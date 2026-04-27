'use client';

import { useRouter } from 'next/navigation';
import { Heart, Users, CalendarDays, TrendingUp, Target, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF5F3] to-white">

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF9B8F] to-[#E87B6F] rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="text-[#2C3E50] font-bold text-xl">Smart Mom</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 text-[#64748B] font-semibold text-sm border-2 border-[#E2E8F0] rounded-lg hover:border-[#FF9B8F] hover:text-[#FF9B8F] transition-all"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register/advisor')}
            className="px-5 py-2.5 bg-[#FF9B8F] text-white font-semibold text-sm rounded-lg hover:bg-[#E87B6F] transition-all"
          >
            Join as Advisor
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#F0F9F5] border border-[#8BA888]/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-[#8BA888] rounded-full"></span>
          <span className="text-[#64748B] text-sm font-medium">Trusted by families nationwide</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-bold text-[#2C3E50] leading-tight mb-6">
          Raise Smarter.<br />
          <span className="text-[#FF9B8F]">
            Live Better.
          </span>
        </h1>

        <p className="text-[#64748B] text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Smart Mom connects working parents with certified healthcare advisors, delivering personalized nutrition plans, growth tracking, and expert guidance — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 bg-[#FF9B8F] text-white font-semibold text-base rounded-lg hover:bg-[#E87B6F] transition-all inline-flex items-center justify-center gap-2"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={() => router.push('/register/advisor')}
            className="px-8 py-4 bg-white border-2 border-[#E2E8F0] text-[#64748B] font-semibold text-base rounded-lg hover:border-[#FF9B8F] hover:text-[#FF9B8F] transition-all"
          >
            Join as Advisor
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-12 mt-20">
          {[
            { value: '500+', label: 'Active Families' },
            { value: '50+', label: 'Certified Advisors' },
            { value: '24/7', label: 'Support Available' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-[#2C3E50]">{value}</p>
              <p className="text-[#94A3B8] text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2C3E50] mb-3">Everything you need to support your child's growth</h2>
          <p className="text-[#64748B] text-base max-w-2xl mx-auto">Comprehensive platform designed to help working mothers stay connected with their child's development journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Heart,
              title: 'Health Tracking',
              desc: "Monitor your child's growth, nutrition, and health milestones with expert guidance.",
              color: '#FF9B8F',
            },
            {
              icon: Users,
              title: 'Professional Support',
              desc: 'Connect with certified healthcare advisors for personalized recommendations.',
              color: '#8BA888',
            },
            {
              icon: CalendarDays,
              title: 'Easy Scheduling',
              desc: 'Book appointments with healthcare professionals at your convenience.',
              color: '#6BB6CC',
            },
            {
              icon: TrendingUp,
              title: 'Progress Analytics',
              desc: "View detailed reports and charts to track your child's development over time.",
              color: '#64748B',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="group bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg hover:border-[#FF9B8F]/30 transition-all duration-300">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} strokeWidth={2} />
              </div>
              <h3 className="text-[#2C3E50] font-semibold text-base mb-2">{title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vision / Mission Section */}
      <div className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2C3E50] mb-3">Our Foundation</h2>
          <p className="text-[#64748B] text-base">The values that drive everything we do</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vision */}
          <div className="bg-gradient-to-br from-[#F0F9FC] to-white border border-[#6BB6CC]/20 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#6BB6CC] rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-[#2C3E50] font-bold text-xl">Vision</h3>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed">
              To become the leading digital platform empowering every working mother with the knowledge, tools, and professional support needed to raise healthy, happy children.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-[#F0F9F5] to-white border border-[#8BA888]/20 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#8BA888] rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-[#2C3E50] font-bold text-xl">Mission</h3>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed">
              To provide accessible, personalized child health and nutrition management by connecting parents with certified advisors through smart meal planning and real-time growth tracking.
            </p>
          </div>

          {/* Motto */}
          <div className="bg-gradient-to-br from-[#FFF5F3] to-white border-2 border-[#FF9B8F]/30 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FF9B8F] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-[#2C3E50] font-bold text-xl">Motto</h3>
            </div>
            <p className="text-[#2C3E50] font-semibold text-base mb-3 italic">
              "Nurture Smart. Grow Strong. Balance Life."
            </p>
            <p className="text-[#64748B] text-sm leading-relaxed">
              We believe that a thriving child begins with an empowered mother.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#2C3E50] to-[#3d5368] rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-2xl mb-2">Ready to get started?</h3>
            <p className="text-white/80 text-base">Join thousands of families already using Smart Mom.</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="flex-shrink-0 px-8 py-4 bg-[#FF9B8F] text-white font-semibold rounded-lg hover:bg-[#E87B6F] transition-all inline-flex items-center gap-2"
          >
            Create Free Account
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8 text-[#94A3B8] text-sm border-t border-[#E2E8F0] pt-8">
        © 2025 Smart Mom. Empowering Families, One Child at a Time.
      </div>
    </div>
  );
}
