import { useState } from 'react'

const AdminTaskRow = ({ 
  task, 
  onToggle, 
  onUpdateTitle, 
  onDelete, 
  currentUserId 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(task.title)

  const handleUpdate = () => {
    if (newTitle.trim() && newTitle !== task.title) {
      onUpdateTitle(task.id, newTitle)
    }
    setIsEditing(false)
  }

  const owner = task.profiles || {}
  const isOwner = task.user_id === currentUserId
  const formattedDate = new Date(task.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="flex items-center gap-6 p-4 bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
      
      {/* 1. Status & Title */}
      <div className="flex items-center gap-4 min-w-[300px] flex-1">
        <button 
          onClick={() => onToggle(task.id, !task.completed)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
            task.completed ? 'bg-brand-blue border-brand-blue' : 'border-gray-200 hover:border-brand-blue'
          }`}
        >
          {task.completed && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {isEditing ? (
          <input
            autoFocus
            className="flex-1 bg-white border-2 border-brand-blue/30 px-3 py-1 rounded-xl outline-none font-bold text-black"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
          />
        ) : (
          <span 
            className={`font-bold transition-all truncate ${task.completed ? 'text-gray-300 line-through' : 'text-black'}`}
            title={task.title}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* 2. Owner Details */}
      <div className="flex flex-col min-w-[200px] group-hover:scale-[1.01] transition-transform">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-black tracking-tight">
            {isOwner ? 'You' : owner.name || 'Anonymous'}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
            owner.role === 'admin' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' : 'bg-gray-100 text-gray-400 border-gray-200'
          }`}>
            {owner.role || 'user'}
          </span>
        </div>
        <span className="text-[10px] font-bold text-gray-400 truncate max-w-[180px]">
          {owner.email || 'no-email@system'}
        </span>
      </div>

      {/* 3. Timestamp */}
      <div className="min-w-[140px] text-right">
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">
          {formattedDate}
        </span>
      </div>

      {/* 4. Actions */}
      <div className="flex items-center gap-1 min-w-[80px] justify-end">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-[#FFCB61] hover:bg-[#FFCB61]/10 transition-colors rounded-xl border border-transparent hover:border-[#FFCB61]/20"
          title="Edit Task"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-[#EA5B6F] hover:bg-[#EA5B6F]/10 transition-colors rounded-xl border border-transparent hover:border-[#EA5B6F]/20"
          title="Delete Task"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

    </div>
  )
}

export default AdminTaskRow
