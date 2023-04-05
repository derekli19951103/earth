import { client } from "@/graphql/client";
import {
  CreateGeoObjectDocument,
  GetGeoObjectsDocument,
} from "@/graphql/gql/graphql";
import { getImageGeoLocation } from "@/helpers/functions/geo";
import { capitalize } from "@/helpers/functions/text";
import { uploadFile } from "@/services/upload";
import { EarthView, GeoFeatures } from "@/types/utils";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { message, Segmented, Statistic } from "antd";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { ACESFilmicToneMapping, sRGBEncoding } from "three";
import { AppContext } from "../Context";
import { Cities } from "./Cities";
import { Earth, EARTH_RADIUS } from "./Earth";
import { GeoTag } from "./GeoTag";
import { Territories } from "./Territories";

export const EarthContainer = () => {
  const { user } = useContext(AppContext);

  const [geoJson, setGeoJson] = useState<{
    type: string;
    features: GeoFeatures[];
  }>();
  const [cityGeoJson, setCityGeoJson] = useState<{
    type: string;
    features: GeoFeatures[];
  }>();
  const [view, setView] = useState<EarthView>("Realistic");
  const [country, setCountry] = useState<GeoFeatures>();
  const [city, setCity] = useState<GeoFeatures>();
  const [destinationLoc, setDestinationLoc] = useState<[number, number]>();

  const geoObjects = useSWR([user.id], ([userId]) => {
    if (userId) {
      return client.request(GetGeoObjectsDocument, { userId });
    }
  });

  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoJson(data);
      });

    fetch("/cities.geojson")
      .then((res) => res.json())
      .then((data) => {
        setCityGeoJson(data);
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
          try {
            const url = await uploadFile("images/", file);
            if (url) {
              const destination = await getImageGeoLocation(file);
              if (destination) {
                const geoObject = await client.request(
                  CreateGeoObjectDocument,
                  {
                    input: {
                      type: "image",
                      title: "Image",
                      imageUrl: url,
                      lng: destination[0],
                      lat: destination[1],
                    },
                  }
                );
                if (geoObject.createGeoObject) {
                  setDestinationLoc(destination);
                }
              }
            }
          } catch (e) {
            message.error((e as Error).message);
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
          countryData={geoJson?.features}
          config={{
            earthTextureEnabled: view === "Realistic" || view === "Combined",
            cloudVisible: view === "Realistic" || view === "Combined",
          }}
          onHoverCountry={setCountry}
          destinationLoc={destinationLoc}
        />

        {geoJson && (view === "Borders" || view === "Combined") && (
          <Territories countryData={geoJson.features} />
        )}

        {cityGeoJson && (view === "Cities" || view === "Combined") && (
          <Cities features={cityGeoJson.features} onHoverCity={setCity} />
        )}

        {geoObjects.data?.geoObjects?.map((geoObject) => {
          return <GeoTag key={geoObject.id} geoObject={geoObject} />;
        })}

        <OrbitControls minDistance={EARTH_RADIUS + 1} enablePan={false} />
        <Stats />
      </Canvas>

      <div style={{ position: "absolute", bottom: 10, right: 10 }}>
        <Segmented
          options={["Cities", "Borders", "Realistic", "Combined"]}
          value={view}
          onChange={(e) => setView(e as EarthView)}
        />
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
