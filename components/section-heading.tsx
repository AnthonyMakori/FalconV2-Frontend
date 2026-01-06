import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface SectionHeadingProps {
  title: string
  description?: string
  viewAllHref?: string
}

export default function SectionHeading({ title, description, viewAllHref }: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>

      {viewAllHref && (
        <Link href={viewAllHref} className="text-sm font-medium text-primary flex items-center mt-2 sm:mt-0">
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  )
}
