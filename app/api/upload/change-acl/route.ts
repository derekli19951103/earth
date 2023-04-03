import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

const exposeObjectAcl = async (bucket: string, key: string) => {
  return fetch(
    `${process.env.LINODE_API_ENDPOINT}/buckets/${process.env.LINODE_REGION}/${bucket}/object-acl`,
    {
      method: "PUT",
      body: JSON.stringify({ acl: "public-read", name: key }),
      headers: {
        Authorization: `Bearer ${process.env.LINODE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export async function POST(request: NextRequest) {
  const { bucket, key } = await request.json();
  if (bucket && key) {
    const presignedUrl = await exposeObjectAcl(bucket, key).then((res) =>
      res.json()
    );
    return NextResponse.json(presignedUrl);
  } else {
    return NextResponse.json({ error: "Missing bucket or key" });
  }
}
