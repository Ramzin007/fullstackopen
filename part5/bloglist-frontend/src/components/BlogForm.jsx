import { useState } from 'react'
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper
} from '@mui/material'

const BlogForm = ({ onAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim() || !url.trim()) {
      return
    }

    onAddBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Create New Blog
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          fullWidth
        />

        <TextField
          label="Author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          fullWidth
        />

        <TextField
          label="URL"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ width: 'fit-content' }}
        >
          Create
        </Button>
      </Box>
    </Paper>
  )
}

export default BlogForm