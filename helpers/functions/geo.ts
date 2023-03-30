import { GeoFeatures } from "@/types/utils";
import * as turf from "@turf/turf";
import { multiPolygon, point, polygon } from "@turf/turf";
import { MathUtils, Spherical, Vector3 } from "three";

export const isLocationInRegion = (
  latitude: number,
  longitude: number,
  feature: GeoFeatures
) => {
  const p = point([longitude, latitude]);
  if (feature.geometry.type === "Polygon") {
    const region = polygon(feature.geometry.coordinates);
    return turf.booleanPointInPolygon(p, region);
  } else if (feature.geometry.type === "MultiPolygon") {
    const region = multiPolygon(feature.geometry.coordinates);
    return turf.booleanPointInPolygon(p, region);
  }
  return false;
};

export function GPSToCartesian(lat: number, lng: number, radius: number) {
  const spherical = new Spherical(
    radius, // radius
    MathUtils.degToRad(90 - lat), // phi (latitude) in radians
    MathUtils.degToRad(lng) // theta (longitude) in radians
  );

  // Create a new Vector3 object and set its coordinates from the spherical coordinates
  const cartesian = new Vector3().setFromSphericalCoords(
    spherical.radius,
    spherical.phi,
    spherical.theta
  );
  return cartesian;
}

export function cartesianToGPS(x: number, y: number, z: number) {
  const polar = new Spherical().setFromCartesianCoords(x, y, z);
  const longitude = MathUtils.radToDeg(polar.theta);
  const latitude = 90 - MathUtils.radToDeg(polar.phi);

  return [longitude, latitude];
}
