import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
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

class AboutPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Container>
          <Main>
            <SEO title="About bioRxiv" />
            <h1>About bioRxiv</h1>
            <p>
              bioRxiv (pronounced "bio-archive") is a free online archive and
              distribution service for unpublished preprints in the life
              sciences. It is operated by Cold Spring Harbor Laboratory, a
              not-for-profit research and educational institution. By posting
              preprints on bioRxiv, authors are able to make their findings
              immediately available to the scientific community and receive
              feedback on draft manuscripts before they are submitted to
              journals.
            </p>
          </Main>
        </Container>
      </Layout>
    )
  }
}

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
