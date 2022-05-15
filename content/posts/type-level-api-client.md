---
title: "Type-Level API Client"
date: 2022-04-26T14:55:04-07:00
draft: true
tags: ["programming", "typescript"]
---

Exactly one year ago I looked around for existing tech that would provide me with compile-time guarantees for a REST-ish API interface. With full-stack TypeScript web applications reaching a level of maturity where I, a previously die-hard Rails developer, felt comfortable taking the dive - it seemed like the Node ecosystem was lacking in ties between the front end and back end.

<!--more-->

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Has anyone made a purely type-level TypeScript API client yet? Seems like full stack TypeScript apps should just allow for a type import into the front end which would validate paths, verbs, body and response. No swagger or intermediary needed.</p>&mdash; Daniel Angell (@dan_the_daniel) <a href="https://twitter.com/dan_the_daniel/status/1387632537061580802?ref_src=twsrc%5Etfw">April 29, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

As a minimalist, I was hoping for a solution that did not involve any extra dependencies. TypeScript alone seemed like a powerful enough tool to get the job done. Maybe I didn't look hard enough but I didn't end up finding prior art that I was happy with. Everything seemed to require either a very opinionated architecture, an intermediary file with its own build step, or a special HTTP client library. I'd already learned not to trust the Node ecosystem and wanted the most unimpressive solution to get the job done. So I built my own.

## Part 1 - Models

The architecture of the app this was built for has a NextJS/React front-end, with a NestJS/TypeORM back-end (Nest/Next gets very confusing to talk about).

Most of the data that gets chucked to the front end originates in the model layer. So if I'm going to use models in the API I want their property's types propogated all the way to the front-end.

### Requirements:

* A system to enumarate attribute names that get sent to NextJS
* A system that does not require re-stating types

### Solution:

I can leverage TypeScript to allow for extracting a per-model type interface defined by just an array of model properties I want to share with the client. For a `User` that array would include things like `["id", "email", "firstName", "lastName", ...]`. This requires some fancy type-level programming, but I've already done the work for you. The trick is all in the signature of the function used to pluck out the corresponding values for `id`, `email` etc.

```typescript
function extractDTOAttrs<This, Attr extends keyof This>(
    this: This,
    attrs: Attr[]
): { [P in Attr]: This[P] extends () => infer Return ? Return : This[P] } {
```

<sup>DTO here is jargon that means "data-transfer-object". It's how the database record looks in JSON format.</sup>

A call to this function looks like:

```typescript
this.extractDTOAttrs([
    "id",
    "email",
    "firstName",
    "lastName",
    // ...
])
```

TypeScript has allowed us to lock down a lot of things here.

