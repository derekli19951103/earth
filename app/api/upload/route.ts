import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const client = new S3Client({
  region: process.env.LINODE_REGION,
  endpoint: process.env.LINODE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LINODE_ACCESS_KEY!,
    secretAccessKey: process.env.LINODE_SECRET_KEY!,
  },
});

const getPresignedPutUrl = async (bucket: string, key: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const url = await getSignedUrl(client, command);

  return url;
};

const getPublicUrl = (presignedUrl: string) => {
  return presignedUrl.slice(0, presignedUrl.indexOf("?"));
};

export async function POST(request: NextRequest) {
  const { bucket, key } = await request.json();
  if (bucket && key) {
    const presignedUrl = await getPresignedPutUrl(bucket, key);
    const publicUrl = getPublicUrl(presignedUrl);

    return NextResponse.json({ presignedUrl, publicUrl });
  } else {
    return NextResponse.json({ error: "Missing bucket or key" });
  }
}
