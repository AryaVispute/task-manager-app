
import TaskItem from './TaskItem'

const TaskList = ({ tasks, loading, error, onToggle, onUpdateTitle, onDelete, userRole, currentUserId }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 border-4 border-pink-light border-t-blue rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-bold">Loading your tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2rem] text-red-500 text-center font-bold shadow-sm">
        <p className="mb-1 text-xl">Oops!</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    const isAdmin = userRole === 'admin'
    return (
      <div className="text-center p-16 bg-cream/30 rounded-[2.5rem] border-4 border-dashed border-gray-100/50">
        <div className="mb-6 mx-auto w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isAdmin ? "#77BEF0" : "#FF90BB"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <p className="text-gray-700 text-2xl font-black mb-2">
          {isAdmin ? 'No tasks found' : 'Your list is clear'}
        </p>
        <p className="text-gray-400 font-semibold max-w-xs mx-auto leading-relaxed">
          {isAdmin 
            ? "The platform's database is currently empty. All user workspaces are clear!" 
            : "Your journey to clarity starts here. Add a task above to begin!"}
        </p>
      </div>
    )
  }


  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdateTitle={onUpdateTitle}
          onDelete={onDelete}
          userRole={userRole}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}


export default TaskList
