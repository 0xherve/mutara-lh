"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface AnimalFeedingRecordsProps {
  animalId: string
}

export function AnimalFeedingRecords({ animalId }: AnimalFeedingRecordsProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFeedingRecords = async () => {
      const supabase = getSupabaseBrowserClient()

      // In a real app, you would fetch the feeding records from Supabase
      // For demo purposes, we'll use sample data
      setRecords(sampleFeedingRecords.filter((r) => r.animal_id === animalId))
      setLoading(false)
    }

    fetchFeedingRecords()
  }, [animalId])

  const filteredRecords = records.filter(
    (record) =>
      record.feed_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase())),
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
          <CardTitle>Feeding Records</CardTitle>
          <CardDescription>Feed types, quantities, and costs</CardDescription>
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
          <div className="text-center py-8 text-muted-foreground">No feeding records found for this animal.</div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Feed Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.feeding_date}</TableCell>
                    <TableCell>{record.feed_type}</TableCell>
                    <TableCell>
                      {record.quantity} {record.quantity_unit}
                    </TableCell>
                    <TableCell>{record.cost ? `R ${record.cost}` : "-"}</TableCell>
                    <TableCell>{record.notes || "-"}</TableCell>
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

const sampleFeedingRecords = [
  {
    id: "1",
    animal_id: "1",
    feed_type: "Alfalfa Hay",
    quantity: 15,
    quantity_unit: "kg",
    feeding_date: ' "1',
    animal_id: "1",
    feed_type: "Alfalfa Hay",
    quantity: 15,
    quantity_unit: "kg",
    feeding_date: "2023-05-15",
    cost: "450",
    notes: "High quality hay for dairy cattle",
  },
  {
    id: "2",
    animal_id: "1",
    feed_type: "Grain Mix",
    quantity: 5,
    quantity_unit: "kg",
    feeding_date: "2023-05-15",
    cost: "250",
    notes: "Protein-rich grain supplement",
  },
  {
    id: "3",
    animal_id: "1",
    feed_type: "Mineral Supplement",
    quantity: 0.5,
    quantity_unit: "kg",
    feeding_date: "2023-05-15",
    cost: "120",
    notes: "Calcium and phosphorus supplement",
  },
  {
    id: "4",
    animal_id: "2",
    feed_type: "Grass Hay",
    quantity: 12,
    quantity_unit: "kg",
    feeding_date: "2023-05-15",
    cost: "350",
    notes: "Standard feed for beef cattle",
  },
]

