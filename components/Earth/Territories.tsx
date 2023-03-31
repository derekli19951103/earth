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

  return (
    <>
      {props.countryData.map((f, index: number) => {
        return <Territory key={index} feature={f} />;
      })}
    </>
  );
};
