const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
  registerDate: { type: Date, default: Date.now },
})
userSchema.methods.output = function() {
  const out = JSON.parse(JSON.stringify(this))
  out.id = out._id
  delete out.password
  delete out.__v
  delete out._id
  return out
}
userSchema.methods.toToken = function() {
  return {
    id: this._id,
    email: this.email,
  }
}

module.exports = {
  userSchema,
}
