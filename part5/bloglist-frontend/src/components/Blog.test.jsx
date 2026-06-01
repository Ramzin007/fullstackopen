import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import NewBlog from './NewBlog'

test('calls event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()

  const user = userEvent.setup()

  render(
    <NewBlog createBlog={createBlog} />
  )

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'React Testing')
  await user.type(inputs[1], 'Muhammed Ramzin')
  await user.type(inputs[2], 'https://react-testing.com')

  const button = screen.getByText('create')
  await user.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Testing',
    author: 'Muhammed Ramzin',
    url: 'https://react-testing.com'
  })
})