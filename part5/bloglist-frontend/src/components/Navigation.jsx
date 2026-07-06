import { Link } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => {
  return (
    <div
      style={{
        padding: '10px',
        marginBottom: '20px',
        background: '#e9ecef'
      }}
    >
      <Link to="/">blogs</Link>

      {' | '}

      {!user
        ? <Link to="/login">login</Link>
        : (
          <>
            <Link to="/create">create blog</Link>

            {' | '}

            {user.name} logged in

            <button
              onClick={onLogout}
              style={{ marginLeft: '10px' }}
            >
              logout
            </button>
          </>
        )}
    </div>
  )
}

export default Navigation