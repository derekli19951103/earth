import { GeoFeatures } from "@/types/utils";
import {
  area,
  booleanPointInPolygon,
  center,
  centerOfMass,
  multiPolygon,
  point,
  pointOnFeature,
  polygon,
} from "@turf/turf";
import ExifReader from "exifreader";
import { MathUtils, Spherical, Vector3 } from "three";

export const isLocationInRegion = (
  latitude: number,
  longitude: number,
  feature: GeoFeatures
) => {
  const p = point([longitude, latitude]);
  if (feature.geometry.type === "Polygon") {
    const region = polygon(feature.geometry.coordinates);
    return booleanPointInPolygon(p, region);
  } else if (feature.geometry.type === "MultiPolygon") {
    const region = multiPolygon(feature.geometry.coordinates);
    return booleanPointInPolygon(p, region);
  }
  return false;
};

export const getPolygonCenter = (feature: GeoFeatures) => {
  if (feature.geometry.type === "MultiPolygon") {
    const areas = feature.geometry.coordinates.map((c: any) =>
      area(polygon(c))
    );
    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < areas.length; i++) {
      const a = area(polygon(feature.geometry.coordinates[i]));
      if (a > max) {
        max = a;
        maxIndex = i;
      }
    }
    const c = pointOnFeature(polygon(feature.geometry.coordinates[maxIndex]));
    return c.geometry.coordinates;
  }
  const p = polygon(feature.geometry.coordinates);
  const c = pointOnFeature(p);
  return c.geometry.coordinates;
};

export function GPSToCartesian(lng: number, lat: number, radius: number) {
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

export const getImageGeoLocation = async (imageFile: File) => {
  const tags = await ExifReader.load(imageFile);
  if (tags) {
    console.log(tags);
    const lng = tags["GPSLongitude"]?.description;
    const lat = tags["GPSLatitude"]?.description;
    const lngRef = tags["GPSLongitudeRef"]?.description[0];
    const latRef = tags["GPSLatitudeRef"]?.description[0];
    if (lat && lng && latRef && lngRef) {
      const realLat = Number(lat) * (latRef === "N" ? 1 : -1);
      const realLng = Number(lng) * (lngRef === "E" ? 1 : -1);

      return [realLng, realLat] as [number, number];
    }
  }
};
