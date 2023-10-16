---
title: "GPT-4 Understands"
date: 2023-10-13T13:37:59-07:00
draft: false
tags: ["gpt"]
---

A prevailing sentiment online is that GPT-4 still does not understand what it talks about. We can argue semantics over what "understanding" truly means. I think it's useful, at least today, to draw the line at whether GPT-4 has succesfully modeled parts of the world. Is it just picking words and connecting them with correct grammar? Or does the token selection actually reflect parts of the physical world?

One of the most remarkable things I've heard about GPT-4 comes from [an episode of *This American Life*](https://www.thisamericanlife.org/803/transcript) titled "Greetings, People of Earth". One of the segments covers the experience of Microsoft researchers that gained access to GPT-4 before its general release.

I want to highlight the most profound part.

## Transcript Excerpt

"[GPT-4] is fed, like, a line of text from some source, but with the last word missing. It guesses what the last word might be, and then it gets told whether or not it got it right so it can adjust its internal math. The fact that it's been fed so much material makes it hard to run tests on it. Like, you don't want to ask it something that it's already seen in the text it's been trained on. So they decided the only way to really test what this thing could do was to try to come up with things to ask it that it would not have encountered before, new original tasks."

...

> It's gonna sound a little bit weird. - We said, "I have a book, nine eggs, a laptop, a bottle, and a nail. Please tell me how to stack them onto each other in a stable manner". That's the question that we asked. And before I give you the GPT-4 answer, let me tell you what ChatGPT answered. So ChatGPT said, "Here is one possible way to stack the objects. Place the bottle on a flat surface. Carefully balance the nail on top of the bottle. Place the eggs on top of the nail."
> - Sebastian Bubeck (Microsoft)

"You look at that and you think it really knows nothing. It is just sort of continuing the sentence in some way."

> That's right. It's just cont-- Exactly right. It's just continuing the sentence. But now comes GPT-4. And GPT-4 is a different beast. So here is GPT-4's answer.
> - Sebastian Bubeck

> One possible way to stack the objects onto each other in a stable manner is place the book flat on the level surface, such as a table or floor. The book will serve as the base of the stack and provide a large and sturdy support. Arrange the nine eggs in a 3-by-3 square on top of the book, leaving some space between them. The eggs will form a second layer and distribute the weight evenly. Laptop goes on the eggs, then the bottle, then the nail on the bottle cap, pointy end of the nail facing up.
> - GPT-4

"It's shocking to think about all the things it seemed to be understanding here. It felt like more than just typing out the next likely word. It seemed to have formed an independent idea about what these words actually meant-- the physical shape of the objects, that eggs are kind of round and fragile, that a book is flat and you can put things on top of it."

...

"The idea is that back when GPT-4 was being trained for it to really consistently get the next word correct, to do that reliably, **it had to do more than just bullshit**. It had to do more than guess based on patterns. To get the next word right, **it had to truly understand the words coming before it.**"

"**It had to build, in its internal wirings and all its software neurons, some understanding of what an egg is** - In other words, to get the next word right, it had to become intelligent. It's quite a thought. It started with nothing. We jammed huge oceans of text through it, and it just wired itself into intelligence, just by being trained to do this one stupid thing."

## My Thoughts

This is crazy to me. You can read in a stream of meaningless numbers (tokens) and incidentally build a reasonably accurate model of the real things those tokens represent.

The implications are vast. We may be able to translate between languages that have never had a "Rosetta Stone". Any animals that have a true language could have it decoded. And while an LLM that's gotten an 8 year old's understanding of balancing assorted items isn't that useful, an LLM that's got a baby whale's grasp on whale language would be revolutionary.
