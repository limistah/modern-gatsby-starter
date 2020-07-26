import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../layout";
import PostListing from "../../components/PostListing";
import "./index.css";

const Pagination = ({ currentPageNum, pageCount }) => {
  const prevPage = currentPageNum - 1 === 1 ? "/" : `/${currentPageNum - 1}/`;
  const nextPage = `/${currentPageNum + 1}/`;
  const isFirstPage = currentPageNum === 1;
  const isLastPage = currentPageNum === pageCount;

  return (
    <div className="paging-container">
      {!isFirstPage && <Link to={prevPage}>Previous</Link>}
      {[...Array(pageCount)].map((_val, index) => {
        const pageNum = index + 1;
        return (
          <Link
            key={`listing-page-${pageNum}`}
            to={pageNum === 1 ? "/" : `/${pageNum}/`}
          >
            {pageNum}
          </Link>
        );
      })}
      {!isLastPage && <Link to={nextPage}>Next</Link>}
    </div>
  );
};

export default (props) => {
  const { data, pageContext } = props;
  const postEdges = data.allMarkdownRemark.edges;
  const { currentPageNum, pageCount } = pageContext;

  return (
    <Layout>
      <div className="listing-container">
        <div className="posts-container">
          <PostListing postEdges={postEdges} />
        </div>

        <Pagination pageCount={pageCount} currentPageNum={currentPageNum} />
      </div>
    </Layout>
  );
};

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query ListingQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
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
            category
            date
          }
        }
      }
    }
  }
`;
