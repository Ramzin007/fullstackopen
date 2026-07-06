import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../src/components/BlogForm'

describe('BlogForm component', () => {
  it('calls onAddBlog with correct details when form is submitted', async () => {
    const mockOnAddBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm onAddBlog={mockOnAddBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /create/i })

    await user.type(inputs[0], 'Test Title')
    await user.type(inputs[1], 'Test Author')
    await user.type(inputs[2], 'http://test.com')

    await user.click(submitButton)

    expect(mockOnAddBlog).toHaveBeenCalledTimes(1)

    expect(mockOnAddBlog).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'http://test.com'
    })
  })

  it('clears input fields after form submission', async () => {
    const mockOnAddBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm onAddBlog={mockOnAddBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /create/i })

    await user.type(inputs[0], 'Test Title')
    await user.type(inputs[1], 'Test Author')
    await user.type(inputs[2], 'http://test.com')

    await user.click(submitButton)

    inputs.forEach(input => {
      expect(input.value).toBe('')
    })
  })
})