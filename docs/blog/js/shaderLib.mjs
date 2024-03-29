const sin = Math.sin,
  cos = Math.cos,
  sqrt = Math.sqrt;

/**
 * Cartesian distance between two points.
 * @param point0 {number[]}
 * @param point1 {number[]}
 * @returns {number}
 */
export const distance = (point0, point1) => {
  if (point0.length !== point1.length)
    throw new Error("Dimensionality must match");

  return sqrt(
    (point0[0] - point1[0]) * (point0[0] - point1[0]) +
    (point0[1] - point1[1]) * (point0[1] - point1[1]) +
    (point0[2] - point1[2]) * (point0[2] - point1[2])
  );
};

/**
 * Get the magnitude of a vector.
 * @param vector {number[]}
 * @returns {number}
 */
export const magnitude = (vector) => {
  return sqrt(
    vector[0] * vector[0] +
    vector[1] * vector[1] +
    vector[2] * vector[2]
  );
};

/**
 * Normalize a vector
 * @param vector {number[]}
 * @returns {number[]}
 */
export const normalize = (vector) => {
  const mag = magnitude(vector);
  return vector.map((dim) => dim / mag);
};

/**
 * Apply a function to elements from both vectors.
 * @param vector0 {number[]}
 * @param vector1 {number[]|number}
 * @param operation {(number, number) => number}
 * @returns {number[]}
 */
const vectorApply = (vector0, vector1, operation) => {
  return vector0.map((dim0, index) =>
    operation(dim0, vector1 instanceof Array ? vector1[index] : vector1)
  );
};

export const add = (vector0, vector1) =>
  vectorApply(vector0, vector1, (a, b) => a + b);

export const sub = (vector0, vector1) =>
  vectorApply(vector0, vector1, (a, b) => a - b);

export const div = (vector0, vector1) =>
  vectorApply(vector0, vector1, (a, b) => a / b);

export const mul = (vector0, vector1) =>
  vectorApply(vector0, vector1, (a, b) => a * b);

export const max = (vector0, vector1) =>
  vectorApply(vector0, vector1, (a, b) => (a > b ? a : b));

export const min = (vector0, vector1) =>
  vectorApply(vector0, vector1, (a, b) => (a < b ? a : b));

export const dot = (vector0, vector1) =>
  (vector0[0] * vector1[0]) + (vector0[1] * vector1[1]) + (vector0[2] * vector1[2]);

export const abs = (vector) => {
  return vector.map((dim) => Math.abs(dim));
};

export const pow = (vector, power) => {
  return vector.map((dim) => Math.pow(dim, power));
};

/**
 * Rotate a 3D vector around the X axis.
 * @param param0 {[number, number, number]}
 * @param theta {number}
 * @returns {[number, number, number]}
 */
export const rotate3DX = ([x, y, z], theta) => {
  const sinTheta = sin(theta);
  const cosTheta = cos(theta);
  // prettier-ignore
  return [
    x,
    y * cosTheta - z * sinTheta,
    y * sinTheta + z * cosTheta,
  ];
};

/**
 * Rotate a 3D vector around the Y axis.
 * @param param0 {[number, number, number]}
 * @param theta {number}
 * @returns {[number, number, number]}
 */
export const rotate3DY = ([x, y, z], theta) => {
  const sinTheta = sin(theta);
  const cosTheta = cos(theta);
  // prettier-ignore
  return [
    x * cosTheta + z * sinTheta,
    y,
    -x * sinTheta + z * cosTheta,
  ];
};

/**
 * Rotate a 3D vector around the Z axis.
 * @param param0 {[number, number, number]}
 * @param theta {number}
 * @returns {[number, number, number]}
 */
export const rotate3DZ = ([x, y, z], theta) => {
  const sinTheta = sin(theta);
  const cosTheta = cos(theta);
  // prettier-ignore
  return [
    x * cosTheta - y * sinTheta,
    x * sinTheta + y * cosTheta,
    z,
  ];
};
