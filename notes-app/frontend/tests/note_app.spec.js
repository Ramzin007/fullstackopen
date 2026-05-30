const { test, expect, beforeEach } = require('@playwright/test')

test.describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')

    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Muhammed Ramzin',
        username: 'ramzin',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('Notes')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await page.getByText('login').click()
    await page.getByTestId('username').fill('ramzin')
    await page.getByTestId('password').fill('secret')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Muhammed Ramzin logged in')).toBeVisible()
  })

  test('a logged in user can create a note', async ({ page }) => {
    await page.getByText('login').click()
    await page.getByTestId('username').fill('ramzin')
    await page.getByTestId('password').fill('secret')
    await page.getByRole('button', { name: 'login' }).click()

    await page.getByText('new note').click()
    await page.getByPlaceholder('write note content here').fill('a note created by playwright')
    await page.getByText('save').click()

    await expect(page.getByText('a note created by playwright')).toBeVisible()
  })
})
