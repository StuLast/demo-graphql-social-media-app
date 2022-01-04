import { TContext } from '../index';

interface TPostParent {
  authorId: number;
}

const user = async (
  { authorId }: TPostParent,
  _: any,
  { prisma }: TContext
) => {
  return await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
};

export const Post = {
  user,
};
