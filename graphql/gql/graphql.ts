/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  Time: any;
};

export type CreateGeoObjectInput = {
  content?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  properties?: InputMaybe<Scalars['JSON']>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type CreateSketchInput = {
  content: Scalars['String'];
  title: Scalars['String'];
};

export type GenshinCharater = {
  __typename?: 'GenshinCharater';
  actived_constellation_num: Scalars['Int'];
  element: Scalars['String'];
  level: Scalars['Int'];
  name: Scalars['String'];
  rarity: Scalars['Int'];
  weapon: GenshinWeapon;
};

export type GenshinWeapon = {
  __typename?: 'GenshinWeapon';
  level: Scalars['Int'];
  name: Scalars['String'];
  rarity: Scalars['Int'];
};

export type GeoObject = {
  __typename?: 'GeoObject';
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  properties?: Maybe<Scalars['JSON']>;
  title: Scalars['String'];
  type: Scalars['String'];
  updatedAt: Scalars['Time'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createGeoObject: GeoObject;
  createSketch: Sketch;
  deleteGeoObject: GeoObject;
  deleteSketch: Scalars['Boolean'];
  login: Session;
  logout: Scalars['Boolean'];
  register: User;
  updateGeoObject: GeoObject;
  updateSketch: Sketch;
};


export type MutationCreateGeoObjectArgs = {
  input: CreateGeoObjectInput;
};


export type MutationCreateSketchArgs = {
  input: CreateSketchInput;
};


export type MutationDeleteGeoObjectArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteSketchArgs = {
  id: Scalars['Int'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateGeoObjectArgs = {
  input: UpdateGeoObjectInput;
};


export type MutationUpdateSketchArgs = {
  input?: InputMaybe<UpdateSketchInput>;
};

export type Query = {
  __typename?: 'Query';
  genshinCharaters: Array<GenshinCharater>;
  geoObjects?: Maybe<Array<GeoObject>>;
  session: User;
  sketches: Array<Maybe<Sketch>>;
};


export type QueryGenshinCharatersArgs = {
  cookies: Scalars['String'];
  uid: Scalars['String'];
};


export type QueryGeoObjectsArgs = {
  userId: Scalars['Int'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['Time'];
  email: Scalars['String'];
  expiresAt: Scalars['Time'];
  token: Scalars['String'];
  userId: Scalars['Int'];
  username: Scalars['String'];
};

export type Sketch = {
  __typename?: 'Sketch';
  content: Scalars['String'];
  createdAt: Scalars['Time'];
  id: Scalars['Int'];
  title: Scalars['String'];
  updatedAt: Scalars['Time'];
  userID: Scalars['Int'];
};

export type UpdateGeoObjectInput = {
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  imageUrl?: InputMaybe<Scalars['String']>;
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  properties?: InputMaybe<Scalars['JSON']>;
  title: Scalars['String'];
  type: Scalars['String'];
};

export type UpdateSketchInput = {
  content: Scalars['String'];
  id: Scalars['Int'];
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Time'];
  email: Scalars['String'];
  id: Scalars['Int'];
  updatedAt: Scalars['Time'];
  username: Scalars['String'];
};

export type GetGeoObjectsQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type GetGeoObjectsQuery = { __typename?: 'Query', geoObjects?: Array<{ __typename?: 'GeoObject', id: number, type: string, title: string, content?: string | null, imageUrl?: string | null, properties?: any | null, createdAt: any, updatedAt: any, lat: number, lng: number }> | null };

export type CreateGeoObjectMutationVariables = Exact<{
  input: CreateGeoObjectInput;
}>;


export type CreateGeoObjectMutation = { __typename?: 'Mutation', createGeoObject: { __typename?: 'GeoObject', id: number, type: string, title: string, content?: string | null, imageUrl?: string | null, properties?: any | null, createdAt: any, updatedAt: any, lat: number, lng: number } };

export type UpdateGeoObjectMutationVariables = Exact<{
  input: UpdateGeoObjectInput;
}>;


export type UpdateGeoObjectMutation = { __typename?: 'Mutation', updateGeoObject: { __typename?: 'GeoObject', id: number, type: string, title: string, content?: string | null, imageUrl?: string | null, properties?: any | null, createdAt: any, updatedAt: any, lat: number, lng: number } };

export type DeleteGeoObjectMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteGeoObjectMutation = { __typename?: 'Mutation', deleteGeoObject: { __typename?: 'GeoObject', id: number, type: string, title: string, content?: string | null, imageUrl?: string | null, properties?: any | null, createdAt: any, updatedAt: any, lat: number, lng: number } };

export type GeoObjectFieldsFragment = { __typename?: 'GeoObject', id: number, type: string, title: string, content?: string | null, imageUrl?: string | null, properties?: any | null, createdAt: any, updatedAt: any, lat: number, lng: number };

export type GetSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionQuery = { __typename?: 'Query', session: { __typename?: 'User', id: number, username: string, email: string } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Session', username: string, email: string, token: string, userId: number, createdAt: any, expiresAt: any } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: number, username: string, email: string, createdAt: any, updatedAt: any } };

export const GeoObjectFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GeoObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GeoObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}}]} as unknown as DocumentNode<GeoObjectFieldsFragment, unknown>;
export const GetGeoObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGeoObjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geoObjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GeoObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GeoObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GeoObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}}]} as unknown as DocumentNode<GetGeoObjectsQuery, GetGeoObjectsQueryVariables>;
export const CreateGeoObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGeoObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGeoObjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGeoObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GeoObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GeoObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GeoObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}}]} as unknown as DocumentNode<CreateGeoObjectMutation, CreateGeoObjectMutationVariables>;
export const UpdateGeoObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGeoObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGeoObjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGeoObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GeoObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GeoObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GeoObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}}]} as unknown as DocumentNode<UpdateGeoObjectMutation, UpdateGeoObjectMutationVariables>;
export const DeleteGeoObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGeoObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGeoObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GeoObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GeoObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GeoObject"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}}]} as unknown as DocumentNode<DeleteGeoObjectMutation, DeleteGeoObjectMutationVariables>;
export const GetSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSession"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetSessionQuery, GetSessionQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;