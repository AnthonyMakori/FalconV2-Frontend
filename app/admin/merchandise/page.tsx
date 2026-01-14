'use client'

import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL!


interface Merchandise {
  id: number
  name: string
  category: string
  price: string
  stock: number
  status: string
  image?: string
}

export default function MerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [showModal, setShowModal] = useState(false)

  // New product state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "In Stock",
    image: null as File | null
  })

  // Fetch merchandise from Laravel API
  const fetchMerchandise = async () => {
    try {
      const res = await fetch(`${API_URL}/merchandise`)
      const data = await res.json()
      setMerchandise(data)
    } catch (error) {
      console.error("Error fetching merchandise:", error)
    }
  }

  useEffect(() => {
    fetchMerchandise()
  }, [])

  // Filtered merchandise
  const filteredMerchandise = merchandise.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter
    const matchesStatus = statusFilter === "All Status" || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement
    if (files) {
      setNewProduct({ ...newProduct, image: files[0] })
    } else {
      setNewProduct({ ...newProduct, [name]: value })
    }
  }

  // Handle form submission
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()

  // console.log("Submitting product:", newProduct)
  // console.log("Image value:", newProduct.image)
  // console.log("Image is File:", newProduct.image instanceof File)

  const formData = new FormData()
  formData.append("name", newProduct.name)
  formData.append("category", newProduct.category)

  // Force numeric values (FormData sends strings)
  formData.append("price", Number(newProduct.price).toString())
  formData.append("stock", Number(newProduct.stock).toString())

  formData.append("status", newProduct.status)

  if (newProduct.image) {
    formData.append("image", newProduct.image)
  }

  // Log FormData contents
  for (const [key, value] of formData.entries()) {
    // console.log(`FormData -> ${key}:`, value)
  }

  try {
    const res = await fetch(`${API_URL}/merchandise`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })

    console.log("Response status:", res.status)

    if (!res.ok) {
      const errorData = await res.json()
      // console.error("Validation / API error:", errorData)
      return
    }

    const data = await res.json()
    // console.log("Product created successfully:", data)

    fetchMerchandise()
    setShowModal(false)
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "In Stock",
      image: null,
    })
  } catch (error) {
    // console.error("Network or fetch error:", error)
  }
}


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Merchandise</h1>

        {/* Modal Trigger */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Fill in the details of the new merchandise product.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <Input
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={newProduct.category}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Select Category</option>
                <option value="Apparel">Apparel</option>
                <option value="Posters">Posters</option>
                <option value="Accessories">Accessories</option>
                <option value="Collectibles">Collectibles</option>
              </select>
              <Input
                name="price"
                type="number"
                placeholder="Price (KES)"
                value={newProduct.price}
                onChange={handleChange}
                required
              />
              <Input
                name="stock"
                type="number"
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={handleChange}
                required
              />
              <select
                name="status"
                value={newProduct.status}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />

              <div className="flex justify-end gap-2 mt-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Product</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Merchandise Table */}
      <Card>
        <CardHeader>
          <CardTitle>Merchandise Management</CardTitle>
          <CardDescription>Manage all merchandise products on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="appearance-none bg-card border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All Categories</option>
                <option>Apparel</option>
                <option>Posters</option>
                <option>Accessories</option>
                <option>Collectibles</option>
              </select>
              <select
                className="appearance-none bg-card border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchandise.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image ? (
                        <img
                          src={`http://localhost:8000/storage/${product.image}`}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">No Image</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>KES {product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {product.status}
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
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="mr-2 h-4 w-4" />
                            Update Stock
                          </DropdownMenuItem>
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
    </div>
  )
}
