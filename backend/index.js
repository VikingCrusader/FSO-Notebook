require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//get all notes
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//get a specific note by id
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(
    note => {
      if (note) response.json(note)
      else response.status(404).end()
    }
  )
})

//delete a specific note by id
app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id).then(
    ()=>response.status(204).end()
  )
})

//update
app.put('/api/notes/:id', (request, response) => {
  const { content, important } = request.body
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true }
  ).then(updatedNote => {
    if (updatedNote) response.json(updatedNote)
    else response.status(404).end()
  })
})

//post a new note
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false
  })
  note.save().then(savedNote => response.json(savedNote))
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})