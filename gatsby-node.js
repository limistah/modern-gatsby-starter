/* eslint "no-console": "off" */

exports.onCreateNode = ({ node, actions, getNode }) => {};

exports.createPages = async ({ graphql, actions }) => {
  // Pulls the createPage action from the Actions API
  const { createPage } = actions;

  // Get all the markdown parsed through the help of gatsby-source-filesystem and gatsby-transformer-remark
  const allMarkdownResult = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
              category
              date
              author
            }
          }
        }
      }
    }
  `);

  // Throws if any error occur while fetching the markdown files
  if (allMarkdownResult.errors) {
    console.error(allMarkdownResult.errors);
    throw allMarkdownResult.errors;
  }
};
