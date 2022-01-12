import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    posts: [Post!]
    me: UserPayload!
    profile(userId: ID): ProfilePayload!
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
    postPublish(id: Int!, publishStatus: Boolean!): PostPayload!
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
    posts: [Post!]!
  }

  type UserPayload {
    userErrors: [UserError!]!
    user: User
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

  type ProfilePayload {
    userErrors: [UserError!]!
    profile: Profile
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type UserError {
    message: String!
  }
`;

export default typeDefs;
