import { Color, UniformsUtils, type IUniform } from 'three';

export const codeRainVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const codeRainFragment = /* glsl */ `
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColor;

  float hash(float x) {
    return fract(sin(x) * 43758.5453123);
  }

  float rain(vec2 uv) {
    float columns = 18.0;
    float row = floor(uv.x * columns);
    float speed = mix(0.25, 0.9, hash(row));
    float trail = fract(uv.y + uTime * speed);
    float head = smoothstep(0.02, 0.0, trail);
    float tail = smoothstep(0.55, 0.3, trail);
    float sparkle = hash(row + floor(trail * 30.0));
    return (head + tail * sparkle * 0.9) * 0.9;
  }

  void main() {
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    float streaks = rain(uv);
    float glow = pow(streaks, 1.4);
    vec3 base = mix(vec3(0.02, 0.05, 0.08), uColor, glow);
    float alpha = clamp(glow, 0.0, 1.0);
    gl_FragColor = vec4(base, alpha);
  }
`;

export const codeRainUniforms: Record<string, IUniform> = {
  uTime: { value: 0 },
  uColor: { value: new Color('#47f4ff') },
};

export function createCodeRainUniforms(): Record<string, IUniform> {
  return UniformsUtils.clone(codeRainUniforms);
}
