import { Link } from 'react-router-dom'
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'

const Users = ({ users }) => {
  return (
    <>
      <div style={{ marginBottom: '20px' }}>
  <h2>Users</h2>
</div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Blogs created</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </TableCell>

                <TableCell align="center">
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Users