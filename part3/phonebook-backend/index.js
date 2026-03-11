require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })


// GET all persons
app.get('/api/persons', async (req, res) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    res.status(500).json({ error: 'database error' })
  }
})


app.get('/api/persons/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id)

    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }

  } catch (error) {
    res.status(400).json({ error: 'malformatted id' })
  }
})


app.post('/api/persons', async (req, res) => {

  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  try {

    const person = new Person({
      name: body.name,
      number: body.number
    })

    const savedPerson = await person.save()

    res.json(savedPerson)

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})


// DELETE person
app.delete('/api/persons/:id', async (req, res) => {

  try {

    await Person.findByIdAndDelete(req.params.id)

    res.status(204).end()

  } catch (error) {
    res.status(400).json({ error: 'malformatted id' })
  }

})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})