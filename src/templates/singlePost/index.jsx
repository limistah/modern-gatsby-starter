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
                  to={`/categories/${_.kebabCase(post.category)}`}
                >
                  <a>{post.category}</a>
                </Link>
              </em>
            </div>
            <PostTags tags={post.tags} />
            <div className="author-container">
              Posted by:{" "}
              <Link
                key={postNode.fields.author.name}
                style={{ textDecoration: "none" }}
                to={`/authors/${_.kebabCase(post.author)}`}
              >
                <a title={postNode.fields.author.name}>
                  <img
                    className="author-avatar"
                    src={postNode.fields.author.avatar}
                    width="50px"
                    height="50px"
                  />
                </a>
              </Link>
            </div>
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
        date
        category
        tags
        author
      }
      fields {
        slug
        date
        author {
          name
          location
          avatar
        }
      }
    }
  }
`;
