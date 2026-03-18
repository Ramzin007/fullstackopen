const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const count = {}

  for (const blog of blogs) {
    count[blog.author] = (count[blog.author] || 0) + 1
  }

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in count) {
    if (count[author] > maxBlogs) {
      maxBlogs = count[author]
      maxAuthor = author
    }
  }

  return { author: maxAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesMap = {}

  for (const blog of blogs) {
    likesMap[blog.author] = (likesMap[blog.author] || 0) + blog.likes
  }

  let maxAuthor = null
  let maxLikes = 0

  for (const author in likesMap) {
    if (likesMap[author] > maxLikes) {
      maxLikes = likesMap[author]
      maxAuthor = author
    }
  }

  return { author: maxAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}