'use client'

import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserDashboardContent } from "@/components/dashboard/user-dashboard-content"

export default function UserDashboard() {
  return (
    <ProtectedRoute requiredRole="user">
      <UserDashboardContent />
    </ProtectedRoute>
  )
}
