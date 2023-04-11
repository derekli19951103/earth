import { Tween } from "@tweenjs/tween.js";

export interface Coord3 {
  x: number;
  y: number;
  z: number;
}

export interface Coord2 {
  x: number;
  y: number;
}

export interface GeoFeatures {
  geometry: {
    type:
      | "Point"
      | "MultiPoint"
      | "LineString"
      | "MultiLineString"
      | "Polygon"
      | "MultiPolygon";
    coordinates: any[];
  };
  properties: any;
  type: string;
}

export type EarthView = "Cities" | "Borders" | "Realistic" | "Combined";
export type DataLayer = "Image" | "Data";
