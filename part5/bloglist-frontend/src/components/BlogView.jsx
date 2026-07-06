const BlogView = ({
  blog,
  user,
  onLike,
  onDelete
}) => {
  if (!blog) {
    return null
  }

  const isOwner =
    user &&
    blog.user &&
    (
      typeof blog.user === 'object'
        ? blog.user.username === user.username
        : blog.user === user.id
    )

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div>{blog.url}</div>

      <div>
        likes {blog.likes}

        {user && (
          <button onClick={onLike}>
            like
          </button>
        )}
      </div>

      <div>
        {blog.user?.name || blog.user?.username}
      </div>

      {isOwner && (
        <button onClick={onDelete}>
          remove
        </button>
      )}
    </div>
  )
}

export default BlogView