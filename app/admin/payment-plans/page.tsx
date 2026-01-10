'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Plus, MoreHorizontal, Trash, ToggleLeft, ToggleRight
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL!

/* -------------------- TYPES -------------------- */
interface PaymentPlan {
  id: number
  name: string
  price: number
  currency: string
  duration: string
  features: string
  is_active: boolean
}

interface PaymentMethod {
  id: number
  name: string
  description: string
  is_active: boolean
}

/* -------------------- HELPERS -------------------- */
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
})

/* -------------------- PAGE -------------------- */
export default function PaymentPlansPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
  })

  /* ---------------- FETCH DATA ---------------- */
  const fetchPlans = async () => {
    const res = await fetch(`${API}/admin/payment-plans`, {
      headers: authHeaders(),
    })
    setPlans(await res.json())
  }

  const fetchMethods = async () => {
    const res = await fetch(`${API}/admin/payment-methods`, {
      headers: authHeaders(),
    })
    setMethods(await res.json())
  }

  useEffect(() => {
    fetchPlans()
    fetchMethods()
  }, [])

  /* ---------------- ACTIONS ---------------- */
  const togglePlan = async (id: number) => {
    await fetch(`${API}/admin/payment-plans/${id}/toggle`, {
      method: "PATCH",
      headers: authHeaders(),
    })
    fetchPlans()
  }

  const deletePlan = async (id: number) => {
    if (!confirm("Delete this plan?")) return
    await fetch(`${API}/admin/payment-plans/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
    fetchPlans()
  }

  const createPlan = async () => {
    setLoading(true)
    await fetch(`${API}/admin/payment-plans`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        currency: "KES",
      }),
    })
    setLoading(false)
    setOpen(false)
    setForm({ name: "", price: "", duration: "", features: "" })
    fetchPlans()
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment Plans</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </div>

      {/* PLANS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>Manage subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.currency} {plan.price}</TableCell>
                  <TableCell>{plan.duration}</TableCell>
                  <TableCell>{plan.features}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      plan.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => togglePlan(plan.id)}>
                          {plan.is_active
                            ? <ToggleLeft className="mr-2 h-4 w-4" />
                            : <ToggleRight className="mr-2 h-4 w-4" />
                          }
                          {plan.is_active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deletePlan(plan.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PAYMENT METHODS */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {methods.map(method => (
            <div
              key={method.id}
              className="flex justify-between items-center border p-4 rounded-md"
            >
              <div>
                <h3 className="font-medium">{method.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
              <span className={`text-sm font-medium ${
                method.is_active ? "text-green-600" : "text-red-600"
              }`}>
                {method.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ADD PLAN MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Plan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Plan Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Duration (e.g. 1 Month)"
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
            />
            <Textarea
              placeholder="Features"
              value={form.features}
              onChange={e => setForm({ ...form, features: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={createPlan}
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
