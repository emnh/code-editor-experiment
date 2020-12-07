// Import stylesheets
import "./style.css";

// Write Javascript code!
const appDiv = document.getElementById("app");
// appDiv.innerHTML = `<h1>JS Starter</h1>`;

const Quad = require("gl-big-quad");
const Shader = require("gl-shader");
const raf = require("raf");

for (let i = 0; i < 12; i++) {
  const canvas = addCanvas(randGLSL());
}

function randFun() {
  const pats = [
    "sin(A)",
    "cos(A)",
    "tan(A)",
    "A * B",
    "A + B",
    "A / B",
    "A - B"
  ];
  const args = ["uv.x", "uv.y", Math.random().toFixed(6)];
  let s = "";
  for (let i = 0; i < 10; i++) {
    const pr = Math.floor(Math.random() * pats.length);
    const ar1 =
      Math.random() < 1.5
        ? args.length - 1
        : Math.floor(Math.random() * args.length);
    const ar2 = Math.floor(Math.random() * args.length);
    s = pats[pr].replace("A", args[ar1]).replace("B", args[ar2]);
    args.push(s);
  }
  return s;
}

function randGLSL() {
  const f = randFun();
  return "vec4(" + f + ", " + f + ", " + f + ", 1.0)";
}

function addCanvas(body) {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  appDiv.append(canvas);
  const gl = canvas.getContext("webgl");
  const quad = Quad(gl);

  const vert = `
  precision mediump float;
  
  attribute vec2 position;
  varying vec2 uv;
  
  void main() {
    uv = position;
  
    vec2 lo = vec2(-0.5);
    vec2 hi = vec2(+0.5);
  
    gl_Position = vec4(mix(lo, hi, position), 1.0, 1.0);
  }
  `;

  const frag =
    `
  precision mediump float;
  
  varying vec2 uv;
  
  void main() {
    gl_FragColor = ` +
    body +
    `;
  }
  `;

  const shader = Shader(gl, vert, frag);

  render();
  function render() {
    shader.bind();
    quad.bind();
    quad.draw();

    // Render again in the next frame
    raf(render);
  }
  return canvas;
}
