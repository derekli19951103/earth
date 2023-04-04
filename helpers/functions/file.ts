import heic2any from "heic2any";

export const heicToJPG = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const imageData = (await heic2any({ blob, toType: "image/jpeg" })) as Blob;
  const dataUrl = URL.createObjectURL(imageData);
  return dataUrl;
};
