import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';
import typeDefs from './schema';
import { Query, Mutation } from './resolvers';

dotenv.config();

const prisma = new PrismaClient();

export interface TContext {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query, Mutation },
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
