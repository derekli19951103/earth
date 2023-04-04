/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query GetGeoObjects($userId: Int!) {\n  geoObjects(userId: $userId) {\n    ...GeoObjectFields\n  }\n}\n\nmutation CreateGeoObject($input: CreateGeoObjectInput!) {\n  createGeoObject(input: $input) {\n    ...GeoObjectFields\n  }\n}\n\nmutation UpdateGeoObject($input: UpdateGeoObjectInput!) {\n  updateGeoObject(input: $input) {\n    ...GeoObjectFields\n  }\n}\n\nmutation DeleteGeoObject($id: Int!) {\n  deleteGeoObject(id: $id) {\n    ...GeoObjectFields\n  }\n}\n\nfragment GeoObjectFields on GeoObject {\n  id\n  type\n  title\n  content\n  imageUrl\n  properties\n  createdAt\n  updatedAt\n}": types.GetGeoObjectsDocument,
    "query GetSession {\n  session {\n    id\n    username\n    email\n  }\n}\n\nmutation Login($input: LoginInput!) {\n  login(input: $input) {\n    username\n    email\n    token\n    userId\n    createdAt\n    expiresAt\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    id\n    username\n    email\n    createdAt\n    updatedAt\n  }\n}": types.GetSessionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetGeoObjects($userId: Int!) {\n  geoObjects(userId: $userId) {\n    ...GeoObjectFields\n  }\n}\n\nmutation CreateGeoObject($input: CreateGeoObjectInput!) {\n  createGeoObject(input: $input) {\n    ...GeoObjectFields\n  }\n}\n\nmutation UpdateGeoObject($input: UpdateGeoObjectInput!) {\n  updateGeoObject(input: $input) {\n    ...GeoObjectFields\n  }\n}\n\nmutation DeleteGeoObject($id: Int!) {\n  deleteGeoObject(id: $id) {\n    ...GeoObjectFields\n  }\n}\n\nfragment GeoObjectFields on GeoObject {\n  id\n  type\n  title\n  content\n  imageUrl\n  properties\n  createdAt\n  updatedAt\n}"): (typeof documents)["query GetGeoObjects($userId: Int!) {\n  geoObjects(userId: $userId) {\n    ...GeoObjectFields\n  }\n}\n\nmutation CreateGeoObject($input: CreateGeoObjectInput!) {\n  createGeoObject(input: $input) {\n    ...GeoObjectFields\n  }\n}\n\nmutation UpdateGeoObject($input: UpdateGeoObjectInput!) {\n  updateGeoObject(input: $input) {\n    ...GeoObjectFields\n  }\n}\n\nmutation DeleteGeoObject($id: Int!) {\n  deleteGeoObject(id: $id) {\n    ...GeoObjectFields\n  }\n}\n\nfragment GeoObjectFields on GeoObject {\n  id\n  type\n  title\n  content\n  imageUrl\n  properties\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetSession {\n  session {\n    id\n    username\n    email\n  }\n}\n\nmutation Login($input: LoginInput!) {\n  login(input: $input) {\n    username\n    email\n    token\n    userId\n    createdAt\n    expiresAt\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    id\n    username\n    email\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetSession {\n  session {\n    id\n    username\n    email\n  }\n}\n\nmutation Login($input: LoginInput!) {\n  login(input: $input) {\n    username\n    email\n    token\n    userId\n    createdAt\n    expiresAt\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nmutation Register($input: RegisterInput!) {\n  register(input: $input) {\n    id\n    username\n    email\n    createdAt\n    updatedAt\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;