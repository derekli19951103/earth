import { getUniqueName } from "@/helpers/functions/text";

export const uploadFile = async (folder: string, file: File) => {
  const fileName = `${folder}${getUniqueName(file.name)}`;
  const { publicUrl, presignedUrl } = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({ bucket: "derek", key: fileName }),
  }).then((res) => res.json());

  if (publicUrl && presignedUrl) {
    const upload = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
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
