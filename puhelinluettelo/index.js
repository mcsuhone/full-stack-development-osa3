require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
var morgan = require('morgan')
const app = express()
const { errorHandler, unknownEndpoint } = require('./middlewares/errorMiddleware')

morgan.token('body', (req, res) => JSON.stringify(req.body));

// Middlewares
app.use(cors())

app.use(express.static('build'))

app.use(express.json())

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

// Request handling
app.get('/', (req, res) => {
  res.send('<h1>Hello everyone in the World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send('<p>Phonebook has info for ' + persons.length + ' people</p>' + 
                  '<p>' + new Date() +'</p>')
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

const generateId = () => {
  const id = Math.round(Math.random() * 10000)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (body.number === undefined) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  
  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(
      request.params.id, 
      {name, number}, 
      {new: true, runValidators: true, context: 'query'}
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

