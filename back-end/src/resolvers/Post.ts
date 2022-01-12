import { TContext } from '../index';
import { userLoader } from '../dataLoaders/userLoader';

interface TPostParent {
  authorId: number;
}

const user = async (
  { authorId }: TPostParent,
  _: any,
  { prisma }: TContext
) => {
  return userLoader.load(authorId);
};

export const Post = {
  user,
};
