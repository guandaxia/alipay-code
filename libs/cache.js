let path = require('path')

let nconf = require('nconf').file({
  dir: './cache',
  file: 'jssdk.json'
})

function saveCache (cacheKey, cacheValue, expire = 0) {
  let date = new Date()
  let time = date.getTime()

  let cacheInfo = {
    value: cacheValue,
    expire: expire + time
  }
  nconf.set(cacheKey, cacheInfo)

  nconf.save()
}

function readCache (cacheKey) {
  nconf.load()
  let cacheInfo = nconf.get(cacheKey)
  console.log({ cacheInfo })
  let date = new Date()
  if (cacheInfo == null || cacheInfo.expire < date.getTime()) {
    return null
  }
  return cacheInfo.value
}

module.exports = {
  saveCache,
  readCache
}
