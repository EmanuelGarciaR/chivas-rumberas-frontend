'use client'

import { useEffect, useRef, useState } from 'react'

const TARGET_COUNT = 1000
const ANIMATION_DURATION = 1800

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const finishCount = () => setCount(TARGET_COUNT)

    if (prefersReducedMotion) {
      finishCount()
      return
    }

    let frameId: number | undefined
    let startTime: number | undefined

    const animateCount = (timestamp: number) => {
      startTime ??= timestamp
      const progress = Math.min(
        (timestamp - startTime) / ANIMATION_DURATION,
        1,
      )
      const easedProgress = 1 - (1 - progress) ** 3

      setCount(Math.floor(easedProgress * TARGET_COUNT))

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        frameId = requestAnimationFrame(animateCount)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[30vh] w-full flex-col items-center justify-around gap-10 bg-rojo px-6 py-14 sm:px-10 lg:flex-row lg:gap-8 lg:px-20 lg:py-10"
      aria-label="Estadísticas y testimonios"
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <p
          className="w-[6ch] text-center font-primary text-[clamp(2.5rem,5vw,4.5rem)] font-medium tabular-nums leading-none text-crema-calido"
          aria-label="+1.000 parches realizados"
        >
          +{count.toLocaleString('es-CO')}
        </p>
        <p className="font-primary text-base font-normal text-crema-calido">
          Parches realizados
        </p>
      </div>

      <blockquote className="flex max-w-[450px] flex-col items-center justify-center text-center">
        <p className="font-primary text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight text-crema-calido">
          &quot;La mejor forma de conocer{' '}
          <span className="font-secondary italic text-amarillo">
            cómo se goza en Medallo
          </span>
          &quot;
        </p>
      </blockquote>
    </section>
  )
}
