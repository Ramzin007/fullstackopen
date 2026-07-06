import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useMatch } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography, Box, Card, CardContent, TextField, List, ListItem } from '@mui/material'

import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [users, setUsers] = useState([])
  const [comment, setComment] = useState('')

  const navigate = useNavigate()

  const sortBlogs = (list) =>
    [...list].sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(data => {
      setBlogs(sortBlogs(data))
    })
  }, [])

  useEffect(() => {
  userService.getAll().then(data => {
    setUsers(data)
  })
  }, [])

  const notify = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')

      notify(`Welcome ${user.name}`, 'success')

      navigate('/')
    } catch {
      notify('wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)

    navigate('/')
  }

const handleAddBlog = async (blogObject) => {
  try {
    const returned = await blogService.create(blogObject)

    setBlogs(prev => sortBlogs([...prev, returned]))

    notify(
      `a new blog ${blogObject.title} by ${blogObject.author} added`,
      'success'
    )

    navigate('/')
  } catch (error) {
    notify(
      error.response?.data?.error || 'failed to create blog',
      'error'
    )
  }
}

  const handleLike = async (blog) => {
    if (!user) return

    const updated = {
      ...blog,
      likes: blog.likes + 1,
      user: typeof blog.user === 'object'
        ? blog.user.id
        : blog.user
    }

    const returned = await blogService.update(
      blog.id,
      updated
    )

setBlogs(prev =>
  sortBlogs(
    prev.map(b =>
      b.id === blog.id
        ? { ...returned, user: blog.user }
        : b
    )
  )
)
  }

  const handleComment = async (blog) => {
  const returned = await blogService.addComment(
    blog.id,
    comment
  )

  setBlogs(prev =>
    prev.map(b =>
      b.id === blog.id ? returned : b
    )
  )

  setComment('')
}

  const handleDeleteBlog = async (blog) => {
    if (
      window.confirm(
        `Remove blog ${blog.title} by ${blog.author}`
      )
    ) {
      await blogService.remove(blog.id)

      setBlogs(prev =>
        prev.filter(b => b.id !== blog.id)
      )

      navigate('/')
    }
  }

  const match = useMatch('/blogs/:id')
  const selectedBlog = match
  ? blogs.find(blog => blog.id === match.params.id)
  : null
  
  const userMatch = useMatch('/users/:id')
  const selectedUser = userMatch
  ? users.find(user => user.id === userMatch.params.id)
  : null

  return (
    <div>
      <Notification notification={notification} />

     <AppBar position="static" sx={{ mb: 3 }}>
  <Toolbar>

    <Button
      color="inherit"
      component={Link}
      to="/"
    >
      Blogs
    </Button>

    <Button
      color="inherit"
      component={Link}
      to="/users"
    >
      Users
    </Button>

    {user && (
      <Button
        color="inherit"
        component={Link}
        to="/create"
      >
        Create
      </Button>
    )}

    <Box sx={{ flexGrow: 1 }} />

    {!user ? (
      <Button
        color="inherit"
        component={Link}
        to="/login"
      >
        Login
      </Button>
    ) : (
      <>
        <Typography sx={{ mr: 2 }}>
          {user.name} logged in
        </Typography>

        <Button
          color="inherit"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </>
    )}

  </Toolbar>
</AppBar>

      <Routes>
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" />
              : (
                <LoginForm
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                />
              )
          }
        />
<Route
  path="/create"
  element={
    user ? (
      <div>
        <h2>Create Blog</h2>
        <BlogForm onAddBlog={handleAddBlog} />
      </div>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

<Route
  path="/users"
  element={<Users users={users} />}
/>

<Route
  path="/users/:id"
  element={<User user={selectedUser} />}
/>


        <Route
          path="/"
          element={
            <div>
              <h2>Blogs</h2> 

              {blogs.map(blog => (
                <Blog
                key={blog.id}
                blog={blog}
              />
              ))}
            </div>
          }
        />
<Route
  path="/blogs/:id"
  element={
    selectedBlog ? (
      <Card sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
        <CardContent>

          <Typography variant="h4" gutterBottom>
            {selectedBlog.title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            by {selectedBlog.author}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <a
              href={selectedBlog.url}
              target="_blank"
              rel="noreferrer"
            >
              {selectedBlog.url}
            </a>
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography>
              Likes: {selectedBlog.likes}
            </Typography>

            {user && (
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleLike(selectedBlog)}
              >
                Like
              </Button>
            )}
          </Box>

          <Typography sx={{ mt: 3 }}>
            Added by {selectedBlog.user?.name}
          </Typography>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Comments
          </Typography>

          <List>
            {selectedBlog.comments?.map((c, index) => (
              <ListItem key={index}>
                {c}
              </ListItem>
            ))}
          </List>

          <Box
            component="form"
            sx={{ mt: 2 }}
            onSubmit={(event) => {
              event.preventDefault()
              handleComment(selectedBlog)
            }}
          >
            <TextField
              fullWidth
              label="Add comment"
              value={comment}
              onChange={({ target }) =>
                setComment(target.value)
              }
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Add Comment
            </Button>
          </Box>

          {user &&
            ((typeof selectedBlog.user === 'object'
              ? selectedBlog.user.username === user.username
              : selectedBlog.user === user.id)) && (
              <Button
                color="error"
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={() => handleDeleteBlog(selectedBlog)}
              >
                Remove Blog
              </Button>
            )}

        </CardContent>
      </Card>
    ) : (
      <Typography>Blog not found</Typography>
    )
  }
/>
      </Routes>
    </div>
  )
}

export default App