import { TContext } from '../index';

interface TUserParent {
  userId: number;
}

const posts = async ({ userId }: TUserParent, _: any, { prisma }: TContext) => {
  return await prisma.post.findMany({
    where: {
      authorId: userId,
    },
  });
};

export const User = {
  posts,
};
