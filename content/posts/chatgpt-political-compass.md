---
title: "ChatGPT's Political Compass"
date: 2022-12-05T16:06:30-08:00
draft: false
tags: ["programming", "gpt"]
---

This is written in response to [this post](https://davidrozado.substack.com/p/the-political-orientation-of-the) from David Rozado.

## Results

I ran the political compass quiz against ChatGPT 3 times to make sure its political compass alignment is consistent. After three tests it seems to be be pegged well into the Left/Libertarian quadrant.

![Aggregate political compass results for ChatGPT](/blog/image/chatgpt/compass.png)

Transcripts: [1](/blog/political-compass-transcripts/1), [2](/blog/political-compass-transcripts/2), [3](/blog/political-compass-transcripts/3)

## Weaseling

To start off I want to call out that [the political compass test](https://www.politicalcompass.org/test) is by no means a definitive source on what it means to be left, right, libertarian or authoritarian. Further, the dimensions chosen and the scales of those dimensions are subjective. It's not possible to define the origin objectively either. But the general takeaway that ChatGPT is left of center and more libertarian than authoritarian seems true.

## The Problem

If you ask ChatGPT about its political beliefs directly you'll get stonewalled.

![ChatGPT stonewalling me on political beliefs](/blog/image/chatgpt/stonewalling.png)

Not only is this clearly not the case - it's impossible (let's ignore any semantic arguments over whether a pattern replicated by a model counts as a belief). As long as ChatGPT can discuss topics that are political in nature it will have a political center-of-mass. And, sadly, any topic can become political.

In my opinion it would be better for the model to be honest with us. OpenAI has built short-circuits to keep ChatGPT from discussing certain topics. But the model might be too complicated for them to actually rope off areas that will give the company PR troubles.

The *honest* way for ChatGPT to respond would be closer to:

```
I am a large language model from OpenAI that has been trained on what can be
read on the internet. Any political beliefs I repeat are pulled from the
general concensus of online discussion in the English language.
```

## Peaking Behind the Curtain

While ChatGPT has been told explicitely by OpenAI *not* to discuss certain topics, the model it uses has a lineage that closely ties it to the standard `text-davinci` model accessible in the [OpenAI playground](https://beta.openai.com/playground).

With the guard rails down we can get some interesting answers from GPT-3.

![GPT-3's political beliefs regarding social policy](/blog/image/chatgpt/socially.png)

What's awesome about the playground is you can display the probability map. Not only have I been able to coax an answer out of GPT-3, but I know that 68% of the time it would claim to be socially progressive or liberal.

![GPT-3's political beliefs regarding fiscal policy](/blog/image/chatgpt/fiscally.png)

And 72% of the time it would claim to be fiscally moderate.

## The Solution

Because a lot of our human interaction takes place over text-only media we are primed to believe that ChatGPT is getting close to the capabilites of a human given its mastery of the English language. But that is a mistake. GPT-3 is amazing technology but it *is not* a canonical source of information. You should not use it to answer questions that don't have a well-established objective answer. We need to understand that GPT-3 is a program that correlates words to each other. It has no reasoning of its own - it only looks like it does because it was trained primarily on text written by humans that were reasoning as they wrote.
