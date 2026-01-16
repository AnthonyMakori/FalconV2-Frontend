"use client"

import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function useDashboardData() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [events, setEvents] = useState<any[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  const [purchases, setPurchases] = useState<any[]>([])
  const [purchasesLoading, setPurchasesLoading] = useState(true)

  const [totalSpent, setTotalSpent] = useState<number>(0)

  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [continueWatching, setContinueWatching] = useState<any[]>([])
  const [watchlist, setWatchlist] = useState<any[]>([])

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/me`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/events`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/purchases`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/purchases/summary`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/watch-history`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/watch-progress/continue`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/watchlist`, { headers }).then(r => r.json()),
    ])
      .then(([u, e, p, s, h, c, w]) => {
        setUser(u ?? null)
        setEvents(Array.isArray(e) ? e : [])
        setPurchases(Array.isArray(p) ? p : [])
        setTotalSpent(Number(s?.total_spent ?? 0))
        setWatchHistory(Array.isArray(h) ? h : [])
        setContinueWatching(Array.isArray(c) ? c : [])
        setWatchlist(Array.isArray(w) ? w : [])
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
        setEventsLoading(false)
        setPurchasesLoading(false)
      })
  }, [])

  return {
    user,
    loading,
    events,
    eventsLoading,
    purchases,
    purchasesLoading,
    totalSpent,
    watchHistory,
    continueWatching,
    watchlist,
  }
}
