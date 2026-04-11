import { supabase } from './supabaseClient'

/**
 * Fetch all tasks ordered by createdAt desc
 */
export const getTasks = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
    throw error
  }
}

/**
 * Insert new task
 */
export const addTask = async (title) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, completed: false }])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error adding task:', error.message)
    throw error
  }
}

/**
 * Update task fields (completed, title, etc.)
 */
export const updateTask = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error updating task:', error.message)
    throw error
  }
}

/**
 * Delete task
 */
export const deleteTask = async (id) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting task:', error.message)
    throw error
  }
}
