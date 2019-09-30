import React, { useState } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Article from "../components/article"
import { rhythm } from "../utils/typography"
import kebabCase from "lodash/kebabCase"
import startCase from "lodash/startCase"
import styled from "styled-components"

import {
  ReactiveBase,
  CategorySearch,
  ReactiveList,
  MultiList,
  SelectedFilters,
} from "@appbaseio/reactivesearch"
import { callbackify } from "util"

const Ul = styled.ul`
  column-count: 3;
  list-style: none;
`

const Container = styled.div`
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 1fr 3fr;
  grid-template-areas:
    "..... main"
    "sidebar results";
`

const Main = styled.div`
  grid-area: main;
`

const Results = styled.div`
  grid-area: results;
`

const Sidebar = styled.div`
  margin-top: 3.2em;
  grid-area: sidebar;
`

const ResultTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 0;
`
function renderItem(res) {
  return (
    <div key={res.id} style={{ marginBottom: rhythm(2) }}>
      <Link to={`/articles/${res.id}`}>
        <ResultTitle
          dangerouslySetInnerHTML={{
            __html: res.title || "Choose a valid Title Field",
          }}
        />
      </Link>
      <p style={{ marginTop: 0 }}>
        <small>{res.authors.join(", ")}</small>
      </p>
      <p
        style={{ marginBottom: 0 }}
        dangerouslySetInnerHTML={{
          __html: res.abstract || "Choose a valid Description Field",
        }}
      />
      {res.url ? (
        <a style={{ marginBottom: "1em" }} href={res.url}>
          {res.url}
        </a>
      ) : null}
    </div>
  )
}

function BioRxivIndex(props) {
  const [searchValue, setSearchValue] = useState({})
  const [searchActive, setSearchActive] = useState(false)
  const { data } = props
  const siteTitle = data.site.siteMetadata.title
  const articles = data.postgres.allArticles.nodes
  const collections = data.collections.categories.nodes.sort((a, b) => {
    if (a.category === null) {
      return 1
    }
    if (b.category === null) {
      return -1
    }
    return a.category.localeCompare(b.category, "en", { sensitivity: "base" })
  })

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="bioRxiv latest" />
      <ReactiveBase app="articles" url="http://localhost:9200">
        <Container>
          <Main>
            <h1 style={{ marginTop: 0 }}>Search</h1>
            <CategorySearch
              componentId="search"
              dataField={["abstract", "title", "authors"]}
              fieldWeights={[1, 2, 1, 2, 1]}
              autosuggest={false}
              highlight={true}
              style={{
                fontSize: "12px",
              }}
              customHighlight={props => ({
                highlight: {
                  pre_tags: ["<mark>"],
                  post_tags: ["</mark>"],
                  fields: {
                    abstract: {},
                    title: {},
                  },
                  number_of_fragments: 0,
                },
              })}
              categoryField="collection.keyword"
              placeholder="Search for articles"
              value={searchValue}
              onChange={(value, triggerQuery, event) => {
                setSearchValue(value)

                if (value && value.term !== "") {
                  setSearchActive(true)
                  triggerQuery()
                } else {
                  setSearchActive(false)
                }
              }}
            />
            {!searchActive ? (
              <>
                <h1>Subject Areas</h1>
                <Ul>
                  {collections.map(node => (
                    <li key={node.category}>
                      <Link to={`/collection/${kebabCase(node.category)}/`}>
                        {node.category ? startCase(node.category) : "Other"} (
                        {node.count})
                      </Link>
                    </li>
                  ))}
                </Ul>

                <h1>Latest</h1>
                {articles.map(node => {
                  return <Article key={node.id} article={node}></Article>
                })}
              </>
            ) : (
              <SelectedFilters />
            )}
          </Main>

          {searchActive ? (
            <Results>
              <ReactiveList
                componentId="result"
                dataField="_score"
                pagination={true}
                react={{
                  and: ["search", "subject", "authors"],
                }}
                renderItem={renderItem}
                size={10}
                style={
                  {
                    // marginTop: 20
                  }
                }
              />
            </Results>
          ) : (
            undefined
          )}
          {searchActive ? (
            <Sidebar>
              <MultiList
                componentId="subject"
                dataField="collection.keyword"
                size={100}
                style={{
                  marginBottom: 20,
                }}
              />
              <MultiList
                componentId="authors"
                dataField="authors.keyword"
                size={100}
                style={{
                  marginBottom: 20,
                }}
              />
            </Sidebar>
          ) : (
            undefined
          )}
        </Container>
      </ReactiveBase>
    </Layout>
  )
}

export default BioRxivIndex

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

    postgres {
      allArticles(
        first: 10
        orderBy: POSTED_DESC
        filter: { posted: { isNull: false } }
      ) {
        nodes {
          id
          collection
          title
          url
          posted
          doi
          authors
        }
      }
    }
  }
`
