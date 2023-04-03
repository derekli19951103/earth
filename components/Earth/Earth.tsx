import {
  cartesianToGPS,
  getPolygonCenter,
  GPSToCartesian,
  isLocationInRegion,
} from "@/helpers/functions/geo";
import atmosFrag from "@/helpers/shaders/atmos.frag.glsl";
import atmosVert from "@/helpers/shaders/atmos.vert.glsl";
import { GradientEmissiveAddon } from "@/helpers/shaders/gradient-emissive";
import { GeoFeatures } from "@/types/utils";
import { ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Interpolation, Tween, update } from "@tweenjs/tween.js";
import ExifReader from "exifreader";
import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  Color,
  CubeTextureLoader,
  Group,
  MeshStandardMaterial,
  SpotLight,
  TextureLoader,
} from "three";

export const EARTH_RADIUS = 100;

export const Earth = (props: {
  countryData?: GeoFeatures[];
  config?: { earthTextureEnabled?: boolean; cloudVisible?: boolean };
  onHoverCountry: (country: GeoFeatures) => void;
  imageFile?: File;
}) => {
  const { countryData, config, onHoverCountry, imageFile } = props;

  const { scene, camera } = useThree();
  const lightGroupRef = useRef<Group>(null);
  const spotLight = useRef<SpotLight>(null);
  const earthMaterailRef = useRef<MeshStandardMaterial>(null);

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

  useEffect(() => {
    if (earthMaterailRef.current) {
      earthMaterailRef.current.map = config?.earthTextureEnabled ? map : null;
      earthMaterailRef.current.color = config?.earthTextureEnabled
        ? new Color()
        : new Color(0x000000);
      earthMaterailRef.current.needsUpdate = true;
    }
  }, [config?.earthTextureEnabled]);

  const moveToImageLocation = (imageFile: File) => {
    ExifReader.load(imageFile).then((tags) => {
      console.log(tags);

      const lng = tags["GPSLongitude"]?.description;
      const lat = tags["GPSLatitude"]?.description;
      const lngRef = tags["GPSLongitudeRef"]?.description[0];
      const latRef = tags["GPSLatitudeRef"]?.description[0];

      if (lat && lng && latRef && lngRef) {
        const realLat = Number(lat) * (latRef === "N" ? 1 : -1);
        const realLng = Number(lng) * (lngRef === "E" ? 1 : -1);
        const pos = GPSToCartesian(realLng, realLat, EARTH_RADIUS + 50);

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
    });
  };

  useEffect(() => {
    if (imageFile) {
      moveToImageLocation(imageFile);
    }
  }, [imageFile]);

  useFrame((state) => {
    if (lightGroupRef.current) {
      lightGroupRef.current.quaternion.copy(state.camera.quaternion);
    }
    update();
  });

  const handleHighlightTerritory = (
    e: ThreeEvent<PointerEvent | MouseEvent>
  ) => {
    const [longitude, latitude] = cartesianToGPS(
      e.point.x,
      e.point.y,
      e.point.z
    );

    const region = countryData?.find((f) =>
      isLocationInRegion(latitude, longitude, f)
    );

    if (region) {
      onHoverCountry(region);
      scene.children.forEach((c) => {
        if (c.userData.type === "region") {
          if (c.userData.coutry_name === region.properties.name) {
            //@ts-ignore
            c.material.color.set("cyan");
            const center = getPolygonCenter(region);
            const pos = GPSToCartesian(center[0], center[1], 1);
            c.position.copy(pos);
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
  };

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
          onPointerMove={handleHighlightTerritory}
          onClick={handleHighlightTerritory}
        >
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshStandardMaterial
            map={map}
            roughnessMap={roughnessMap}
            roughness={0.5}
            onBeforeCompile={GradientEmissiveAddon}
            ref={earthMaterailRef}
          />
        </mesh>

        <mesh userData={{ type: "cloud" }} visible={config?.cloudVisible}>
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
