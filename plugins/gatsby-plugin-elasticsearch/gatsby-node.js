const { Client } = require("@elastic/elasticsearch")

const { chunk } = require("lodash")
const report = require("gatsby-cli/lib/reporter")

/**
 * give back the same thing as this was called with.
 *
 * @param {any} obj what to keep the same
 */
const identity = obj => obj

exports.onPostBuild = async function(
  { graphql },
  { appId, apiKey, queries, indexName: mainIndexName, chunkSize = 1000 }
) {
  const activity = report.activityTimer(`index to Elasticsearch`)
  activity.start()

  const client = new Client({ node: "http://localhost:9200" })

  activity.setStatus(`${queries.length} queries to index`)

  const jobs = queries.map(async function doQuery(
    { indexName = mainIndexName, query, transformer = identity, settings = {} },
    i
  ) {
    if (!query) {
      report.panic(
        `failed to index to Elasticsearch. You did not give "query" to this query`
      )
    }
    if (settings.mappings) {
      await client.indices.create(
        {
          index: indexName,
          body: {
            mappings: settings.mappings,
          },
        },
        { ignore: [400] }
      )
    }

    const result = await graphql(query)
    if (result.errors) {
      report.panic(`failed to index to Elasticsearch`, result.errors)
    }

    const objects = transformer(result)
    const chunks = chunk(objects, chunkSize)

    activity.setStatus(`query ${i}: splitting in ${chunks.length} jobs`)

    const chunkJobs = chunks.map(async function(chunked) {
      const body = chunked.flatMap(doc => [
        { index: { _index: indexName } },
        doc,
      ])

      const { body: bulkResponse } = await client.bulk({ refresh: true, body })

      if (bulkResponse.errors) {
        report.panic(`failed to index to Elasticsearch - bulk`)
      }
      return bulkResponse
    })

    return Promise.all(chunkJobs)
  })

  try {
    await Promise.all(jobs)
  } catch (err) {
    report.panic(`failed to index to Elasticsearch`, err)
  }
  activity.end()
}
