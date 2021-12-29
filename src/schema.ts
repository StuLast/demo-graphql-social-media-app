import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    posts: [Post!]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type Mutation {
    postCreate(input: PostInput!): PostPayload!
    postUpdate(id: Int!, input: PostInput!): PostPayload!
    postDelete(id: Int!): PostPayload!
    signup(input: UserInput!): AuthPayload!
    signin(input: SignInInput!): AuthPayload!
  }

  input PostInput {
    title: String
    content: String
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile
    posts: [Post!]!
  }

  type UserData {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  input UserInput {
    name: String
    email: String
    password: String
    profile: ProfileInput
  }

  input ProfileInput {
    bio: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserError {
    message: String!
  }
`;

export default typeDefs;
