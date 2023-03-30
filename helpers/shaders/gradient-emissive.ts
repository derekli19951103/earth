import { Shader } from "three";

export const GradientEmissiveAddon = (shader: Shader) => {
  shader.vertexShader = shader.vertexShader.replace(
    "varying vec3 vViewPosition;",
    `varying vec3 vViewPosition;
                 varying vec3 vertexNormal;
                `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <uv_vertex>",
    `#include <uv_vertex>
                 vertexNormal = normalize(normalMatrix * normal);
                `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "varying vec3 vViewPosition;",
    `varying vec3 vViewPosition;
                 varying vec3 vertexNormal;
                `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "vec3 totalEmissiveRadiance = emissive;",
    `vec3 totalEmissiveRadiance = emissive;
                 float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
                 vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
                `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <dithering_fragment>",
    `#include <dithering_fragment>
                 gl_FragColor += vec4(atmosphere, 1.0);
                `
  );
};
