import parseArgs from 'command-line-args'
import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
import pdf2html from 'pdf2html'
import * as url from 'node:url'

// 10KB for each record, 0.5KB for meta
const MAX_RECORD_LEN = 10 * 1000 - 512

function minifyContent (content) {
  return content
    .replace(/[ \n]+/mg, ' ')
}

function chunkContent (content) {
  const totalBytes = Buffer.byteLength(content, 'utf8')
  if (totalBytes < MAX_RECORD_LEN) {
    return [content]
  } else {
    const chunkCount = Math.ceil(totalBytes / MAX_RECORD_LEN)
    // utf8 is variable length encoding, do simple solution
    const chunkSize = Math.ceil(content.length / chunkCount)
    const chunks = []
    for (let i = 0; i < chunkCount; i++) {
      chunks.push(content.substr(i * chunkSize, chunkSize))
    }
    return chunks
  }
}

const pdfOptions = {
  maxBuffer: 1024 * 1024 * 50,
  text: true
}

export async function buildOneIndex (argPayload) {
  const env = process.env
  const algoliaKeys = ['ALGOLIA_APP_ID', 'ALGOLIA_DATA_API_KEY', 'ALGOLIA_INDEX_NAME']

  if (algoliaKeys.some(key => !env[key])) {
    throw new Error(`Missing one of env variables: ${algoliaKeys.join(', ')}`)
  }

  const agClient = algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_DATA_API_KEY)
  const agIndex = agClient.initIndex(env.ALGOLIA_INDEX_NAME)
  
  console.info(`Converting ${argPayload.src} to HTML`)
  const textPerPages = await pdf2html.pages(argPayload.src, pdfOptions)
  console.info(`Got ${textPerPages.length} pages`)

  const companyId = argPayload['company-id'] || argPayload.companyId
  const year = Number.parseInt(argPayload.year)

  const agPayload = textPerPages.flatMap((content, index) => {
    const page = index + 1
    const id = `${companyId}-${argPayload.year}-${page}`
    const contentList = chunkContent(minifyContent(content))
    const commonMeta = {
      page,
      company: companyId,
      year
    }
    if (contentList.length === 1) {
      return {
        objectID: id,
        content: contentList[0],
        ...commonMeta
      }
    } else {
      return contentList.map((content, index) => {
        return {
          objectID: `${id}-${index}`,
          content,
          ...commonMeta
        }
      })
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

