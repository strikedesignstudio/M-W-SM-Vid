// waterDistortion.frag
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uImage;

// Noise function to generate smooth noise
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Smooth Perlin noise for fluid distortion
float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x);
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution;
    float t = uTime * 0.5;
    
    // Create fluid distortion effect
    float n = smoothNoise(st * 5.0 + vec2(t, t));
    vec2 offset = vec2(n - 0.5, n - 0.5) * 0.02;

    vec2 uv = st + offset;
    vec4 color = texture2D(uImage, uv);

    gl_FragColor = color;
}
