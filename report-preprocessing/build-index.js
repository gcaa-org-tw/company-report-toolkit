import parseArgs from 'command-line-args'
import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
import pdf2html from 'pdf2html'
import * as url from 'node:url'

function minifyContent (content) {
  return content
    .replace(/[ \n]+/mg, ' ')
}

export async function buildOneIndex (argPayload) {
  const env = process.env
  const algoliaKeys = ['ALGOLIA_APP_ID', 'ALGOLIA_DATA_API_KEY', 'ALGOLIA_INDEX_NAME']

  if (algoliaKeys.some(key => !env[key])) {
    throw new Error(`Missing one of env variables: ${algoliaKeys.join(', ')}`)
  }

  const agClient = algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_DATA_API_KEY)
  const agIndex = agClient.initIndex(env.ALGOLIA_INDEX_NAME)
  
  const textPerPages = await pdf2html.pages(argPayload.src, { text: true })

  const companyId = argPayload['company-id'] || argPayload.companyId
  const year = Number.parseInt(argPayload.year)

  const agPayload = textPerPages.map((content, index) => {
    const page = index + 1
    const id = `${companyId}-${argPayload.year}-${page}`
    return {
      objectID: id,
      page,
      company: companyId,
      year,
      content: minifyContent(content)
    }
  })

  console.info(`Uploading ${agPayload.length} pages for ${companyId}[${year}]`)
  try {
    await agIndex.saveObjects(agPayload)
  } catch (err) {
    console.error(err)
    throw err
  }
  return agPayload.length
}

const modulePath = url.fileURLToPath(import.meta.url)
if (process.argv[1] === modulePath) {
  dotenv.config()
  const argOpts = [
    { name: 'src', alias: 's', type: String },
    { name: 'company-id', alias: 'i', type: String },
    { name: 'year', alias: 'y', type: String }
  ]

  const argPayload = parseArgs(argOpts)

  if (argOpts.some(arg => !(arg.name in argPayload))) {
    console.error(`usage: node ${process.argv[1]} -s <source file> -i <company ID> -y <year>`)
    process.exit(1)
  }
  buildOneIndex(argPayload)
}

