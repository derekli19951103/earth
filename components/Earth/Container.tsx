import { capitalize } from "@/helpers/functions/text";
import { EarthView, GeoFeatures } from "@/types/utils";
import { UploadOutlined } from "@ant-design/icons";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Button, Segmented, Statistic, Upload } from "antd";
import { useEffect, useState } from "react";
import { ACESFilmicToneMapping, sRGBEncoding } from "three";
import { Cities } from "./Cities";
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
  const [view, setView] = useState<EarthView>("Realistic");
  const [country, setCountry] = useState<GeoFeatures>();
  const [city, setCity] = useState<GeoFeatures>();
  const [image, setImage] = useState<File>();

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
          imageFile={image}
        />

        {geoJson && (view === "Borders" || view === "Combined") && (
          <Territories countryData={geoJson.features} />
        )}

        {cityGeoJson && (view === "Cities" || view === "Combined") && (
          <Cities features={cityGeoJson.features} onHoverCity={setCity} />
        )}

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
          backgroundColor: "white",
          padding: 10,
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

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <Upload
          onChange={(info) => {
            if (info.file.status === "done") {
              setImage(info.file.originFileObj);
            } else if (info.file.status === "error") {
              setImage(info.file.originFileObj);
            }
          }}
          showUploadList={{ showRemoveIcon: false }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </div>
    </>
  );
};
