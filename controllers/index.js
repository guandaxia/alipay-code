const mysql = require('../libs/mysql')
const config = require('../config/default')
const { JSSDK } = require('../libs/jssdk')

let index = async (ctx, next) => {
  console.log(ctx.params)
  let id = ctx.params.id || 1

  let sql, sqlResult
  sql = 'SELECT id FROM codes ORDER BY id DESC LIMIT 1'
  sqlResult = await mysql.query(sql)
  if (id > sqlResult[0].id) {
    id = sqlResult[0].id
  }

  sql = 'SELECT id, contents FROM codes WHERE id = ?'
  sqlResult = await mysql.query(sql, id)
  console.log('contents:', sqlResult[0].contents)

  console.log(ctx.request.href)
  let option = {
    appid: config.wechat.appid,
    appsecret: config.wechat.appsecret
  }
  let jssdk = new JSSDK(option)
  let url = ctx.request.href
  let jsInfo = await jssdk.sign(url)
  console.log(jsInfo)

  await ctx.render('index', {
    code: sqlResult[0].contents,
    id: sqlResult[0].id,
    jsInfo
  })
}

let statistics = async (ctx, next) => {
  console.log(ctx.params)
  let id = ctx.request.body.id

  let sql = 'UPDATE codes SET count = count + 1 WHERE id = ?'

  await mysql.query(sql, id)

  ctx.response.body = JSON.stringify([])
}

module.exports = {
  'GET /:id?': index,
  'POST /:id': statistics
}
