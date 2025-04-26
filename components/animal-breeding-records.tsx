"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface AnimalBreedingRecordsProps {
  animalId: string
}

export function AnimalBreedingRecords({ animalId }: AnimalBreedingRecordsProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchBreedingRecords = async () => {
      const supabase = getSupabaseBrowserClient()

      // In a real app, you would fetch the breeding records from Supabase
      // For demo purposes, we'll use sample data
      setRecords(sampleBreedingRecords.filter((r) => r.female_id === animalId || r.male_id === animalId))
      setLoading(false)
    }

    fetchBreedingRecords()
  }, [animalId])

  const filteredRecords = records.filter(
    (record) =>
      (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.breeding_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Breeding Records</CardTitle>
          <CardDescription>Breeding history and offspring information</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
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
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No breeding records found for this animal.</div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Actual Delivery</TableHead>
                  <TableHead>Offspring</TableHead>
                  <TableHead>Success</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.breeding_date}</TableCell>
                    <TableCell>{record.breeding_type}</TableCell>
                    <TableCell>{animalId === record.female_id ? record.male_name : record.female_name}</TableCell>
                    <TableCell>{record.expected_delivery_date || "-"}</TableCell>
                    <TableCell>{record.actual_delivery_date || "-"}</TableCell>
                    <TableCell>{record.offspring_count || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={record.success ? "default" : "destructive"}>
                        {record.success ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const sampleBreedingRecords = [
  {
    id: "1",
    female_id: "1",
    female_name: "Bella",
    male_id: "2",
    male_name: "Max",
    breeding_date: "2023-01-15",
    breeding_type: "Natural",
    expected_delivery_date: "2023-10-25",
    actual_delivery_date: "2023-10-23",
    success: true,
    offspring_count: 1,
    notes: "Healthy calf born without complications",
  },
  {
    id: "2",
    female_id: "1",
    female_name: "Bella",
    male_id: "2",
    male_name: "Max",
    breeding_date: "2022-02-10",
    breeding_type: "Artificial Insemination",
    expected_delivery_date: "2022-11-20",
    actual_delivery_date: "2022-11-18",
    success: true,
    offspring_count: 1,
    notes: "Healthy calf born without complications",
  },
  {
    id: "3",
    female_id: "3",
    female_name: "Woolly",
    male_id: null,
    male_name: "External Ram",
    breeding_date: "2023-03-05",
    breeding_type: "Natural",
    expected_delivery_date: "2023-08-02",
    actual_delivery_date: null,
    success: false,
    offspring_count: 0,
    notes: "Breeding unsuccessful",
  },
]

