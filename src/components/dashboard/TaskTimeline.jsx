import AddTask from './AddTask'
import { formatDate } from '../../utils/dateUtils'

const TaskTimeline = ({

  rightCollapsed,
  setRightCollapsed,
  onAddTask,
  weekDates,
  selectedDate,
  setSelectedDate,
  timelineTasks,
  onToggleTask,
  onDeleteClick,
  brandColors,
  userRole,
  currentUserId
}) => {
  return (
    <section 
      className={`panel-transition flex flex-col bg-gray-50/20 relative ${
        rightCollapsed ? 'w-24 shrink-0' : 'flex-1 grow min-w-0'
      }`}
    >
      <div className="p-8 pb-4 bg-white/50 backdrop-blur-md z-10 border-b border-gray-100/10">
        <div className="flex justify-between items-center mb-6">
          {!rightCollapsed && (
            <div className="flex-1 mr-4">
              <AddTask onAddTask={onAddTask} />
            </div>
          )}
          <button 
            onClick={() => setRightCollapsed(!rightCollapsed)}
            className="p-3.5 hover:bg-gray-50 rounded-2xl transition-all text-brand-blue cursor-pointer shrink-0"
          >
            <svg className={`transition-transform duration-500 ${rightCollapsed ? '' : 'rotate-180'}`} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {!rightCollapsed && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 py-2 animate-in fade-in duration-700 snap-x">
            {weekDates.map((d, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedDate(d.toDateString)}
                className="flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105 shrink-0 snap-center"
              >
                <span className={`text-[10px] font-black uppercase tracking-tight ${selectedDate === d.toDateString ? 'text-brand-blue' : 'text-gray-400'}`}>
                  {d.day}
                </span>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black transition-all ${
                  selectedDate === d.toDateString ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-110' : 'text-gray-400 hover:text-black'
                }`}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!rightCollapsed && (
        <div className="flex-1 overflow-y-auto no-scrollbar px-10 pt-8 pb-20 relative">
          <div className="space-y-4 pl-6">
            {timelineTasks.length > 0 ? (
              [...timelineTasks].reverse().map((task, idx) => {
                const themeColor = task.completed ? '#4B5563' : brandColors[idx % brandColors.length];
                const tintColor = themeColor + '15'; // 10% opacity
                const isOwner = task.user_id === currentUserId;
                const isAdmin = userRole === 'admin';

                const ownerProfile = task.profiles
                
                const getOwnerDisplay = () => {
                  if (isOwner) return 'You'
                  if (ownerProfile?.name) return ownerProfile.name
                  if (ownerProfile?.email) {
                    const [emailName, domain] = ownerProfile.email.split('@')
                    return `${emailName}@${domain.substring(0, 2)}...`
                  }
                  return 'Guest'
                }

                const ownerName = getOwnerDisplay()
                
                return (
                  <div key={task.id} className="relative flex items-start group">
                    <div className="absolute left-[20px] top-5 w-6 h-6 rounded-full border-[5px] border-white shadow-sm z-10 transition-transform group-hover:scale-110"
                         style={{ backgroundColor: themeColor }}></div>
                    
                    <div 
                      onClick={() => (isOwner || isAdmin) && onToggleTask(task.id, !task.completed)}
                      className={`ml-16 flex-1 p-4 rounded-[1.5rem] border-2 border-gray-100 transition-all hover:shadow-md group-hover:-translate-y-0.5 relative ${isOwner || isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
                      style={{ backgroundColor: tintColor, borderBottomWidth: '2px', borderBottomColor: themeColor }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: themeColor }}>
                            {task.completed ? 'COMPLETED' : 'IN PROGRESS'}
                          </span>
                          {!isOwner && (
                            <span className="bg-white/60 text-gray-500 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border border-gray-200/50">
                              {ownerName}
                            </span>
                          )}
                          {isOwner && (
                            <span className="bg-white/60 text-brand-blue text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border border-brand-blue/20">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-gray-500 italic">
                            {formatDate(task.createdAt)}
                          </span>

                          {(isOwner || isAdmin) && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDeleteClick(task.id); }} 
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded-lg text-brand-red transition-all duration-300"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <h3 className={`text-[15px] font-bold ${task.completed ? 'text-gray-500 line-through' : 'text-black'}`}>
                        {task.title}
                      </h3>
                    </div>
                  </div>
                )

              })
            ) : (
              <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-1000">
                <div className="w-32 h-32 rounded-full bg-[#FFCB61]/20 border-4 border-white flex items-center justify-center shadow-lg mb-6">
                  <span className="text-4xl font-black text-[#FFCB61]">?</span>
                </div>
                <p className="text-gray-500 font-bold italic tracking-wide text-lg">No tasks scheduled for this day.</p>
                <p className="text-gray-400 text-[10px] mt-2 uppercase font-black tracking-widest">Master your clarity.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default TaskTimeline
