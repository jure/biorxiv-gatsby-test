const articleQuery = `{
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
}
`

const collectionQuery = `{
  collections: postgres {
    categories {
      nodes {
        category
        count
      }
    }
  }
}`

const queries = [
  {
    query: articleQuery,
    transformer: ({ data }) =>
      data.articles.allArticles.edges.map(({ node }) => {
        return {
          id: node.id,
          title: node.title,
          abstract: node.abstract,
          posted: node.posted,
          authors: node.authors,
          collection: node.collection,
          doi: node.doi,
          url: node.url,
        }
      }), // optional
    indexName: "articles", // overrides main index name, optional
    settings: {
      // optional, any index settings
      mappings: {
        properties: {
          posted: { type: "date" },
        },
      },
    },
  },
  {
    query: collectionQuery,
    transformer: ({ data }) =>
      data.collections.categories.nodes.map(node => {
        return {
          category: node.category,
          count: node.count,
        }
      }),
    indexName: "collections", // overrides main index name, optional
  },
]

module.exports = queries
