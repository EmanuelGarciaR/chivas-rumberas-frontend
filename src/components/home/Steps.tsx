const steps = [
  {
    number: '01',
    title: 'Elige',
    description: 'Cuéntanos qué día quieres celebrar y cuántos son.',
  },
  {
    number: '02',
    title: 'Reserva',
    description:
      'Separamos tu fecha y armamos el recorrido perfecto para ti.',
  },
  {
    number: '03',
    title: 'Disfruta',
    description:
      'Disfruta de tu parche inolvidable con tu familia y grupo de amigos.',
  },
]

export function Steps() {
  return (
    <section
      id="como-funciona"
      className="flex min-h-screen w-full flex-col items-start justify-center gap-8 bg-primary px-6 py-20 sm:px-10 lg:gap-10 lg:px-20 lg:py-24"
      aria-labelledby="steps-title"
    >
      <p className="font-primary text-base uppercase tracking-[0.08em] text-rojo">
        ¡Es así de fácil!
      </p>

      <div className="flex w-full flex-col items-start justify-between gap-12 lg:flex-row lg:items-center lg:gap-10">
        <header className="w-full lg:w-[45%]">
          <h2
            id="steps-title"
            className="font-primary text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] tracking-[-0.03em] text-txt-primary"
          >
            De idea a
            <br />
            <span className="font-secondary italic text-rojo">
              parche inolvidable.
            </span>
          </h2>
        </header>

        <ol className="flex w-full max-w-[650px] list-none flex-col gap-8 p-0 lg:w-[55%] lg:gap-7">
          {steps.map((step) => (
            <li
              key={step.number}
              className="grid w-full grid-cols-[40px_1fr] items-start gap-x-4 gap-y-2  sm:grid-cols-[40px_180px_1fr] sm:items-center sm:gap-y-0 sm:pb-0"
            >
              <span
                className="row-span-2 font-primary font-bold text-rojo sm:row-span-1"
                aria-hidden="true"
              >
                {step.number}
              </span>
              <h3 className="font-primary text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight text-txt-primary">
                {step.title}
              </h3>
              <p className="col-start-2 font-primary text-base leading-relaxed text-txt-primary sm:col-start-auto">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
