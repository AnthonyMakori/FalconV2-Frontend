'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash, ToggleLeft, ToggleRight } from "lucide-react"

// Sample payment plans data
const paymentPlans = [
  {
    id: 1,
    name: "Basic",
    price: "KES 499",
    duration: "1 Month",
    features: "HD Streaming, 1 Device",
    status: "Active",
  },
  {
    id: 2,
    name: "Standard",
    price: "KES 999",
    duration: "1 Month",
    features: "HD Streaming, 2 Devices, Downloads",
    status: "Active",
  },
  {
    id: 3,
    name: "Premium",
    price: "KES 1,499",
    duration: "1 Month",
    features: "4K Streaming, 4 Devices, Downloads, Exclusive Content",
    status: "Active",
  },
  {
    id: 4,
    name: "Annual Basic",
    price: "KES 4,999",
    duration: "12 Months",
    features: "HD Streaming, 1 Device",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Annual Premium",
    price: "KES 14,999",
    duration: "12 Months",
    features: "4K Streaming, 4 Devices, Downloads, Exclusive Content",
    status: "Active",
  },
]

export default function PaymentPlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment Plans</h1>
        <Link href="/admin/payment-plans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Plans Management</CardTitle>
          <CardDescription>Manage subscription and payment plans for the platform</CardDescription>
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
                {paymentPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.price}</TableCell>
                    <TableCell>{plan.duration}</TableCell>
                    <TableCell>{plan.features}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          plan.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {plan.status === "Active" ? (
                            <DropdownMenuItem>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
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

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Configure available payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                  <span className="font-bold">M</span>
                </div>
                <div>
                  <h3 className="font-medium">M-PESA</h3>
                  <p className="text-sm text-muted-foreground">Mobile money payment method</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                  <span className="font-bold">F</span>
                </div>
                <div>
                  <h3 className="font-medium">Flutterwave</h3>
                  <p className="text-sm text-muted-foreground">Card and bank payments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                  <span className="font-bold">P</span>
                </div>
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-muted-foreground">International payments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Inactive</span>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
