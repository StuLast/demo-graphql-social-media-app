import JWT from 'jsonwebtoken';

const getUserFromToken = (token: string): { userId: number } | null => {
  const signature = process.env.JWT_SIGNATURE;
  if (!signature) {
    console.log('unable to locate JWT_SIGNATURE env var');
    return null;
  }
  try {
    return JWT.verify(token, signature) as {
      userId: number;
    };
  } catch (error) {
    return null;
  }
};

export { getUserFromToken };
