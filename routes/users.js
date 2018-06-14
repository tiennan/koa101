const Models = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

  async register (ctx, next) {
    const { email, name, password } = ctx.request.body
    if (!email || !password || !name) {
      ctx.throw(400) // 400 "bad request"
    }
    // TODO: validation

    let existingUser = await Models.User.findOne({ email }).exec()
    if (existingUser) {
      ctx.throw(403) // 403 "forbidden"
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    let user = new Models.User({
      email,
      name,
      password: hashedPassword,
    })
    await user.save()
    ctx.body = user.output()
  },

  async login(ctx, next) {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.throw(400) // 400 "bad request"
    }

    let user = await Models.User.findOne({ email }).exec()
    if (!user) {
      ctx.throw(401) // 401 "unauthorized"
    }

    if (await bcrypt.compare(password, user.password)) {
      ctx.body = {
        message: 'success',
        user: user.output(),
        token: jwt.sign({
          data: user.toToken(),
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 day
        }, Config.jwt.secret),
      }
    } else {
      ctx.throw(401) // 401 "unauthorized"
    }
  },

  async list(ctx, next) {
    let { page, limit } = ctx.request.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 20
    const skip = (page - 1) * limit

    let condition = {}
    let total = await Models.User.count({})
    let users = await Models.User.find({}, null, {skip, limit}).exec()

    ctx.body = {
      users: users.map(item => item.output()),
      total,
    }
  },

  async show(ctx, next) {
    const user = await Models.User.findOne({ _id: ctx.params.id }).exec()
    if (user) {
      ctx.body = {
        user: user.output(),
      }
    } else {
      ctx.throw(404)
    }
  },

  async update(ctx, next) {
    const { name } = ctx.request.body
    if (!ctx.params.id) {
      ctx.throw(400) // 400 "bad request"
    }
    if (ctx.state.user.data.id !== ctx.params.id) {
      ctx.throw(401) // 401 "unauthorized"
    }

    let ret = await Models.User.updateOne({ _id: ctx.params.id }, { name })
    if (ret.n === 0) {
      ctx.body = {
        message: 'not found',
      }
    } else {
      ctx.body = {
        message: 'success',
      }
    }
  },
}
