import { TContext } from '../index';

interface TPostCreateArgs {
  input: {
    title: string;
    content: string;
  };
}

const Mutation = {
  postCreate: async (
    _: any,
    { input }: TPostCreateArgs,
    { prisma }: TContext
  ) => {
    const { title, content } = input;
    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: 1,
        },
      });
      return {
        userErrors: [],
        post,
      };
    } catch (err) {
      return { userErrors: err };
    }
  },
};

export { Mutation };
