const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await user.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid note can be added by logged in user', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })

  const newNote = {
    content: 'async/await simplifies API tests',
    important: true
  }

  await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
