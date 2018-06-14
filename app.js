const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const router = require('koa-router')()
const koajwt = require('koa-jwt')
const mongoose = require('mongoose')

const usersRoute = require('./routes/users')
global.Config = require('./config')

console.log('connecting mongodb...')
mongoose.connect(Config.mongo.uri).then(
  () => { console.log('mongodb connected.') },
  (err) => { console.log(err) }
)

router
  .get('/hello', (ctx, next) => {
    ctx.body = 'hello world!'
  })
  .post('/users/register', usersRoute.register)
  .post('/users/login', usersRoute.login)
  .get('/users', usersRoute.list)
  .get('/users/:id', usersRoute.show)
  .patch('/users/:id', usersRoute.update)

const app = new Koa()
app
  .use(logger())
  .use(cors())
  .use(koajwt({
    secret: Config.jwt.secret,
  }).unless({
    method: 'OPTIONS',
    path: [
      /^\/hello/,
      /^\/admin\/login/,
      /^\/users\/register/,
      /^\/users\/login/,
    ]
  }))
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(Config.port)
console.log(`listening port ${Config.port}`)
