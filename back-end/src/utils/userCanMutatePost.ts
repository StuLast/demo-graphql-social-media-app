import { TContext } from '..';
import { TUserErrors } from '../resolvers/mutations/postResolvers';

interface TUserCanMutatePost {
  userId: number;
  postId: number;
  prisma: TContext['prisma'];
}

const userCanMutatePost = async ({
  userId,
  postId,
  prisma,
}: TUserCanMutatePost): Promise<undefined | TUserErrors> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return { message: 'User not found' };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return { message: 'Post not found' };
  }

  if (post.authorId !== user.id) {
    return { message: 'post not owned by user' };
  }

  return;
};

export { userCanMutatePost, TUserCanMutatePost };
