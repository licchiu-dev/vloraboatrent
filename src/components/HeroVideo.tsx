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
        className="absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] object-cover blur-sm scale-105"
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
      <div className="absolute inset-0 bg-ocean-deep/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#041827]/90 via-[#0A3D62]/70 to-[#02070C]/85" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 160 160%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.75%27/%3E%3C/svg%3E")',
        }}
      />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(0,180,216,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(10,61,98,0.35) 0%, transparent 70%)',
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
