'use client'

import { useEffect, useRef } from 'react'

interface HeroVideoProps {
  title: React.ReactNode
  subtitle: string
  ctaText?: string
  ctaScrollTo?: string
  videoSrc?: string
}

export default function HeroVideo({
  title,
  subtitle,
  ctaText = 'Prenota ora',
  ctaScrollTo = 'prenota',
  videoSrc = '/videos/hero.mp4',
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.play().catch(() => {
      // Some mobile browsers block autoplay in low-power or data-saving modes.
    })
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0A3D62 0%, #1678C2 30%, #00B4D8 60%, #48CAE4 80%, #90E0EF 100%)',
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => videoRef.current?.play().catch(() => undefined)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-ocean-deep/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/35 via-transparent to-ocean-deep/30" />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 70%, rgba(0,180,216,0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(10,61,98,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 pb-20">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10 leading-relaxed font-light">
          {subtitle}
        </p>

        <a
          href={`#${ctaScrollTo}`}
          className="inline-block bg-sand hover:bg-sand-dark text-ocean-deep font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sand/40"
        >
          {ctaText}
        </a>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="w-full h-14 md:h-18"
        >
          <path d="M0,36 C360,72 1080,0 1440,36 L1440,72 L0,72 Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
