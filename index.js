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
  const r = Math.floor(Math.random() * 10);
  switch (r) {
    case 0:
      return "cos";
    case 1:
      return "tan";
    case 2:
      return "atan";
    default:
      return "sin";
  }
  return "sin";
}

function randGLSL() {
  const f = randFun();
  return "vec4(uv * 0.5 + 0.5, " + f + "(uv.x), 1.0)";
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
