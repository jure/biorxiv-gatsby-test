import React from "react"

function Xref(props) {
  return <a href={`#${props.rid}`}>{props.children}</a>
}

function Graphic(props) {
  // It seems wasteful to do another round of image processing within Gatsby
  // even though you could:
  // https://github.com/gatsbyjs/gatsby/tree/master/examples/using-gatsby-image/plugins/gatsby-source-remote-images
  // https://using-gatsby-image.gatsbyjs.org/
  // Even so, the example JATS referenfes tif files, which are not web friendly.
  // So I'm providing a temporary translation layer for this one example.
  // To be discussed.

  const translation = {
    "685172v1_tbl1.tif":
      "https://www.biorxiv.org/content/biorxiv/early/2019/06/28/685172/T1.large.jpg",
    "685172v1_fig1.tif":
      "https://www.biorxiv.org/content/biorxiv/early/2019/06/28/685172/F1.large.jpg",
    "685172v1_fig2.tif":
      "https://www.biorxiv.org/content/biorxiv/early/2019/06/28/685172/F2.large.jpg",
    "685172v1_fig3.tif":
      "https://www.biorxiv.org/content/biorxiv/early/2019/06/28/685172/F3.large.jpg",
    "685172v1_fig4.tif":
      "https://www.biorxiv.org/content/biorxiv/early/2019/06/28/685172/F4.large.jpg",
  }

  // Using the elements sibling to determine the alt text value for the
  // image
  const alt =
    props.node.parentElement.children.item(0).textContent /* label */ +
    props.node.parentElement.children
      .item(1)
      .firstElementChild.textContent.replace("\n", "")
      .replace(/\s\s+/g, " ") /* title */

  return <img src={translation[props["xlinkHref"]]} alt={alt} />
}

function Figure(props) {
  return <figure id={props.id}>{props.children}</figure>
}

function Ref(props) {
  global.doi = {}
  global.doi[props.id] = props.node
  const doi = props.node.querySelector('pub-id[pub-id-type="doi"]')
  if (doi) {
    return (
      <li key={props.id} id={props.id}>
        <a href={`https://doi.org/${doi.textContent}`}>{props.children}</a>
      </li>
    )
  }
  return <li id={props.id}>{props.children}</li>
}

function Label(props) {
  if (props.node.parentElement.nodeName === "ref") {
    return null
  } else {
    return <span>{props.children}</span>
  }
}

function Title(props) {
  // Hack: Hide some titles
  if (["ref-list", "ack"].includes(props.node.parentElement.nodeName)) {
    return null
  }
  return <h3>{props.children}</h3>
}
const XMLNodeToReactComponentMap = {
  p: "p",
  bold: "strong",
  default: "span",
  sup: "sup",
  sub: "sub",
  xref: Xref,
  title: Title,
  graphic: Graphic,
  fig: Figure,
  "table-wrap": Figure,
  ref: Ref,
  label: Label,
}

function validAttribute(attr) {
  if (attr === "xlink:href") {
    return "xlinkHref"
  } else {
    return attr
  }
}

function processChildren(children, parentAttributes) {
  return Array.from(children.length ? children : []).map((node, i) => {
    // return if text node
    if (node.nodeType === 3) return node.nodeValue

    // collect all attributes
    processChildren(node.childNodes)
    let attributes = {}
    if (node.attributes && node.attributes.length) {
      attributes = Array.from(node.attributes).reduce((attrs, attr) => {
        attrs[validAttribute(attr.name)] = attr.value
        return attrs
      }, {})
    }

    const element =
      XMLNodeToReactComponentMap[node.nodeName] ||
      XMLNodeToReactComponentMap.default

    const isReact = typeof element !== "string"

    return React.createElement(
      element,
      {
        ...attributes,
        node: isReact ? node : undefined,
        nodename: node.nodeName,
        key: node.id || i,
      },
      processChildren(node.childNodes, attributes)
    )
  })
}

class XMLtoReact extends React.Component {
  render() {
    const { xmlDoc, selector } = this.props
    const selected = xmlDoc.querySelector(selector)

    return <>{processChildren(Array.from(selected.childNodes))}</>
  }
}

export function JatsToReact(props) {
  let xmlDoc
  if (typeof window !== "undefined") {
    xmlDoc = new DOMParser().parseFromString(props.xml, "text/xml")
  } else {
    const { JSDOM } = require("jsdom")
    xmlDoc = new JSDOM(props.xml, { contentType: "text/xml" }).window.document
  }
  return (
    <>
      <h2>Main Text</h2>
      <XMLtoReact xmlDoc={xmlDoc} selector="body" />
      <h2>References</h2>
      <ol>
        <XMLtoReact xmlDoc={xmlDoc} selector="ref-list" />
      </ol>
      <h2>Acknowledgements</h2>
      <XMLtoReact xmlDoc={xmlDoc} selector="ack" />
    </>
  )
}
