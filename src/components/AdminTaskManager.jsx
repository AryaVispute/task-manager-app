import { useState, useMemo } from 'react'
import AdminTaskRow from './AdminTaskRow'

const AdminTaskManager = ({
  tasks,
  loading,
  error,
  onToggle,
  onUpdateTitle,
  onDelete,
  currentUserId
}) => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                           t.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
                           t.profiles?.name?.toLowerCase().includes(search.toLowerCase())
      
      const matchesFilter = filter === 'all' ? true :
                           filter === 'completed' ? t.completed : !t.completed
      
      return matchesSearch && matchesFilter
    })

    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  }, [tasks, search, filter, sortOrder])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-12 h-12 border-3 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="bg-brand-red/10 text-brand-red p-8 rounded-[2rem] border-2 border-brand-red/20 text-center">
        <h3 className="text-xl font-black mb-2 tracking-tight">System Error</h3>
        <p className="font-bold">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      
      {/* 1. Admin Control Header */}
      <div className="p-10 border-b-2 border-gray-100/50 bg-gray-50/10">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-0">
          
          <div className="flex items-center gap-4 flex-1 w-full max-w-xl">
            <div className="relative flex-1 group">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-blue transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="w-full bg-white border-[3px] border-gray-100 text-black pl-14 pr-6 py-4 rounded-3xl focus:border-brand-blue outline-none font-bold transition-all text-base shadow-sm"
                placeholder="Search tasks, users, or emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="px-6 py-4 bg-white border-[3px] border-gray-100 rounded-3xl hover:border-brand-blue transition-all flex items-center gap-3 group shadow-sm"
            >
              <svg 
                className={`text-brand-blue transition-transform duration-500 ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
              >
                 <path d="M7 11V3m0 0L3 7m4-4l4 4m6 6v8m0 0l-4-4m4 4l4-4" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-3xl shadow-inner border border-gray-200/50">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-white text-brand-blue shadow-lg scale-105' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. Management Table Area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto no-scrollbar pb-12">
        
        {/* Table Header Row */}
        <div className="flex items-center gap-6 px-14 py-6 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
          <div className="min-w-[300px] flex-1">Task & Status</div>
          <div className="min-w-[200px]">Owner Information</div>
          <div className="min-w-[140px] text-right">Created Date</div>
          <div className="min-w-[80px] text-right">Controls</div>
        </div>

        {/* Dynamic Task Rows */}
        <div className="min-w-full px-10">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <AdminTaskRow 
                key={task.id}
                task={task}
                onToggle={onToggle}
                onUpdateTitle={onUpdateTitle}
                onDelete={onDelete}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-1000">
               <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                 <span className="text-4xl">🔎</span>
               </div>
               <h3 className="text-xl font-black text-black tracking-tight mb-2">No matching records</h3>
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Master your search.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminTaskManager
