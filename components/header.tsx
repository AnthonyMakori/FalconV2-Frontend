"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { Search, Menu, ChevronDown, User, Heart, Bookmark, LogOut, BarChart3, Sparkles, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { getGenres } from "@/lib/tmdb"
import { CynthiaMoviesLogo } from "@/components/cynthia-logo"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres()
        setGenres(genresData)
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/trending", label: "Trending" },
    { href: "/popular", label: "Popular" },
    { href: "/top-rated", label: "Top Rated" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-lg border-b shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="relative h-10 w-10 overflow-hidden">
                <Image src="/images/falcon-eye-philmz-logo.png" alt="Falcon Eye Philmz" fill className="object-contain" />
              </div>
              <span className="text-primary font-bold text-xl">Falcon Eye Philmz</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary group",
                  pathname === item.href ? "text-primary" : "text-foreground/80",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            ))}

            {/* Categories Dropdown */}
            <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-foreground/80 hover:text-primary p-0 h-auto"
                >
                  Categories
                  <ChevronDown
                    className={cn("ml-1 h-4 w-4 transition-transform duration-200", isCategoriesOpen && "rotate-180")}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 max-h-[70vh] overflow-y-auto" sideOffset={8}>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {genres.map((genre) => (
                    <DropdownMenuItem key={genre.id} asChild>
                      <Link
                        href={`/categories/${genre.id}`}
                        className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium">{genre.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/search">
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </Link>
            </motion.div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                  <div className="flex items-center justify-start gap-2 p-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && <p className="font-medium text-sm">{session.user.name}</p>}
                      {session.user?.email && (
                        <p className="w-[180px] truncate text-xs text-muted-foreground">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recommendations" className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Recommended
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watchlist" className="flex items-center">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Watchlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/analytics" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <MobileNavigation
                  navItems={navItems}
                  genres={genres}
                  pathname={pathname}
                  session={session}
                  onClose={() => setIsMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

function MobileNavigation({
  navItems,
  genres,
  pathname,
  session,
  onClose,
}: {
  navItems: { href: string; label: string }[]
  genres: { id: number; name: string }[]
  pathname: string
  session: any
  onClose: () => void
}) {
  const [showCategories, setShowCategories] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center space-x-2">
          <CynthiaMoviesLogo className="h-6 w-6" />
          <span className="font-bold text-lg">Movies</span>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:bg-accent hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}

        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => setShowCategories(!showCategories)}
            className="w-full justify-between px-4 py-3 h-auto text-sm font-medium"
          >
            Categories
            <ChevronDown className={cn("h-4 w-4 transition-transform", showCategories && "rotate-180")} />
          </Button>

          <AnimatePresence>
            {showCategories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-1 px-2 py-2 max-h-60 overflow-y-auto">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/categories/${genre.id}`}
                      onClick={onClose}
                      className="flex items-center px-3 py-2 text-xs font-medium rounded-md hover:bg-accent transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {session && (
        <div className="border-t pt-4 space-y-2">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <User className="mr-3 h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/recommendations"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <Sparkles className="mr-3 h-4 w-4" />
            Recommended
          </Link>
          <Link
            href="/favorites"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <Heart className="mr-3 h-4 w-4" />
            Favorites
          </Link>
          <Link
            href="/watchlist"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <Bookmark className="mr-3 h-4 w-4" />
            Watchlist
          </Link>
          <Link
            href="/analytics"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <BarChart3 className="mr-3 h-4 w-4" />
            Analytics
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              signOut()
              onClose()
            }}
            className="w-full justify-start px-4 py-3 h-auto text-sm font-medium text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Log out
          </Button>
        </div>
      )}
    </div>
  )
}
