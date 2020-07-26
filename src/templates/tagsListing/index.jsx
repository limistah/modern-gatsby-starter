import React from "react";
import { graphql } from "gatsby";
import Layout from "../../layout";
import PostListing from "../../components/PostListing";

export default ({ pageContext, data }) => {
  const { tag } = pageContext;
  const postEdges = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <div className="tag-container">
        <div>Posts posted with {tag}</div>
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  );
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
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
