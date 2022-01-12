import React from "react";
import { gql, useQuery } from '@apollo/client'
import Post from "../../components/Post/Post";

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      createdAt
      user {
        name
      }
    }
  }
`;

export default function Posts() {
  const { data, error, loading } = useQuery(GET_POSTS);

  if (error) {
    return <div><h1>Error Page</h1></div>
  }

  if (loading) {
    return <div> Loading </div>
  }

  const { posts } = data;

  return <div>
    <h1> Posts</h1>
    <div>
      {posts.map(post => {
        return (
          <Post
            key={post.id}
            title={post.title}
            content={post.content}
            date={post.createdAt}
            published={post.published}
            user={post.user.name}
            id={post.id}
            isMyProfile={true}
          />
        )
      })}
    </div>
  </div>;
}
