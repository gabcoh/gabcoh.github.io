import '../css/index.css';
import vert from './shader.vert';
import frag from './shader.frag';

import VanillaTilt from 'vanilla-tilt';

let canvas = document.createElement('canvas');
canvas.width = window.innerWidth/10;
canvas.height = window.innerHeight/10;

let gl = canvas.getContext("webgl");

const vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vert);
gl.compileShader(vertShader);
if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
  alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertShader));
  gl.deleteShader(vertShader);
}

const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, frag);
gl.compileShader(fragShader);
if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
  alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragShader));
  gl.deleteShader(fragShader);
}

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);

const shaderInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
  },
  uniformLocations: {
    time: gl.getUniformLocation(shaderProgram, 'millis'),
  },
};

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);


const positions = [
  -1.0,  -1.0,
  1.0,  -1.0,
  1.0, 1.0,
  -1.0,  1.0,
  1.0, 1.0,
  -1.0, -1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

function animate(time) {
  gl.clearColor(0,0,0,1);
  gl.clearDepth(1);
  gl.disable(gl.DEPTH_TEST);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

  gl.useProgram(shaderInfo.program);
  gl.uniform1f(shaderInfo.uniformLocations.time, time);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

  setTimeout(() => requestAnimationFrame(animate), 1e3/30);
}
animate();

document.body.appendChild(canvas);

VanillaTilt.init(document.querySelector("canvas"), {
  max: 25,
  speed: 400
});
