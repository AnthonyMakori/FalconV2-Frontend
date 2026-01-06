// Performance optimization utilities
class PerformanceService {
  private imageCache = new Map<string, HTMLImageElement>()
  private prefetchQueue = new Set<string>()

  // Preload images for better performance
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.imageCache.has(src)) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        this.imageCache.set(src, img)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  // Preload multiple images
  async preloadImages(srcs: string[]): Promise<void> {
    const promises = srcs.map((src) => this.preloadImage(src))
    await Promise.allSettled(promises)
  }

  // Lazy load images with intersection observer
  setupLazyLoading(): void {
    if (typeof window === "undefined") return

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          if (src) {
            img.src = src
            img.classList.remove("lazy")
            imageObserver.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }

  // Prefetch critical resources
  prefetchCriticalResources(): void {
    if (typeof window === "undefined") return

    // Prefetch critical API endpoints
    const criticalEndpoints = ["/api/movies/trending", "/api/movies/popular", "/api/genres"]

    criticalEndpoints.forEach((endpoint) => {
      if (!this.prefetchQueue.has(endpoint)) {
        this.prefetchQueue.add(endpoint)
        // Use link prefetch
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = endpoint
        document.head.appendChild(link)
      }
    })
  }

  // Debounce function for search and other frequent operations
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  // Throttle function for scroll events
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // Measure and log performance metrics
  measurePerformance(name: string, fn: () => void): void {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
  }

  // Get performance insights
  getPerformanceInsights(): {
    cacheSize: number
    prefetchQueueSize: number
    memoryUsage?: any
  } {
    return {
      cacheSize: this.imageCache.size,
      prefetchQueueSize: this.prefetchQueue.size,
      memoryUsage: (performance as any).memory || null,
    }
  }
}

export const performanceService = new PerformanceService()

// Initialize performance optimizations
if (typeof window !== "undefined") {
  // Setup lazy loading when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      performanceService.setupLazyLoading()
      performanceService.prefetchCriticalResources()
    })
  } else {
    performanceService.setupLazyLoading()
    performanceService.prefetchCriticalResources()
  }
}
