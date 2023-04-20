---
title: "10 Gb/s Router - For fun!"
date: 2023-04-18T11:25:48-07:00
draft: false
tags: ['networking', 'hardware']
---

Last year I was lucky enough to get access to 10 Gb/s home internet for $40/month. Ironically my ISP can not provide me with a router capable of handling more than 1 Gb/s. For $40/month that's acceptable - I'm paying less than most people do for Gigabit anyway. But I wanted to experience the full power of 10 Gb/s.

Looking around it's clear there isn't much consumer networking hardware built for 10 Gb/s. Many of the routers advertised as 10 Gb/s only have 2.5 Gb/s WAN ports combined with WiFi 6E. So from your WiFi 6E capable device to the router there is a theoretical best case bandwidth of 10.8 Gb/s. But from your router to the internet you've got a pipe less than a quarter that size.

The consumer hardware that *can* truly deliver 10 Gb/s to a device on your LAN (in my case, a wired device) never has more than one 10 Gb/s LAN port. The AXE16000 for example has:

* 1x 10 Gb/s LAN
* 1x 2.5 Gb/s LAN
* 4x 1 Gb/s LAN

![](/blog/image/router/AXE16000-rear.jpg)

It's $500. But the feature set isn't quite what I'm looking for. The WiFi is over-spec'd and switch under-spec'd.

## Building My Own

| Part | Model | Price |
|:--|:--|:--|
| PC | Dell Optiplex 7020 | $50 (Craigslist) |
| Switch | [TEG-S750](https://www.trendnet.com/products/10g-switch/5-port-10g-switch-TEG-S750-v1) | $310 |
| NIC | [X540-BT2 (Offbrand)](https://www.amazon.com/dp/B01IR7T7PG) | $125 |
| 6 inch Cat6A | N/A | $3 |
| AP | [R6700](https://www.netgear.com/home/wifi/routers/r6700/) | $0 (My old router) |
| SATA Y-Splitter | N/A | $0 (From cable bin) |
| **Total** | | **$488** |

![](/blog/image/router/homebrew-rear.jpg)

## PC

| Part | Model |
|:--|:--|
| CPU | i5-4590 @ 3.3 GHz |
| RAM | 2x4 GiB DDR3 |
| PCIe Slot | 3.0 x16 |
| PCIe Slot | 2.0 x4 |

I got a nice deal on this old Haswell Dell small-form-factor PC. It's got 4 cores and 8GiB of RAM, which is more than enough for a router. The 3.0 x16 PCIe slot will handle the NIC, which leaves one x4 slot for future expansion needs.

![](/blog/image/router/homebrew-front.jpg)

The only downside is the x16 PCIe slot is right up against the power supply. This means cooling is a bit of an issue for the NIC.

![](/blog/image/router/homebrew-open.jpg)

## NIC

I needed a network card that was all RJ45. My ISP-provided fiber modem only outputs via an RJ45 and nothing on my LAN uses SFP+. The old Intel X540-BT2 looked like the best solution. I bought an off-brand version (still uses the original silicon) that includes a fan. The original X540 was known for overheating, and given the limited airflow in the Dell I think the fan is necessary.

There's a [LTT video](https://youtu.be/_IzyJTcnPu8?t=184) that came out a few months after I built this router that recommends almost all of the same parts. They've modded their X540 to include a Noctua fan and mention it offhand, but that fan is *really* necessary because these NICs get **hot**.

![](/blog/image/router/homebrew-nic.jpg)

### Switch

So one thing to keep in mind is that because the NIC is using such an [ancient chip](https://ark.intel.com/content/www/us/en/ark/products/60021/intel-ethernet-controller-x540bt2.html) (released Q4 2012) it does not support 2.5 Gb/s or 5 Gb/s ethernet. It can only do 10M/100M/1G/10G. If you decide to save a buck and use a 2.5 Gb/s or 5 Gb/s switch then the NIC will drop down to 1 Gb/s as that will be the highest common speed between the NIC and switch. But because *this* switch can communicate with the NIC at 10 Gb/s it works fine. The switch handles translating between 10G-baseT and lower speeds that devices might speak.

What I love about this switch is that it runs on 12V and only consumes 1.5A. That allowed me to very easily wire it right into the PC's internal power supply.

![](/blog/image/router/homebrew-switch.jpg)

Amazingly each 12V wire (the yellow wires) in a SATA cable can deliver [up to 1.5A](https://www.playtool.com/pages/psuconnectors/connectors.html#sata)! The Dell PC only expects you to have one SATA powered device, so I needed a Y-splitter cable to power both the switch and the storage device (a low power SSD in my case). Thankfully I already had one lying around. It's definitely within spec, and I've had this running for almost a year without trouble. Just **make sure** you've got the right wires soldered to each other - ground to ground, +V to +V.

![](/blog/image/router/homebrew-cable.jpg)

What I've got in the end is a single power outlet solution for my router and switch combo. And with a little velcro it all feels like a single unit.

### AP

While I clearly don't prioritize it, I still want good WiFi. For me that means good enough to stream HD video to a couple of devices simultaneously. WiFi 802.11ac can handle that perfectly. My old router has functionality to put it into "AP Mode" where it no longer acts as a firewall or DHCP server. With "AP Mode" enabled the old router is nothing more than a WiFi to ethernet translator.

![](/blog/image/router/homebrew-ap-mode.png)

This router requires 12V at 2.5A. I could pull that out of the spare PCIe slot, but for now it's running off of a separate power supply.

### Operating System

I'm running [pfSense](https://www.pfsense.org/) on this computer. It's a FreeBSD-based operating system designed specifically for routers and it's got some awesome features. But generally I just want it to do its job and allow me to never think about my router when I just want to use my computers.

## Results

It's not 10 Gb/s. But my ISP claims they provide "up to" 10 Gb/s. I've only ever seen as much as 2.5 Gb/s when downloading Steam games. That's still pretty cool.

![](/blog/image/router/homebrew-speedtest.png)

Was it worth the effort? For me, definitely. I had a ton of fun and learned a few things along the way. But I think if you're not *really* into computer hardware the consumer products available like the AXE16000 will get you to a similar result for a similar price.
