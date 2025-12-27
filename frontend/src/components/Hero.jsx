export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[520px] h-[360px]
          bg-[#f59e0b]/12
          rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Context badge */}
        <span
          className="inline-flex items-center mb-8 px-6 py-2
          rounded-full text-[11px] font-semibold tracking-[0.35em] uppercase
          text-[#f59e0b] border border-[#f59e0b]/25 bg-[#f59e0b]/5"
        >
          anonymous messaging
        </span>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl
          font-semibold text-white leading-[1.05] tracking-tight mb-8">
          Say it. Send it.
          <br />
          <span className="text-[#f59e0b]">
            Stay anonymous.
          </span>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-400
          max-w-xl mx-auto mb-12 leading-relaxed">
          ANONIX allows people to send messages without attaching their identity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">

          <a
            href="/register"
            className="w-full sm:w-auto px-10 py-4
              bg-[#f59e0b] text-[#050505]
              rounded-full text-sm font-semibold tracking-wide
              hover:brightness-110 transition
              shadow-lg shadow-[#f59e0b]/25 text-center"
          >
            Register
          </a>

          <a
            href="/login"
            className="w-full sm:w-auto px-10 py-4
              rounded-full text-sm font-semibold tracking-wide
              text-white border border-white/15
              hover:bg-white/5 transition text-center"
          >
            Login
          </a>

        </div>

      </div>
    </section>
  );
}
