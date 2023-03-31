import { GPSToCartesian } from "@/helpers/functions/geo";
import { GeoFeatures } from "@/types/utils";
import { useThree } from "@react-three/fiber";
import { Tween, Interpolation } from "@tweenjs/tween.js";
import ExifReader from "exifreader";
import { useEffect, useMemo, useRef } from "react";
import { LineSegments } from "three";
import { GeoJsonGeometry } from "three-geojson-geometry";
import { EARTH_RADIUS } from "./Earth";

const Territory = (props: { feature: GeoFeatures }) => {
  const { feature } = props;
  const ref = useRef<LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new GeoJsonGeometry(feature.geometry, EARTH_RADIUS + 0.1);

    return geo;
  }, [feature.geometry]);

  return (
    <lineSegments
      ref={ref}
      geometry={geometry}
      userData={{ type: "region", coutry_name: feature.properties.name }}
    >
      <lineBasicMaterial color="white" />
    </lineSegments>
  );
};

export const Territories = (props: { countryData: GeoFeatures[] }) => {
  const { camera } = useThree();

  const handleDropFile = async (e: DragEvent) => {
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
              const pos = GPSToCartesian(realLng, realLat, EARTH_RADIUS + 50);

              camera.lookAt(0, 0, 0);

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
  };

  useEffect(() => {
    window.addEventListener("drop", handleDropFile);

    return () => {
      window.removeEventListener("drop", handleDropFile);
    };
  }, []);

  return (
    <>
      {props.countryData.map((f, index: number) => {
        return <Territory key={index} feature={f} />;
      })}
    </>
  );
};
