import React from "react";
import { graphql } from "gatsby";
import Layout from "../../layout";
import PostListing from "../../components/PostListing";
import AuthorInfo from "../../components/AuthorInfo";

export default ({ pageContext, data }) => {
  const { author } = pageContext;
  const postEdges = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <div className="category-container">
        <div>Posts posted by {author}</div>
        <AuthorInfo />
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  );
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query AuthorPage($author: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { author: { eq: $author } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            author
            date
          }
        }
      }
    }
  }
`;
