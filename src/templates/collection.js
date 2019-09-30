import React from "react"
import PropTypes from "prop-types"
// Components
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Article from "../components/article"
import styled from "styled-components"

const Container = styled.div`
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 1fr 3fr;
  grid-template-areas: "..... main";
`

const Main = styled.div`
  grid-area: main;
`

const CollectionTemplate = ({ pageContext, data, location }) => {
  const { collection } = pageContext
  const { edges, totalCount } = data.postgres.allArticles
  const siteTitle = data.site.siteMetadata.title

  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? "/" : (currentPage - 1).toString()
  const nextPage = (currentPage + 1).toString()

  const collectionGeader = `${totalCount} article${
    totalCount === 1 ? "" : "s"
  } in ${collection}`
  return (
    <Layout location={location} title={siteTitle}>
      <Container>
        <Main>
          <h1>{collectionGeader}</h1>
          <ul>
            {edges.map(({ node }) => {
              return <Article key={node.id} article={node} />
            })}
          </ul>
          <small>
            Page {currentPage} of {numPages}
          </small>
          <p>
            {!isFirst && (
              <Link
                to={`/collection/${collection}/${prevPage}`}
                rel="prev"
                style={{ marginRight: "1em" }}
              >
                ← Previous Page
              </Link>
            )}
            {!isLast && (
              <Link to={`/collection/${collection}/${nextPage}`} rel="next">
                Next Page →
              </Link>
            )}
          </p>
          <p>
            <Link to="/collections">All subjects</Link>
          </p>
        </Main>
      </Container>
    </Layout>
  )
}

CollectionTemplate.propTypes = {
  pageContext: PropTypes.shape({
    collection: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allArticles: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            title: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
          }),
        }).isRequired
      ),
    }),
  }),
}
export default CollectionTemplate
export const collectionQuery = graphql`
  query($collection: String, $offset: Int!, $first: Int!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    postgres {
      allArticles(
        offset: $offset
        first: $first
        condition: { collection: $collection }
        orderBy: POSTED_DESC
      ) {
        totalCount
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
