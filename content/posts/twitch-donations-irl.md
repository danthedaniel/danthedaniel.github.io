---
title: "Twitch Donations IRL"
date: 2026-05-02T18:54:39-07:00
draft: false
tags: ["programming", "volunteering", "fundraising"]
---

<img src="/blog/image/twitch-donations-irl/teaser.jpeg" style="object-fit:contain;border-radius:1rem;width:100%;" alt="A cropped image of a display showing just the top with a rainbow colored $69.00 donation amount" />

In the last couple of years I've spent a lot of time volunteering at a local hackerspace called Noisebridge. It works differently from most other places. We do not require anyone to pay dues to be in the space. We let anyone use any of our materials or tools (with some exceptions for safety or claimed works in progress) even if they just walked in off the street for the first time. This can cause confusion to the occasional newcomer asking to become a member. I'll say "You already are!". But what they want is a traditional quid-pro-quo. They give us money, and in return are entitled to our resources. The trick then is getting people to give us money for things they already get for free.

<!--more-->

## The Problem

Our building is rented, so we need some way to come up with $11k every month. Thankfully the organization is 100% volunteer ran so our total montly expenses are only around $14k. To get recurring revenue there are some membership tiers that grant 24/7 access. However these tiers also come with the responsability to sweep people out when you leave. Many people aren't interested in that. There are people that give us money every month without anything extra in return. But this system isn't particularly lucrative. Before the pandemic the community had a monthly surplus. But shutting the space down for a year and a half killed a lot of momentum. Members left San Francisco, or the country entirely.

The organization has periodically reached a crisis state where we are months from bankruptcy. Thankfully we have so far managed to fundraise our way out of these moments. With such a vast network that includes both high paid tech employees and early adopters of Bitcoin it's not uncommon for a $100k donation to come into our accounts. But we only need to fail this game of chicken once for the organization to die. It's better for us to become self-sufficient by building financial fitness rather than be dependent on generous crypto-millionaires.

## A Solution

Before I started this project we had a few different ways to donate.

* Cash (with cash boxes placed around the space)
* PayPal
* A Stripe-powered page where you needed to type in your credit card number

I had been upset with our Stripe page. I used it to create a recurring donation, but it provided no means to *increase* the amount during our last fundraising panic. People occasionally contacted the treasurer to adjust or cancel their recurring donations which was always a slow process. I decided to rebuild the site to provide the bare minimum for managing your recurring donation (cancellation, amount changes, payment method updates). But why stop there?

I wanted us to support Apple Pay and Google Pay. Digital terminals were out of the question. Who'd trust a random machine in a space as anarchist as this? I decided to stick QR codes around the building. Paper wasn't cool enough, so I wrote some OpenSCAD code and 3D printed multi-color QR codes. There's a little red logo in the middle to catch your eye. The design makes it easy to pattern-match on what is a donation prompt. I have to assume the complexity of 3D printing a QR code also provides some proof of authenticity.

<img src="/blog/image/twitch-donations-irl/laser-cutter.jpeg" style="object-fit:contain;border-radius:1rem;width:calc(max(300px, 60%));" alt="A QR code on a large laser cutting machine" />
<img src="/blog/image/twitch-donations-irl/donation-screenshot.jpeg" style="object-fit:contain;width:calc(max(300px, 60%));" alt="A donation prompt screenshot" />

I've also placed around 20 other QR codes in the space, following the Disney World principle of trash cans. Place them so that no matter where you are you can see one.

Making it easier to give us money helps. But I also wanted to add some social proof. A way to show people that yes, people are donating for the laser cutter, sewing room, 3D printers, etc. So I installed 4 displays in the space that show real-time alerts for donations and new memberships.

<div style="display:flex;flex-direction:row;justify-content:space-around;padding:2rem 0;">
  <video src="/blog/video/twitch-donations-irl/header.webm" loop controls width="80%" style="border-radius:1rem;"></video>
</div>

