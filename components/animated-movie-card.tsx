"use client"

import { motion } from "framer-motion"
import MovieCard from "./movie-card"

interface AnimatedMovieCardProps {
  movie: any
  index: number
  className?: string
}

export default function AnimatedMovieCard({ movie, index, className }: AnimatedMovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <MovieCard movie={movie} className={className} />
    </motion.div>
  )
}
