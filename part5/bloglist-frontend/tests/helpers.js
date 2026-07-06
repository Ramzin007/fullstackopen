import axios from 'axios'

const baseUrl = 'http://localhost:3003'

export const resetDb = async () => {
  await axios.post(`${baseUrl}/api/testing/reset`)
}

export const createUser = async () => {
  await axios.post(`${baseUrl}/api/users`, {
    username: 'testuser',
    name: 'Test User',
    password: 'password'
  })
}

export const loginWith = async (page) => {
  await page.goto('http://localhost:5173/login')

  await page.locator('input[type="text"]').fill('testuser')
  await page.locator('input[type="password"]').fill('password')
  await page.getByRole('button', { name: 'login' }).click()

  await page.waitForURL('http://localhost:5173/', { timeout: 5000 })
}