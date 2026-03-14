'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤱</span>
          <span className="text-white font-extrabold text-xl tracking-tight">Smart Mom</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2 text-white font-semibold text-sm border border-white/30 rounded-xl hover:bg-white/10 transition-all"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register/advisor')}
            className="px-5 py-2 bg-white text-purple-800 font-bold text-sm rounded-xl hover:bg-purple-50 active:scale-95 transition-all shadow-lg"
          >
            Join as Advisor
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-purple-200 text-xs font-medium">Trusted by families across the nation</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Raise Smarter.<br />
          <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Live Better.
          </span>
        </h1>

        <p className="text-purple-200 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Smart Mom connects working parents with certified healthcare advisors, delivering personalized nutrition plans, growth tracking, and expert guidance — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 bg-white text-purple-800 font-bold text-base rounded-2xl shadow-2xl hover:bg-purple-50 active:scale-95 transition-all"
          >
            Get Started Free →
          </button>
          <button
            onClick={() => router.push('/register/advisor')}
            className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-base rounded-2xl hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
          >
            Join as Advisor
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {[
            { value: '500+', label: 'Active Families' },
            { value: '50+', label: 'Certified Advisors' },
            { value: '4', label: 'Nutrition Age Groups' },
            { value: '3', label: 'Meal Plan Types' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-white">{value}</p>
              <p className="text-purple-300 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vision / Mission / Motto */}
      <div className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-2">Our Foundation</h2>
          <p className="text-purple-300 text-sm">The values that drive everything we do</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Vision */}
          <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0">
                  🔭
                </div>
                <h3 className="text-white font-extrabold text-xl">Vision</h3>
              </div>
              <p className="text-purple-200 text-sm leading-relaxed">
                To become the leading digital platform empowering every working mother with the knowledge, tools, and professional support needed to raise healthy, happy children.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0">
                  🎯
                </div>
                <h3 className="text-white font-extrabold text-xl">Mission</h3>
              </div>
              <p className="text-purple-200 text-sm leading-relaxed">
                To provide accessible, personalized child health and nutrition management by connecting parents with certified advisors through smart meal planning and real-time growth tracking.
              </p>
            </div>
          </div>

          {/* Motto */}
          <div className="group relative bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-400/30 rounded-3xl p-8 hover:from-purple-500/40 hover:to-pink-500/30 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0">
                  💜
                </div>
                <h3 className="text-white font-extrabold text-xl">Motto</h3>
              </div>
              <p className="text-white font-bold text-base italic leading-relaxed mb-3">
                "Nurture Smart. Grow Strong. Balance Life."
              </p>
              <p className="text-purple-200 text-sm leading-relaxed">
                We believe that a thriving child begins with an empowered mother.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-white/10 to-white/5 border border-white/15 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm">
          <div>
            <h3 className="text-white font-extrabold text-xl mb-1">Ready to get started?</h3>
            <p className="text-purple-300 text-sm">Join thousands of families already using Smart Mom.</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="flex-shrink-0 px-8 py-3.5 bg-white text-purple-800 font-bold rounded-2xl hover:bg-purple-50 active:scale-95 transition-all shadow-xl text-sm"
          >
            Create Free Account →
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8 text-purple-500 text-xs">
        © 2025 Smart Mom Balancing System. Empowering Families, One Child at a Time.
      </div>

    </div>
  );
}
