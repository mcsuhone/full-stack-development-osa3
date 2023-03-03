const express = require('express')
const cors = require('cors')
// var morgan = require('morgan')
const app = express()

// morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: '040-123456'
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: '39-44-5323523'
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: '12-43-234345'
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: '39-23-6423122'
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hello everyone in the World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send('<p>Phonebook has info for ' + persons.length + ' people</p>' + 
           '<p>' + new Date() +'</p>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const id = Math.round(Math.random() * 10000)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.filter(person => person.name === body.name).length > 0) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    important: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})