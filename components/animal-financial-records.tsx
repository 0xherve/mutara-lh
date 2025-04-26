"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface AnimalFinancialRecordsProps {
  animalId: string
}

export function AnimalFinancialRecords({ animalId }: AnimalFinancialRecordsProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFinancialRecords = async () => {
      const supabase = getSupabaseBrowserClient()

      // In a real app, you would fetch the financial records from Supabase
      // For demo purposes, we'll use sample data
      setRecords(sampleFinancialRecords.filter((r) => r.animal_id === animalId))
      setLoading(false)
    }

    fetchFinancialRecords()
  }, [animalId])

  const filteredRecords = records.filter(
    (record) =>
      record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>Income and expenses related to this animal</CardDescription>
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
          <div className="text-center py-8 text-muted-foreground">No financial records found for this animal.</div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.transaction_date}</TableCell>
                    <TableCell>
                      <Badge variant={record.transaction_type === "Income" ? "default" : "secondary"}>
                        {record.transaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell
                      className={`text-right ${record.transaction_type === "Income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {record.transaction_type === "Income" ? "+" : "-"}R {record.amount}
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

const sampleFinancialRecords = [
  {
    id: "1",
    animal_id: "1",
    transaction_date: "2023-05-15",
    transaction_type: "Income",
    category: "Milk Production",
    amount: "1200",
    description: "Monthly milk sales",
  },
  {
    id: "2",
    animal_id: "1",
    transaction_date: "2023-05-15",
    transaction_type: "Expense",
    category: "Feed",
    amount: "450",
    description: "Monthly feed costs",
  },
  {
    id: "3",
    animal_id: "1",
    transaction_date: "2023-02-10",
    transaction_type: "Expense",
    category: "Veterinary",
    amount: "650",
    description: "Treatment for mastitis",
  },
  {
    id: "4",
    animal_id: "2",
    transaction_date: "2023-04-05",
    transaction_type: "Expense",
    category: "Veterinary",
    amount: "450",
    description: "Annual vaccination",
  },
]

