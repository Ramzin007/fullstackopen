const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET } = require('../utils/config')

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decoded = jwt.verify(req.token, SECRET)
  const user = await User.findById(decoded.id)

  req.user = user
  next()
}

module.exports = userExtractor