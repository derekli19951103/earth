import { GPSToCartesian } from "@/helpers/functions/geo";
import { GeoFeatures } from "@/types/utils";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  InstancedMesh,
  Object3D,
  sRGBEncoding,
} from "three";
import { Earth, EARTH_RADIUS } from "./Earth";
import { Territories } from "./Territories";

export const EarthContainer = () => {
  const [geoJson, setGeoJson] = useState<{
    type: string;
    features: GeoFeatures[];
  }>();
  const [cityGeoJson, setCityGeoJson] = useState<{
    type: string;
    features: GeoFeatures[];
  }>();

  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGeoJson(data);
      });

    fetch("/cities.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCityGeoJson(data);
      });
  }, []);

  return (
    <Canvas
      tabIndex={1}
      camera={{ position: [0, 0, 200] }}
      onContextMenu={(e) => e.preventDefault()}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.outputEncoding = sRGBEncoding;
      }}
    >
      <Earth countryData={geoJson?.features} />

      {geoJson && <Territories countryData={geoJson.features} />}

      {cityGeoJson && <CITIES features={cityGeoJson.features} />}

      <OrbitControls minDistance={EARTH_RADIUS + 50} />
      <Stats />
    </Canvas>
  );
};

const CITIES = (props: { features: GeoFeatures[] }) => {
  const { features } = props;
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = useRef(new Object3D());

  const { raycaster } = useThree();

  useEffect(() => {
    for (let i = 0; i < features.length; i++) {
      const coord = features[i].geometry.coordinates[0][0];

      const pos = GPSToCartesian(coord[1], coord[0], EARTH_RADIUS + 1);
      tempObject.current!.position.set(pos.x, pos.y, pos.z);
      tempObject.current!.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.current!.matrix);
    }
    meshRef.current!.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {});

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, features.length]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="white" />
    </instancedMesh>
  );
};
