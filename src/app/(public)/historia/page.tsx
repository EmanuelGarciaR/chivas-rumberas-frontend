import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRightIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Nuestra historia | Chivas Rumberas La 80',
  description:
    'Conoce la historia de La Coqueta (1954) y La Perla (1959), nuestras chivas rumberas con décadas de tradición antioqueña.',
}

interface ChivaStory {
  id: string
  name: string
  year: string
  headline: string
  paragraphs: string[]
  experienceTitle: string
  experienceText: string
  specs: { label: string; value: string }[]
  ctaLabel: string
  whatsappHref: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}

const STORIES: ChivaStory[] = [
  {
    id: 'la-coqueta',
    name: 'La Coqueta',
    year: 'Modelo 1954',
    headline: '70 años de historia que hoy bailan contigo',
    paragraphs: [
      'Nacida en 1954 en las carreteras de San Roque, Antioquia, La Coqueta vivió décadas llevando familias campesinas entre montañas y pueblos, cargando historias, mercados y sueños paisas. Hoy, ese mismo espíritu viajero se viste de fiesta para recorrer Medellín como nunca antes.',
      'Su historia es también la de un sueño cumplido: su propietario la adquirió porque desde niño soñaba con tener una chiva propia. Con amor, tiempo y visión, la transformó pieza por pieza en una experiencia única, conservando su alma campesina, pero añadiéndole todo lo que una noche épica merece.',
    ],
    experienceTitle: '¿Qué te espera adentro?',
    experienceText:
      'Sube a La Coqueta y entra a otro mundo. Sonido profesional que retumba, pista de baile lista para que nadie se quede sentado, luces rítmicas que siguen el beat, cámara de humo para ese momento cinematográfico e inversor para conectar al DJ con su RX y consolas. Aquí no hay límites para la rumba.',
    specs: [
      { label: 'Modelo', value: '1954' },
      { label: 'Origen', value: 'San Roque, Antioquia' },
      { label: 'Capacidad', value: 'Hasta 40 personas' },
      { label: 'Altura interior', value: '1.95 m' },
      { label: 'Sonido', value: 'Sonido profesional + inversor para DJ' },
      { label: 'Pista', value: 'Pista de baile' },
      { label: 'Efectos', value: 'Cámara de humo' },
      { label: 'Iluminación', value: 'Luces rítmicas' },
    ],
    ctaLabel: '¡La Coqueta te está esperando!',
    whatsappHref:
      'https://wa.me/573124797221?text=Hola,%20quiero%20reservar%20La%20Coqueta%20(1954)',
    imageSrc: '/images/chivas/la-coqueta/chiva-1.jpg',
    imageAlt: 'Chiva rumbera La Coqueta modelo 1954',
    reverse: false,
  },
  {
    id: 'la-perla',
    name: 'La Perla',
    year: 'Modelo 1959',
    headline: 'De las veredas de Marinilla al corazón de tu fiesta',
    paragraphs: [
      'Hay vehículos que nacen con alma propia. La Perla es uno de ellos. Desde 1959 recorrió las veredas de Marinilla, Antioquia, siendo testigo de generaciones, cosechas y tardes de pueblo. Luego la vida la llevó a Santa Elena, donde por tres años descansó en una finca de un jardinero silletero, rodeada de flores, sombreros y colores, siendo el telón de fondo perfecto para los recuerdos de quienes la visitaban.',
      'En 2025 llegó a Medellín con una nueva misión: ser el escenario donde tú y los tuyos escriban la mejor noche del año. La Perla no es solo una chiva: es patrimonio vivo de Antioquia que hoy vibra al ritmo de la ciudad.',
    ],
    experienceTitle: '¿Qué te espera adentro?',
    experienceText:
      'La Perla llegó equipada para dar la fiesta más grande. Con capacidad para 50 personas, es perfecta para grupos que quieren vivir la noche en grande. Sonido profesional, inversor para DJ con RX y consolas, pista de baile, luces rítmicas y cámara de humo. Todo listo para que el único trabajo tuyo sea gozar.',
    specs: [
      { label: 'Modelo', value: '1959' },
      { label: 'Origen', value: 'Marinilla, Antioquia' },
      { label: 'Historia', value: 'Finca silletera, Santa Elena' },
      { label: 'Capacidad', value: 'Hasta 50 personas' },
      { label: 'Altura interior', value: '1.90 m' },
      { label: 'Sonido', value: 'Sonido profesional + inversor para DJ' },
      { label: 'Pista', value: 'Pista de baile' },
      { label: 'Efectos', value: 'Cámara de humo y luces rítmicas' },
    ],
    ctaLabel: '¡Súbete a La Perla y vive la noche!',
    whatsappHref:
      'https://wa.me/573124797221?text=Hola,%20quiero%20reservar%20La%20Perla%20(1959)',
    imageSrc: '/images/chivas/la-perla/chiva-6.jpg',
    imageAlt: 'Chiva rumbera La Perla modelo 1959',
    reverse: true,
  },
]

