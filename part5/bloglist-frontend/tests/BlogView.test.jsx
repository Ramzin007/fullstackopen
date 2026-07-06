import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogView from '../src/components/BlogView'

describe('BlogView component', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'owner',
      name: 'Owner User'
    }
  }

  it('shows blog information and no buttons to unauthenticated users', () => {
    render(
      <BlogView
        blog={blog}
        user={null}
        onLike={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText(/Test Blog Test Author/i)).toBeInTheDocument()
    expect(screen.getByText('http://test.com')).toBeInTheDocument()
    expect(screen.getByText(/likes 5/i)).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: /like/i })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: /remove/i })
    ).not.toBeInTheDocument()
  })

  it('shows only the like button to a logged-in user who is not the owner', () => {
    render(
      <BlogView
        blog={blog}
        user={{ username: 'someoneElse' }}
        onLike={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: /like/i })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: /remove/i })
    ).not.toBeInTheDocument()
  })

  it('shows both like and remove buttons to the blog owner', () => {
    render(
      <BlogView
        blog={blog}
        user={{ username: 'owner' }}
        onLike={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: /like/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /remove/i })
    ).toBeInTheDocument()
  })
})