const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../middleware/userExtractor')

// 🔹 GET all
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })

  res.json(blogs)
})

// 🔹 POST (requires token)
blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user

  const blog = new Blog({
    ...req.body,
    user: user._id,
  })

  const saved = await blog.save()

  user.blogs = user.blogs.concat(saved._id)
  await user.save()

  res.status(201).json(saved)
})

// 🔹 DELETE (only owner)
blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) return res.status(404).end()

  if (blog.user.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: 'not allowed' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter