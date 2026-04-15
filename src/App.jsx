import { useState, useEffect, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from './services/supabaseClient'
import { getTasks, addTask, updateTask, deleteTask, getUserProfile, signOut, updateProfileName } from './services/api'
import TaskInventory from './components/TaskInventory'
import TaskTimeline from './components/TaskTimeline'
import DashboardHeader from './components/DashboardHeader'
import LandingScreen from './components/LandingScreen'
import ConfirmModal from './components/ConfirmModal'
import NamePromptModal from './components/NamePromptModal'
import Auth from './components/Auth'

function App() {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null) // null means loading role
  const [userName, setUserName] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString())
  const [entryStage, setEntryStage] = useState('splash')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null })
  const [isEditingName, setIsEditingName] = useState(false)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)


  const brandColors = ['#77BEF0', '#FFCB61', '#FF894F', '#EA5B6F']

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
        setUserEmail(session.user.email)
      } else {
        setUserRole('user') // No session means default role
        setUserName(null)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
        setUserEmail(session.user.email)
      } else {
        setTasks([]) // Clear tasks on logout
        setUserRole('user')
        setUserEmail(null)
        setUserName(null)
      }
    })


    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    const profile = await getUserProfile(userId)
    setUserRole(profile.role)
    setUserName(profile.name)
  }

  const handleUpdateName = async (name) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await updateProfileName(user.id, name)
      setUserName(name)
      setIsEditingName(false) // Close modal on success
      toast.success(`Nice to meet you, ${name}!`)
    } catch (err) {
      console.error('Final update catch:', err)
      toast.error(`Update failed: ${err.message || 'Unknown error'}`)
    }
  }




  useEffect(() => {
    if (entryStage === 'splash') {
      const timer = setTimeout(() => setEntryStage('landing'), 3000)
      return () => clearTimeout(timer)
    }
  }, [entryStage])

  useEffect(() => {
    if (session && userRole) {
      fetchTasks()
    }
  }, [session, userRole])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks(userRole === 'admin')
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }


  const tasksThisMonth = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return tasks.filter(t => new Date(t.createdAt) >= startOfMonth).length
  }, [tasks])

  const leftFilteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filter === 'all' ? true :
                           filter === 'completed' ? t.completed : !t.completed
      return matchesSearch && matchesFilter
    })
  }, [tasks, filter, searchQuery])

  const timelineTasks = useMemo(() => {
    return tasks.filter(t => new Date(t.createdAt).toDateString() === selectedDate)
  }, [tasks, selectedDate])

  const weekDates = useMemo(() => {
    const dates = []
    const today = new Date()
    for (let i = -14; i <= 14; i++) {
        const d = new Date()
        d.setDate(today.getDate() + i)
        dates.push({
            full: d,
            day: d.toLocaleString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            toDateString: d.toDateString(),
            isToday: d.toDateString() === today.toDateString()
        })
    }
    return dates
  }, [])

  const handleAddTask = async (title) => {
    const loadingToast = toast.loading('Adding task...')
    try {
      const newTask = await addTask(title)
      setTasks((prev) => [newTask, ...prev])
      toast.success('Task added successfully!', { id: loadingToast })
    } catch (err) {
      toast.error('Error adding task: ' + err.message, { id: loadingToast })
    }
  }

  const handleToggleTask = async (id, completed) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
      await updateTask(id, { completed })
      toast.success(completed ? 'Task completed!' : 'Task marked as pending')
    } catch (err) {
      toast.error('Error updating task status')
      fetchTasks() 
    }
  }

  const handleUpdateTitle = async (id, title) => {
    const loadingToast = toast.loading('Saving changes...')
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)))
      await updateTask(id, { title })
      toast.success('Task title updated!', { id: loadingToast })
    } catch (err) {
      toast.error('Error updating task title', { id: loadingToast })
      fetchTasks()
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, taskId: id })
  }

  const handleConfirmDelete = async () => {
    const id = deleteModal.taskId
    setDeleteModal({ isOpen: false, taskId: null })
    const loadingToast = toast.loading('Deleting task...')
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id))
      await deleteTask(id)
      toast.success('Task deleted', { id: loadingToast })
    } catch (err) {
      toast.error('Error deleting task', { id: loadingToast })
      fetchTasks()
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
    } catch (err) {
      toast.error('Error logging out')
    }
  }

  if (entryStage !== 'app') {
    return <LandingScreen stage={entryStage} onStart={() => setEntryStage('app')} />
  }

  if (!session) {
    return (
      <Auth 
        onAuthSuccess={async () => {
          const { data: { session: newSession } } = await supabase.auth.getSession()
          setSession(newSession)
          if (newSession) fetchProfile(newSession.user.id)
        }} 
      />
    )
  }

  // Name Onboarding - Show modal manually
  const showNamePrompt = session && userRole && isEditingName


  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-6 overflow-hidden">
      <Toaster position="top-right" />
      
      {showNamePrompt && (
        <NamePromptModal 
          onSave={handleUpdateName} 
          onCancel={() => setIsEditingName(false)}
          initialEmail={userEmail}
        />

      )}

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Delete Task?"
        message="This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, taskId: null })}
      />

      <DashboardHeader 
        tasksThisMonth={tasksThisMonth} 
        onLogout={handleLogout} 
        userRole={userRole} 
        userName={userName}
        userEmail={userEmail}
        onEditName={() => setIsEditingName(true)}
      />



      <main className="w-full max-w-7xl bg-white border-[3px] border-gray-100 rounded-[3rem] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.1)] flex h-[78vh] overflow-hidden relative">
        <TaskInventory 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          leftCollapsed={leftCollapsed}
          setLeftCollapsed={setLeftCollapsed}
          filteredTasks={leftFilteredTasks}
          loading={loading}
          error={error}
          onToggle={handleToggleTask}
          onUpdateTitle={handleUpdateTitle}
          onDelete={handleDeleteClick}
          userRole={userRole}
          currentUserId={session?.user?.id}
        />

        <TaskTimeline 
          rightCollapsed={rightCollapsed}
          setRightCollapsed={setRightCollapsed}
          onAddTask={handleAddTask}
          weekDates={weekDates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          timelineTasks={timelineTasks}
          onToggleTask={handleToggleTask}
          onDeleteClick={handleDeleteClick}
          brandColors={brandColors}
          userRole={userRole}
          currentUserId={session?.user?.id}
        />
      </main>

    </div>
  )
}

export default App
