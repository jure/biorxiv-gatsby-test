import React from "react"

import { rhythm } from "../utils/typography"
import { Link } from "gatsby"

const Article = props => {
  const article = props.article
  return (
    <article key={article.id}>
      <header>
        <h3
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          <Link style={{ boxShadow: `none` }} to={`/articles/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        <p>{article.authors && article.authors.join(", ")}</p>
        <small>
          Published on{" "}
          {new Date(article.posted).toLocaleDateString("en", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          . bioRxiv {article.id};{" "}
          <a href={`https://doi.org/${article.doi}`}>
            https://doi.org/{article.doi}
          </a>{" "}
        </small>
      </header>
    </article>
  )
}

export default Article
