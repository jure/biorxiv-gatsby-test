import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Image from "gatsby-image"
import styled from "styled-components"

const LinkWithActive = props => {
  return <Link activeStyle={{ color: "#982F33" }} {...props}></Link>
}

const Container = styled.div`
  display: grid;
  grid-gap: 2em;
  grid-template-columns: 1fr 1fr 3fr 2fr;
  grid-template-areas:
    "....... ...... header ....."
    "....... main main ....."
    "....... ...... footer .....";
`

const Header = styled.div`
  grid-area: header;
`

const Footer = styled.div`
  grid-area: footer;
`

const Main = styled.div`
  grid-area: main;
`

const NavigationLink = styled(LinkWithActive)`
  display: inline-block;
  color: black;
  margin-right: 1em;
  text-transform: uppercase;
  font-weight: bold;
  // width: 6em;
  :hover {
    text-decoration: none;
  }
  :last-of-type {
    margin-right: 0;
  }
`

const Navigation = styled.div`
  // text-align: center;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.07);
  line-height: 3em;
  height: 3em;
`

function Layout(props) {
  const { logo, simpleLogo } = useStaticQuery(
    graphql`
      query {
        simpleLogo: file(absolutePath: { regex: "/bioRxiv_simple.png/" }) {
          childImageSharp {
            fixed(height: 20) {
              ...GatsbyImageSharpFixed_noBase64
            }
          }
        }
        logo: file(absolutePath: { regex: "/bioRxiv_logo_homepage.png/" }) {
          childImageSharp {
            fixed(width: 300) {
              ...GatsbyImageSharpFixed_noBase64
            }
          }
        }
      }
    `
  )
  const { location, children } = props
  const rootPath = `${__PATH_PREFIX__}/`
  let header = (
    <>
      <Navigation>
        {location.pathname !== rootPath ? (
          <NavigationLink to={`/`}>
            <Image
              fixed={simpleLogo.childImageSharp.fixed}
              alt="Home bioRxiv"
              critical={true}
              fadeIn={false}
              style={{
                top: 4,
                minWidth: 50,
              }}
            />
          </NavigationLink>
        ) : (
          <NavigationLink to="/">Home</NavigationLink>
        )}

        <NavigationLink to="/about/">About</NavigationLink>
        <NavigationLink to="/submit">Submit</NavigationLink>
        <NavigationLink to="/collections">Channels</NavigationLink>
      </Navigation>
      {location.pathname === rootPath && (
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          <Image
            fixed={logo.childImageSharp.fixed}
            fadeIn={false}
            critical={true}
            alt="bioRxiv"
            style={{
              margin: "3em auto 1em",
              display: "block",
              minWidth: 50,
            }}
          />
        </Link>
      )}
    </>
  )

  return (
    <Container>
      <Header>{header}</Header>
      <Main>{children}</Main>
      <Footer></Footer>
    </Container>
  )
}

export default Layout
