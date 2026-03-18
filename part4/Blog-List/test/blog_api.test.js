const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Ramzin',
    url: 'http://example.com/1',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'John',
    url: 'http://example.com/2',
    likes: 10,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('blogs api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blogs returned', async () => {
    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, initialBlogs.length)
  })

  test('unique identifier is named id', async () => {
    const res = await api.get('/api/blogs')
    assert(res.body[0].id !== undefined)
    assert(res.body[0]._id === undefined)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Tester',
      url: 'http://test.com',
      likes: 7,
    }

    await api.post('/api/blogs').send(newBlog).expect(201)

    const blogs = await Blog.find({})
    assert.strictEqual(blogs.length, initialBlogs.length + 1)
  })

  test('likes default to 0 if missing', async () => {
    const newBlog = {
      title: 'No Likes',
      author: 'Tester',
      url: 'http://nolikes.com',
    }

    const res = await api.post('/api/blogs').send(newBlog).expect(201)
    assert.strictEqual(res.body.likes, 0)
  })

  test('blog without title fails', async () => {
    const newBlog = {
      author: 'Tester',
      url: 'http://fail.com',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('blog without url fails', async () => {
    const newBlog = {
      title: 'Missing URL',
      author: 'Tester',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})