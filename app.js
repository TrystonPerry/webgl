import webgl from "./webgl.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("c");

canvas.style.height = `${window.innerHeight}px`;
canvas.height = window.innerHeight;
canvas.style.width = `${window.innerWidth}px`;
canvas.width = window.innerWidth;

const gl = canvas.getContext("webgl");
if (!gl) throw new Error("No WebGL context");

gl.viewport(0, 0, +canvas.width, +canvas.height);

const vShader = webgl.createShader(
  gl,
  gl.VERTEX_SHADER,
  document.getElementById("vertex").text
);
const fShader = webgl.createShader(
  gl,
  gl.FRAGMENT_SHADER,
  document.getElementById("fragment").text
);

const program = webgl.createProgram(gl, vShader, fShader);

const aPosition = gl.getAttribLocation(program, "a_position");
const uColor = gl.getUniformLocation(program, "u_color");
const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

gl.useProgram(program);
gl.enableVertexAttribArray(aPosition);

// DRAW
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2; // 2 components per iteration
var type = gl.FLOAT; // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0; // start at the beginning of the buffer

// Tell the attribute how to read data from the ARRAY_BUFFER
gl.vertexAttribPointer(aPosition, size, type, normalize, stride, offset);

for (let i = 0; i < 50; i++) {
  drawRect(gl, rand(), rand(), rand(), rand());
}

function drawRect(gl, x, y, w, h) {
  const x1 = x + w;
  const y1 = y + h;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x, y, x1, y, x, y1, x, y1, x1, y, x1, y1]),
    gl.STATIC_DRAW
  );

  gl.uniform4f(
    uColor,
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random()
  );

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function rand() {
  return Math.random() * 2 - 1;
}
