import { useState } from 'react'
import { signIn, signUp } from '../services/api'
import toast from 'react-hot-toast'

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showVerification, setShowVerification] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await signIn(email, password)
        toast.success('Welcome back!')
        if (onAuthSuccess) onAuthSuccess()
      } else {
        const data = await signUp(email, password)
        
        // CASE: Confirmation Required (Session is null)
        if (data.user && !data.session) {
          setShowVerification(true)
          toast.success('Verification email sent!')
        } 
        // CASE: Confirmation OFF (Session exists)
        else if (data.session) {
          toast.success('Welcome to FlowDo!')
          if (onAuthSuccess) onAuthSuccess()
        }
        else {
          // This case should ideally not be hit if Supabase behavior is consistent
          toast.success('Account created! Please sign in.')
          setIsLogin(true)
        }
      }
    } catch (error) {
      console.error('Authentication Error:', error)
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }



  if (showVerification) {
    return (
      <div className="min-h-screen w-full bg-white relative flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-md px-6 animate-in zoom-in duration-700">
          <div className="bg-white border-[3px] border-gray-100 rounded-[3rem] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.1)] p-12 text-center">
            <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#77BEF0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
            </div>
            <h2 className="text-3xl font-black text-black tracking-tight mb-4">Check your email</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
              We've sent a verification link to <span className="text-black font-bold">{email}</span>. Please click the link to activate your account.
            </p>
            <button
              onClick={() => { setShowVerification(false); setIsLogin(true); }}
              className="btn-saas w-full justify-center"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Diagonal Cross Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 animate-in slide-in-from-bottom-12 duration-1000">
        <div className="bg-white border-[3px] border-gray-100 rounded-[3rem] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12">
          
          <div className="text-center mb-10">
            <span className="bg-brand-red/5 border-2 border-brand-red/20 text-brand-red px-6 py-1.5 rounded-2xl font-black tracking-tighter shadow-sm text-lg block w-fit mx-auto mb-6">
              FlowDo
            </span>
            <h2 className="text-3xl font-black text-black tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Join FlowDo'}
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              {isLogin ? 'Sign in to access your workspace' : 'Create an account to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-gray-50 border-2 border-gray-100 text-black px-5 py-3 rounded-2xl focus:border-brand-blue outline-none font-medium transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border-2 border-gray-100 text-black px-5 py-3 rounded-2xl focus:border-brand-blue outline-none font-medium transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-saas w-full justify-center mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors px-4 py-2"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
