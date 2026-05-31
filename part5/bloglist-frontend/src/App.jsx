import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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
    console.log('wrong credentials')
  }
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  setUser(null)
}

    if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>
         logout
        </button>
      </p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App