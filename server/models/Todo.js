import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Todo', schema)
