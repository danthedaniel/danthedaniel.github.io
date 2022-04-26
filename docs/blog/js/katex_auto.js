// Automatically render all elements of type pre.math as latex equations.
setTimeout(function() {
    var math_elements = document.querySelectorAll('pre.math');

    math_elements.forEach(function(e) {
        e.innerHTML = katex.renderToString(e.innerText);
    });
}, 100);
