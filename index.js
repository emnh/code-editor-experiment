// Import stylesheets
import "./style.css";

// Write Javascript code!
const appDiv = document.getElementById("app");
// appDiv.innerHTML = `<h1>JS Starter</h1>`;

const $ = require("jquery");
//const Quad = require("gl-big-quad");
//const Shader = require("gl-shader");
//const raf = require("raf");
const THREE = require("three");
const quad = require("./quad.js");

const DEPTH = 100;
const X = "vUV.x";
const Y = "vUV.y";
const width = Math.max(100, window.innerWidth / 10);
const height = width;
//const height = Math.max(100, window.innerHeight / 10);
// const width = Math.max(100, window.innerWidth / 1);
// const height = Math.max(100, window.innerHeight / 1);

function fstr(x) {
  return x.toFixed(6);
}

const fs = [];
for (let x = 0.0; x < window.innerWidth; x += width) {
  for (let y = 0.0; y < window.innerHeight; y += height) {
    const z = 0.0;
    const pos = new THREE.Vector3(
      (1 * x) / window.innerWidth,
      (1 * y) / window.innerHeight,
      z
    );
    const ppos = new THREE.Vector3(
      (1 * (x - width)) / window.innerWidth,
      (1 * (y - height)) / window.innerHeight,
      z
    );
    const f1 = randFun();
    const cond =
      X +
      " > " +
      fstr(ppos.x) +
      " && " +
      Y +
      " > " +
      fstr(ppos.y) +
      " && " +
      X +
      " < " +
      fstr(pos.x) +
      " && " +
      Y +
      " < " +
      fstr(pos.y) +
      " && " +
      "true";
    console.log(ppos.x, pos.x, ppos.y, pos.y);
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    const f2 = "((" + cond + ") ? vec3(" + f1 + ") : vec3(0.0))";
    // const f2 =
    //   "((" + cond + ") ? vec3(" + r + ", " + g + ", " + b + ") : vec3(0.0))";
    fs.push(f2);
  }
}
let s = "vec3 s = vec3(0.0);\n";
for (let i = 0; i < fs.length; i++) {
  // s += fs[i] + " + ";
  s += "    s += " + fs[i] + ";";
}
console.log(s);
// return "vec4(" + f + ", " + f + ", " + f + ", 1.0)";
const prebody = s;
// const body = prebody + "\n;gl_FragColor = vec4(r, g, b, a);";
// const body = prebody + "\n;gl_FragColor = vec4(r, g, b, a);";
const body = prebody + "\n gl_FragColor = vec4(s, 1.0);";

quad.init();
const canvas = addCanvas(body);
quad.animate();

$("#app")
  .css("padding", "0px")
  .css("margin", "0px");
$("body")
  .css("padding", "0px")
  .css("margin", "0px");
$("canvas")
  .css("padding", "0px")
  .css("margin", "0px");
// .css("width", "200px")
// .css("height", "200px");

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
    "A / max(B, 0.00001)",
    "A - B",
    "B * A",
    "B + A",
    "B / max(A, 0.00001)",
    "B - A"
  ];
  const args = ["vUV.x", "vUV.y", "time", Math.random().toFixed(6)];
  let s = "";
  let longest = "";
  for (let i = 0; i < DEPTH; i++) {
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
  console.log(f);
  return "vec4(" + f + ", " + f + ", " + f + ", 1.0)";
}

function addCanvas(body) {
  const vert = `
  precision mediump float;
  
  varying vec2 vUV;
  
  void main() {
    vUV = uv;
    gl_Position = vec4(position, 1.0);
  }
  `;

  const frag =
    `
  precision mediump float;
  
  uniform float time;
  
  varying vec2 vUV;
  
  void main() {
    ` +
    body +
    `;
  }
  `;

  return quad.initQuad(vert, frag);
}
