import React from "react";
import { graphql } from "gatsby";
import Layout from "../../layout";
import PostListing from "../../components/PostListing";
import AuthorInfo from "../../components/AuthorInfo";

export default ({ pageContext, data }) => {
  const { authorDetails } = pageContext;
  const postEdges = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <div>
        <h1 style={{ textAlign: "center" }}>Author Roll</h1>
        <div className="category-container">
          <AuthorInfo author={authorDetails} />
          <PostListing postEdges={postEdges} />
        </div>
      </div>
    </Layout>
  );
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query AuthorPage($authorMdField: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [fields___date], order: DESC }
      filter: { frontmatter: { author: { eq: $authorMdField } } }
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
