const fs = require('fs')
const path = require('path')
const parseArgs = require('command-line-args')
const algoliasearch = require('algoliasearch')
const dotenv = require('dotenv')
const pdf2html = require('pdf2html')

dotenv.config()

async function main () {
  const argOpts = [
    { name: 'src', alias: 's', type: String },
    { name: 'company-id', alias: 'i', type: String },
    { name: 'year', alias: 'y', type: String }
  ]
    
  const argPayload = parseArgs(argOpts)

  if (argOpts.some(arg => !(arg.name in argPayload))) {
    console.error(`usage: node ${process.argv[1]} -s <source file> -i <company ID> -y <year>`)
    return 1
  }

  const env = process.env
  const algoliaKeys = ['ALGOLIA_APP_ID', 'ALGOLIA_DATA_API_KEY', 'ALGOLIA_INDEX_NAME']

  if (algoliaKeys.some(key => !env[key])) {
    console.error(`Missing one of env variables: ${algoliaKeys.join(', ')}`)
    return 2
  }

  const agClient = algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_DATA_API_KEY)
  const agIndex = agClient.initIndex(env.ALGOLIA_INDEX_NAME)
  
  const textPerPages = await pdf2html.pages(argPayload.src, { text: true })

  const companyId = argPayload['company-id']
  const year = Number.parseInt(argPayload.year)

  const agPayload = textPerPages.map((content, index) => {
    const page = index + 1
    const id = `${companyId}-${argPayload.year}-${page}`
    return {
      objectID: id,
      page,
      company: companyId,
      year,
      content
    }
  })

  console.info(`Uplaoding ${agPayload.length} pages for ${companyId}[${year}]`)
  await agIndex.saveObjects(agPayload)
}

main()
