

const DashboardHeader = ({ tasksThisMonth, onLogout, userRole, userName, userEmail, onEditName }) => {
  const isAdmin = userRole === 'admin'

  const getDisplayName = () => {
    if (userName) return userName
    if (userEmail) {
      const [name, domain] = userEmail.split('@')
      return `${name}@${domain.substring(0, 2)}...`
    }
    return 'User'
  }

  const identity = getDisplayName()

  return (
    <header className="w-full max-w-7xl mb-12 flex justify-between items-center animate-in fade-in slide-in-from-top duration-1000 px-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-gray-500 font-bold italic">
            {isAdmin ? `Admin Dashboard` : `Welcome back, ${identity} 👋`}
          </h2>
          {isAdmin && (
            <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-brand-blue/20">
              Admin Mode
            </span>
          )}
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          {isAdmin ? (
            <>Hey {userName || 'Admin'}, <span className="text-brand-blue">managing all tasks</span> 🚀</>
          ) : (
            <>You have <span className="text-brand-blue">{tasksThisMonth} tasks</span> this month 👍</>
          )}
        </h1>
      </div>


      <div className="flex items-center gap-6">
        <button 
          onClick={onEditName}
          className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-all group"
          title="Edit your display name"
        >
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Edit Name</span>
        </button>

        <div className="h-8 w-[2px] bg-gray-100 rounded-full hidden sm:block" />

        <button
          onClick={onLogout}
          className="flex items-center gap-4 group transition-all"
        >
          <div className="text-right flex flex-col items-end">
            <span className="text-sm font-black text-black tracking-tight">{identity}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-red transition-colors">Logout</span>
          </div>
          <div className="w-12 h-12 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-brand-red/5 group-hover:border-brand-red/20 transition-all shadow-sm">
            <svg 
              className="group-hover:translate-x-0.5 transition-transform text-gray-400 group-hover:text-brand-red"
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        </button>
      </div>
    </header>
  )
}



export default DashboardHeader

