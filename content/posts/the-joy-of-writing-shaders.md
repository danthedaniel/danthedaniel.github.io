---
title: "The Joy of Writing Shaders"
date: 2018-02-04T00:00:00-04:00
draft: false
tags: ["programming", "math", "graphics"]
---

<div class="iframe-wrapper rounded">
    <iframe frameborder="0" src="https://www.shadertoy.com/embed/4dcyzH?gui=true&paused=true&muted=true" allowfullscreen></iframe>
</div>

Shaders provide programmers with a beautiful combination of art and math. Most other throwaway projects are devoid of any artistic value. In less than a dozen lines of code you can draw fractals. A few more and you can start creating intricate animations. The most interesting part is the unique perspective they force you into.

Say you want to draw a circle in an imperative programming language. You need to break out a for loop and calculate the `sin` and `cos` of different angles until you have points all around the circumference of a circle.

```python
vertices = []  
for angle in range(0, 360, 6):  
    x = cos(angle) / radius  
    y = sin(angle) / radius  
    vertices.append((x, y))
```

Then I would render lines sequentially connecting each point to the last. But this results in a circle that's really just a regular polygon with a large number of sides. You could also try to use Bézier curves, but that feels a bit more removed from the definition of a circle.

In a shader you'd use a more simplified definition of a circle. If you're inside of the circle's radius you draw the circle. If you're outside of the radius you don't.

```glsl
uniform vec2 u_resolution;

void main() {
    float radius = 0.3;
    vec2 center = vec2(0.5);
    vec2 pos = gl_FragCoord.xy / u_resolution.xy;

    if (distance(pos, center) > radius) {
        gl_FragColor = vec4(1.0);
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}
```

![](/blog/image/shaders/circle_1.png)

The most interesting part is that you rarely think about more than one pixel at a time. The shader code above is ran once per pixel. There's no need to worry about how many sides your circle has. You don't refer to other information rendered in the same frame. This is what makes shaders so fast. Each pixel can be rendered simultaneously.

Just like learning your first functional programming language after being introduced to C++ or Java, this paradigm shift puts you into a completely different mode of thinking. The dependence on math that you might otherwise toss aside once you've left school is great. None of my web scrapers, APIs, or simulations require me to use 2D rotation matrices.

When writing shaders I often find myself transfixed by how quickly changes can lead to visual results. The feedback loop is one of the tightest there is in programming. Quick compile times coupled with hot-reloading (shout out to [glslViewer](https://github.com/patriciogonzalezvivo/glslViewer)) make for a happy programmer.

Check out my shaders on GitHub [here](https://github.com/danthedaniel/shaders) and [here](https://github.com/teaearlgraycold/shadron).
