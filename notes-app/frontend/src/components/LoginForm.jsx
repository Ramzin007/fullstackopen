import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = event => {
    event.preventDefault()

    handleLogin({
      username,
      password
    })

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={submit}>
      <div>
        username
        <input
          data-testid="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>

      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm