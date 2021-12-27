import { Post, Prisma } from '@prisma/client';
import { TContext } from '../index';

interface TPostCreateArgs {
  input: {
    title: string;
    content: string;
  };
}

interface TPostUpdateArgs {
  id: string;
  input: {
    title?: string;
    content?: string;
  };
}

interface TPostPayload {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

const postCreate = async (
  _: any,
  { input }: TPostCreateArgs,
  { prisma }: TContext
): Promise<TPostPayload> => {
  const { title, content } = input;
  const postPayload: TPostPayload = {
    userErrors: [],
    post: null,
  };

  let hasContent = false;
  let hasTitle = false;

  content.length > 0
    ? (hasContent = true)
    : postPayload.userErrors.push({
        message: 'Must contain valid post content',
      });

  title.length > 0
    ? (hasTitle = true)
    : postPayload.userErrors.push({
        message: 'Must contain a valid post title',
      });

  //Implement user Id check to confirm user exists

  if (!hasContent || !hasTitle) {
    return postPayload;
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });
    postPayload.post = post;
  } catch (err: any) {
    postPayload.userErrors.push(err.message);
  }
  return postPayload;
};

const postUpdate = async (
  _: any,
  { id, input }: TPostUpdateArgs,
  { prisma }: TContext
): Promise<TPostPayload> => {
  const { title, content } = input;

  const postPayload: TPostPayload = {
    userErrors: [],
    post: null,
  };

  if (!title && !content) {
    postPayload.userErrors.push({
      message: 'Request should have either title, content or both',
    });
    return postPayload;
  }

  const updateable = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!updateable) {
    postPayload.userErrors.push({
      message: 'Request needs valid post id',
    });
    return postPayload;
  }

  const updates: TPostUpdateArgs['input'] = {};

  if (title) {
    updates.title = title;
  }

  if (content) {
    updates.content = content;
  }

  const updatedPost = await prisma.post.update({
    data: {
      ...updates,
    },
    where: {
      id: Number(id),
    },
  });

  postPayload.post = updatedPost;

  return postPayload;
};

const Mutation = {
  postCreate,
  postUpdate,
};

export { Mutation };
