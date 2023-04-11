"use client";
import { AppContext } from "@/components/Context";
import { EarthContainer } from "@/components/Earth/Container";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();

  const { setSystemConfig } = useContext(AppContext);

  useEffect(() => {
    const dataUrl = searchParams.get("dataUrl");
    if (dataUrl) {
      setSystemConfig({
        visualizeDataUrl: dataUrl as string,
        view: "Borders",
        layer: "Data",
      });
    }
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <EarthContainer />
    </div>
  );
}
