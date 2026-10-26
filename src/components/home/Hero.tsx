import { ArrowDownIcon, ArrowUpRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section
      className="relative flex min-h-screen flex-col justify-center gap-8 overflow-hidden bg-[url('/images/hero/hero-1.jpg')] bg-cover bg-center bg-no-repeat px-6 pb-16 pt-32 text-blanco sm:px-10 lg:gap-5 lg:px-[100px] lg:pt-28"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.36)_55%,rgba(0,0,0,0.2)_100%)]" />

      <div className="relative z-10 flex max-w-3xl flex-col gap-5">
        <p className="relative pl-[60px] text-xs font-normal uppercase tracking-[0.12em] text-blanco before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-[30px] before:-translate-y-1/2 before:bg-amarillo">
          Medellín, Colombia
        </p>

        <h1
          id="hero-heading"
          className="font-primary text-[clamp(3rem,8vw,5.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-blanco text-lg"
        >
          La noche
          <br />
          <span className="font-secondary font-normal italic text-amarillo">
            se enciende
          </span>
          <br />
          en Medallo.
        </h1>

        <p className="max-w-[600px] pb-2 text-base font-normal leading-relaxed text-blanco sm:text-base lg:pb-8 lg:text-base">
          La experiencia paisa que convierte cualquier
          <br className="hidden sm:block" /> celebración en una historia para contar.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <Button
          href="#reserva"
          variant="primary"
          size="lg"
          className="w-full rounded-none text-base sm:w-auto"
        >
          Arma tu parche!
          <ArrowUpRightIcon size={18} aria-hidden="true" />
        </Button>
        <Button
          href="#nuestras-chivas"
          variant="secondary"
          size="lg"
          className="w-full rounded-none border-2 border-blanco bg-black/0 text-blanco backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md sm:w-auto"
        >
          Conoce nuestras chivas
          <ArrowDownIcon size={18} aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
