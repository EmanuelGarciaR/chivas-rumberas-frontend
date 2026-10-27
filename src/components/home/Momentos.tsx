export function Momentos() {
  return (
    <section
      id="momentos"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 overflow-hidden px-6 py-20 sm:px-10 lg:gap-10 lg:px-20 lg:py-24"
      aria-labelledby="momentos-title"
    >
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/videos/video-chiva-ia.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      <div
        className="absolute inset-0 bg-[rgba(8,5,3,0.65)]"
        aria-hidden="true"
      />

      <p className="relative z-10 font-primary text-base uppercase tracking-[0.08em] text-amarillo">
        Así se viven nuestras chivas
      </p>

      <header className="relative z-10 flex w-full flex-col items-center justify-center gap-8 text-center">
        <h2
          id="momentos-title"
          className="font-primary text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.03em] text-crema-calido"
        >
          Momentos que son
          <br />
          <span className="font-secondary italic text-amarillo">
            inolvidables
          </span>
        </h2>

        <a
          href="https://www.instagram.com/emanuelgarcia.r"
          target="_blank"
          rel="noopener noreferrer"
          className="relative font-primary text-base text-amarillo no-underline transition-all duration-300 hover:-translate-y-0.5 hover:opacity-80 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-amarillo"
        >
          @chivasrumberasla80
        </a>
      </header>
    </section>
  )
}
