import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('if like button is clicked twice, event handler is called twice', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLike={mockHandler}
    />
  )

  const user = userEvent.setup()

  // show details first
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})