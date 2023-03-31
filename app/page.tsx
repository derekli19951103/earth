"use client";
import { EarthContainer } from "@/components/Earth/Container";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
