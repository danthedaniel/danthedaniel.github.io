---
title: "Type-Level API Client"
date: 2022-05-14T14:55:04-07:00
draft: false
tags: ["programming", "typescript"]
---

One year ago I looked around for existing tech that would provide me with compile-time guarantees for a REST-ish API interface. With full-stack TypeScript web applications reaching a level of maturity where I, a previously die-hard Rails developer, felt comfortable taking the dive - it seemed like the Node ecosystem was lacking in ties between the front end and back end.

<!--more-->

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Has anyone made a purely type-level TypeScript API client yet? Seems like full stack TypeScript apps should just allow for a type import into the front end which would validate paths, verbs, body and response. No swagger or intermediary needed.</p>&mdash; Daniel Angell (@dan_the_daniel) <a href="https://twitter.com/dan_the_daniel/status/1387632537061580802">April 29, 2021</a></blockquote>

As a minimalist, I was hoping for a solution that did not involve any extra dependencies. TypeScript alone seemed like a powerful enough tool to get the job done. Maybe I didn't look hard enough but I didn't end up finding prior art that I was happy with. Everything seemed to require either a very opinionated architecture, an intermediary file with its own build step, or a special HTTP client library. I'd already learned not to trust the Node ecosystem and wanted the most unimpressive solution to get the job done. So I built my own.

## Setting expectations

The following is not a library, nor a declaration of intent to build a library. It's merely a design pattern
that I want to help popularize. After a year of use this system proved to be both easy to maintain and helpful
when writing and changing code. Errors related to faulty API expectations were rare thanks to this system. You
can get many of the benefits that I achieved by using GraphQL. But for systems that predate GraphQL or
situations where GraphQL feels inappropriate this can be your fall-back.

## Part 1 - Models

The architecture of the app this was built for has a NextJS/React front-end, with a NestJS/TypeORM back-end.

Most of the data that gets chucked to the front end originated in the model layer. So if I'm going to use models in the API I want their property's types propagated all the way to the front-end.

### Requirements:

1. A system to enumerate attribute names that get sent to NextJS
2. A system that does not require re-stating types

### Solution:

I can leverage TypeScript to allow for extracting a per-model type interface defined by just an array of model properties I want to share with the client. For a `User` that array would include things like `["id", "email", "firstName", "lastName", ...]`. This requires some fancy type-level programming, but I've already done the hard work for you. The trick is all in the signature of the function used to pluck out the corresponding values for `id`, `email` etc.

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
* The return type of *this specific `extractDTOAttrs` invokation* will be an interface with the keys as elements from the array, and each key's matching type pulled from the model's existing type definition.

Here's a more complete excerpt from two TypeORM files:

`@company/models/root.entity.ts`:
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

`@company/models/user.entity.ts`:
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

The end goal here is to get both the data and type for each model's DTO into the front end code. We have the types written automatically for us. We just need to pipe them through to the client.

### Requirements:

1. Get the type of `User.toDTO()` to a place where it can be accessed from the front end

`@company/api/modules/user.controller.ts`:
```typescript
@Controller("user")
export class UserController {
  constructor(
    // ...
  ) {
    super();
  }

  @Get("me")
  @UseGuards(AuthGuard())
  async me(@Req() req: AuthdRequest) {
    return { status: "success", data: req.user.toDTO() };
  }
}
```

<sup>The above code is from a NestJS back-end.</sup>

Just with the code above TypeScript will automatically pipe through the type of `User.toDTO()` into the
return type of `UserController.me`. The full type will be:

```typescript
interface UserControllerMeMethod {
  status: "success",
  data: {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    // ...
  }
}
```

The wrapper structure is called `SuccessResponse<T>`. So the type is, more succinctly, `SuccessResponse<ReturnType<User["toDTO]>>`.

We *could* extract this type from the controller and import it into the front end without any other supporting code. But that would require the front-end to reference specific back-end files which increases coupling. So as an alternative I've defined an endpoints file in the root of the NestJS project. If we only export endpoint definitions in this file we can grab the full API definition with one clean import:

```typescript
import * as API from "@company/api/endpoints";
```

Here's what the endpoint spec looks like for `/user/me`:

`@company/api/endpoints`:
```typescript
/**
 * Get attributes on currently logged in user.
 */
export type CurrentUser = GetEndpoint<"/user/me", never, ResponseDataType<typeof UserController, "me">>;

// ...more endpoints...
```

And here are the supporting types:

`@company/api/types`:
```typescript
// API response structure
export interface SuccessResponse<T> {
  status: "success";
  data: T;
}

export interface ErrorResponse {
  status: "error";
  errorCode: ErrorCodeType;
  message?: string;
  details?: { [key: string]: unknown };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Endpoint types
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

// Below here is code to cleanly extract the return type from a controller method.
type ClassType = new (...args: unknown[]) => any;
type UnPromisify<Outer> = Outer extends Promise<infer Inner> ? Inner : Outer;
type UnResponsify<Outer> = Outer extends SuccessResponse<infer Data> ? Data : never;

export type ResponseDataType<
  Controller extends ClassType,
  Method extends keyof InstanceType<Controller>
> = UnResponsify<UnPromisify<ReturnType<InstanceType<Controller>[Method]>>>;
```

