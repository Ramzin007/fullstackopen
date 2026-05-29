const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { SECRET } = require('../utils/config')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user && (await bcrypt.compare(password, user.passwordHash))

  if (!passwordCorrect) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    SECRET
  )

  res.json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter