import React from "react"
import PropTypes from "prop-types"
// Utilities
import kebabCase from "lodash/kebabCase"
import startCase from "lodash/startCase"

// Components
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"

const Container = styled.div`
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 1fr 3fr;
  grid-template-areas: "..... main";
`

const Main = styled.div`
  grid-area: main;
`

const CollectionsPage = ({
  location,
  data: {
    collections: {
      categories: { nodes },
    },
    site: {
      siteMetadata: { title },
    },
  },
}) => {
  const collections = nodes.sort((a, b) => {
    if (a.category === null) {
      return 1
    }
    if (b.category === null) {
      return -1
    }
    return a.category.localeCompare(b.category, "en", { sensitivity: "base" })
  })
  return (
    <Layout location={location} title={title}>
      <Container>
        <Main>
          <Helmet title={title} />
          <div>
            <h1>Collections</h1>
            <ul>
              {collections.map(collection => (
                <li key={collection.category}>
                  <Link to={`/collection/${kebabCase(collection.category)}/`}>
                    {startCase(collection.category)} ({collection.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Main>
      </Container>
    </Layout>
  )
}

CollectionsPage.propTypes = {
  data: PropTypes.shape({
    collections: PropTypes.shape({
      categories: PropTypes.shape({
        nodes: PropTypes.arrayOf(
          PropTypes.shape({
            category: PropTypes.string,
            count: PropTypes.string.isRequired,
          }).isRequired
        ),
      }),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}
export default CollectionsPage
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
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
