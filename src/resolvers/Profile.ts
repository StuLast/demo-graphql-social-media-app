import { TContext } from '../index';

interface TProfileParent {
  id: number;
  bio: string | null;
  userId: number;
}

const user = async (
  { userId }: TProfileParent,
  _: any,
  { prisma }: TContext
) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const Profile = {
  user,
};
