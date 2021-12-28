import { postResolvers } from './postResolvers';
import { authResolvers } from './authResolvers';

export const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
