import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const [newBlogVisible, setNewBlogVisible] = useState(false)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      setNewBlogVisible(false)

      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success'
      )
    } catch (exception) {
      showNotification(
        exception.response?.data?.error || 'failed to create blog',
        'error'
      )
    }
  }

  const handleLike = async blog => {
    try {
      const blogId = blog.id || blog._id
      const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user?.id || blog.user?._id
      }

      const returnedBlog = await blogService.update(blogId, updatedBlog)

      setBlogs(
        blogs.map(b => {
          const currentId = b.id || b._id
          return currentId !== blogId ? b : returnedBlog
        })
      )
    } catch {
      showNotification('failed to update likes', 'error')
    }
  }

  const handleDelete = async blog => {
    const ok = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!ok) return

    try {
      const blogId = blog.id || blog._id
      await blogService.remove(blogId)

      setBlogs(
        blogs.filter(b => {
          const currentId = b.id || b._id
          return currentId !== blogId
        })
      )

      showNotification(
        `removed blog ${blog.title} by ${blog.author}`,
        'success'
      )
    } catch (exception) {
      showNotification(
        exception.response?.data?.error || 'failed to delete blog',
        'error'
      )
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification message={message} type={messageType} />

        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} type={messageType} />

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      <h2>create new</h2>

      {newBlogVisible ? (
        <>
          <NewBlog createBlog={addBlog} />
          <button onClick={() => setNewBlogVisible(false)}>
            cancel
          </button>
        </>
      ) : (
        <button onClick={() => setNewBlogVisible(true)}>
          new blog
        </button>
      )}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id || blog._id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
    </div>
  )
}

export default App