import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material'

const User = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {user.name}
      </Typography>

      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        Added blogs
      </Typography>

      <List>
        {user.blogs.map(blog => (
          <ListItem key={blog.id} divider>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default User