## Part 3 - Views

Okay, so we have models that automatically define types for their DTO incarnations. And we also have a
back-end that preserves these types (and any other types defined in the controllers themselves). So with
that all set in place we need to do a few more things.

### Requirements:

1. Convert the response types into their post JSON serialization/de-serialization versions.
2. Unpack the Endpoint types in front end code.

<sup>An Endpoint type (such as `GetEndpoint`, `PostEndpoint`, etc.) wraps up a Verb type, Path type, Response type, and more. Being able to see each of those components one at a time is helpful.</sup>

Requirement 1 may have surprised you. What conversion needs to be done? Why would a type look different after converting to/from JSON? We're only sending JSON-serializable types over the network, right? Yes - but not all JSON-serializable types deserialize back to their original type.

Take, for example, a `Date`. We will often want to include a `createdAt` or `updatedAt` timestamp in DTOs.
You *can* serialize a `Date`, but `JSON.stringify({ date: new Date() })` results in `{ "date": "2022-05-15T05:21:07.324Z" }`. The `Date` has become a string! And when de-serializing why would the front-end know that this string in particular should become a `Date`? It doesn't.

The intention here is not to change this behavior. Only to track it accurately. We don't want a type in the front-end that tells you there's a `Date` field in a DTO. And then at run time it's actually a string. That's exactly the kind of error we're using TypeScript to prevent!

The solution is to define a recursive type, `JSONSerialized`, that walks through an object or array. The context here is front-end code reading back-end types.

```typescript
/**
 * Converts a type into its post JSON serialization/de-serialization version.
 */
type JSONSerialized<T> =
  // We first check if we're looking at a primitive type. Primitives will be passed
  // through untouched by `JSON.parse(JSON.stringify(...))`, so `JSONSerialized` replicates
  // that behavior. The exact `T` type is output instead of `number` or `string` in case
  // the type is actually a union (ex: "foo" | "bar"). This way the union is preserved.
  T extends number ? T :
  T extends string ? T :
  T extends boolean ? T :
  T extends null ? null :
  // If we aren't looking at a primitive, then we'll next check if we're working with an
  // array. If so we convert the array's element type using a recursive type call.
  T extends (infer Elem)[] ? JSONSerialized<Elem>[] :
  // Here's the magic that takes care of `Date`s. Some types have a `toJSON` function.
  // `JSON.stringify` will call this function if it doesn't already know what to do with
  // a value. By using `infer` we can dynamically extract the return type of a `toJSON()`
  // as defined on ANY type - including `Date.toJSON`.
  T extends { toJSON: () => infer Return } ? Return :
  // Lastly, check if we're working with an Object and if so, iterate through its
  // key/value pairs - sending each value into a recursive call to `JSONSerialized`.
  T extends { [Key in keyof T]: T[Key] } ? { [Key in keyof T]: JSONSerialized<T[Key]> } :
  never;
```


We can take care of requirement 2 with the following types. Each extractor type uses the generic endpoint type, `Endpoint`, along with TypeScript's `infer` keyword to extract just one of the type parameters.

`ResponseDataType` uses our buddy `JSONSerialized` to revise the back-end type for use in the front-end.

```typescript
import { ApiResponse, Endpoint, PatchEndpoint, PostEndpoint, PutEndpoint } from "@company/api/types";

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
```

Now we just need a nice function that makes use of these types. Below we define `request<T>()` such that
only valid API requests can be made. This is done by locking down the `method`, `url`, `params` and
`data` fields in the `RequestOptions` type.

`@company/webapp/http.ts`:
```typescript
import axios, { AxiosRequestConfig } from "axios";

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

## Part 4 - Bringing it all together

So you want to request the DTO for the current user.

1. First, get out our bespoke `request` function.
2. Then get a handle on the full API definition.
3. Pass the `CurrentUser` endpoint type into `request`'s type parameter.

```typescript
import { request } from "@company/webapp/http";
import * as API from "@company/api/endpoints";

const user = await request<API.CurrentUser>({});
```

Already you'll be getting compiler errors! `API.CurrentUser`'s method is of type "get" and you haven't
specified an HTTP method.

```typescript
const user = await request<API.CurrentUser>({ method: "get" });
```

Again a compiler error (thanks, TypeScript :D). `API.CurrentUser` has a path type of "/user/me" and
you haven't provided a path.

```typescript
const user = await request<API.CurrentUser>({ method: "get", url: "/user/me" });
```

Success! This is a valid API request. And even better the type of `user` is `ApiResponse<{ id: number, email: string, ...}>`.

Changing anything along the pipeline from the model to the view will automatically adjust the types and should
give compiler errors where the API has made a breaking change. New fields are automatically shown in your
front end code. The only parts of the API spec that duplicate information are the HTTP verb and path where we had to re-type them in `@company/api/endpoints`. But those are unlikely to change very often - if ever.
