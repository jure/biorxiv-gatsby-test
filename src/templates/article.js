import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { JatsToReact } from "../components/jatsToReact"
import { rhythm, scale } from "../utils/typography"
import startCase from "lodash/startCase"
import styled from "styled-components"
import "./article.css"

const Container = styled.div`
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 1fr 3fr;
  grid-template-areas: "..... main";
`

const Main = styled.div`
  grid-area: main;
`

const Ul = styled.ul`
  list-style: none;
  li {
    display: inline;
  }

  li:not(:last-child):after {
    content: ", ";
  }
`

class ArticleTemplate extends React.Component {
  render() {
    const xml = require("../../content/biorxivjats.xml")
    const article = this.props.data.postgres.allArticles.edges[0].node
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={article.title} description={article.abstract} />
        <Container>
          <Main>
            <article>
              <header>
                <small>{startCase(article.collection)}</small>
                <h1
                  style={{
                    marginTop: rhythm(1),
                    marginBottom: 0,
                  }}
                >
                  {article.title}
                </h1>
                <Ul>
                  {article.authors.map((author, i) => {
                    if (article.orcids[i]) {
                      return (
                        <li>
                          <a href={article.orcids[i]}>{author}</a>
                        </li>
                      )
                    }
                    return <li>{author}</li>
                  })}
                </Ul>
                <p
                  style={{
                    ...scale(-1 / 5),
                    display: `block`,
                    marginBottom: rhythm(1),
                  }}
                >
                  Published on {article.posted}.{" "}
                  <a
                    href={`https://doi.org/${article.doi}`}
                  >{`https://doi.org/${article.doi}`}</a>
                </p>
              </header>
              <h2>Abstract</h2>
              <section dangerouslySetInnerHTML={{ __html: article.abstract }} />
              <a href={article.url}>View on {article.url}</a>
              <JatsToReact xml={xml} />
              <hr
                style={{
                  marginBottom: rhythm(1),
                }}
              />
              <footer></footer>
            </article>

            <nav>
              <ul
                style={{
                  display: `flex`,
                  flexWrap: `wrap`,
                  justifyContent: `space-between`,
                  listStyle: `none`,
                  padding: 0,
                }}
              >
                <li>
                  {previous && (
                    <Link to={`/articles/${previous.id}`} rel="prev">
                      ← {previous.title}
                    </Link>
                  )}
                </li>
                <li>
                  {next && (
                    <Link to={`/articles/${next.id}`} rel="next">
                      {next.title} →
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </Main>
        </Container>
      </Layout>
    )
  }
}

export default ArticleTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    postgres {
      allArticles(condition: { id: $slug }) {
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
            orcids
          }
        }
      }
    }
  }
`
