import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('url and likes are shown when view button is clicked', async () => {
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

  render(<Blog blog={blog} />)

  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)

  expect(
    screen.getByText('https://reactpatterns.com')
  ).toBeVisible()

  expect(
    screen.getByText('likes 7')
  ).toBeVisible()
})