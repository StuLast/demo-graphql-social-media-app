import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

interface TSignInArgs {
  input: {
    email: string;
    password: string;
  };
}

interface TAuthPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

const signup = async (
  _: any,
  { input }: TSignUpArgs,
  { prisma }: TContext
): Promise<TAuthPayload> => {
  const { email, name, profile, password } = input;

  // Validation
  // ==========

  const userPayload: TAuthPayload = {
    userErrors: [],
    token: null,
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

  const signature = process.env.JWT_SIGNATURE;

  if (emailExists || !isValidEmail || !isValidPassword || !signature) {
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
    !signature
      ? userPayload.userErrors.push({
          message: 'Unable to generate token signature',
        })
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

  //Create valid response with token
  //================================

  const token = await jwt.sign(
    {
      userId: newUser.id,
    },
    signature,
    {
      expiresIn: 5 * 25 * 60,
    }
  );

  if (!token) {
    userPayload.userErrors.push({ message: 'Unable to generate token' });
    return userPayload;
  }

  //Add to redis

  userPayload.token = token;

  return userPayload;
};

const signin = async (
  _: any,
  { input }: TSignUpArgs,
  { prisma }: TContext
): Promise<TAuthPayload> => {
  const { email, password } = input;

  const authPayload: TAuthPayload = {
    userErrors: [],
    token: null,
  };

  // check inputs are valid
  // ======================
  const isValidEmail = validator.isEmail(email);
  const isValidPassword = !!password;
  const isExistingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!isValidEmail || !isValidPassword || !isExistingUser) {
    authPayload.userErrors.push({
      message: 'Signin credentials not valid',
    });
    return authPayload;
  }

  //check if password matches

  const hasCorrectPassword = bcrypt.compare(password, isExistingUser.password);
  if (!hasCorrectPassword) {
    authPayload.userErrors.push({
      message: 'Signin credentials not valid',
    });
  }

  const signature = process.env.JWT_SIGNATURE;
  if (!signature) {
    authPayload.userErrors.push({ message: 'Unable to generate token' });
    return authPayload;
  }

  const token = await jwt.sign(
    {
      userId: isExistingUser.id,
    },
    signature,
    {
      expiresIn: 5 * 25 * 60,
    }
  );

  if (!token) {
    authPayload.userErrors.push({ message: 'Unable to generate token' });
    return authPayload;
  }

  authPayload.token = token;
  return authPayload;
};

export const authResolvers = {
  signup,
  signin,
};
