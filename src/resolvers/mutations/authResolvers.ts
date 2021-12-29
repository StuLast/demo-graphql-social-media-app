import { User } from '@prisma/client';
import validator from 'validator';
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

const signup = async (
  _: any,
  { input }: TSignUpArgs,
  { prisma }: TContext
): Promise<TUserPayload> => {
  const { email, name, profile, password } = input;

  const userPayload: TUserPayload = {
    userErrors: [],
    user: null,
  };

  const isEmail = validator.isEmail(email);

  const emailExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (emailExists || !isEmail) {
    !isEmail
      ? userPayload.userErrors.push({ message: 'Email is not valid' })
      : null;
    emailExists
      ? userPayload.userErrors.push({ message: 'Cannot use email' })
      : null;
    return userPayload;
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password, //TODO - Need to hash password
    },
  });

  await prisma.profile.create({
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
