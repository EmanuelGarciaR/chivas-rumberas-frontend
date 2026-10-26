const reasons = [
  {
    number: '01',
    title: (
      <>
        Todo listo
        <br />
        para la experiencia
      </>
    ),
    description:
      'Nosotros ponemos la música, las luces y el ambiente. Tú pones la actitud.',
  },
  {
    number: '02',
    title: (
      <>
        Rutas con
        <br />
        sabor local
      </>
    ),
    description: 'Recorre los lugares que hacen de Medellín un lugar único.',
  },
  {
    number: '03',
    title: (
      <>
        Seguridad
        <br />
        sin pensarla
      </>
    ),
    description:
      'Conductores profesionales y un equipo pendiente de ti durante todo el recorrido.',
  },
]

export function Why() {
  return (
    <section
      id="nosotros"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-secondary px-6 py-20 sm:px-10 lg:gap-10 lg:px-20 lg:py-24"
      aria-labelledby="why-heading"
    >
      <h2
        id="why-heading"
        className="w-full font-primary text-base font-normal uppercase tracking-[0.08em] text-rojo"
      >
        ¿Por qué nosotros?
      </h2>

      <div className="relative flex w-full flex-col justify-center gap-10 after:absolute after:bottom-[-1.5rem] after:left-1/2 after:h-0.5 after:w-full after:-translate-x-1/2 after:bg-rojo lg:flex-row lg:gap-10">
        {reasons.map((reason) => (
          <article
            key={reason.number}
            className="flex flex-1 flex-col gap-3 border-b border-rojo/20 pb-8 last:border-b-0 lg:gap-4 lg:border-b-0 lg:pb-0"
          >
            <p className="font-primary text-md text-rojo">{reason.number}</p>
            <h3 className="font-primary text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight text-txt-primary">
              {reason.title}
            </h3>
            <p className="max-w-[250px] font-primary text-base font-normal leading-relaxed text-txt-primary">
              {reason.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
