'use client'

import { useEffect, useState } from "react"
import { apiFetch } from "@/utils/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Trash } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type EventType = {
  id: number
  name: string
  location: string
  date: string
  type: string
  status: string
  price: string | number
  description?: string | null
  poster?: string | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState<{
    name: string
    location: string
    date: string
    type: string
    status: string
    price: string
    description: string
    poster: File | null
  }>({
    name: "",
    location: "",
    date: "",
    type: "",
    status: "Upcoming",
    price: "",
    description: "",
    poster: null,
  })

  // Load events on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/auth/signin"
      return
    }
    loadEvents()
  }, [])

    const loadEvents = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await apiFetch(`${API_URL}/events`)
        setEvents(res?.data || [])
      } catch (err: any) {
        setError(err?.message || "Failed to load events")
      } finally {
        setLoading(false)
      }
    }


  const saveEvent = async () => {
    if (!form.name || !form.location || !form.date || !form.type || !form.price) {
      setError("Please fill all required fields")
      return
    }

    setLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("location", form.location)
      formData.append("date", form.date)
      formData.append("type", form.type)
      formData.append("status", form.status)
      formData.append("price", form.price)
      formData.append("description", form.description)
      if (form.poster) formData.append("poster", form.poster)

      await apiFetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      // Reset form
      setForm({ name: "", location: "", date: "", type: "", status: "Upcoming", price: "", description: "", poster: null })

      const fileInput = document.querySelector<HTMLInputElement>("input[type='file']")
      if (fileInput) fileInput.value = ""

      setOpen(false)
      loadEvents()
    } catch (err: any) {
      setError(err?.message || "Failed to save event")
      console.error("API Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    setLoading(true)
    setError("")
    try {
      await apiFetch(`${API_URL}/events/${id}`, { method: "DELETE" })
      loadEvents()
    } catch (err: any) {
      setError(err?.message || "Failed to delete event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Events Management</CardTitle>
          <CardDescription>Manage all events</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poster</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : events?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {event.poster && (
                        <img
                          src={event.poster}
                          alt={event.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{event.status}</TableCell>
                    <TableCell>{event.price}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Event Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
            <Input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <Input
              placeholder="Type (Festival, Workshop…)"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-md px-3 py-2 text-sm"
              onChange={e => setForm({ ...form, poster: e.target.files?.[0] || null })}
            />
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <DialogFooter>
            <Button onClick={saveEvent} disabled={loading}>
              {loading ? "Saving..." : "Save Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
