import express from "express"

const app = express();
const port = 3001

app.use(express.json())

let person = [
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
    res.json(person)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})