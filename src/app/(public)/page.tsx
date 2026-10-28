import { Hero } from '@/components/home/Hero'
import { Experience } from '@/components/home/Experience'
import { Why } from '@/components/home/Why'
import { Chivas } from '@/components/home/Chivas'
import { Steps } from '@/components/home/Steps'
import { Stats } from '@/components/home/Stats'
import { Momentos } from '@/components/home/Momentos'
import { BookingSection } from '@/components/booking/BookingSection'
import { getChivas } from '@/lib/api/chivas'
import { getTravels } from '@/lib/api/travels'
import type { ChivaListItem, Travel } from '@/lib/types'

export default async function HomePage() {
  let chivas: ChivaListItem[] = []
  let travels: Travel[] = []
  let loadError: string | undefined

  try {
    const result = await Promise.all([
      getChivas('available'),
      getTravels(),
    ])
    chivas = result[0]
    travels = result[1]
  } catch (error: unknown) {
    console.error('Error loading booking options:', error)
    loadError =
      error instanceof Error
        ? error.message
        : 'No fue posible cargar las opciones de reserva.'
  }

  return (
    <>
      <Hero />
      <Experience />
      <Why />
      <Chivas />
      <Steps />
      <Stats />
      <BookingSection chivas={chivas} travels={travels} loadError={loadError} />
      <Momentos />
    </>
  )
}
