import { client, handleGQLError } from "@/graphql/client";
import {
  CreateUploadDocument,
  DeleteUploadDocument,
  FileType,
  GetUploadsDocument,
} from "@/graphql/gql/graphql";
import { uploadFile } from "@/services/upload";
import { InboxOutlined } from "@ant-design/icons";
import { Radio, Table, Typography, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import { useContext } from "react";
import useSWR from "swr";
import { AppContext } from "../Context";

const { Dragger } = Upload;

export const UploadData = () => {
  const { user, setSystemConfig, systemConfig } = useContext(AppContext);

  const uploads = useSWR([user.id, "uploads"], ([userId]) => {
    if (userId) {
      return client
        .request(GetUploadsDocument, {
          userId,
          fileType: FileType.Json,
        })
        .catch(handleGQLError);
    }
  });

  const handleDeleteUpload = (id: number) => {
    client.request(DeleteUploadDocument, { id }).catch(handleGQLError);
  };

  return (
    <>
      <Typography.Paragraph>Visualize Data</Typography.Paragraph>
      <div style={{ height: 200 }}>
        <Dragger
          multiple={false}
          accept="application/json"
          customRequest={async ({ file, onSuccess, onError }) => {
            const f = file as RcFile;

            const url = await uploadFile("files/", f).catch((e) => {
              onError!({ name: "Upload error", message: (e as Error).message });
            });
            if (url) {
              const doc = await client
                .request(CreateUploadDocument, {
                  input: { url, type: FileType.Json },
                })
                .catch(handleGQLError);
              if (doc) {
                onSuccess!(url, undefined);
              }
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">Support for json files.</p>
        </Dragger>
      </div>

      <Table
        dataSource={uploads.data?.getUploads || []}
        columns={[
          {
            key: "url",
            title: "Data",
            dataIndex: "url",
            render: (_, r) => (
              <Typography.Link
                ellipsis
                style={{ width: 150 }}
                target="_blank"
                href={r.url}
              >
                {r.url}
              </Typography.Link>
            ),
          },
          {
            key: "action",
            title: "Action",
            width: 130,
            render: (_, r) => {
              return (
                <Radio.Group
                  onChange={({ target: { value } }) => {
                    switch (value) {
                      case "use":
                        setSystemConfig({
                          ...systemConfig,
                          visualizeDataUrl: r.url,
                          layer: "Data",
                        });
                        break;
                      case "delete":
                        handleDeleteUpload(r.id);
                        break;
                      case "share":
                        window.navigator.clipboard.writeText(
                          `${"https://earth-rho.vercel.app/"}share?dataUrl=${
                            r.url
                          }`
                        );
                        break;
                    }
                  }}
                  size="small"
                >
                  <Radio.Button value="use">Use</Radio.Button>
                  <Radio.Button value="share">Share</Radio.Button>
                  <Radio.Button value="delete">Delete</Radio.Button>
                </Radio.Group>
              );
            },
          },
        ]}
      />
    </>
  );
};
