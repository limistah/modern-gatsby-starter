import React from "react";
import { graphql, Link } from "gatsby";
import _ from "lodash";
import Layout from "../../layout";
import "./b16-tomorrow-dark.css";
import "./index.css";
import PostTags from "../../components/PostTags";

export default class PostTemplate extends React.Component {
  render() {
    const { data, pageContext } = this.props;
    const { slug } = pageContext;
    const postNode = data.markdownRemark;
    const post = postNode.frontmatter;
    if (!post.id) {
      post.id = slug;
    }

    return (
      <Layout>
        <div>
          <div>
            <h1>{post.title}</h1>
            <div className="category">
              Posted to{" "}
              <em>
                <Link
                  key={post.category}
                  style={{ textDecoration: "none" }}
                  to={`/category/${_.kebabCase(post.category)}`}
                >
                  <a>{post.category}</a>
                </Link>
              </em>
            </div>
            <PostTags tags={post.tags} />
            <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
          </div>
        </div>
      </Layout>
    );
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        cover
        date
        category
        tags
      }
      fields {
        slug
        date
      }
    }
  }
`;
