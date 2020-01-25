attribute vec2 aVertexPosition;

precision mediump float;

varying vec2 pos;

void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  pos = aVertexPosition;
}
