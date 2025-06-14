uniform vec2 resolution;
uniform float time;
uniform float performanceLevel; // Performance level: 0.5 for low-end, 1.0 for high-end
// uniform vec2 mouse; // We'll add mouse later
varying vec2 vUv;

// Palette function from Shadertoy
vec3 palette( in float t )
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.283185*(c*t+d));
}

// SDF functions from Shadertoy
float sphere( in vec3 p, in vec3 o, in float r)
{
    return length(p - o) - r;
}

float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

mat2 rot2D(float angle)
{
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

// Main SDF from Shadertoy
float sdf (in vec3 p)
{
    vec3 s2_pos = vec3(sin(time)*1.5, cos(time)*0.6, 0.0);
    vec3 s3_pos = vec3(cos(time)*1.25, sin(time)*1.0, 0.0);
    vec3 s4_pos = vec3(sin(time)*cos(time)*0.8, cos(time), 0.0);
    float s1 = sphere(p, vec3(0.0, 0.2, 0.0), 0.8);
    float s2 = sphere(p, s2_pos, 0.8);
    float s3 = sphere(p, s3_pos, 0.8);
    float s4 = sphere(p, s4_pos, 0.8);
    return opSmoothUnion(opSmoothUnion(s3, opSmoothUnion(s1, s2, 0.5), 0.5), s4, 0.5);
}

void main() {
    // Adapted from Shadertoy mainImage
    vec2 uv = ((gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y) * 1.5;
    vec2 m = vec2(cos(time*1.0), sin(time*2.0));
    vec3 ray_origin = vec3(uv, -2.0);
    vec3 ray_direction = vec3(0.0, 0.0, 1.0);
    float t = 0.0;
    
    ray_origin.yz *= rot2D(-m.y);
    ray_direction.yz *= rot2D(-m.y);
    ray_origin.xz *= rot2D(-m.x);
    ray_direction.xz *= rot2D(-m.x);
    
    // Adaptive iteration count based on performance level
    int maxIterations = int(mix(40.0, 80.0, performanceLevel));
    float minDistance = mix(0.01, 0.001, performanceLevel);
    
    for (int i = 0; i < 80; i++)
    {
        if (i >= maxIterations) break;
        
        vec3 p = ray_origin + ray_direction * t;
        float d = sdf(p);
        
        if (d < minDistance) {
            break;
        }
        
        // Adaptive step size for better performance
        t += d * mix(1.2, 1.0, performanceLevel);
        
        // Early exit for distant rays
        if (t > 10.0) break;
    }
    
    vec3 color = palette(t * 0.1);
    gl_FragColor = vec4(color, 0.0);
} 