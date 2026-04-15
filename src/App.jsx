import { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import { signOut } from './services/api'
import LandingPage from './pages/LandingPage'
import AuthForm from './components/auth/AuthForm'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [session, setSession] = useState(null)
  const [entryStage, setEntryStage] = useState('splash')

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Auth Listeners
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (entryStage === 'splash') {
      const timer = setTimeout(() => setEntryStage('landing'), 3000)
      return () => clearTimeout(timer)
    }
  }, [entryStage])

  const handleLogout = async () => {
    await signOut()
    setSession(null)
  }

  // 1. Splash & Landing Navigation
  if (entryStage !== 'app') {
    return <LandingPage stage={entryStage} onStart={() => setEntryStage('app')} />
  }

  // 2. Authentication Flow
  if (!session) {
    return (
      <AuthForm 
        onAuthSuccess={async () => {
          const { data: { session: newSession } } = await supabase.auth.getSession()
          setSession(newSession)
        }} 
      />
    )
  }

  // 3. Main Application Dashboard
  return (
    <DashboardPage 
      session={session} 
      onLogout={handleLogout} 
    />
  )
}

export default App