* The array of strings can only contain valid keys to `This` (the type of our model's `this` pointer)
* The return type of *this specific `extractDTOAttrs` invokation* will be an interface with the keys in the array, and each key's matching type is pulled from the model's existing type definition.

Here's a more complete exerpt from two TypeORM files:

`root.entity.ts`:

```typescript
type CanBeDTO = { toDTO: () => unknown };

function canBeDTO(value: unknown): value is CanBeDTO {
  return value && typeof value["toDTO"] === "function";
}

export abstract class RootEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  abstract toDTO(): unknown;

  /**
   * Pick only certain attributes from `this`.
   * @param this Model instance
   * @param attrs Whitelist of attributes
   * @returns DTO object.
   */
  extractDTOAttrs<This, Attr extends keyof This>(
    this: This,
    attrs: Attr[]
  ): { [P in Attr]: This[P] extends () => infer Return ? Return : This[P] } {
    const DTO: any = {};

    for (const attr of attrs) {
      const value = this[attr];

      if (value instanceof Promise || canBeDTO(value)) {
        throw new Error(`Attribute ${attr} can not be exported to a DTO`);
      }

      if (typeof value === "function") {
        DTO[attr] = value.bind(this)();
      } else {
        DTO[attr] = value;
      }
    }

    return DTO;
  }
}
```

`user.entity.ts`:

```typescript
@Entity({ name: "user" })
export class User extends RootEntity {
  @Column({ unique: true, type: "citext" })
  email: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  // ...

  toDTO() {
    return this.extractDTOAttrs([
      "id",
      "email",
      "firstName",
      "lastName",
      // ...
    ]);
  }
}
```

This solution is generic enough that you should be able to use it with any ORM. Not just TypeORM.

Thanks to TypeScript's return type inference the type of `this.extractDTOAttrs([...])` becomes `User.toDTO()`'s type as well.

## Part 2 - Controllers

```typescript
@Controller("user")
export class UserController extends BaseController {
  constructor(
    // ...
  ) {
    super();
  }

  @Get("me")
  @UseGuards(AuthGuard())
  async me(@Req() req: AuthdRequest) {
    return this.success(req.user.toDTO());
  }
}
```

```typescript
/**
 * Get attributes on currently logged in user.
 */
export type CurrentUser = GetEndpoint<"/user/me", never, ResponseDataType<typeof UserController, "me">>;
```

```typescript
export interface SuccessResponse<T> {
  status: "success";
  data: T;
}

export interface ErrorResponse {
  status: "error";
  errorCode: ErrorCodeType;
  message?: string;
  details?: { [key: string]: unknown };
  traceback?: string[];
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

type HttpVerb = "get" | "post" | "patch" | "put" | "delete" | "options";

export interface Endpoint<Verb extends HttpVerb, Path extends string, Params, ResponseData> {
  verb: Verb;
  path: Path;
  params: Params;
  responseData: ResponseData;
}

export type GetEndpoint<Path extends string, Params, ResponseData> = Endpoint<"get", Path, Params, ResponseData>;

export interface PostEndpoint<Path extends string, Params, Body, ResponseData>
  extends Endpoint<"post", Path, Params, ResponseData> {
  body: Body;
}

export interface PatchEndpoint<Path extends string, Params, Body, ResponseData>
  extends Endpoint<"patch", Path, Params, ResponseData> {
  body: Body;
}

export interface PutEndpoint<Path extends string, Params, Body, ResponseData>
  extends Endpoint<"put", Path, Params, ResponseData> {
  body: Body;
}

export type DeleteEndpoint<Path extends string, Params, ResponseData> = Endpoint<"delete", Path, Params, ResponseData>;

type ClassType = new (...args: unknown[]) => any;
type UnPromisify<Outer> = Outer extends Promise<infer Inner> ? Inner : Outer;
type UnResponsify<Outer> = Outer extends SuccessResponse<infer Data> ? Data : never;

export type ResponseDataType<
  Controller extends ClassType,
  Method extends keyof InstanceType<Controller>
> = UnResponsify<UnPromisify<ReturnType<InstanceType<Controller>[Method]>>>;
```

### Part 3 - Views

```typescript
import { ApiResponse, Endpoint, PatchEndpoint, PostEndpoint, PutEndpoint } from "@api-types";
import axios, { AxiosRequestConfig } from "axios";

/**
 * Converts a type into its post JSON serialization/deserialization version.
 */
type JSONSerialized<T> =
  T extends number ? T :
  T extends string ? T :
  T extends boolean ? T :
  T extends null ? null :
  T extends (infer Elem)[] ? JSONSerialized<Elem>[] :
  T extends { toJSON: () => infer Return } ? Return :
  T extends { [Key in keyof T]: T[Key] } ? { [Key in keyof T]: JSONSerialized<T[Key]> } :
  never;

// Types for pulling apart an endpoint definition
export type VerbType<T> = T extends Endpoint<infer Verb, any, any, any> ? Verb : never;
export type PathType<T> = T extends Endpoint<any, infer Path, any, any> ? Path : never;
export type BodyType<T> =
  T extends PostEndpoint<any, any, infer Body, any> ? Body :
  T extends PatchEndpoint<any, any, infer Body, any> ? Body :
  T extends PutEndpoint<any, any, infer Body, any> ? Body :
  never;
export type ParamsType<T> = T extends Endpoint<any, any, infer Params, any> ? Params : never;
export type ResponseDataType<T> = T extends Endpoint<any, any, any, infer Data> ? JSONSerialized<Data> : never;

const client = axios.create({
  timeout: 30000,
});

export interface RequestOptions<T extends Endpoint<any, any, any, any>> extends AxiosRequestConfig {
  method: VerbType<T>;
  url: PathType<T>;
  params?: ParamsType<T>;
  data?: BodyType<T>;
}

/**
 * Make a type-checked api request.
 * @param options Request options
 * @returns Response payload
 */
export const request = async <T extends Endpoint<any, any, any, any>>(
  options: RequestOptions<T>
): Promise<ApiResponse<ResponseDataType<T>>> => {
  const response = await client.request({
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    ...options,
  });

  const apiResponse = response.data as ApiResponse<ResponseDataType<T>>;

  if (apiResponse.status === "error") {
    throw new Error();
  }

  return apiResponse;
};
```

```typescript
import * as API from "@http-endpoints";
import { request } from "./services/http";

const user = await request<API.CurrentUser>({ method: "get", url: "/user/me" });
```
