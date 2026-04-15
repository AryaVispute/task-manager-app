import { useState } from 'react'

const NamePromptModal = ({ onSave, onCancel, initialEmail }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await onSave(name)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white border-[3px] border-gray-100 rounded-[3rem] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.2)] p-10 animate-in zoom-in-95 duration-500 relative">
        
        {/* Close Icon */}
        <button 
          onClick={onCancel}
          className="absolute top-8 right-8 p-3 text-gray-300 hover:text-brand-red transition-colors rounded-2xl hover:bg-brand-red/5"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
             <span className="text-4xl">👋</span>
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight mb-3">Update your name</h2>
          <p className="text-gray-400 font-semibold leading-relaxed px-2">
            This name will be used across the app for greetings and identifies your tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Preferred Name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Arya"
              className="w-full bg-gray-50 border-2 border-gray-100 text-black px-6 py-4 rounded-2xl focus:border-brand-blue outline-none font-bold transition-all text-lg placeholder:text-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-50 text-gray-400 font-bold py-4 rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="btn-saas flex-[2] justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Save Changes
                  <svg className="ml-2 group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


export default NamePromptModal
