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
            <SEO title="Submission Guide" />
            <h1>Submission Guide</h1>
            <p>
              bioRxiv is an online archive and distribution service for
              preprints in the life sciences. It is operated by Cold Spring
              Harbor Laboratory, a not-for-profit research and educational
              institution.
            </p>
            <p>
              An article may be deposited in bioRxiv in draft or final form,
              provided that it concerns a relevant scientific field, the content
              is unpublished at the time of submission, and all its authors have
              consented to its deposition. Authors wishing to deposit
              manuscripts must first register on the site. There is no charge
              for registration or article deposition.
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