export default function HistoriaPage() {
  return (
    <main className="flex-1 bg-primary px-6 pb-20 pt-32 text-txt-primary sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Intro */}
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="font-primary text-[clamp(2.2rem,4.5vw,3.75rem)] font-light leading-[1.15] tracking-[-0.03em] text-txt-primary">
            Dos chivas. Dos historias.{' '}
            <span className="font-secondary font-bold italic text-rojo">
              Una sola rumba.
            </span>
          </h1>
          <p className="mt-5 font-primary text-base leading-relaxed text-txt-secondary sm:text-lg">
            Cada una con décadas de carreteras antioqueñas en sus ruedas y una
            noche entera de fiesta por delante. Escoge la tuya y déjate llevar.
          </p>
        </header>

        {/* Stories */}
        <div className="mt-16 space-y-20">
          {STORIES.map((story) => (
            <article
              key={story.id}
              id={story.id}
              className="rounded-2xl border border-borde bg-card p-6 sm:p-10"
            >
              <div
                className={`grid items-center gap-8 lg:grid-cols-12 ${
                  story.reverse ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Photo */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-secondary">
                    <Image
                      src={story.imageSrc}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Narrative */}
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-primary text-2xl font-bold text-txt-primary sm:text-3xl">
                      {story.name}
                    </h2>
                    <span className="rounded-full bg-amarillo px-3 py-1 text-xs font-semibold text-negro">
                      {story.year}
                    </span>
                  </div>

                  <p className="mt-2 font-secondary text-lg italic text-rojo">
                    {story.headline}
                  </p>

                  <div className="mt-5 space-y-4 font-primary text-sm leading-relaxed text-txt-secondary sm:text-base">
                    {story.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience & Specs */}
              <div className="mt-8 grid gap-8 border-t border-borde pt-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <h3 className="font-primary text-lg font-bold text-txt-primary">
                    {story.experienceTitle}
                  </h3>
                  <p className="mt-2 font-primary text-sm leading-relaxed text-txt-secondary sm:text-base">
                    {story.experienceText}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <h3 className="font-primary text-sm font-semibold uppercase tracking-wider text-txt-secondary">
                    Ficha técnica
                  </h3>
                  <dl className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {story.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="rounded-lg border border-borde/60 bg-primary/50 px-3.5 py-2.5 text-sm"
                      >
                        <dt className="text-xs text-txt-secondary">{spec.label}</dt>
                        <dd className="mt-0.5 font-medium text-txt-primary">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-borde pt-6">
                <p className="font-secondary text-base font-bold text-txt-primary">
                  {story.ctaLabel}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={story.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amarillo px-5 text-sm font-semibold text-negro transition-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amarillo focus-visible:ring-offset-2"
                  >
                    Reservar por WhatsApp
                    <ArrowUpRightIcon size={16} aria-hidden="true" />
                  </a>
                  <Link
                    href="/#reserva"
                    className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-borde bg-primary px-5 text-sm font-medium text-txt-primary transition-colors hover:border-amarillo hover:text-rojo"
                  >
                    Ir al formulario
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
