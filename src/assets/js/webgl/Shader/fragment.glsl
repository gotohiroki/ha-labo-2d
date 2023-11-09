struct TextureData {
  sampler2D texture;
  vec2 coveredScale;
};

uniform float u_time;
uniform TextureData u_image;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_refractPower;
uniform float u_unrefractRange;
varying vec2 vUv;

const float radius = 0.3;

#include './_inc/noise.glsl';

float map(float value, float min1, float max1, float min2, float max2) {
  float v = clamp(value, min1, max1);
  return min2 + (v - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  // 画像が画面サイズにフィットするようにuvを変換する
  vec2 uv = (vUv - 0.5) * u_image.coveredScale + 0.5;

  // 画面のアスペクト比を求める
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

  // マウスの座標は、-1 ~ 1で取得されるので、0 ~ 1に変換する
  vec2 mouse = u_mouse * 0.5 + 0.5;

  // ノイズを計算する
  float n = cnoise(uv * 3.0 + u_time * 0.3) * 0.02;

  // マウスとuvの距離を計算する（noiseも加算しておく） 
  // distance(x, y)	xとyの距離をfloatで返す
  float dist = distance(mouse * aspect, vUv * aspect) + n;

  // 球体の境界を求める（微小値を引くことで、境界をすこしだけぼかす）
  // smoothstep(e0, e1, x)	エルミート補完を行う
  float limit = 1.0 - smoothstep(radius - 0.003, radius, dist);
  
  
  // uvからマウスへの方向を求める。大きさは、曲げる量になる。
  vec2 refractPower = (vUv - mouse) * u_refractPower;

  // 球体内で屈折する範囲を求める（0.1までは曲げない）
  float range = map(dist, u_unrefractRange, radius, 0.0, 1.0);

  // 球体の端にいくほど、強く曲がるようにする。
  // pow(x, y)	xのy乗を返す
  range = pow(range, 3.0);

  // 曲げる量をもとめる。屈折の強さ（+方向） * 範囲
  vec2 distortion = refractPower * range;


  // 球体内の色をtextureから取得する。rgbシフトもさせる
  float inCircle_r = texture2D(u_image.texture, uv - (distortion + 0.001)).r;
  float inCircle_g = texture2D(u_image.texture, uv - (distortion + 0.002)).g;
  float inCircle_b = texture2D(u_image.texture, uv - (distortion + 0.003)).b;

  // シフトさせた色要素を合成する
  vec3 inCircle = vec3(inCircle_r, inCircle_g, inCircle_b);

  // 球体の背面につける影
  float shadow = smoothstep(radius, radius + 0.1, radius);
  shadow = shadow * (1.0 - 0.9) + 0.9;

  // 球体の外側の色を取得する
  vec4 tex = texture2D(u_image.texture, uv);

  // 影と合成する
  vec3 color = mix(vec3(0.0), tex.rgb, shadow);

  // 球体と合成する
  // mix(x, y, a)	x(1-a)+y*aを返す（つまり線形補間）
  color = mix(color, inCircle, limit);

  gl_FragColor = vec4(color, 1.0);
}