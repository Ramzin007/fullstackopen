import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
    setNotification('wrong credentials')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  setUser(null)
}

const addBlog = async blogObject => {
  const returnedBlog = await blogService.create(blogObject)
  setBlogs(blogs.concat(returnedBlog))
  setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  setTimeout(() => {
    setNotification(null)
  }, 5000)
}

    if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} />
      <p>
        {user.name} Logged in
        <button onClick={handleLogout}>
         logout
        </button>
      </p>
      <h2>Create Blog</h2>
      <NewBlog createBlog={addBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App