export const heicToJPG = async (file: File) => {
  if (typeof window === "undefined") return;
  if (file.type !== "image/heic") return;
  return (await (
    await import("heic2any")
  ).default({ blob: file, toType: "image/jpeg" })) as Blob | undefined;
};
