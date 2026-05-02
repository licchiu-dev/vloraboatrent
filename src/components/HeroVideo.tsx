interface HeroVideoProps {
  title: React.ReactNode
  subtitle: string
  ctaText?: string
  ctaScrollTo?: string
}

export default function HeroVideo({
  title,
  subtitle,
  ctaText = 'Prenota ora',
  ctaScrollTo = 'prenota',
}: HeroVideoProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0A3D62 0%, #1678C2 30%, #00B4D8 60%, #48CAE4 80%, #90E0EF 100%)',
      }}
    >
      {/*
        TODO: Sostituire il gradiente con un video reale.
        Aggiungere il file video in /public/videos/hero.mp4 e decommentare:

        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-ocean-deep/30 to-transparent" />
      */}

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 70%, rgba(0,180,216,0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(10,61,98,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 pb-20">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white px-5 py-2 rounded-full text-sm font-semibold mb-8 tracking-wide">
          🌊 Esperienze di mare autentiche
        </div>

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

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/45 text-xs uppercase tracking-widest">
          <span>Scorri</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-bounce" />
        </div>
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
