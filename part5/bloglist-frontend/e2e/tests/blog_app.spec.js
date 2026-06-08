const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  const openNewBlogForm = async page => {
    const toggle = page.getByRole('button', { name: 'new blog' })
    if (await toggle.count() > 0) {
      await toggle.first().click()
    }
  }

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Muhammed Ramzin',
        username: 'ramzin',
        password: 'secret'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('textbox').first().fill('ramzin')
    await page.getByRole('textbox').nth(1).fill('secret')
    await page.getByRole('button', { name: 'login' }).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('ramzin')
      await page.getByRole('textbox').nth(1).fill('secret')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Muhammed Ramzin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('ramzin')
      await page.getByRole('textbox').nth(1).fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Muhammed Ramzin logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('ramzin')
      await page.getByRole('textbox').nth(1).fill('secret')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Muhammed Ramzin logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await openNewBlogForm(page)

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('React Testing')
      await inputs.nth(1).fill('Ramzin')
      await inputs.nth(2).fill('https://react-testing.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('React Testing Ramzin').first()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await openNewBlogForm(page)

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Like Test Blog')
      await inputs.nth(1).fill('Ramzin')
      await inputs.nth(2).fill('https://like-test.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByTestId('blog').filter({
        hasText: 'Like Test Blog'
      })

      await expect(blog.first()).toBeVisible()

      await blog.first().getByRole('button', { name: 'view' }).click()
      await blog.first().getByRole('button', { name: 'like' }).click()

      await expect(blog.first()).toContainText('likes 1')
    })
    test('user who created a blog can delete it', async ({ page }) => {
      await openNewBlogForm(page)

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Delete Test Blog Unique')
      await inputs.nth(1).fill('Ramzin')
      await inputs.nth(2).fill('https://delete-test.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByTestId('blog').filter({
        hasText: 'Delete Test Blog Unique'
      })

      await expect(blog.first()).toBeVisible()

      await blog.first().getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await blog.first().getByRole('button', { name: 'remove' }).click()

      await expect(blog).toHaveCount(0)
    })
  })
})