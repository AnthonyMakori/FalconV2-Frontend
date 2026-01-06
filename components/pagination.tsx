import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
  query?: string
}

export default function Pagination({ currentPage, totalPages, baseUrl = "", query }: PaginationProps) {
  // Limit total pages to a reasonable number
  const maxPages = Math.min(totalPages, 500)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (maxPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= maxPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range around current page
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(maxPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= maxPages - 2) {
        start = maxPages - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push(-1) // -1 represents ellipsis
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < maxPages - 1) {
        pages.push(-2) // -2 represents ellipsis
      }

      // Always show last page
      pages.push(maxPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // Generate URL for a page
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()

    if (query) {
      params.set("query", query)
    }

    if (page > 1) {
      params.set("page", page.toString())
    }

    const queryString = params.toString()
    return `${baseUrl}${queryString ? `?${queryString}` : ""}`
  }

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <Button variant="outline" size="icon" disabled={currentPage <= 1} asChild={currentPage > 1}>
        {currentPage > 1 ? (
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </span>
        )}
      </Button>

      {pageNumbers.map((pageNumber, index) => {
        // Render ellipsis
        if (pageNumber < 0) {
          return (
            <span key={`ellipsis-${index}`} className="flex items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )
        }

        // Render page number
        return (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="icon"
            asChild={pageNumber !== currentPage}
          >
            {pageNumber !== currentPage ? (
              <Link href={getPageUrl(pageNumber)}>
                <span>{pageNumber}</span>
              </Link>
            ) : (
              <span>{pageNumber}</span>
            )}
          </Button>
        )
      })}

      <Button variant="outline" size="icon" disabled={currentPage >= maxPages} asChild={currentPage < maxPages}>
        {currentPage < maxPages ? (
          <Link href={getPageUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </span>
        )}
      </Button>
    </div>
  )
}
