'use client'

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* =======================
   TYPES
======================= */
interface Role {
  id: number
  name: string
  permissions: Permission[]
}

interface Permission {
  id: number
  name: string
  description?: string
  category: string
}

/* =======================
   API HELPER
======================= */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("Authentication token missing")
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
}

/* =======================
   COMPONENT
======================= */
export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  const [newPermissionName, setNewPermissionName] = useState("")
  const [newPermissionCategory, setNewPermissionCategory] = useState("")
  const [newPermissionDescription, setNewPermissionDescription] = useState("")

  /* =======================
     FETCH DATA
  ======================= */
  const fetchData = async () => {
  try {
    setLoading(true)

    const res = await authFetch("/permissions")
    if (!res.ok) throw new Error("Failed to fetch permissions")

    const data = await res.json()

    // ✅ NORMALIZE roles.permissions
    const normalizedRoles = data.roles.map((role: any) => ({
      ...role,
      permissions: role.permissions ?? [],
    }))

    setPermissions(data.permissions)
    setRoles(normalizedRoles)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/auth/signin"
      return
    }

    fetchData()
  }, [])

  /* =======================
     TOGGLE PERMISSION
  ======================= */
  const handleTogglePermission = async (
    roleId: number,
    permissionId: number,
    checked: boolean
  ) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return

    const currentPermissionIds = role.permissions.map(p => p.id)
    const updatedPermissions = checked
      ? [...new Set([...currentPermissionIds, permissionId])]
      : currentPermissionIds.filter(id => id !== permissionId)

    try {
      const res = await authFetch(`/roles/${roleId}/permissions`, {
        method: "POST",
        body: JSON.stringify({ permissions: updatedPermissions }),
      })

      if (!res.ok) {
        throw new Error("Failed to update permissions")
      }

      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  /* =======================
     CREATE PERMISSION
  ======================= */
  const handleCreatePermission = async () => {
    if (!newPermissionName || !newPermissionCategory) return

    try {
      const res = await authFetch("/permissions", {
        method: "POST",
        body: JSON.stringify({
          name: newPermissionName,
          category: newPermissionCategory,
          description: newPermissionDescription,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create permission")
      }

      setNewPermissionName("")
      setNewPermissionCategory("")
      setNewPermissionDescription("")
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  /* =======================
     GROUP PERMISSIONS
  ======================= */
  const permissionsByCategory = permissions.reduce<Record<string, Permission[]>>(
    (acc, perm) => {
      acc[perm.category] = acc[perm.category] || []
      acc[perm.category].push(perm)
      return acc
    },
    {}
  )

  if (loading) {
    return <div className="p-6">Loading permissions...</div>
  }

  /* =======================
     UI
  ======================= */
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Permissions Management</h1>
        <Button onClick={fetchData}>
          <Save className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="create">Create Permission</TabsTrigger>
        </TabsList>

        {/* MATRIX */}
        <TabsContent value="matrix" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permission Matrix</CardTitle>
              <CardDescription>
                Assign permissions to roles. Changes apply instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[260px]">Permission</TableHead>
                      {roles.map(role => (
                        <TableHead key={role.id} className="text-center">
                          {role.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(permissionsByCategory).map(([category, perms]) => (
                      <React.Fragment key={category}>
                        <TableRow className="bg-muted/50">
                          <TableCell
                            colSpan={roles.length + 1}
                            className="font-semibold"
                          >
                            {category}
                          </TableCell>
                        </TableRow>

                        {perms.map(permission => (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">
                              {permission.name}
                            </TableCell>

                            {roles.map(role => {
                              const checked = role.permissions.some(
                                p => p.id === permission.id
                              )

                              return (
                                <TableCell key={role.id} className="text-center">
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={value =>
                                      handleTogglePermission(
                                        role.id,
                                        permission.id,
                                        Boolean(value)
                                      )
                                    }
                                  />
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CREATE */}
        <TabsContent value="create" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Permission</CardTitle>
              <CardDescription>
                Add a new permission that can be assigned to roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input
                  value={newPermissionName}
                  onChange={e => setNewPermissionName(e.target.value)}
                  placeholder="Permission name"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <Input
                  value={newPermissionCategory}
                  onChange={e => setNewPermissionCategory(e.target.value)}
                  placeholder="Module / Category"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <Input
                  value={newPermissionDescription}
                  onChange={e => setNewPermissionDescription(e.target.value)}
                  placeholder="Optional description"
                  className="col-span-3"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleCreatePermission}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Permission
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
