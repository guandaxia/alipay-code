const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const views = require('koa-views')
const koaStatic = require('koa-static')

const path = require('path')
const fs = require('fs')

// var files = fs.readdirSync(__dirname + '/controllers')

const app = new Koa()

app.use(koaStatic(
  path.join(__dirname, './static')
))

// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})

function addMapping (router, mapping) {
  for (let url in mapping) {
    if (url.startsWith('GET ')) {
      let path = url.substring(4)
      router.get(path, mapping[url])
      // console.log(`register URL mapping: GET ${path} ${mapping[url]}`);
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`register URL mapping: POST ${path}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}

function addControllers (router) {
  let files = fs.readdirSync(path.join(__dirname, '/controllers'))
  let jsFiles = files.filter((f) => {
    return f.endsWith('.js')
  })

  for (let f of jsFiles) {
    // console.log(`process controller: ${f}...`);
    let mapping = require(path.join(__dirname, '/controllers/', f))
    addMapping(router, mapping)
  }
}

addControllers(router)

app.use(bodyParser())
// add router middleware:
app.use(router.routes())

app.listen(3000)
console.log('app started at port 3000...')
