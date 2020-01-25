precision mediump float;

#pragma glslify: noise = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(glsl-hsv2rgb)

uniform float millis;

varying vec2 pos;
void main() {
  float noisev = noise(vec3(pos/10.0, millis/1e4));
  vec3 color = hsv2rgb(vec3(noisev*.20 + .8, 1, 1));
  gl_FragColor = vec4(color, 1.0);
}
