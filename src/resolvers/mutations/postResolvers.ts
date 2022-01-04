import { Post } from '@prisma/client';
import { TContext } from '../../index';
import { userCanMutatePost } from '../../utils';

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

interface TPostPublishArgs {
  id: string;
  publishStatus: boolean;
}

interface TPostPayload {
  userErrors: TUserErrors[];
  post: Post | null;
}

interface TUserErrors {
  message: string;
}

const postCreate = async (
  _: any,
  { input }: TPostCreateArgs,
  { prisma, userInfo }: TContext
): Promise<TPostPayload> => {
  const { title, content } = input;
  const postPayload: TPostPayload = {
    userErrors: [],
    post: null,
  };

  let hasContent = false;
  let hasTitle = false;

  if (!userInfo || !userInfo.userId) {
    postPayload.userErrors.push({
      message: 'Invalid User Info',
    });
    return postPayload;
  }

  const validatedUser = await prisma.user.findUnique({
    where: {
      id: userInfo.userId,
    },
  });

  if (!validatedUser) {
    postPayload.userErrors.push({
      message: 'Invalid User Info',
    });
    return postPayload;
  }

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

  if (!hasContent || !hasTitle!) {
    return postPayload;
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: validatedUser.id,
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
  { prisma, userInfo }: TContext
): Promise<TPostPayload> => {
  const { title, content } = input;

  const postPayload: TPostPayload = {
    userErrors: [],
    post: null,
  };

  if (!userInfo || !userInfo.userId) {
    postPayload.userErrors.push({
      message: 'User Info not valid',
    });
    return postPayload;
  }

  if (!id) {
    postPayload.userErrors.push({
      message: 'Post ID not valid',
    });
    return postPayload;
  }

  const mutateError = await userCanMutatePost({
    userId: userInfo.userId,
    postId: Number(id),
    prisma,
  });

  if (mutateError) {
    postPayload.userErrors.push({
      message: mutateError.message,
    });
    return postPayload;
  }

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

const postDelete = async (
  _: any,
  { id }: TPostUpdateArgs,
  { prisma, userInfo }: TContext
): Promise<TPostPayload> => {
  const postPayload: TPostPayload = {
    userErrors: [],
    post: null,
  };

  if (!userInfo || !userInfo.userId) {
    postPayload.userErrors.push({
      message: 'User Info not valid',
    });
    return postPayload;
  }

  if (!id) {
    postPayload.userErrors.push({
      message: 'Post ID not valid',
    });
    return postPayload;
  }

  const mutateError = await userCanMutatePost({
    userId: userInfo.userId,
    postId: Number(id),
    prisma,
  });

  if (mutateError) {
    postPayload.userErrors.push({
      message: mutateError.message,
    });
    return postPayload;
  }

  const isDeletable = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!isDeletable) {
    postPayload.userErrors.push({ message: 'Unable to locate post id' });
    return postPayload;
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });

  postPayload.post = deletedPost;

  return postPayload;
};

const postPublish = async (
  _: any,
  { id, publishStatus }: TPostPublishArgs,
  { prisma, userInfo }: TContext
): Promise<TPostPayload> => {
  const postPayload: TPostPayload = {
    userErrors: [],
    post: null,
  };

  if (!userInfo || !userInfo.userId) {
    postPayload.userErrors.push({
      message: 'User Info not valid',
    });
    return postPayload;
  }

  const mutateError = await userCanMutatePost({
    userId: userInfo.userId,
    postId: Number(id),
    prisma,
  });

  if (mutateError) {
    postPayload.userErrors.push({
      message: mutateError.message,
    });
    return postPayload;
  }

  const post = await prisma.post.update({
    data: {
      published: publishStatus,
    },
    where: {
      id: Number(id),
    },
  });

  postPayload.post = post;

  return postPayload;
};

export const postResolvers = {
  postCreate,
  postUpdate,
  postDelete,
  postPublish,
};
export { TUserErrors };
