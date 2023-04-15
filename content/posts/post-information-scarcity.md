---
title: "Post Information Scarcity"
date: 2023-04-15T14:58:51-07:00
draft: false
tags: ["gpt"]
---

In Star Trek humans live in a post-scarcity world. Transporter technology allows for instantaneous and cheap movement of humans and objects anywhere on a planet, and into or out of orbit. The same devices that allow for transportation can also re-organize matter into arbitrary configurations. This means that anything that can be designed can be owned for essentially no cost. What do people do in such a world? As Gene Roddenberry imagined, they explore. If we can get anything that's ever been recorded for free in an instant, then new and undiscovered things are of unparalleled value and interest.

Right now a lot of work is put into recycling knowledge. Someone that knows enough to sling some Apex can bridge the gap between someone that does not and a business need. And now your Salesforce workspace pings your customer ops team with a special notification for high value leads. Someone that knows the local building codes can be consulted on new construction projects and identify issues in a design. Someone building Rails CRUD apps recycles Rails-isms until they have satisfied all requirements.

GPT-4 has made it clear that with enough training data you can automatically solve small problems with a high level of success.

**If**

1. ... the context to solve the problem is represented in text
2. ... the context fits in the model's context window
3. ... the solution can be represented in text
4. ... the problem is similar to ones solved in its training set

then those problems are solved cheaper and faster by an AI than by a human. Human data labelers are already losing their jobs to GPT. People that are paid to write SQL snippets or similar brief incantations will soon follow. And GPT is going to come for my job given enough time.

But while GPT can solve "novel" problems that it's never seen before, it can only do so in the sense that a parameterized function can solve novel problems:

```jsx
function Component({ label }) {
  return (
    <span>{label}</span>
  );
}

<Component label="Look, ma! Never before seen code!">
```

Most day-to-day requests have already been satisfied by a programmer before. And at some point solutions for most people's problems have been uploaded to GitHub or Stack Overflow. The same goes for most of the ways people want to compose solutions. And thus we can ask GPT for a brand new solution to a never-before-seen problem.

Unlike many vocal critics on the internet, I am not saying this to imply GPT is useless. In fact, *GPT may be the most powerful software tool since the unix shell*. But it's only distributing knowledge that programmers have, until now, kept amongst themselves. As the tooling around GPT refines I can see every office worker slinging code without even realizing that's what they're doing.

Once OpenAI and its competitors get their hands on enough training data for other domains we'll see those sectors lose a need for knowledge workers. Imagine 1,000 skilled UX designers meticulously annotating their work over the course of a year in a way that a tranformer can train on. The current state-of-the-art in UX will get crystalized. That knowedge will then be the *least* someone can know about UX. So to be as blunt as possible, **if it's your job to know things GPT is coming for your paycheck**. GPT connects a human and a need for knowledge with a solution wrapped up in the context of their problem.

But on the other hand, **if it's your job to discover truly novel information, GPT can't compete with you**. Only so much can be inferred from the Socratic method. Without real-world testing your tower of assumptions will quickly fall over.

We're about to find out what it's like to crash into a post information scarcity reality.
