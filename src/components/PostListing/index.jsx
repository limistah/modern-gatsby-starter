import React from "react";
import { Link } from "gatsby";

const getPostList = (postEdges) => {
  const postList = [];
  postEdges.forEach((postEdge) => {
    postList.push({
      path: postEdge.node.fields.slug,
      tags: postEdge.node.frontmatter.tags,
      cover: postEdge.node.frontmatter.cover,
      title: postEdge.node.frontmatter.title,
      date: postEdge.node.fields.date,
      excerpt: postEdge.node.excerpt,
      timeToRead: postEdge.node.timeToRead,
    });
  });
  return postList;
};

export default (props) => {
  const postList = getPostList(props.postEdges);
  return (
    <div>
      {
        /* Your post list here. */
        postList.map((post) => (
          <Link to={post.path} key={post.title}>
            <h1>{post.title}</h1>
          </Link>
        ))
      }
    </div>
  );
};
