---
title: "Working With GPT"
date: 2023-04-07T17:14:55-07:00
draft: false
tags: ["gpt"]
---

The programmer internet is polarizing over ChatGPT. Some claim that it is nearly AGI, some claim it cannot do anything of value, with plenty of people in between. I've worked with GPT-3 professionally, used CoPilot for over a year, and recently started programming side-projects with the assistance of ChatGPT (I pay for GPT-4 access). I'm considering working with LLMs full time again, so I pay close attention to what the GPT models can actually do.

It's actually not very obvious what ChatGPT is good at for a number of reasons. But the trickiest is that **ChatGPT is multiple things at once**, and all through the same interface.

## ChatGPT as a Search Engine

There are some things that ChatGPT has seen enough times, and the humans prompting it are not divided over, which you can ask it about without much chance of failure.

For example:

> **User**: When was Abraham Lincoln born?

> **ChatGPT**: Abraham Lincoln was born on February 12, 1809.

[Checks out](https://en.wikipedia.org/wiki/Abraham_Lincoln)

Or more on topic:

> **User**: How do I copy a docker build argument into an environment variable within a Dockerfile?

> **ChatGPT**: In a Dockerfile, you can copy a build argument into an environment variable using the `ARG` and `ENV` instructions. Here's how to do it:
> 1. First, use the ARG instruction to define a build argument, with a default value if desired:
> ```docker
> ARG MY_BUILD_ARG=default_value
> ```
> 2. Then, use the ENV instruction to create an environment variable and set its value to the build argument:
> ```docker
> ENV MY_ENV_VAR=${MY_BUILD_ARG}
> ```

I could have used the docker documentation or Stack Overflow to get the same result. But ChatGPT can also get this right, and most helpfully it can take your specific needs and customize the output to them:

> **User**: How do I copy a docker build argument into an environment variable within a Dockerfile? My PaaS provides the argument COMMIT_ID and I need it to be exposed as GIT_COMMIT in my container, with "unset" as the fallback value.

> **ChatGPT**: To copy the `COMMIT_ID` build argument into the `GIT_COMMIT` environment variable with a fallback value of "unset", you can use the `ARG` and `ENV` instructions in your Dockerfile. Here's an example:
> ```docker
> # Define the build argument and set the fallback value
> ARG COMMIT_ID=unset
> 
> # Copy the build argument into an environment variable
> ENV GIT_COMMIT=${COMMIT_ID}
> ```

The problem is that for more esoteric questions ChatGPT may make up an answer. It's primed to be very careful about making up news events, but not so much docker commands. So for situations where you do not have instant feedback from your computer on the correctness of ChatGPT's output, it is not a suitable replacement for a search engine.

## ChatGPT as an Overpowered Markov Chain

My favorite ChatGPT use case from the last month was in translating documentation into an enum. The Prisma NodeJS database ORM is generally pretty good, but it's not perfect. I'd asked ChatGPT, as a search engine, how I can detect if a Postgres insert fails due to a uniqueness constraint on a specific column:

> **User**: I have a prisma model WebhookEvent. How can I tell if an insert to the table failed because of the unique constraint on the `event_id` column?

> **ChatGPT**: When you try to insert a record with a unique constraint violation in Prisma, it will throw a `PrismaClientKnownRequestError` with a specific error code. To check if the insert failed due to the unique constraint on the event_id column, you can catch the error and verify its code and related metadata.
> ```typescript
> try {
>   const webhookEvent = await prisma.webhookEvent.create({
>     data: webhookEventData,
>   });
>   return webhookEvent;
> } catch (error) {
>   if (
>     error instanceof Prisma.PrismaClientKnownRequestError &&
>     error.code === 'P2002' &&
>     error.meta.target.includes('event_id')
>   ) {
>     console.log('Insert failed due to a unique constraint violation on the event_id column.');
>   } else {
>     console.log('An unexpected error occurred:', error);
>   }
>   throw error;
> }
> ```

This also [checks out](https://community.redwoodjs.com/t/how-to-handle-prisma-unique-constraints-with-a-friendly-error/4117) as of a few months ago. And it's nice that ChatGPT was able to tailor the solution to my code base.

But that bit that says `error.code === "P2002"` seems lame. There should be some source of truth for these error codes, right?

> **User**: Is there an enum in Prisma that I can reference instead of using `"P2002"`?

> **ChatGPT**: Yes, Prisma has an enum called PrismaErrorCode that you can use to reference error codes instead of hardcoding them as strings. Here's how you can update the previous example to use the PrismaErrorCode enum:
> ```typescript
> const { PrismaClient, Prisma } = require('@prisma/client');
> Prisma.PrismaErrorCode.UniqueConstraintViolation
> ```

And...

```
Property 'PrismaErrorCode' does not exist on type 'typeof Prisma'.ts(2339)
```

It seems ChatGPT has lied to me! But that's not an issue because the TypeScript compiler won't. And shockingly, there actually isn't any source of truth for Prisma error codes. A quick Google search will turn up [this page](https://www.prisma.io/docs/reference/api-reference/error-reference) as the only reference available.

I would still love to have an enum, though...

ChatGPT to the rescue! All I need to do is forgive the beefy markov chain, and embrace its pattern-matching nature. Here I've just copied everything from the docs and pasted it into the prompt:

> **User**: Can you turn this documentation into a typescript enum for prisma error codes? Please include comments on each enum variant, along with descriptive and concise names:
> 
> Error codes
> 
> Common
> 
> P1000
> 
> "Authentication failed against database server at {database_host}, the provided database credentials for {database_user} are not valid. Please make sure to provide valid database credentials for the database server at {database_host}."
> 
> P1001

> "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}."
> 
> P1002

etc.

> **ChatGPT**: Here is an enum representing Prisma error codes:
> ```typescript
> enum PrismaError {
>   // Common
>   AuthenticationFailed = "P1000",
>   DatabaseServerUnreachable = "P1001",
>   DatabaseServerTimeout = "P1002",
>   DatabaseDoesNotExist = "P1003",
>   OperationTimeout = "P1008",
>   DatabaseAlreadyExists = "P1009",
>   AccessDenied = "P1010",
>   TlsConnectionError = "P1011",
>   SchemaValidationError = "P1012",
>   InvalidDatabaseString = "P1013",
>   UnderlyingModelError = "P1014",
>   UnsupportedDatabaseFeatures = "P1015",
>   IncorrectNumberOfParameters = "P1016",
>   ConnectionClosed = "P1017",
> 
>   // Prisma Client (Query Engine)
>   ColumnValueTooLong = "P2000",
>   RecordNotFound = "P2001",
>   UniqueConstraintFailed = "P2002",
> ```

etc.

Now, it didn't do everything I asked. It didn't "include comments on each enum variant". But god damn. This is quite the solution! Not only is it all correct, the names are also impressively good! `DatabaseServerUnreachable` does not appear in the source docs, that name is synthesized from the error description. And now we have the full (at time of writing) error list to reference as our code-base grows.

Our `if` statement's much better now:

```typescript
if (
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === PrismaError.UniqueConstraintFailed &&
  error.meta.target.includes('event_id')
)
```

That worked really well. But I've noticed that for times where I get too deep into higher-kinded types with Typescript ChatGPT will fail pretty hard. To be fair, when I try to write the code manually I also struggle. That kind of code is usually there for ego-stroking, though. So maybe it's best left un-written.

## Conclusion

ChatGPT is a tool. It's a tool that tricks you into thinking it knows more than it does. But once you learn its capabilities it's useful. Not just day-to-day, but multiple times per hour. It can take a while to learn how much is too much to ask of it. Writing in an uncommon language? You'll have much more trouble than asking it to write React code. Rewriting your code to meet the demands of a new user? Sorry, not yet.

But the models will only get better from here. And hooking GPT into a search engine, a compiler, and your documentation will give it super powers. Right now it feels like a 15-20% speed boost for coding. But when it takes away some painful work like restructuring documentation into code and you feel that 100x time save - oh man that's a taste of the future right there.
