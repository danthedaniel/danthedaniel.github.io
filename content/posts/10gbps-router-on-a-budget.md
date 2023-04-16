---
title: "10 Gb/s Router on a Budget"
date: 2023-04-16T13:25:48-07:00
draft: true
tags: ['networking', 'hardware']
---

Last year I found myself lucky enough to get access to Sonic's fiber internet. In my area they offer only one plan - 10 Gb/s for $50/month. Upgrading was a no-brainer as AT&T was charging me $70/month for 1Gb/s. But I didn't just want to save $20 each month. I wanted to finally live the dream of having 10 Gb/s straight to my desktop computer.

Easy enough, I just need to find a networking solution that can handle my home internet's *raw power*. Let's look at the options.

## Top-of-the-line Consumer Hardware

### NETGEAR RAXE500

![](/blog/image/router/RAXE500-cover.jpg)

![](/blog/image/router/RAXE500-rear.jpg)

<br />

| Price |   WAN   |   LAN  |
|-------|---------|--------|
| $500  | 2.5 Gb/s| 2 Gb/s |

I guess technically there is some >10 Gb/s capability here (through WiFi 6E), but what does that matter when the actual WAN port can only handle 2.5 Gb/s? And to get the maximum throughput to my desktop I'd need to run two different ethernt cables. And for $500 I'd be getting only *one fifth* of the maximum speed to my computer. Why even bother at that point?

There are a lot of solutions similar to the RAXE500, another is the ASUS AX11000, that advertise themselves as "10 Gb/s" but are incapable of delivering more than 2 Gb/s to any device.

### TP-Link AXE16000

![](/blog/image/router/AXE16000-cover.jpg)

![](/blog/image/router/AXE16000-rear.jpg)

<br />

| Price |   WAN   |   LAN   |
|-------|---------|---------|
| $500  | 10 Gb/s | 10 Gb/s*|

<small>* 10 Gb/s on one port</small>

Now we're getting somewhere! This spawn of Cthulhu can not only raise the dead, but it can also deliver 10 Gb/s right to your computer!

One major downside, however, is the hodge-podge of varying ports.

* 1x 10 Gb/s WAN
* 1x 10 Gb/s LAN
* 1x 2.5 Gb/s LAN
* 4x 1 Gb/s LAN

In reality this type of throughput is more than acceptable. But at $500? I don't really find the lackluster LAN switch they've built in to match the price.

## Enterprise Hardware

## Build your Own!
