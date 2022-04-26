---
title: "The N Sphere"
date: 2017-08-26T00:00:00-04:00
draft: false
tags: ['math']
---

It's very common for high-school students to learn the geometry of a circle.  
Trigonometric functions (`sin()`, `cos()`, etc.) are required knowledge for  
high-school graduates, and they have a close relationship to circles. This means  
that most students have seen the equation for a unit circle:

<pre class="math">y = \sqrt{1 - x^2}</pre>

Or put in a more general form:

<pre class="math">x^2 + y^2 = 1</pre>

Not as many have taken calculus, but for those that have they've probably also  
seen the equation for a unit sphere:

<pre class="math">x^2 + y^2 + z^2 = 1</pre>

Once you've seen both equations, it's easy to notice the pattern - every dimensional variable is squared, and those squares are summed to equal 1. This means that a hyper-sphere, regardless of how hard is may be to visualize, is no more mathematically complicated than the sum of 4 squares. In fact, any n-dimensional sphere (or n-sphere as they are known) can be calculated as

<pre class="math">{x_1}^2 + {x_2}^2 + ... + {x_n}^2 = 1</pre>

<pre class="math">\sum_{i=1}^n {x_i}^2 = 1</pre>

In summation-notation

The n-sphere isn't something most people were taught about. That's probably because it's not something that you'd run into unless you either learn about it yourself or you've take a few different calculus courses.

But there is a simpler form that could be discussed earlier, perhaps as a way to introduce students to multi-variate calculus early on. In the summation form of the n-sphere shown above, `i` can be less than two. You can have a 1-dimensional sphere.

<pre class="math">x^2 = 1</pre>

Also known as a 0-sphere

The above equation does not produce a shape - since the drawing space for a 1-D function is just a single line. Rather, the 0-sphere looks like two points. For the unit 0-sphere those points are 1 and -1 (as both equal 1 when squared).

![](/blog/image/n-sphere/n-sphere-1.svg)

The red dots above are the 0-sphere.

The 0-sphere might seem useless, but it actually shows up much more often than you might think. When two spheres intersect, the shape on their surfaces that intersects each other is a circle. And when two circles (A and B) intersect, their intersection is a 0-sphere C.

![](/blog/image/n-sphere/n-sphere-2.svg)

### References

*   [https://en.wikipedia.org/wiki/N-sphere](https://en.wikipedia.org/wiki/N-sphere)
