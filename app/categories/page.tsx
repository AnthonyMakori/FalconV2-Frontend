import CategoriesClientPage from "./CategoriesClientPage"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export const metadata = {
  title: "Movie Categories - Cynthia Movies",
  description: "Browse movies by genre and category",
}

export default function CategoriesPage() {
  return (
    <>
      <ScrollToTopOnMount />
      <CategoriesClientPage />
    </>
  )
}
