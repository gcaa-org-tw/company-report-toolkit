const csvTempCache: any = {}

function genUniqueId () {
  const id = Math.random().toString(36).slice(2)
  if (csvTempCache[id]) {
    return genUniqueId()
  }
  return id
}

export function appendCache (content: any, fileName: string, expire = 60 * 1000) {
  const id = genUniqueId()
  csvTempCache[id] = {
    name: fileName,
    content
  }
  setTimeout(() => {
    delete csvTempCache[id]
  }, expire)

  return id
}

export function getCache (id: string) {
  return csvTempCache[id]
}
