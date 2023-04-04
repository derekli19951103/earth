"use client";
import { AppProvider } from "@/components/Context";
import { ConfigProvider, theme } from "antd";
import { SWRConfig } from "swr";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <AppProvider>{children}</AppProvider>
      </ConfigProvider>
    </SWRConfig>
  );
}
