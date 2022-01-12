import { TContext } from '../index';

interface TUserParent {
  userId: number;
}

const posts = async (
  { userId }: TUserParent,
  _: any,
  { prisma, userInfo }: TContext
) => {
  if (!userInfo || !userInfo.userId) {
    throw new Error('User Id does not exist');
  }

  const isUserProfile = userInfo.userId === userId;

  const where: { authorId: number; published?: boolean } = { authorId: userId };

  if (!isUserProfile) {
    where.published = true;
  }

  return await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const User = {
  posts,
};
