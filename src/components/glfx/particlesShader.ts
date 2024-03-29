const vertexShader = `
uniform float uTime;
uniform sampler2D screenCapture;
uniform float limit;
uniform float uZoomMultiplier;
uniform vec2 mouse;
  
attribute float size;
attribute vec2 texel;

varying vec3 vColor;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

vec3 colorfulNoise(vec3 P)
{
  // Compute noise values for the three color channels separately
  float red_noise = cnoise(P);
  float green_noise = cnoise(P + vec3(127.1, 311.7, 74.7));
  float blue_noise = cnoise(P + vec3(269.5, 183.3, 246.1));

  // Normalize the noise values to the range [0, 1]
  red_noise = red_noise * 0.5 + 0.5;
  green_noise = green_noise * 0.5 + 0.5;
  blue_noise = blue_noise * 0.5 + 0.5;

  // Combine the noise values into a single vec3
  vec3 color_noise = vec3(red_noise, green_noise, blue_noise);

  return color_noise;
}

void main() {

  vColor = texture2D(screenCapture, texel).rgb; //customColor;
  //vColor = colorfulNoise(vColor);
  
  vec3 texelZ = vec3(texel,1);
  float no = cnoise( -( uTime * 12. ) + abs( texelZ ) * 1000. );
  
  // if (limit < 2.)
  float coeff = (size - 200.) / 400. + 235.;
  float nx = cnoise(texelZ + no + (uTime * coeff + 3000.));
  float ny = cnoise(texelZ + no + (uTime * (coeff + 300.) + 1000.));
  float nz = cnoise(texelZ + no + (uTime * coeff + 2000.));

  vec3 noise = vec3(nz, ny, nz);

  vec4 noisyPosition = modelViewMatrix  * vec4(vec3((position / no) * noise), 1.0 );
  noisyPosition = projectionMatrix * noisyPosition;
  noisyPosition.x += mouse.x;
  noisyPosition.y += mouse.y;
  
  float noisyPointSize = distance( vec3(nx, ny, nz), vec3(0, 0, 0)) * 4.;
  noisyPointSize = (noisyPointSize * noisyPointSize)  * uZoomMultiplier * .25;

  vec4 normalPosition = projectionMatrix *  vec4( position, 1.0 );
  // float normalPointSize = size * ( 1.0 / -normalPosition.z );

  gl_PointSize = 3.0 * noisyPointSize * (size + 0.5);

  gl_Position =  noisyPosition / limit + normalPosition; //noisyPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 0.45);
}
`;

const uniforms = {
    uTime: { value: 0 },
    screenCapture: { value: null },
    limit: { value: 0 },
    uZoomMultiplier: { value: 0 },
    mouse: { value: null },
};

const shader = {
    uniforms,
    vertexShader,
    fragmentShader,
};

export default shader;
