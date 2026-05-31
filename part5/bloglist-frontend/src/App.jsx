import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import NewBlog from './components/NewBlog'

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

const addBlog = async blogObject => {
  const returnedBlog = await blogService.create(blogObject)
  setBlogs(blogs.concat(returnedBlog))
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
      <h2>Blogs</h2>
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