import { useState } from 'react'

const AddTask = ({ onAddTask }) => {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title)
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <div className="relative flex-1 group">
        <input
          type="text"
          placeholder="Plan your next achievement..."
          className="w-full bg-white border-2 border-gray-100 focus:border-brand-blue/30 rounded-2xl py-4.5 px-6 outline-none transition-all font-semibold shadow-sm group-hover:shadow-md h-[60px]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={!title.trim()}
        className="h-[60px] px-8 bg-black text-white hover:bg-[#FFCB61] hover:text-gray-600 font-black rounded-2xl transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-black/10 disabled:opacity-30 flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="hidden md:inline">Add Task</span>
      </button>
    </form>
  )
}

export default AddTask
