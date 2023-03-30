varying vec3 vertexNormal; 
uniform float intensity;
uniform vec3 color;
void main() { 
    float calc_intensity = pow(intensity - dot(vertexNormal, vec3(0.0,0.0,1.0)), 2.0); 
    gl_FragColor = vec4(color, 1.0) * calc_intensity; 
}