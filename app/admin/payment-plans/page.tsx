'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"

/* ================= TYPES ================= */

interface PaymentPlan {
  id: number
  name: string
  price: string
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

/* ================= API HELPERS ================= */

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token")

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

/* ================= PAGE ================= */

export default function PaymentPlansPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  /* -------- Fetch Data -------- */

  const fetchPlans = async () => {
    const res = await fetch(`${API_URL}/admin/payment-plans`, {
      headers: getAuthHeaders(),
    })
    setPlans(await res.json())
  }

  const fetchMethods = async () => {
    const res = await fetch(`${API_URL}/admin/payment-methods`, {
      headers: getAuthHeaders(),
    })
    setMethods(await res.json())
  }

  useEffect(() => {
    Promise.all([fetchPlans(), fetchMethods()]).finally(() =>
      setLoading(false)
    )
  }, [])

  /* -------- Actions -------- */

  const togglePlanStatus = async (id: number) => {
    await fetch(`${API_URL}/admin/payment-plans/${id}/toggle`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    })
    fetchPlans()
  }

  const deletePlan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    await fetch(`${API_URL}/admin/payment-plans/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    fetchPlans()
  }

  const toggleMethodStatus = async (id: number) => {
    await fetch(`${API_URL}/admin/payment-methods/${id}/toggle`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    })
    fetchMethods()
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading payment data...</p>
  }

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment Plans</h1>
        <Link href="/admin/payment-plans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </Link>
      </div>

      {/* ===== Payment Plans ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Plans Management</CardTitle>
          <CardDescription>
            Manage subscription and payment plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
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
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      {plan.name}
                    </TableCell>
                    <TableCell>
                      {plan.currency} {plan.price}
                    </TableCell>
                    <TableCell>{plan.duration}</TableCell>
                    <TableCell>{plan.features}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          plan.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
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
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/payment-plans/${plan.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => togglePlanStatus(plan.id)}
                          >
                            {plan.is_active ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
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
          </div>
        </CardContent>
      </Card>

      {/* ===== Payment Methods ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Configure available payment gateways
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <h3 className="font-medium">{method.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    method.is_active
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {method.is_active ? "Active" : "Inactive"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleMethodStatus(method.id)}
                >
                  Toggle
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
