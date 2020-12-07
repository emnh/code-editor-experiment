// Import stylesheets
import "./style.css";

// Write Javascript code!
const appDiv = document.getElementById("app");
// appDiv.innerHTML = `<h1>JS Starter</h1>`;

const $ = require("jquery");
const Quad = require("gl-big-quad");
const Shader = require("gl-shader");
const raf = require("raf");

for (let i = 0; i < 12; i++) {
  const canvas = addCanvas(randGLSL());
}

$("#app")
  .css("padding", "0px")
  .css("margin", "0px");
$("body")
  .css("padding", "0px")
  .css("margin", "0px");
$("canvas")
  .css("padding", "0px")
  .css("margin", "0px")
  .css("width", "200px")
  .css("height", "200px");

function randFun() {
  const pats = [
    "exp2(A)",
    "log2(A)",
    "radians(A)",
    "degrees(A)",
    "abs(A)",
    "sqrt(A)",
    "inversesqrt(A)",
    "fract(A)",
    "sign(A)",
    "floor(A)",
    "ceil(A)",
    "exp(A)",
    "log(A)",
    "sin(A)",
    "cos(A)",
    "tan(A)",
    "atan(A)",
    "asin(A)",
    "acos(A)",
    "atan(A, B)",
    "atan(B, A)",
    "mod(A, B)",
    "mod(B, A)",
    "min(A, B)",
    "min(B, A)",
    "max(A, B)",
    "max(B, A)",
    "pow(A, B)",
    "pow(B, A)",
    "length(vec2(A, B))",
    "length(vec2(B, A))",
    "distance(vec2(A, B), vec2(0.5))",
    "distance(vec2(B, A), vec2(0.5))",
    "A * B",
    "A + B",
    "A / B",
    "A - B",
    "B * A",
    "B + A",
    "B / A",
    "B - A"
  ];
  const args = ["uv.x", "uv.y", "t", Math.random().toFixed(6)];
  let s = "";
  let longest = "";
  for (let i = 0; i < 100; i++) {
    const pr = Math.floor(Math.random() * pats.length);
    const ar1 = Math.floor(Math.random() * args.length);
    const ar2 = Math.floor(Math.random() * args.length);
    s = pats[pr].replace("A", args[ar1]).replace("B", args[ar2]);
    args.push(s);
    if (s.length > longest.length) {
      longest = s;
    }
  }
  return "clamp(" + longest + ", 0.0, 1.0)";
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
  
  uniform float t;
  
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
    shader.uniforms.t += 0.01;
    quad.bind();
    quad.draw();

    // Render again in the next frame
    raf(render);
  }
  return canvas;
}
