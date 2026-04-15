import { useState } from 'react'

const TaskItem = ({ task, onToggle, onUpdateTitle, onDelete, userRole, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const isAdmin = userRole === 'admin'
  const isOwner = task.user_id === currentUserId
  const hasAccess = isOwner || isAdmin

  // Get owner email and truncate it
  const ownerEmail = task.profiles?.email || 'Guest'
  const truncateEmail = (email) => {
    if (!email || email === 'Guest') return 'Guest'
    const [name, domain] = email.split('@')
    return `${name}@${domain.substring(0, 2)}...`
  }

  const handleSave = () => {
    if (editTitle.trim() === '') {
      setEditTitle(task.title)
      setIsEditing(false)
      return
    }
    onUpdateTitle(task.id, editTitle)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.toLocaleDateString([], { day: 'numeric', month: 'short' })
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    return `${day}, ${time}`
  }

  return (
    <div 
      className={`flex items-center gap-4 p-4 mb-3 rounded-[1.5rem] bg-white border-2 transition-all group shadow-sm ${
        isAdmin && isOwner ? 'border-brand-blue/40 shadow-brand-blue/5' : 'border-gray-100/60'
      } ${isAdmin && !isOwner ? 'opacity-70 saturate-[0.8]' : ''} hover:border-brand-blue/30`}
    >
      
      {/* Custom SaaS Checkbox */}
      {!isEditing && (
        <label className="relative flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={task.completed}
            disabled={!hasAccess}
            onChange={() => onToggle(task.id, !task.completed)}
            className="peer sr-only"
          />
          <div className="w-7 h-7 rounded-lg border-2 border-gray-200 peer-checked:bg-brand-blue peer-checked:border-brand-blue transition-all flex items-center justify-center">
            <svg 
              className={`w-4 h-4 text-white transition-opacity duration-300 ${task.completed ? 'opacity-100' : 'opacity-0'}`} 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </label>
      )}
      
      {isEditing ? (
        <input
          type="text"
          autoFocus
          className="flex-1 bg-gray-50 border-2 border-brand-blue/20 text-black px-3 py-1.5 rounded-xl focus:border-brand-blue outline-none font-bold text-base"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
        />
      ) : (
        <div className="flex-1 min-w-0" onClick={() => hasAccess && setIsEditing(true)}>
          <div className="flex items-center gap-2 mb-0.5">
            <p 
              className={`text-base font-bold truncate transition-all ${
                task.completed 
                  ? 'text-gray-400 line-through' 
                  : 'text-black'
              }`}
            >
              {task.title}
            </p>
            {isAdmin && (
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                isOwner ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}>
                {isOwner ? 'You' : 'User'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-gray-500 italic block">
              {formatDate(task.createdAt)}
            </span>
            {isAdmin && (
              <span className="text-[10px] font-bold text-gray-400">
                • Created by: <span className="text-gray-500">{isOwner ? 'You' : truncateEmail(ownerEmail)}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions Always Visible */}
      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="p-2 text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </button>
            <button onClick={handleCancel} className="p-2 text-brand-red hover:bg-brand-red/5 rounded-xl transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </>
        ) : (
          <>
            {hasAccess && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="p-2 text-gray-300 hover:text-[#FFCB61] hover:bg-[#FFCB61]/5 rounded-xl transition-all"
                title="Edit Task"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
            )}
            {hasAccess && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="p-2 text-gray-300 hover:text-[#EA5B6F] hover:bg-[#EA5B6F]/5 rounded-xl transition-all"
                title="Delete Task"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" /></svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TaskItem
