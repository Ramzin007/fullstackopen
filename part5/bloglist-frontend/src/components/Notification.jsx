import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert
      severity={
        notification.type === 'success'
          ? 'success'
          : 'error'
      }
      sx={{ mb: 2 }}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification