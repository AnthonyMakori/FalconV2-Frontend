'use client'

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content"

export default function AdminDashboard() {
  return (
    <div className="">
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
    </div>
  )
}
