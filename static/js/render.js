const columns = 75;
const rows = 30;
const srcRoot = `${window.location.protocol}//${window.location.host}/blog/js`;

const palette = " ·+*&#@";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("pre.shader-canvas");
  const textarea = document.querySelector("textarea.code-editor");

  compileShader(textarea)
    .then(pixelFunc => runShader(pixelFunc, canvas))
    .then(() => {
      requestAnimationFrame(() => {
        cancelAnimationFrame(requestAnimationId);
        previousTimestamp = null;
      });
    })
    .catch(e => {
      canvas.innerText = e.message;
    });

  canvas.addEventListener("mouseover", () => {
    compileShader(textarea)
      .then(pixelFunc => runShader(pixelFunc, canvas))
      .catch(e => {
        canvas.innerText = e.message;
      });
  });

  canvas.addEventListener("mouseout", () => {
    cancelAnimationFrame(requestAnimationId);
    previousTimestamp = null;
  });
});

/**
 * @typedef {(x: number, y: number, time: number) => number} PixelFunc
 */

/**
 * Build a 2D character array.
 * @param width {number}
 * @param height {number}
 * @param timestamp {number}
 * @param pixelFunc {PixelFunc}
 * @returns {string[][]}
 */
const buildBuffer = (width, height, timestamp, pixelFunc) => {
  const buffer = [];

  for (let y = 0; y < height; y++) {
    const line = [];

    for (let x = 0; x < width; x++) {
      const lightness = pixelFunc(x / width, y / height, timestamp / 1000);
      const clamped = Math.max(0, Math.min(0.99, lightness));
      const char = palette[Math.floor(clamped * palette.length)];
      line.push(char ?? " ");
    }

    buffer.push(line);
  }

  return buffer;
};

/**
 * Eval textarea contents and return the fragment function.
 * @param {Element} textarea 
 * @returns {Promise<PixelFunc>}
 */
async function compileShader(textarea) {
  const fragmentSource = textarea.value.replaceAll("$src", srcRoot);
  const module = await importString(fragmentSource);

  if (!("fragment" in module)) {
    throw new Error("Module must export a fragment function");
  }

  return module.fragment;
}

let frameNumber = 0;
let frameRate = 4;
let requestAnimationId = null;
let currentTime = 0;
let previousTimestamp = null;
/**
 * Run the fragment function and update the canvas.
 * @param {PixelFunc} pixelFunc 
 * @param {Element} canvas 
 */
async function runShader(pixelFunc, canvas) {
  function frame(timestamp) {
    if (previousTimestamp !== null) {
      const deltaTime = timestamp - previousTimestamp;
      currentTime += deltaTime;
    }
    previousTimestamp = timestamp;

    if (frameNumber % frameRate === 0) {
      const buffer = buildBuffer(columns, rows, currentTime, pixelFunc);
      canvas.innerText = buffer.map(line => line.join("")).join("\n");
    }

    frameNumber++;

    requestAnimationId = requestAnimationFrame(frame);
  };

  requestAnimationId = requestAnimationFrame(frame);
}

/**
 * Perform a dynamic import from a string.
 * @param {string} str 
 * @returns module
 */
function importString(str) {
  if (URL.createObjectURL) {
    const blob = new Blob([str], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const module = import(url);
    URL.revokeObjectURL(url); // GC objectURLs
    return module;
  }
  
  const url = "data:text/javascript;base64," + btoa(moduleData);
  return import(url);
}
