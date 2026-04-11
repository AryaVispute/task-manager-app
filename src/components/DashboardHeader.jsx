

const DashboardHeader = ({ tasksThisMonth }) => {
  return (
    <header className="w-full max-w-7xl mb-12 flex justify-between items-end animate-in fade-in slide-in-from-top duration-1000 px-4">
      <div>
        <h2 className="text-gray-500 font-bold mb-1 italic">Welcome to FlowDo!</h2>
        <h1 className="text-4xl font-black tracking-tight">
          You have <span className="text-brand-blue">{tasksThisMonth} tasks</span> this month 👍
        </h1>
      </div>
    </header>
  )
}

export default DashboardHeader
