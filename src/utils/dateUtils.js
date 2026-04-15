/**
 * Formats a date string into a human-readable "Day, Time" format.
 * Example: "Oct 15, 11:30 PM"
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.toLocaleDateString([], { day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${day}, ${time}`
}

/**
 * Generates an array of dates surrounding today for the timeline.
 * @param {number} range Number of days before and after today.
 * @returns {Array} List of date objects
 */
export const getWeekDates = (range = 14) => {
  const dates = []
  const today = new Date()
  for (let i = -range; i <= range; i++) {
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
}

/**
 * Checks if a task was created this month.
 * @param {Array} tasks 
 * @returns {number} Count of tasks this month
 */
export const getTasksThisMonthCount = (tasks) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return tasks.filter(t => new Date(t.createdAt) >= startOfMonth).length
}
