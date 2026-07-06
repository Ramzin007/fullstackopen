import {
  TextField,
  Button,
  Paper,
  Typography
} from '@mui/material'

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        p: 3,
        mt: 3
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
      >
        Log in to application
      </Typography>

      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={({ target }) =>
            setUsername(target.value)
          }
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={({ target }) =>
            setPassword(target.value)
          }
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Paper>
  )
}

export default LoginForm