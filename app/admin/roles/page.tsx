'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Users, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/utils/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

// ----------------------
// TypeScript Types
// ----------------------
type PermissionsResponse = {
  permissions: Permission[]
  roles: {
    id: number
    name: string
    description: string
    is_system: number
  }[]
}


type Role = {
  id: number
  name: string
  description: string
  is_system: boolean
  permissions: Permission[]
  users: { id: number; name: string }[]
}

type NewRole = {
  name: string
  description: string
  permissions: number[]
}

// ----------------------
// Component
// ----------------------
export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newRole, setNewRole] = useState<NewRole>({
    name: "",
    description: "",
    permissions: [],
  })

  // Fetch roles and permissions
  useEffect(() => {
  async function fetchData() {
    setLoading(true)
    setError("")
    try {
      const rolesData: Role[] = await apiFetch(`${API_URL}/roles`)
      const permissionsResponse: PermissionsResponse = await apiFetch(
        `${API_URL}/permissions`
      )

      setRoles(rolesData)
      setPermissions(permissionsResponse.permissions) 
    } catch (err: any) {
      setError(err.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])


  // Toggle permission selection for new role
  const togglePermission = (id: number) => {
    setNewRole((prev) => {
      const permissions = prev.permissions.includes(id)
        ? prev.permissions.filter((p) => p !== id)
        : [...prev.permissions, id]
      return { ...prev, permissions }
    })
  }

  // Handle creating a new role
  const handleSaveRole = async () => {
    if (!newRole.name.trim()) {
      alert("Role name is required")
      return
    }

    try {
      const savedRole: Role = await apiFetch(`${API_URL}/roles`, {
        method: "POST",
        body: JSON.stringify(newRole),
      })
      setRoles((prev) => [...prev, savedRole])
      setNewRole({ name: "", description: "", permissions: [] })
      alert("Role created successfully")
    } catch (err: any) {
      alert(err.message || "Failed to create role")
    }
  }

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role and assign permissions. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  placeholder="Role name"
                  className="col-span-3"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  placeholder="Role description"
                  className="col-span-3"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>

              <div className="mt-4">
                <Label>Permissions</Label>
                <div className="mt-2 border rounded-md p-4 max-h-[300px] overflow-y-auto">
                  {permissions.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={`perm-${perm.id}`}
                        checked={newRole.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`perm-${perm.id}`}>{perm.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSaveRole}>Save Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Tabs defaultValue="roles">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      {role.is_system && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          System
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{role.users?.length || 0} users</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{role.permissions?.length || 0} permissions</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" disabled={role.is_system}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Manage system permissions that can be assigned to roles.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {permissions.map((perm) => (
                    <div key={perm.id} className="flex justify-between items-center border-b py-2">
                      <div>
                        <span className="font-medium">{perm.name}</span> - <span>{perm.description}</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
