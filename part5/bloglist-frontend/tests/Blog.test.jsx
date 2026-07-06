import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from '../src/components/Blog'

describe('Blog component', () => {
  const blog = {
    id: '123',
    title: 'Test Blog',
    author: 'Test Author'
  }

  it('renders title and author', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Test Blog Test Author')
    ).toBeInTheDocument()
  })
})