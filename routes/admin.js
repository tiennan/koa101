const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

module.exports = {
  async hello(ctx, next) {
    await sleep(2000)
    ctx.body ='hello world'
  },
  /**
   * POST /admin/login - admin login
   */
  async login(ctx, next) {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.throw(400)
    }

    // console.log(await bcrypt.hash((email + password), 10))
    // return;

    if (await bcrypt.compare((email + password), '$2b$10$F6CSPFCI8UgLq4eDSBYkt.GyilYz3ntFtObcsckxgphVeHDWeXb5q')) {
      const user = {
        id: 0,
        isAdmin: true,
        email: 'admin',
      }
      ctx.body = {
        message: 'success',
        user,
        token: jwt.sign({
          data: user,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 1 day
        }, Config.jwt.secret),
      }
    } else {
      ctx.throw(401)
    }
  },
}
