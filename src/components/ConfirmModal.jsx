

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full max-w-sm bg-white rounded-[3rem] border-2 border-gray-100 p-10 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300"
      >
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-brand-red/5 rounded-3xl flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EA5B6F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-black text-black mb-2">{title}</h3>
          <p className="text-gray-400 font-medium mb-10 leading-relaxed px-2">
            {message}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-5 bg-black text-white font-black rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-black/10 hover:bg-brand-red transition-colors"
            >
              Confirm Deletion
            </button>
            <button
              onClick={onCancel}
              className="w-full py-5 bg-gray-50 text-gray-400 hover:text-black font-black rounded-2xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
