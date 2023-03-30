import {
  cartesianToGPS,
  GPSToCartesian,
  isLocationInRegion,
} from "@/helpers/functions/geo";
import atmosFrag from "@/helpers/shaders/atmos.frag.glsl";
import atmosVert from "@/helpers/shaders/atmos.vert.glsl";
import { GradientEmissiveAddon } from "@/helpers/shaders/gradient-emissive";
import { GeoFeatures } from "@/types/utils";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Easing, Interpolation, Tween, update } from "@tweenjs/tween.js";
import ExifReader from "exifreader";
import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  CubeTextureLoader,
  Group,
  SpotLight,
  TextureLoader,
} from "three";

export const EARTH_RADIUS = 100;

export const Earth = (props: { countryData?: GeoFeatures[] }) => {
  const { countryData } = props;

  const { scene, camera } = useThree();
  const lightGroupRef = useRef<Group>(null);
  const spotLight = useRef<SpotLight>(null);

  const [map, roughnessMap, cloudMap] = useLoader(TextureLoader, [
    "/textures/8k_earth_nightmap.jpg",
    "/textures/8k_earth_specular_map.png",
    "/textures/8k_earth_clouds.jpg",
  ]);

  //@ts-ignore
  const [skybox] = useLoader(CubeTextureLoader, [
    [
      "/textures/sky/px.png",
      "/textures/sky/nx.png",
      "/textures/sky/py.png",
      "/textures/sky/ny.png",
      "/textures/sky/pz.png",
      "/textures/sky/nz.png",
    ],
  ]);

  useEffect(() => {
    scene.background = skybox;

    window.addEventListener("keypress", (e) => {
      if (e.key === "e") {
        console.log(scene.children);
      }
    });
  }, [scene, skybox]);

  const slienceDefaultEvents = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    window.addEventListener("dragleave", slienceDefaultEvents);

    window.addEventListener("dragover", slienceDefaultEvents);

    window.addEventListener("dragenter", slienceDefaultEvents);

    window.addEventListener("drop", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          if (file) {
            const tags = await ExifReader.load(file);
            if (tags) {
              console.log(tags);

              const lng = tags["GPSLongitude"]?.description;
              const lat = tags["GPSLatitude"]?.description;
              const lngRef = tags["GPSLongitudeRef"]?.description[0];
              const latRef = tags["GPSLatitudeRef"]?.description[0];

              if (lat && lng && latRef && lngRef) {
                const realLat = Number(lat) * (latRef === "N" ? 1 : -1);
                const realLng = Number(lng) * (lngRef === "E" ? 1 : -1);
                const pos = GPSToCartesian(realLat, realLng, EARTH_RADIUS + 50);

                const initCameraPos = camera.position.clone();
                new Tween({
                  x: initCameraPos.x,
                  y: initCameraPos.y,
                  z: initCameraPos.z,
                })
                  .to({ x: pos.x, y: pos.y, z: pos.z }, 1000)
                  .interpolation(Interpolation.CatmullRom)
                  .onUpdate(({ x, y, z }) => {
                    camera.position.set(x, y, z);
                  })
                  .start();
              }
            }
          }
        }
      }
    });

    return () => {
      window.removeEventListener("dragleave", slienceDefaultEvents);
      window.removeEventListener("dragover", slienceDefaultEvents);
      window.removeEventListener("dragenter", slienceDefaultEvents);
    };
  }, []);

  useFrame((state) => {
    if (lightGroupRef.current) {
      lightGroupRef.current.quaternion.copy(state.camera.quaternion);
    }
    update();
  });

  // useHelper(spotLight as any, SpotLightHelper);

  return (
    <>
      <ambientLight color={0x404040} />
      <group ref={lightGroupRef}>
        <spotLight
          position={[-200, 200, 350]}
          intensity={2}
          color={0xffffff}
          angle={Math.PI / 4}
          ref={spotLight}
        />
      </group>

      <group rotation={[0, -Math.PI / 2, 0]} visible={true}>
        <mesh
          userData={{ type: "earth" }}
          onPointerMove={(e) => {
            const [longitude, latitude] = cartesianToGPS(
              e.point.x,
              e.point.y,
              e.point.z
            );

            const region = countryData?.find((f) =>
              isLocationInRegion(latitude, longitude, f)
            );

            if (region) {
              console.log(region.properties.name);
              scene.children.forEach((c) => {
                if (c.userData.type === "region") {
                  if (c.userData.coutry_name === region.properties.name) {
                    //@ts-ignore
                    c.material.color.set("cyan");
                    c.position.set(1, 1, 1);
                  } else {
                    //@ts-ignore
                    c.material.color.set("white");
                    c.position.set(0, 0, 0);
                  }
                }
              });
            } else {
              scene.children.forEach((c) => {
                if (c.userData.type === "region") {
                  //@ts-ignore
                  c.material.color.set("white");
                  c.position.set(0, 0, 0);
                }
              });
            }
          }}
        >
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshStandardMaterial
            map={map}
            // color="black"
            roughnessMap={roughnessMap}
            roughness={0.5}
            onBeforeCompile={GradientEmissiveAddon}
          />
        </mesh>

        <mesh userData={{ type: "cloud" }} visible={true}>
          <sphereGeometry args={[EARTH_RADIUS + 1, 64, 64]} />
          <meshStandardMaterial
            map={cloudMap}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh userData={{ type: "aura" }}>
        <sphereGeometry args={[EARTH_RADIUS + 8, 64, 64]} />
        <shaderMaterial
          blending={AdditiveBlending}
          side={BackSide}
          vertexShader={atmosVert}
          fragmentShader={atmosFrag}
          uniforms={{
            intensity: { value: 0.9 },
            color: { value: [0.3, 0.6, 1.0] },
          }}
        />
      </mesh>
    </>
  );
};
