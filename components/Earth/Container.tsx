import { GPSToCartesian, isLocationInRegion } from "@/helpers/functions/geo";
import { GeoFeatures } from "@/types/utils";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import ExifReader from "exifreader";
import { useEffect, useRef, useState } from "react";
import { ACESFilmicToneMapping, sRGBEncoding } from "three";
import { Earth } from "./Earth";
import { Territories } from "./Territories";

export const EarthContainer = () => {
  const [geoJson, setGeoJson] = useState<{
    type: string;
    features: GeoFeatures[];
  }>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGeoJson(data);
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

      <OrbitControls minDistance={150} />
      <Stats />
    </Canvas>
  );
};
