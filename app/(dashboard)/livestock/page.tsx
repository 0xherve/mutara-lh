"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter, Download, MilkIcon as Cow } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AddLivestockDialog } from "@/components/add-livestock-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

export default function LivestockPage() {
  const { user } = useSupabaseAuth()
  const [animals, setAnimals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchAnimals = async () => {
      if (!user) return

      const supabase = getSupabaseBrowserClient()

      // Get user's farm
      const { data: farmData } = await supabase.from("farms").select("id").eq("user_id", user.id).single()

      if (farmData) {
        const { data } = await supabase
          .from("animals")
          .select("*, animal_categories(name)")
          .eq("farm_id", farmData.id)
          .order("tag_id", { ascending: true })

        setAnimals(data || [])
      }

      // For demo purposes, we'll set some sample data
      // In a real app, you would use the data from Supabase
      setAnimals(sampleAnimals)
      setLoading(false)
    }

    fetchAnimals()
  }, [user])

  const filteredAnimals = animals.filter(
    (animal) =>
      animal.tag_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (animal.name && animal.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Livestock</h1>
          <p className="text-muted-foreground">Manage your livestock records</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Animal
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search animals..."
                className="h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <div className="w-full min-w-[640px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnimals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">{animal.tag_id}</TableCell>
                    <TableCell>{animal.name || "-"}</TableCell>
                    <TableCell>{animal.category}</TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>{animal.gender}</TableCell>
                    <TableCell>{animal.age}</TableCell>
                    <TableCell>
                      {animal.weight} {animal.weight_unit}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          animal.status === "Active"
                            ? "default"
                            : animal.status === "Sold"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {animal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/livestock/${animal.id}`}>
                          <Cow className="h-4 w-4" />
                          <span className="sr-only">View animal</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddLivestockDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

const sampleAnimals = [
  {
    id: "1",
    tag_id: "BTL-001",
    name: "Bella",
    category: "Cattle",
    breed: "Holstein",
    gender: "Female",
    age: "3 years",
    weight: 650,
    weight_unit: "kg",
    status: "Active",
  },
  {
    id: "2",
    tag_id: "BTL-002",
    name: "Max",
    category: "Cattle",
    breed: "Angus",
    gender: "Male",
    age: "4 years",
    weight: 850,
    weight_unit: "kg",
    status: "Active",
  },
  {
    id: "3",
    tag_id: "SHP-001",
    name: "Woolly",
    category: "Sheep",
    breed: "Merino",
    gender: "Female",
    age: "2 years",
    weight: 65,
    weight_unit: "kg",
    status: "Active",
  },
  {
    id: "4",
    tag_id: "GT-001",
    name: "Billy",
    category: "Goats",
    breed: "Boer",
    gender: "Male",
    age: "1.5 years",
    weight: 70,
    weight_unit: "kg",
    status: "Sold",
  },
  {
    id: "5",
    tag_id: "BTL-003",
    name: "Daisy",
    category: "Cattle",
    breed: "Jersey",
    gender: "Female",
    age: "5 years",
    weight: 500,
    weight_unit: "kg",
    status: "Active",
  },
  {
    id: "6",
    tag_id: "PG-001",
    name: "Porky",
    category: "Pigs",
    breed: "Duroc",
    gender: "Male",
    age: "1 year",
    weight: 120,
    weight_unit: "kg",
    status: "Active",
  },
  {
    id: "7",
    tag_id: "BTL-004",
    name: "Thunder",
    category: "Cattle",
    breed: "Brahman",
    gender: "Male",
    age: "6 years",
    weight: 920,
    weight_unit: "kg",
    status: "Deceased",
  },
  {
    id: "8",
    tag_id: "CKN-001",
    name: null,
    category: "Poultry",
    breed: "Leghorn",
    gender: "Female",
    age: "8 months",
    weight: 1.8,
    weight_unit: "kg",
    status: "Active",
  },
]

