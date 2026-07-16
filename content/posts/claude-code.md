---
title: "Claude Code is the ceiling on vibe-coded software"
date: 2026-07-16T15:40:00-07:00
draft: false
tags: ["programming"]
---

Anthropic would like you to believe that you don't need to deal with code anymore. Just prompt your agent, set up the right guardrails, port everything to Rust, and you're on the path to success. All of the major LLM companies heavily or exclusively use LLMs to develop their consumer software. And of course they do. How bad would it look if Anthropic told you to use Claude for all of your programming tasks - but *they* don't really trust it to develop their products.

<!--more-->

And look at the results. Claude Code struggled for over a year to fix text flickering on long chat sessions. They've declared victory against this bug numerous times. Maybe this time they've finally succeeded? But it would be hard to imagine that the `claude` TUI product would have languished like this under human software engineering. Anthropic hires many of the best software engineers and pays them outrageous salaries (starting around $400,000 for mere product engineers). These people are hired not to write code. They are hired to lead the charge on agentic development. There are few companies out there that have more informed processes for guiding LLMs to build software. With Anthropic at the very pinnacle of agentic development, I see mediocrity as their foremost product trait. The company is kept alive thanks to the experts working on the models. It succeeds *despite* the product team, not because of it.

One would think that agentic software development would allow for a significant increase in product velocity. But I rarely notice product improvements to the core Anthropic products - their web chat and Claude Code. I do need to credit the team behind Claude Design. It is a notable step up from having Claude produce layouts and styles on its own.

Claude is awesome. It saves me time, acts as a force-multiplier and allows me to act on intuition I don't have the expertise to implement myself. But if it is as good as Anthropic wants me to believe, their PR team would tell a different story. There has recently been a large discussion spurred on by the port of Bun from Zig to Rust. I like the Bun product, despite the internal chaos apparent from the stream of bug fixes. I don't care at all what language Bun is implemented in. I also won't write off a Rust port just because LLMs were used to do the work. But we can't believe that LLMs did a perfect job here. Anyone who works with them knows you need to keep them on a short leash when the stakes are high - as they are when trying to build secure runtime environments.

The official narrative about the port makes almost no mention of human code review. Imagine the humiliation for Anthropic if the Bun port was a disaster and they could have caught subtle bugs before releasing the code. You would think a company in that position would at least double-check Claude's work. Perhaps have the Bun team comb over a random selection of 10% of the code. And if they had done this - which I really expect something of the sort must have happened - then they would have told us if it went well. It would look incredibly good for Anthropic to be able to say they had their best engineers review Claude's port of Bun and they found no issues. Given the lack of such an announcement, I can only conclude Claude didn't do as good of a job as they want us to believe.

So it doesn't seem like Claude is really as good as they'd lead me to believe. You can not hand over all implementation to an LLM - at least not yet - if you want the best product quality.
