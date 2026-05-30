const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const middleware = require('../utils/middleware')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const note = await Note.findById(request.params.id)

  if (!note) {
    return response.status(204).end()
  }

  if (note.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'only creator can delete this note' })
  }

  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )

  response.json(updatedNote)
})

module.exports = notesRouter
