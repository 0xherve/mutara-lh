"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

interface AddLivestockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddLivestockDialog({ open, onOpenChange }: AddLivestockDialogProps) {
  const { user } = useSupabaseAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    tag_id: "",
    name: "",
    category_id: "",
    breed: "",
    gender: "",
    date_of_birth: "",
    weight: "",
    weight_unit: "kg",
    status: "Active",
    acquisition_date: "",
    acquisition_cost: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Get user's farm
      const { data: farmData } = await supabase.from("farms").select("id").eq("user_id", user?.id).single()

      if (farmData) {
        // In a real app, you would insert the animal record
        // await supabase.from('animals').insert({
        //   ...formData,
        //   farm_id: farmData.id
        // })

        // For demo purposes, we'll just close the dialog
        console.log("Animal added:", { ...formData, farm_id: farmData.id })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error adding animal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
          <DialogDescription>Enter the details of the new animal to add to your livestock records.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag_id">Tag ID *</Label>
                <Input
                  id="tag_id"
                  name="tag_id"
                  placeholder="e.g., BTL-001"
                  required
                  value={formData.tag_id}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Optional" value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  required
                  value={formData.category_id}
                  onValueChange={(value) => handleSelectChange("category_id", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cattle</SelectItem>
                    <SelectItem value="2">Sheep</SelectItem>
                    <SelectItem value="3">Goats</SelectItem>
                    <SelectItem value="4">Pigs</SelectItem>
                    <SelectItem value="5">Poultry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  name="breed"
                  placeholder="e.g., Holstein"
                  required
                  value={formData.breed}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select required value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight_unit">Unit</Label>
                <Select
                  value={formData.weight_unit}
                  onValueChange={(value) => handleSelectChange("weight_unit", value)}
                >
                  <SelectTrigger id="weight_unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acquisition_date">Acquisition Date</Label>
                <Input
                  id="acquisition_date"
                  name="acquisition_date"
                  type="date"
                  value={formData.acquisition_date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acquisition_cost">Acquisition Cost (R)</Label>
                <Input
                  id="acquisition_cost"
                  name="acquisition_cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.acquisition_cost}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional information about the animal"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Animal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

