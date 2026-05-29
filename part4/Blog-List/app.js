const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { MONGODB_URI } = require('./utils/config')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const tokenExtractor = require('./middleware/tokenExtractor')
const errorHandler = require('./middleware/errorHandler')

const app = express()

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

module.exports = app