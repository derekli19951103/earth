/* eslint-disable @next/next/no-img-element */
import { GeoObjectFieldsFragment } from "@/graphql/gql/graphql";
import { GPSToCartesian } from "@/helpers/functions/geo";
import { Html } from "@react-three/drei";
import { EARTH_RADIUS } from "./Earth";

export const GeoTag = (props: { geoObject: GeoObjectFieldsFragment }) => {
  const { geoObject } = props;

  return (
    <Html
      position={GPSToCartesian(geoObject.lng, geoObject.lat, EARTH_RADIUS + 1)}
      occlude
    >
      <div
        style={{
          padding: 5,
          backgroundColor: "white",
          borderRadius: "0 8px 8px",
        }}
      >
        <div style={{ marginBottom: 2 }}>{geoObject.title}</div>
        {geoObject.imageUrl && (
          <img src={geoObject.imageUrl} alt="..." width={100} />
        )}
      </div>
    </Html>
  );
};
