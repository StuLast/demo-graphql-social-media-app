import { User } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcryptjs';
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

  // Validation
  // ==========

  const userPayload: TUserPayload = {
    userErrors: [],
    user: null,
  };

  const isValidEmail = validator.isEmail(email);
  const isValidPassword = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  const hasBio = !!profile.bio;
  const hasName = !!(name.length > 0);
  const emailExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (emailExists || !isValidEmail || !isValidPassword) {
    !isValidEmail
      ? userPayload.userErrors.push({ message: 'Email is not valid' })
      : null;
    !isValidPassword
      ? userPayload.userErrors.push({
          message:
            'Password needs a mix of lower & upper case letters, numbers and symbol, and must be at least 8 characters long',
        })
      : null;
    !hasBio
      ? userPayload.userErrors.push({
          message: 'profile.bio field is not valid',
        })
      : null;
    !hasName
      ? userPayload.userErrors.push({ message: 'Name is not valid' })
      : null;
    emailExists
      ? userPayload.userErrors.push({ message: 'Cannot use email' })
      : null;
    return userPayload;
  }

  // Writing to DB
  // =============

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
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
