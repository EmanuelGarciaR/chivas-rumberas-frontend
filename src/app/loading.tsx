export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <section className="flex min-h-[70vh] flex-col justify-center gap-8 px-6 py-24 sm:px-10 lg:px-20">
        <div className="h-4 w-40 animate-pulse rounded bg-amarillo/40" />
        <div className="space-y-3">
          <div className="h-12 w-full max-w-xl animate-pulse rounded bg-card" />
          <div className="h-12 w-4/5 max-w-lg animate-pulse rounded bg-amarillo/40" />
        </div>
        <div className="h-5 w-full max-w-md animate-pulse rounded bg-secondary" />
        <div className="h-12 w-44 animate-pulse rounded-lg bg-rojo/40" />
      </section>

      <section className="space-y-8 bg-secondary px-6 py-20 sm:px-10 lg:px-20">
        <div className="h-4 w-36 animate-pulse rounded bg-rojo/40" />
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-2xl bg-card p-6"
            >
              <div className="h-5 w-10 animate-pulse rounded bg-rojo/40" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-primary" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 bg-rojo px-6 py-14 sm:px-10 lg:flex-row lg:items-center lg:justify-around lg:px-20">
        <div className="mx-auto h-16 w-40 animate-pulse rounded bg-crema-calido/40 lg:mx-0" />
        <div className="mx-auto h-8 w-full max-w-md animate-pulse rounded bg-amarillo/50 lg:mx-0" />
      </section>
    </div>
  )
}
