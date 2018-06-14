const mongoose = require('mongoose')
const schemas = require('./schemas')

module.exports = {
  User: mongoose.model('User', schemas.userSchema),
}
