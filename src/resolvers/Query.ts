import { Post } from '@prisma/client';
import { TContext } from '../index';

interface TGetFilteredPosts {}

const posts = async (
  _: any,
  __: any,
  { prisma }: TContext
): Promise<Post[]> => {
  const posts = await prisma.post.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
  return posts;
};

const Query = {
  posts,
};

export { Query };
