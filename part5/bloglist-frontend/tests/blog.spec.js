import { test, expect } from '@playwright/test'
import { resetDb, createUser, loginWith } from './helpers.js'

test.describe('Blog app', () => {
  test.beforeEach(async () => {
    await resetDb()
    await createUser()
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page)
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create' }).click()

      await page.getByRole('textbox').nth(0).fill('Test Blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByRole('link', { name: /Test Blog Author/i })
      ).toBeVisible()
    })

    test('blog can be liked twice', async ({ page }) => {
      await page.getByRole('link', { name: 'create' }).click()

      await page.getByRole('textbox').nth(0).fill('Like Test')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Like Test Author/i }).click()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText(/Likes:\s*1/i)).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(
        page.getByText(/Likes:\s*2/i)
      ).toBeVisible()
    })

    test('user can delete blog', async ({ page }) => {
      await page.getByRole('link', { name: 'create' }).click()

      await page.getByRole('textbox').nth(0).fill('Delete Test')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('link', { name: /Delete Test Author/i }).click()

      page.once('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')

      await expect(
        page.getByText(/Delete Test/i)
      ).toHaveCount(0)
    })

    test('only creator sees delete button', async ({ page, request }) => {
      await page.getByRole('link', { name: 'create' }).click()

      await page.getByRole('textbox').nth(0).fill('Owner Test')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'otheruser',
          name: 'Other User',
          password: 'password'
        }
      })

      await page.goto('http://localhost:5173/login')

      await page.locator('input[type="text"]').fill('otheruser')
      await page.locator('input[type="password"]').fill('password')

      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('link', { name: /Owner Test Author/i }).click()

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).toHaveCount(0)
    })

  test('blogs are ordered by likes', async ({ page }) => {
  const createBlog = async (title) => {
    await page.getByRole('link', { name: 'create' }).click()

    await page.getByRole('textbox').nth(0).fill(title)
    await page.getByRole('textbox').nth(1).fill('Author')
    await page.getByRole('textbox').nth(2).fill('http://test.com')

    await page.getByRole('button', { name: 'create' }).click()

    await expect(
      page.getByRole('link', { name: new RegExp(`${title} Author`) })
    ).toBeVisible()
  }

  await createBlog('Low likes')
  await createBlog('Medium likes')
  await createBlog('High likes')

  await page.getByRole('link', { name: /High likes Author/i }).click()

  await page.getByRole('button', { name: 'like' }).click()
  await expect(page.getByText(/Likes:\s*1/i)).toBeVisible()

  await page.getByRole('button', { name: 'like' }).click()
  await expect(page.getByText(/Likes:\s*2/i)).toBeVisible()

  await page.goto('http://localhost:5173/')

  await page.getByRole('link', { name: /Medium likes Author/i }).click()

  await page.getByRole('button', { name: 'like' }).click()
await expect(page.getByText(/Likes:\s*1/i)).toBeVisible()

await page.goto('http://localhost:5173/')

await expect(page.locator('.blog')).toHaveCount(3)

await expect(page.locator('.blog').nth(0))
  .toContainText('High likes')

await expect(page.locator('.blog').nth(1))
  .toContainText('Medium likes')

await expect(page.locator('.blog').nth(2))
  .toContainText('Low likes')
})
  })
})