

const DashboardHeader = ({ tasksThisMonth, onLogout, userRole }) => {
  const isAdmin = userRole === 'admin'

  return (
    <header className="w-full max-w-7xl mb-12 flex justify-between items-center animate-in fade-in slide-in-from-top duration-1000 px-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-gray-500 font-bold italic">
            {isAdmin ? 'Admin Dashboard' : 'Welcome to FlowDo!'}
          </h2>
          {isAdmin && (
            <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-brand-blue/20">
              Admin Mode
            </span>
          )}
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          {isAdmin ? (
            <>Managing <span className="text-brand-blue">all user tasks</span> 🚀</>
          ) : (
            <>You have <span className="text-brand-blue">{tasksThisMonth} tasks</span> this month 👍</>
          )}
        </h1>
      </div>


      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-gray-400 hover:text-brand-red font-bold text-sm transition-all group px-4 py-2 hover:bg-brand-red/5 rounded-2xl"
      >
        <span>Logout</span>
        <svg 
          className="group-hover:translate-x-1 transition-transform"
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </header>
  )
}

export default DashboardHeader

