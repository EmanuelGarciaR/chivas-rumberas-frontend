'use client'

import Image from 'next/image'

function createChivas(folder: 'la-coqueta' | 'la-perla', numbers: number[]) {
  return numbers.map((number) => ({
    id: `${folder}-chiva-${number}`,
    image: `/images/chivas/${folder}/chiva-${number}.jpg`,
  }))
}

const coqueta = createChivas('la-coqueta', [1, 2, 3, 4, 7, 9, 17])
const perla = createChivas('la-perla', [6, 8, 10, 11, 12, 13, 14, 15, 16])

interface ChivaCarouselProps {
  name: string
  items: typeof coqueta | typeof perla
  animation: 'animate-chivas-right' | 'animate-chivas-left'
}

function ChivaCarousel({ name, items, animation }: ChivaCarouselProps) {
  const duplicatedItems = [...items, ...items]

  return (
    <figure className="overflow-hidden" aria-label={`Carrusel de ${name}`}>
      <figcaption className="mb-4 font-primary text-sm uppercase tracking-[0.08em] text-amarillo">
        {name}
      </figcaption>
      <div className="overflow-hidden">
        <div
          className={`flex w-max gap-5 ${animation}`}
          role="list"
          aria-label={`Imágenes de ${name}`}
        >
          {duplicatedItems.map((chiva, index) => (
            <article
              key={`${chiva.id}-${index}`}
              className="group w-[78vw] max-w-[420px] overflow-hidden bg-[var(--color-marron-oscuro)] sm:w-[42vw] lg:w-[28vw]"
              role="listitem"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={chiva.image}
                  alt={`Imagen de ${name}`}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 28vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </figure>
  )
}

export function Chivas() {
  return (
    <section
      id="nuestras-chivas"
      className="w-full overflow-hidden bg-[var(--color-negro-profundo)] px-6 py-20 text-blanco sm:px-10 lg:px-20 lg:py-24"
      aria-labelledby="chivas-title"
    >
      <p className="font-primary text-base uppercase tracking-[0.08em] text-amarillo">
        Nuestras chivas
      </p>

      <header className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <h2
          id="chivas-title"
          className="font-primary text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-blanco"
        >
          Tu chiva,
          <br />
          <span className="font-secondary italic text-amarillo">tu parche</span>
        </h2>
        <p className="max-w-[500px] font-primary text-base leading-relaxed text-blanco/90">
          Desde un parche conociendo lugares hermosos de la ciudad, hasta la
          fiesta del año. Tenemos la chiva que necesitas para disfrutar como nunca antes.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-10">
        <ChivaCarousel
          name="La Coqueta"
          items={coqueta}
          animation="animate-chivas-right"
        />
        <ChivaCarousel
          name="La Perla"
          items={perla}
          animation="animate-chivas-left"
        />
      </div>
    </section>
  )
}
