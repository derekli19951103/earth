import { message } from "antd";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_API_ORIGIN!}graphql`
);

export const handleGQLError = (err: Error) => {
  message.error(
    //@ts-ignore
    err.response.errors.map((e: any) => e.message).join(", ")
  );
};
