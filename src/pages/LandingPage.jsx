
const LandingPage = ({ stage, onStart }) => {
  // Splash Stage: White background with small centered spinner
  if (stage === 'splash') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="spinner scale-75"></div>
      </div>
    )
  }

  // Landing Stage: Refined Header + SaaS Button
  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Diagonal Cross Grid Background - Top Weighted */}
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

      <div className="relative z-10 text-center max-w-4xl px-6 animate-in slide-in-from-bottom-12 duration-1000">
        
        {/* Main Heading - 2 Lines & Reduced Size */}
        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-4 leading-tight">
          <span>Meet </span>
          <span className="relative inline-block px-8 py-2 mx-0.5">
            <span className="absolute inset-0 bg-brand-red/10 rounded-2xl blur-xl scale-110"></span>
            <span className="relative bg-brand-red/5 border-2 border-brand-red/20 text-brand-red px-8 py-2 rounded-2xl shadow-lg shadow-brand-red/5">
              FlowDo
            </span>
          </span>
          <br />
          <span>your go-to task manager.</span>
        </h1>

        {/* Tagline - Small Dark Grey Italics */}
        <p className="text-gray-600 text-sm md:text-base font-medium max-w-lg mx-auto mb-10 italic leading-relaxed">
          &ldquo;Turn your daily chaos into clarity—FlowDo helps you plan, track, and complete tasks with focus and ease.&rdquo;
        </p>

        {/* New SaaS Button */}
        <button
          onClick={onStart}
          className="btn-saas"
        >
          Get Started
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14m-7-7 7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default LandingPage
