import { Hero } from '@/components/home/Hero'
import { Experience } from '@/components/home/Experience'
import { Why } from '@/components/home/Why'
import { Chivas } from '@/components/home/Chivas'
import { Steps } from '@/components/home/Steps'
import { Stats } from '@/components/home/Stats'
import { Momentos } from '@/components/home/Momentos'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Experience />
      <Why />
      <Chivas />
      <Steps />
      <Stats />
      <Momentos />
    </>
  )
}
