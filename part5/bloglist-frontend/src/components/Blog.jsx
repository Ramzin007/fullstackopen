import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogUserId = blog.user?.id || blog.user?._id
  const loggedUserId = user?.id || user?._id

  const showDeleteButton =
    blogUserId?.toString() === loggedUserId?.toString()

  return (
    <div style={blogStyle} data-testid="blog">
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>

          <div>
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>
              like
            </button>
          </div>

          <div>{blog.user?.name}</div>

          {showDeleteButton && (
            <button onClick={() => handleDelete(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog