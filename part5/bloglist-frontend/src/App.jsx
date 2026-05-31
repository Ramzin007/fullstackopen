import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
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

    } catch (exception) {
      showNotification(
        'wrong username or password',
        'error'
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

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

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification
          message={message}
          type={messageType}
        />

        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification
        message={message}
        type={messageType}
      />

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      <Togglable buttonLabel="create new blog">
        <h2>create new</h2>
        <NewBlog createBlog={addBlog} />
      </Togglable>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}

export default App