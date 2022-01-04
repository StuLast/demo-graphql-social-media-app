import { Post, User, Profile } from '@prisma/client';
import { AnyRecord } from 'dns';
import { TContext } from '../index';

interface TUserPayload {
  userErrors: TUserErrors[];
  user: User | null;
}

interface TProfilePayload {
  userErrors: TUserErrors[];
  profile: Profile | null;
}

interface TUserErrors {
  message: String;
}

interface TProfileInput {
  userId: String;
}

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

const me = async (
  _: any,
  __: any,
  { prisma, userInfo }: TContext
): Promise<TUserPayload> => {
  const userPayload: TUserPayload = {
    userErrors: [],
    user: null,
  };

  if (!userInfo || !userInfo.userId) {
    userPayload.userErrors.push({ message: 'User not valid' });
    return userPayload;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userInfo.userId,
    },
  });

  userPayload.user = user;
  return userPayload;
};

const profile = async (
  _: AnyRecord,
  { userId }: TProfileInput,
  { prisma }: TContext
): Promise<TProfilePayload> => {
  const profilePayload: TProfilePayload = {
    userErrors: [],
    profile: null,
  };

  const userExists = userId ? userId : null;

  if (!userExists) {
    console.log('UserExists returns failure');
    profilePayload.userErrors.push({ message: 'User ID not valid' });
    return profilePayload;
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: Number(userId),
    },
  });

  if (!profile) {
    profilePayload.userErrors.push({ message: 'No profile for user' });
  }

  profilePayload.profile = profile;

  return profilePayload;
};

const Query = {
  posts,
  me,
  profile,
};

export { Query };
