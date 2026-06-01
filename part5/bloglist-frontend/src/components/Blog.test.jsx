import { render } from '@testing-library/react'
import { test, expect } from 'vitest'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
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

  const { container } = render(
    <Blog blog={blog} />
  )

  const element = container.querySelector('.blog')

  expect(element).toHaveTextContent(
    'React patterns'
  )

  expect(element).toHaveTextContent(
    'Michael Chan'
  )

  expect(element).not.toHaveTextContent(
    'https://reactpatterns.com'
  )

  expect(element).not.toHaveTextContent(
    'likes'
  )
})