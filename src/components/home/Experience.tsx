import Link from 'next/link'
import { ArrowUpRightIcon } from '@/components/icons'

export function Experience() {
  return (
    <section
      id="la-experiencia"
      className="flex min-h-screen w-full flex-col justify-center gap-12 bg-primary px-6 py-20 sm:px-10 lg:flex-row lg:items-center lg:justify-start lg:gap-28 lg:px-[200px] lg:py-24"
      aria-labelledby="experience-heading"
    >
      <div className="flex w-full max-w-[600px] flex-col gap-5 lg:w-[45%]">
        <h2
          id="experience-heading"
          className="font-primary text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.25] tracking-[-0.03em] text-txt-primary"
        >
          Una chiva no es
          <br />
          un vehículo.
          <br />
          <span className="font-secondary bold italic text-rojo">Es tradición.</span>
        </h2>
      </div>

      <div className="flex w-full max-w-[500px] flex-col items-start justify-center gap-5 lg:w-[45%]">
        <p className="max-w-[400px] font-primary text-lg font-normal leading-relaxed text-txt-primary sm:text-xl">
          Subite a una experiencia que solo puede pasar en Medellín. Música,
          luces, amigos y esa energía que no se explica: se vive.
        </p>

        <p className="max-w-[400px] font-primary text-base font-normal leading-relaxed text-txt-secondary">
          Diseñamos cada recorrido para que tú solo tengas que preocuparte por
          una cosa: disfrutarlo.
        </p>

        <Link
          href="/historia"
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-8 inline-flex items-center gap-[15px] font-primary text-base text-rojo no-underline transition-all duration-300 hover:-translate-y-0.5 hover:opacity-80 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-rojo"
        >
          Conoce nuestra historia
          <ArrowUpRightIcon size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
