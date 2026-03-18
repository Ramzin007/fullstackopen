const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '1',
    title: 'First Blog',
    author: 'Author A',
    url: 'http://example.com',
    likes: 5,
  },
]

const listWithManyBlogs = [
  {
    _id: '1',
    title: 'Blog 1',
    author: 'Author A',
    url: 'http://example.com/1',
    likes: 5,
  },
  {
    _id: '2',
    title: 'Blog 2',
    author: 'Author B',
    url: 'http://example.com/2',
    likes: 10,
  },
  {
    _id: '3',
    title: 'Blog 3',
    author: 'Author A',
    url: 'http://example.com/3',
    likes: 7,
  },
]



test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})



describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('of one blog equals its likes', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('of many blogs is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(listWithManyBlogs), 22)
  })
})



describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    assert.deepStrictEqual(result, listWithManyBlogs[1])
  })
})



describe('most blogs', () => {
  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)

    assert.deepStrictEqual(result, {
      author: 'Author A',
      blogs: 2,
    })
  })
})



describe('most likes', () => {
  test('returns author with most total likes', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)

    assert.deepStrictEqual(result, {
      author: 'Author A',
      likes: 12,
    })
  })
})