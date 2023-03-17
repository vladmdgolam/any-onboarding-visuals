import glsl from "babel-plugin-glsl/macro"

const frag = glsl`
    uniform float time;
    varying vec2 vUv;
    uniform vec3 pink;
    uniform vec3 blue;
    uniform float blur;
    uniform vec2 position;
    uniform float radius;
    uniform float seed;
    #define PI 3.1415926535897932384626433832795

    #pragma glslify: blendDifference = require(glsl-blend/difference)
    #pragma glslify: snoise2 = require(glsl-noise/simplex/2d) 

    float circle(vec2 uv, vec2 pos, float r, float blur) {
        float d = length(uv-pos);
        float result = smoothstep(r, r-blur, d);
        return result;
    }

    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    vec4 grain(vec4 col, float scale, float amount) {
        vec2 args = vec2(gl_FragCoord.xy*scale + rand(gl_FragCoord.xy + time)*10.0);
        float noiseValue = snoise2(args);
        vec3 noise = vec3(noiseValue);
        vec3 grainColor = mix(vec3(0.0), vec3(1.0), noise * amount);
        return vec4(mix(col.rgb, grainColor, amount), col.a);
    }

    // vec4 grain(vec4 col, float scale, float amount) {
    //     vec2 position1 = gl_FragCoord.xy * scale + vec2(time);
    //     vec2 position2 = gl_FragCoord.xy * scale * 1.5 + vec2(time * 1.5);
    //     float noiseValue1 = snoise2(position1);
    //     float noiseValue2 = snoise2(position2);
    //     vec3 noise = vec3(noiseValue1 + noiseValue2);
    //     vec3 grainColor = mix(vec3(0.0), vec3(1.0), noise * amount);
    //     return vec4(mix(col.rgb, grainColor, amount), col.a);
    // }
    
    void main() {
        vec2 uv = vUv;
        uv -= .5;
        
        float r = 0.5 * 0.8;

        // 1. PINK CIRCLE
        // derive pos from radius = 0.15 and angle = 30 degrees
        // get random angle from seed
        float angle = rand(vec2(seed+1.0)) * 2.0 * PI;
        float speed = time * 0.3;
        vec2 pos = vec2(0.19 * cos(angle + speed), 0.19 * sin(angle+speed));
        vec3 pinkCircle = circle(uv, pos, r * 0.7, 0.2) * pink ;
        vec3 col = pinkCircle;

        
        // 2. WHITE CIRCLE
        // calculate radius using noise
        float noiseScale2 = 10.5;
        float noise2 = snoise2(vec2(noiseScale2 + time * 0.1));
        float noiseRad = map(noise2, 0.0, 1.0, 0.8, 0.9);

        // random start angle
        float sAngle = rand(vec2(seed, seed * 23.7)) * 2.0 * PI;
        pos = vec2(cos(sAngle + time*0.6), sin(sAngle + time*0.6)) * 0.15;
        float whiteCircle = circle(uv, pos, r*noiseRad, 0.2);
        col += whiteCircle * vec3(1.);

        // 3. BLUE CIRCLE
        float blueCircleRad = map(sin(time), -1.0, 1.0, 0.95, 1.0);
        
        float blueCircle = circle(uv, position, r*blueCircleRad, 0.2);
        vec3 blueCircleFilled = blueCircle * blue;
        
        col = blendDifference(col, blueCircleFilled);
        
        // 4. PINK BACKDROP
        float pinkBackdrop = circle(uv, vec2(0.,0.), r*1.1, 0.05) * 0.1;
        col += pinkBackdrop * pink;

        // 4.5
        // map transparency, when colour is close to black, otherwise it's opaque
        float alpha = smoothstep(0.0, 1.0, length(col));
        
        // 5. BLACK CIRCLE
        col = clamp(col, 0., 1.);
        float black = circle(uv, vec2(0.,0.), r, 0.1);
        col -= vec3(black)*2.0;

        // circle is fully opaque
        alpha += black*2.0;

        // 6. GRAIN
        col = grain(vec4(col,1.), 1.4, 0.25).rgb;        
        
        gl_FragColor = vec4(col, alpha);
    }
      `

export default frag
