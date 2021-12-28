import { User } from '@prisma/client';
import { TContext } from '../../index';

interface TSignUpArgs {
  input: {
    email: string;
    name: string;
    profile: {
      bio: string;
    };
    password: string;
  };
}

interface TUserPayload {
  userErrors: {
    message: string;
  }[];
  user: User | null;
}

const signup = async (_: any, { input }: TSignUpArgs, { prisma }: TContext) => {
  const { email, name, profile, password } = input;
  const userPayload: TUserPayload = {
    userErrors: [],
    user: null,
  };

  const emailExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (emailExists) {
    userPayload.userErrors.push({ message: 'Cannot use email' });
    return userPayload;
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password, //TODO - Need to hash password
    },
  });

  const newProfile = await prisma.profile.create({
    data: {
      userId: newUser.id,
      bio: profile.bio,
    },
  });

  userPayload.user = newUser;

  return userPayload;
};

export const authResolvers = {
  signup,
};