<div style="width:100%;display:flex;flex-direction:row;justify-content:space-around;">
  <div style="background:rgba(255,255,255,0.05);border-left:4px solid #44e;padding:1rem 1.5rem;margin:0 0 1.5rem 0;border-radius:0.5rem;font-size:0.9em;width:calc(80% - 3rem);">
    You can see above the special effect used for an amount that is the highest in the list. The list is a log of the previous 20 donations.
  </div>
</div>

Beyond social proof, people get rewarded with various animations to celebrate their donation. Surprisingly, a lot of people find joy in these effects. I've also seen many more instance where people say something like "Do this for me and I'll donate to Noisebridge". Because everyone will see it the statement holds more weight.

I added a border of RGB NeoPixels to each display, with 3D printed diffusers glued to each pixel. This helps make the display feel more real. We have all grown numb to the magic of millions of pixels that can each display millions of colors 60 times per second. Displays show a portal into the digital world. What's on a display is deemed less real than its surroundings. But adding just a little novelty helps bleed the digital domain into meatspace.

<img src="/blog/image/twitch-donations-irl/matrix-display.jpeg" width="80%" alt="Image of a screen mounted to a wall showing a log of donation amounts" />

<div style="width:100%;display:flex;flex-direction:row;justify-content:space-around;">
  <div style="background:rgba(255,255,255,0.05);border-left:4px solid #44e;padding:1rem 1.5rem;margin:0 0 1.5rem 0;border-radius:0.5rem;font-size:0.9em;width:calc(80% - 3rem);">
    The way the LEDs work is kind of fun. Each display is driven by a Raspberry Pi 5 (2GB model). What you see on the screen is a web page hosted on the same server hosting all of the other donation related functionality. The Pi also hosts a web server that provides an API to control the LEDs which the web page connects to in a cross-origin request to localhost:3000. In order to simplify deployments the LED API receives what are essentially 1-dimensional shader functions written in JavaScript. I take functions right out of the front-end, <a href="https://github.com/noisebridge/donate-portal/blob/5a5c560bf6355bc7957d1159200ebccd25df32aa/src/assets/js/effects/led_effects.mjs#L89" target="_blank">call <code>toString()</code> on them</a> and ship them off to the Pi <a href="https://github.com/noisebridge/alert-kiosks/blob/b4c33492f700a3f2f09db39193ce9aca1f0d8fe9/rgb-server/index.ts#L141" target="_blank">where they are <code>eval()</code>'d</a> :D
  </div>
</div>

Just like on some Twitch streams, there are special donation amounts that trigger certain effects. Above you can see what happens when you donate $13.37. There are a bunch of different effects on the screen and corresponding LED strip animations. $4.20 and $420 are of course well supported.

<div style="display:flex;flex-direction:row;justify-content:space-around;padding:2rem 0;">
  <video src="/blog/video/twitch-donations-irl/snoop.webm" controls width="80%" style="border-radius:1rem;"></video>
</div>

I have noticed that we raise more through the QR codes and displays when I'm around to prompt people to donate. I might tell someone I know to be generous that there's a new animation if you donate $42. Repeat a few times and that's $126. There's a separate social problem here where I will need to get other people invested in the project. My current plan is to get other members to add new effects, giving them a sense of ownership, and then they can go around letting people know there's a new effect to try.

Often I see people donate just to test out the display on their first visit. The default donation amount for the QR code shown on the displays is $100. This is of course adjustable, but it's not uncommon for someone to accept that default. I've seen multiple people bring in their friends, direct them to a display to donate, and they all get excited when Snoop Dogg shows up.

It's perfectly on brand for Noisebridge to have a custom made wacky RGB LED system. We famously also have a giant display made out of LED illuminated beer bottles.

<img src="/blog/image/twitch-donations-irl/flaschen-taschen.jpeg" width="80%" alt="A large wall-scale display made from beer bottles in stacked bottle cases" />

While this project has not completely closed our funding gap, it has meaningfully helped. More importantly, everyone in our anarchist organization now has their eyes on the finances. Last year's fundraising wouldn't have been so panicked if we hadn't been able to forget about money.

All of the code is available [on GitHub](https://github.com/noisebridge/donate-portal). You can visit the live site at [donate.noisebridge.net](https://donate.noisebridge.net).
