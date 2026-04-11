import { useState, useEffect, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getTasks, addTask, updateTask, deleteTask } from './services/api'
import TaskInventory from './components/TaskInventory'
import TaskTimeline from './components/TaskTimeline'
import DashboardHeader from './components/DashboardHeader'
import LandingScreen from './components/LandingScreen'
import ConfirmModal from './components/ConfirmModal'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString())
  const [entryStage, setEntryStage] = useState('splash')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null })
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  const brandColors = ['#77BEF0', '#FFCB61', '#FF894F', '#EA5B6F']

  useEffect(() => {
    if (entryStage === 'splash') {
      const timer = setTimeout(() => setEntryStage('landing'), 3000)
      return () => clearTimeout(timer)
    }
  }, [entryStage])

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks()
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

  if (entryStage !== 'app') {
    return <LandingScreen stage={entryStage} onStart={() => setEntryStage('app')} />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-6 overflow-hidden">
      <Toaster position="top-right" />
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Delete Task?"
        message="This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, taskId: null })}
      />

      <DashboardHeader tasksThisMonth={tasksThisMonth} />

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
        />
      </main>
    </div>
  )
}

export default App
