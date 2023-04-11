import { client, handleGQLError } from "@/graphql/client";
import {
  CreateGeoObjectDocument,
  GetGeoObjectsDocument,
} from "@/graphql/gql/graphql";
import {
  getImageGeoLocation,
  getPolygonCenter,
  GPSToCartesian,
} from "@/helpers/functions/geo";
import { capitalize } from "@/helpers/functions/text";
import { uploadFile } from "@/services/upload";
import { DataLayer, EarthView, GeoFeatures } from "@/types/utils";
import { Html, OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { message, Segmented, Statistic } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import {
  ACESFilmicToneMapping,
  Quaternion,
  sRGBEncoding,
  Vector3,
} from "three";
import { AppContext } from "../Context";
import { Cities } from "./Cities";
import { Earth, EARTH_RADIUS } from "./Earth";
import { GeoTag } from "./GeoTag";
import { Territories } from "./Territories";

export const EarthContainer = () => {
  const { user, systemConfig, setSystemConfig } = useContext(AppContext);

  const [countryJson, setCountryJson] = useState<{
    type: string;
    features: GeoFeatures[];
  }>();
  const [cityJson, setCityJson] = useState<{
    type: string;
    features: GeoFeatures[];
  }>();
  const view = systemConfig.view;
  const layer = systemConfig.layer;
  const [country, setCountry] = useState<GeoFeatures>();
  const [city, setCity] = useState<GeoFeatures>();
  const [destinationLoc, setDestinationLoc] = useState<[number, number]>();

  const geoObjects = useSWR([user.id], ([userId]) => {
    if (userId) {
      return client
        .request(GetGeoObjectsDocument, { userId })
        .catch(handleGQLError);
    }
  });

  const visualizeData = useSWR([systemConfig.visualizeDataUrl], ([url]) => {
    if (url) {
      return fetch(url).then((res) => res.json());
    }
  });

  const combinedVisualization = useMemo(() => {
    if (visualizeData.data && countryJson) {
      const countries = visualizeData.data.countries as {
        number: number;
        name: string;
        color: string;
      }[];
      if (countries) {
        const max = Math.max(...countries.map((c) => c.number));
        const countryMap = countries.reduce((acc, cur: any) => {
          acc[cur.name] = {
            ...cur,
            magnitude: (cur.number / max) * 100,
          };
          return acc;
        }, {} as Record<string, any>);

        const result = countryJson.features.map((feature) => {
          const country = countryMap[feature.properties.name];
          if (country) {
            return {
              ...feature,
              data: country,
            };
          }
          return feature as GeoFeatures & {
            data?: {
              number: number;
              name: string;
              color: string;
              magnitude: number;
            };
          };
        });

        return result;
      }
    }
    return [];
  }, [visualizeData.data, countryJson]);

  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        setCountryJson(data);
      });

    fetch("/cities.geojson")
      .then((res) => res.json())
      .then((data) => {
        setCityJson(data);
      });
  }, []);

  const slienceDefaultEvents = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropFile = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file) {
          const url = await uploadFile("images/", file).catch((e) => {
            message.error((e as Error).message);
          });
          if (url) {
            const destination = await getImageGeoLocation(file);
            if (destination) {
              const geoObject = await client
                .request(CreateGeoObjectDocument, {
                  input: {
                    type: "image",
                    title: "Image",
                    imageUrl: url,
                    lng: destination[0],
                    lat: destination[1],
                  },
                })
                .catch(handleGQLError);
              if (geoObject) {
                setDestinationLoc(destination);
              }
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("dragleave", slienceDefaultEvents);
    window.addEventListener("dragover", slienceDefaultEvents);
    window.addEventListener("dragenter", slienceDefaultEvents);
    window.addEventListener("drop", handleDropFile);

    return () => {
      window.removeEventListener("dragleave", slienceDefaultEvents);
      window.removeEventListener("dragover", slienceDefaultEvents);
      window.removeEventListener("dragenter", slienceDefaultEvents);
      window.removeEventListener("drop", handleDropFile);
    };
  }, []);

  return (
    <>
      <Canvas
        tabIndex={1}
        camera={{ position: [0, 0, 200] }}
        onContextMenu={(e) => e.preventDefault()}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.outputEncoding = sRGBEncoding;
        }}
      >
        <Earth
          countryData={countryJson?.features}
          config={{
            earthTextureEnabled: view === "Realistic" || view === "Combined",
            cloudVisible: view === "Realistic" || view === "Combined",
          }}
          onHoverCountry={setCountry}
          destinationLoc={destinationLoc}
        />

        {countryJson && (view === "Borders" || view === "Combined") && (
          <Territories countryData={countryJson.features} />
        )}

        {cityJson && (view === "Cities" || view === "Combined") && (
          <Cities features={cityJson.features} onHoverCity={setCity} />
        )}

        {layer === "Image" &&
          geoObjects.data?.geoObjects?.map((geoObject) => {
            return <GeoTag key={geoObject.id} geoObject={geoObject} />;
          })}

        {layer === "Data" &&
          combinedVisualization?.map((f, i) => {
            const center = getPolygonCenter(f);
            const pos = GPSToCartesian(center[0], center[1], EARTH_RADIUS + 1);

            const normal = new Vector3(pos.x, pos.y, pos.z).normalize();
            const quaternion = new Quaternion().setFromUnitVectors(
              new Vector3(0, 1, 0),
              normal
            );

            if (f.data?.number) {
              return (
                <>
                  <mesh key={i} position={pos} quaternion={quaternion}>
                    <boxGeometry args={[2, f.data.magnitude, 2]} />
                    <meshPhongMaterial color={f.data.color} />
                  </mesh>
                  <Html position={pos}>
                    <div style={{ color: "white" }}>{f.data.number}</div>
                  </Html>
                </>
              );
            }
          })}

        <OrbitControls minDistance={EARTH_RADIUS + 1} enablePan={false} />
        {process.env.NODE_ENV === "development" && <Stats />}
      </Canvas>

      <div style={{ position: "absolute", bottom: 10, right: 10 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <Segmented
            options={["Image", "Data"]}
            value={layer}
            onChange={(e) =>
              setSystemConfig({ ...systemConfig, layer: e as DataLayer })
            }
          />
          <Segmented
            options={["Cities", "Borders", "Realistic", "Combined"]}
            value={view}
            onChange={(e) =>
              setSystemConfig({ ...systemConfig, view: e as EarthView })
            }
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          borderRadius: 10,
          backgroundColor: "black",
        }}
      >
        <Statistic title="Country" value={country?.properties.name || "None"} />
        {(view === "Cities" || view === "Combined") && (
          <Statistic
            title="City"
            value={capitalize(city?.properties.NAME || "None")}
          />
        )}
      </div>
    </>
  );
};
