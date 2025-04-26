"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AddHealthRecordDialog } from "@/components/add-health-record-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface AnimalHealthRecordsProps {
  animalId: string
}

export function AnimalHealthRecords({ animalId }: AnimalHealthRecordsProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchHealthRecords = async () => {
      const supabase = getSupabaseBrowserClient()

      // In a real app, you would fetch the health records from Supabase
      // const { data } = await supabase
      //   .from('health_records')
      //   .select('*')
      //   .eq('animal_id', animalId)
      //   .order('record_date', { ascending: false })

      // For demo purposes, we'll use sample data
      setRecords(sampleHealthRecords.filter((r) => r.animal_id === animalId))
      setLoading(false)
    }

    fetchHealthRecords()
  }, [animalId])

  const filteredRecords = records.filter(
    (record) =>
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.record_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.medicine && record.medicine.toLowerCase().includes(searchTerm.toLowerCase())),
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
          <CardTitle>Health Records</CardTitle>
          <CardDescription>Vaccinations, treatments, and health checks</CardDescription>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
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
          <div className="text-center py-8 text-muted-foreground">No health records found for this animal.</div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Administered By</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.record_date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.record_type === "Vaccination"
                            ? "default"
                            : record.record_type === "Treatment"
                              ? "secondary"
                              : record.record_type === "Checkup"
                                ? "outline"
                                : record.record_type === "Disease"
                                  ? "destructive"
                                  : "default"
                        }
                      >
                        {record.record_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.medicine || "-"}</TableCell>
                    <TableCell>{record.administered_by}</TableCell>
                    <TableCell>{record.cost ? `R ${record.cost}` : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AddHealthRecordDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} animalId={animalId} />
    </Card>
  )
}

const sampleHealthRecords = [
  {
    id: "1",
    animal_id: "1",
    record_date: "2023-05-15",
    record_type: "Vaccination",
    description: "Annual vaccination against Bovine Respiratory Disease",
    medicine: "Bovi-Shield Gold FP 5",
    administered_by: "Dr. Smith",
    cost: "450",
  },
  {
    id: "2",
    animal_id: "1",
    record_date: "2023-02-10",
    record_type: "Treatment",
    description: "Treatment for mild mastitis",
    medicine: "Spectramast LC",
    administered_by: "Dr. Johnson",
    cost: "650",
  },
  {
    id: "3",
    animal_id: "1",
    record_date: "2022-11-20",
    record_type: "Checkup",
    description: "Routine health checkup",
    medicine: null,
    administered_by: "Dr. Smith",
    cost: "300",
  },
  {
    id: "4",
    animal_id: "2",
    record_date: "2023-04-05",
    record_type: "Vaccination",
    description: "Annual vaccination against Blackleg",
    medicine: "Ultrabac 8",
    administered_by: "Dr. Smith",
    cost: "450",
  },
]

