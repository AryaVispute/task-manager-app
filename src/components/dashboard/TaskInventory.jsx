
import TaskList from './TaskList'

const TaskInventory = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  leftCollapsed,
  setLeftCollapsed,
  filteredTasks,
  loading,
  error,
  onToggle,
  onUpdateTitle,
  onDelete,
  userRole,
  currentUserId
}) => {
  return (
    <section 
      className={`panel-transition flex flex-col border-r-2 border-gray-50 bg-white relative ${
        leftCollapsed ? 'w-24 shrink-0' : 'flex-1 grow min-w-0'
      }`}
    >
      <div className="p-8 pb-4 flex justify-between items-center group/nav">
        {!leftCollapsed && (
          <div className="relative flex-1 mr-4">
            <input
              type="text"
              placeholder="Search a task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue/30 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        )}
        <button 
          onClick={() => setLeftCollapsed(!leftCollapsed)}
          className="p-3.5 hover:bg-gray-50 rounded-2xl transition-all text-brand-blue cursor-pointer shrink-0"
        >
          <svg className={`transition-transform duration-500 ${leftCollapsed ? 'rotate-180' : ''}`} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      </div>

      {!leftCollapsed && (
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 pt-2 space-y-6">
          <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-fit mb-6">
            {['all', 'completed', 'pending'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black capitalize transition-all ${
                  filter === f ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black font-bold'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <TaskList
            tasks={filteredTasks}
            loading={loading}
            error={error}
            onToggle={onToggle}
            onUpdateTitle={onUpdateTitle}
            onDelete={onDelete}
            currentUserId={currentUserId}
            userRole={userRole}
          />
        </div>
      )}
    </section>
  )
}

export default TaskInventory
