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
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "date")) {
        const date = moment(new Date(node.frontmatter.date), "DD/MM/YYYY");
        if (!date.isValid) {
          console.warn(`WARNING: Invalid date.`, node.frontmatter);
        }
        // MarkdownRemark does not include date by default
        createNodeField({ node, name: "date", value: date.toISOString() });
      }

      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "author")) {
        // Set the author data
        const authorPath = path.resolve(
          __dirname,
          `authors/${node.frontmatter.author}.json`
        );
        const authorJson = require(authorPath);
        // // MarkdownRemark does not include date by default
        // console.log(authorJson);
        createNodeField({ node, name: "author", value: authorJson });
      }
    }

    createNodeField({ node, name: "slug", value: slug });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  // Pulls the createPage action from the Actions API
  const { createPage } = actions;

  // Template to use to render the post converted HTML
  const postPage = path.resolve("./src/templates/singlePost/index.jsx");
  // Template to use to render the post listing converted HTML
  const listingPage = path.resolve("./src/templates/postsListing/index.jsx");
  // Template to use to render the post listing converted HTML
  const landingPage = path.resolve("./src/templates/landing/index.jsx");
  // Template to use to render posts based on categories
  const categoriesListing = path.resolve(
    "./src/templates/categoriesListing/index.jsx"
  );
  // Template to use to render posts based on categories
  const tagsListingPage = path.resolve("./src/templates/tagsListing/index.jsx");
  // Template to use to render posts based on categories
  const authorsListingPage = path.resolve(
    "./src/templates/authorsListing/index.jsx"
  );

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

  // Sort posts
  postsEdges.sort((postA, postB) => {
    const dateA = moment(new Date(postA.node.frontmatter.date), "DD/MM/YYYY");

    const dateB = moment(postB.node.frontmatter.date, "DD/MM/YYYY");

    if (dateA.isBefore(dateB)) return 1;
    if (dateB.isBefore(dateA)) return -1;

    return 0;
  });

  // Paging
  const postsPerPage = 3;
  if (postsPerPage) {
    const pageCount = Math.ceil(postsEdges.length / postsPerPage);

    Array.from({ length: pageCount }).forEach((_val, pageNum) => {
      createPage({
        path: pageNum === 0 ? `/` : `/${pageNum + 1}/`,
        component: listingPage,
        context: {
          limit: postsPerPage,
          skip: pageNum * postsPerPage,
          pageCount,
          currentPageNum: pageNum + 1,
        },
      });
    });
  } else {
    // Load the landing page instead
    createPage({
      path: `/`,
      component: landingPage,
    });
  }

  const categorySet = new Set();
  const tagSet = new Set();

  // Loops through all the post nodes
  postsEdges.forEach((edge, index) => {
    // Generate a list of categories
    if (edge.node.frontmatter.category) {
      categorySet.add(edge.node.frontmatter.category);
    }

    // Generate a list of tags
    if (edge.node.frontmatter.tags) {
      edge.node.frontmatter.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    }

    // Create post pages
    createPage({
      path: edge.node.fields.slug,
      component: postPage,
      context: {
        slug: edge.node.fields.slug,
      },
    });
  });

  // Create category pages
  categorySet.forEach((category) => {
    createPage({
      path: `/categories/${_.kebabCase(category)}/`,
      component: categoriesListing,
      context: { category },
    });
  });

  //  Create tag pages
  tagSet.forEach((tag) => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagsListingPage,
      context: { tag },
    });
  });

  const allAuthorsJson = await graphql(`
    {
      allAuthorsJson {
        edges {
          node {
            id
            avatar
            mdField
            location
            name
            email
            description
          }
        }
      }
    }
  `);

  const authorsEdges = allAuthorsJson.data.allAuthorsJson.edges;
  authorsEdges.forEach((author) => {
    createPage({
      path: `/authors/${_.kebabCase(author.node.mdField)}/`,
      component: authorsListingPage,
      context: { author: author.node.mdField },
    });
  });
};
