import { supabase } from './supabaseClient'

/**
 * AUTH FUNCTIONS
 */

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

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
    console.error('Error fetching profile:', error.message)
    return { role: 'user', email: null, name: null } 
  }
}

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
    console.error('Error updating profile name:', error.message)
    throw error
  }
}


/**
 * TASK CRUD FUNCTIONS
 */

export const getTasks = async (isAdmin = false) => {
  try {
    console.log('Fetching tasks. Admin Mode:', isAdmin)
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

    // Manual filtering for extra safety (Double-Lock)
    if (!isAdmin) {
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query.order('createdAt', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching tasks:', error.message)
    throw error
  }
}



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
    console.error('Error adding task:', error.message)
    throw error
  }
}

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

