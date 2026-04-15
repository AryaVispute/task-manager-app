import { supabase } from './supabaseClient'

/**
 * AUTHENTICATION SERVICES
 */

/**
 * Registers a new user with email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Supabase auth response
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

/**
 * Authenticates an existing user.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Supabase session data
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Signs out the current user.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * PROFILE SERVICES
 */

/**
 * Fetches the user profile including role and name.
 * @param {string} userId 
 * @returns {Promise<object>} Profile record
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, email, name')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }
}

/**
 * Updates the display name in the user's profile.
 * @param {string} userId 
 * @param {string} name 
 * @returns {Promise<object>} Updated profile record
 */
export const updateProfileName = async (userId, name) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(`Failed to update profile name: ${error.message}`)
  }
}

/**
 * TASK SERVICES
 */

/**
 * Fetches all tasks. Filters by owner unless admin mode is active.
 * @param {boolean} isAdmin 
 * @returns {Promise<Array>} List of tasks with owner profiles
 */
export const getTasks = async (isAdmin = false) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        profiles (
          name,
          email,
          role
        )
      `)

    // Manual filtering for data isolation (Double-Lock)
    if (!isAdmin) {
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query.order('createdAt', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`)
  }
}

/**
 * Creates a new task for the authenticated user.
 * @param {string} title 
 * @returns {Promise<object>} The created task
 */
export const addTask = async (title) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, completed: false, user_id: user.id }])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    throw new Error(`Failed to create task: ${error.message}`)
  }
}

/**
 * Updates an existing task.
 * @param {string} id 
 * @param {object} updates 
 * @returns {Promise<object>} The updated task
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
    throw new Error(`Failed to update task: ${error.message}`)
  }
}

/**
 * Deletes a task by ID.
 * @param {string} id 
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
    throw new Error(`Failed to delete task: ${error.message}`)
  }
}

