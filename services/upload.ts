import { heicToJPG } from "@/helpers/functions/file";
import { getUniqueName } from "@/helpers/functions/text";
import { extname } from "path";

export const uploadFile = async (folder: string, file: File) => {
  let fileName = "";
  let blob: Blob = file;

  switch (file.type) {
    case "image/heic":
      try {
        const jpg = await heicToJPG(file);
        if (jpg) {
          blob = jpg;
          const ext = extname(file.name);
          fileName = `${folder}${getUniqueName(file.name).replace(
            ext,
            ".jpg"
          )}`;
        }
      } catch (e) {
        throw new Error("Failed to convert HEIC to JPG");
      }
      break;
    default:
      fileName = `${folder}${getUniqueName(file.name)}`;
  }

  const { publicUrl, presignedUrl } = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({ bucket: "derek", key: fileName }),
  }).then((res) =>
    res.json().then((res) => res as { publicUrl: string; presignedUrl: string })
  );

  if (publicUrl && presignedUrl) {
    const upload = await fetch(presignedUrl, {
      method: "PUT",
      body: blob,
    });

    await fetch("/api/upload/change-acl", {
      method: "POST",
      body: JSON.stringify({ bucket: "derek", key: fileName }),
    });

    if (upload.status === 200) {
      return publicUrl;
    } else {
      throw new Error("Upload failed");
    }
  } else {
    throw new Error("Missing publicUrl or presignedUrl");
  }
};
