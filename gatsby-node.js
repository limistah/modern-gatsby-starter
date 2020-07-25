/* eslint "no-console": "off" */
const path = require("path");
const _ = require("lodash");
const moment = require("moment");

// Called each time a new node is created
exports.onCreateNode = ({ node, actions, getNode }) => {
  // A Gatsby API action to add a new field to a node
  const { createNodeField } = actions;
  // The field that would be included
  let slug;
  // The currently created node is a MarkdownRemark type
  if (node.internal.type === "MarkdownRemark") {
    // Recall, we are using gatsby-source-filesystem?
    // This pulls the parent(File) node,
    // instead of the current MarkdownRemark node
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      // The node is a valid remark type and has a title,
      // Use the title as the slug for the node.
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    } else if (parsedFilePath.name !== "index" && parsedFilePath.dir !== "") {
      // File is in a directory and the name is not index
      // e.g content/2020_02/learner/post.md
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    } else if (parsedFilePath.dir === "") {
      // File is not in a subdirectory
      slug = `/${parsedFilePath.name}/`;
    } else {
      // File is in a subdirectory, and name of the file is index
      // e.g content/2020_02/learner/index.md
      slug = `/${parsedFilePath.dir}/`;
    }

    if (Object.prototype.hasOwnProperty.call(node, "frontmatter")) {
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "slug")) {
        slug = `/${_.kebabCase(node.frontmatter.slug)}`;
      }
      console.log(node.frontmatter);
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "date")) {
        moment(new Date(node.frontmatter.date), "DD/MM/YYYY");
        if (!date.isValid) {
          console.warn(`WARNING: Invalid date.`, node.frontmatter);
        }
        // MarkdownRemark does not include date by default
        createNodeField({ node, name: "date", value: date.toISOString() });
      }
    }

    createNodeField({ node, name: "slug", value: slug });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  // Pulls the createPage action from the Actions API
  const { createPage } = actions;

  // Template to use to render the post converted HTML
  const postPage = path.resolve("./src/templates/singlePost/index.js");

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

  // Items/Details are stored inside of edges
  const postsEdges = allMarkdownResult.data.allMarkdownRemark.edges;

  // Loops through all the post nodes
  postsEdges.forEach((edge, index) => {
    // Create post pages
    createPage({
      path: edge.node.fields.slug,
      component: postPage,
      context: {
        slug: edge.node.fields.slug,
      },
    });
  });
};
