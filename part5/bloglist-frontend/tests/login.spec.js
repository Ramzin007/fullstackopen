import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
  await page.goto('http://localhost:5173/login')

  await expect(
    page.getByText('log in to application')
  ).toBeVisible()
    
    const usernameInputs = page.locator('input[type="text"]')
    await expect(usernameInputs.first()).toBeVisible()
    
    const passwordInputs = page.locator('input[type="password"]')
    await expect(passwordInputs).toBeVisible()
    
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'testuser',
          name: 'Test User',
          password: 'password'
        }
      })
    
      await page.goto('http://localhost:5173/login')

      await page.locator('input[type="text"]').fill('testuser')
      await page.locator('input[type="password"]').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText(/Test User logged in/)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'testuser',
          name: 'Test User',
          password: 'password'
        }
      })

      await page.goto('http://localhost:5173/login')
      
      await page.locator('input[type="text"]').fill('testuser')
      await page.locator('input[type="password"]').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })
})