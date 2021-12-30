import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';
import typeDefs from './schema';
import { Query, Mutation } from './resolvers';
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
  resolvers: { Query, Mutation },
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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
