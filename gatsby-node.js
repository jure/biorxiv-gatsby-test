const path = require(`path`)

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
      canvas: "empty",
    },
  })

  actions.setWebpackConfig({
    externals: ["canvas", "jsdom"],
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const collectionTemplate = path.resolve("src/templates/collection.js")
  const articleTemplate = path.resolve("./src/templates/article.js")
  const result = await graphql(
    `
      {
        articles: postgres {
          allArticles {
            edges {
              node {
                id
                doi
                collection
                title
                url
                posted
                abstract
                authors
              }
            }
          }
        }

        collections: postgres {
          categories {
            nodes {
              category
              count
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create article pages.
  const articles = result.data.articles.allArticles.edges

  articles.forEach((article, index) => {
    const previous =
      index === articles.length - 1 ? null : articles[index + 1].node
    const next = index === 0 ? null : articles[index - 1].node
    createPage({
      path: `/articles/${article.node.id}`,
      component: articleTemplate,
      context: {
        slug: article.node.id,
        previous,
        next,
      },
    })
  })

  const collections = result.data.collections.categories.nodes

  for (const collection of collections) {
    const result = await graphql(`
    {
      articles: postgres {
        allArticles(condition: {collection: "${collection.category}"}) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
   `)
    const articlesPerPage = 10
    const numPages = Math.ceil(
      result.data.articles.allArticles.edges.length / articlesPerPage
    )

    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? `/collection/${collection.category}`
            : `/collection/${collection.category}/${i + 1}`,
        component: collectionTemplate,
        context: {
          collection: collection.category,
          first: articlesPerPage,
          offset: i * articlesPerPage,
          numPages,
          currentPage: i + 1,
        },
      })
    })
  }
}
