import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';
import typeDefs from './schema';
import { Query, Mutation, Profile, Post, User } from './resolvers';
import { getUserFromToken } from './utils';

dotenv.config();

const prisma = new PrismaClient();

export interface TContext {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: { userId: number } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query, Mutation, Profile, Post, User },
  context: async ({ req }: any): Promise<TContext> => {
    const userInfo: { userId: number } | null = await getUserFromToken(
      req.headers.authorization
    );
    return {
      prisma,
      userInfo,
    };
  },
});

const PORT = process.env.PORT || 4000;

server.listen(PORT).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

export { prisma };
