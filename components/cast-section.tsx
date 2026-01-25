interface Cast {
  id: number
  name: string
}

interface Props {
  casts: Cast[]
}

export default function CastSection({ casts }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Cast</h2>

      <div className="flex flex-wrap gap-3">
        {casts.map((cast) => (
          <span
            key={cast.id}
            className="rounded-full bg-neutral-800 px-4 py-1 text-sm"
          >
            {cast.name}
          </span>
        ))}
      </div>
    </section>
  )
}
