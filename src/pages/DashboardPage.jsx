import { useState, useEffect, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '../services/supabaseClient'
import { 
  getTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  getUserProfile, 
  signOut, 
  updateProfileName 
} from '../services/api'

// Component Imports
import TaskInventory from '../components/dashboard/TaskInventory'
import TaskTimeline from '../components/dashboard/TaskTimeline'
import DashboardHeader from '../components/layout/DashboardHeader'
import ConfirmModal from '../components/ui/ConfirmModal'
import NamePromptModal from '../components/ui/NamePromptModal'
import AdminTaskManager from '../components/admin/AdminTaskManager'

// Utility Imports
import { getWeekDates, getTasksThisMonthCount } from '../utils/dateUtils'

const DashboardPage = ({ session, onLogout }) => {
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userEmail, setUserEmail] = useState(session?.user?.email)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // UI State
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString())
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null })
  const [isEditingName, setIsEditingName] = useState(false)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  const brandColors = ['#77BEF0', '#FFCB61', '#FF894F', '#EA5B6F']

  useEffect(() => {
    if (session) {
      fetchProfile(session.user.id)
      fetchTasks()
    }
  }, [session])

  const fetchProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId)
      setUserRole(profile.role)
      setUserName(profile.name)
    } catch (err) {
      toast.error('Failed to load profile details')
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      // Pass is admin check to API
      const profile = await getUserProfile(session.user.id)
      const data = await getTasks(profile.role === 'admin')
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Memoized Data
  const tasksThisMonth = useMemo(() => getTasksThisMonthCount(tasks), [tasks])
  
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

  const weekDates = useMemo(() => getWeekDates(), [])

  // Handlers
  const handleUpdateName = async (name) => {
    try {
      await updateProfileName(session.user.id, name)
      setUserName(name)
      setIsEditingName(false)
      toast.success(`Identity updated: ${name}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleAddTask = async (title) => {
    const loadingToast = toast.loading('Creating task...')
    try {
      const newTask = await addTask(title)
      setTasks((prev) => [newTask, ...prev])
      toast.success('Task scheduled!', { id: loadingToast })
    } catch (err) {
      toast.error(err.message, { id: loadingToast })
    }
  }

  const handleToggleTask = async (id, completed) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
      await updateTask(id, { completed })
      toast.success(completed ? 'Task completed!' : 'Task back in progress')
    } catch (err) {
      toast.error('Update failed')
      fetchTasks()
    }
  }

  const handleUpdateTitle = async (id, title) => {
    const loadingToast = toast.loading('Updating...')
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)))
      await updateTask(id, { title })
      toast.success('Saved', { id: loadingToast })
    } catch (err) {
      toast.error('Save failed', { id: loadingToast })
      fetchTasks()
    }
  }

  const handleConfirmDelete = async () => {
    const id = deleteModal.taskId
    setDeleteModal({ isOpen: false, taskId: null })
    const loadingToast = toast.loading('Deleting...')
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id))
      await deleteTask(id)
      toast.success('Task removed', { id: loadingToast })
    } catch (err) {
      toast.error('Delete failed', { id: loadingToast })
      fetchTasks()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-6 overflow-hidden w-full">
      <Toaster position="top-right" />
      
      {isEditingName && (
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
        onLogout={onLogout} 
        userRole={userRole} 
        userName={userName}
        userEmail={userEmail}
        onEditName={() => setIsEditingName(true)}
      />

      <main className="w-full max-w-7xl bg-white border-[3px] border-gray-100 rounded-[3rem] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.1)] flex h-[78vh] overflow-hidden relative">
        {userRole === 'admin' ? (
          <AdminTaskManager 
            tasks={tasks}
            loading={loading}
            error={error}
            onToggle={handleToggleTask}
            onUpdateTitle={handleUpdateTitle}
            onDelete={(id) => setDeleteModal({ isOpen: true, taskId: id })}
            currentUserId={session?.user?.id}
          />
        ) : (
          <>
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
              onDelete={(id) => setDeleteModal({ isOpen: true, taskId: id })}
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
              onDeleteClick={(id) => setDeleteModal({ isOpen: true, taskId: id })}
              brandColors={brandColors}
              userRole={userRole}
              currentUserId={session?.user?.id}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
