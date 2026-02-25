import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Todo from './models/Todo.js'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/todos')
  .then(() => console.log('MongoDB connected'))

app.get('/todos', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 })
  res.json(todos)
})

app.post('/todos', async (req, res) => {
  const todo = await Todo.create({ text: req.body.text })
  res.json(todo)
})

app.patch('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { done: req.body.done },
    { new: true }
  )
  res.json(todo)
})

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

app.listen(3001, () => console.log('Server running on port 3001'))
