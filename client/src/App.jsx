import { useEffect, useState } from 'react'

const API = 'http://localhost:3001'

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    fetch(`${API}/todos`)
      .then(r => r.json())
      .then(setTodos)
  }, [])

  async function addTodo() {
    if (!input.trim()) return
    const todo = await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    }).then(r => r.json())
    setTodos([todo, ...todos])
    setInput('')
  }

  async function toggleTodo(id, done) {
    const updated = await fetch(`${API}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done })
    }).then(r => r.json())

    setTodos(todos.map(t => t._id === id ? updated : t))
  }

  async function deleteTodo(id) {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter(t => t._id !== id))
  }

  const completed = todos.filter(t => t.done).length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-lg">

        <div className="mb-10">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-600 text-sm mt-1">{completed} of {todos.length} completed</p>
        </div>

        <div className="flex gap-2 mb-8">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/25 placeholder:text-gray-600 transition-colors"
            placeholder="Add a task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="bg-white text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo._id}
              className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3 group"
            >
              <button
                onClick={() => toggleTodo(todo._id, todo.done)}
                className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  todo.done
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {todo.done && <span className="text-white text-xs">✓</span>}
              </button>

              <span className={`flex-1 text-sm ${todo.done ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                {todo.text}
              </span>

              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-transparent group-hover:text-gray-600 hover:!text-red-400 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          ))}

          {todos.length === 0 && (
            <p className="text-center text-gray-700 py-10 text-sm">No tasks yet. Add one above.</p>
          )}
        </div>

      </div>
    </div>
  )
}
