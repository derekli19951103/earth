"use client";
import { SWRConfig } from "swr";

export default function Template({ children }: { children: React.ReactNode }) {
  return <SWRConfig>{children}</SWRConfig>;
}
