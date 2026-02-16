const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (!person) {
    return res.status(404).end()
  }

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  if (persons.some(p => p.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.use((req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
