import express from "express"

const app = express();
const port = 3001

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons' , (req,res) => {
    res.json(persons)
})

app.get('/info' , (req, res) => {
  const date = new Date()
  res.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)

  if (!person) {
    return res.status(404).json({ error: 'person not found' }).end()
  }

  res.json(person)
})

app.delete('/api/persons/:id' , (req,res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})