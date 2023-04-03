import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:8080/graphql",
  documents: ["graphql/schema/**/*.graphql"],
  overwrite: true,
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./graphql/gql/": {
      preset: "client",
      config: {},
      plugins: [],
    },
  },
};

export default config;
