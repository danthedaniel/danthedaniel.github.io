---
title: "Claude gave the BrainFuck Ray Tracer a 9000x Speedup"
date: 2026-10-07T23:48:00-07:00
draft: false
tags: ["vibe-coding"]
---

A few weeks ago someone published a blog post about a [brainfuck ray tracer](https://epestr.com/blog/writing-a-ray-tracer-in-brainfuck/). The file is 23MB of brainfuck instructions and runs around 1 pixel per minute (when rendering the sky, which is the fastest part of the image). That means it takes *months* to render the complete image.

I wanted to see how my own [brainfuck JIT](https://github.com/danthedaniel/BF-JIT) handled the problem. Unsurprisingly, it produces about 1 pixel per minute. I had been gifted "unlimited" Claude tokens for an evening for an unrelated hackathon. After I finished the main project I pointed Claude Opus 5.5 at the compiler and told it to optimize `ray.bf` - "no cheating!". After 1 hour and 45 minutes Claude had the image rendering so much faster that a full image would only take *minutes*! [Here](https://github.com/danthedaniel/BF-JIT/tree/optimizer) is the branch with Claude's changes.

I post this not to brag about work I didn't do. But you may find yourself in the position to loop Claude over an easily evaluated problem. Give it a shot. Given the net ~1,500 extra lines of code I think the 9000x speedup is justified. If we use these tools appropriately the future of software is bright.
