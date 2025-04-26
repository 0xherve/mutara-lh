"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MilkIcon as Cow, Stethoscope, Heart, Utensils, DollarSign, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AnimalHealthRecords } from "@/components/animal-health-records"
import { AnimalBreedingRecords } from "@/components/animal-breeding-records"
import { AnimalFeedingRecords } from "@/components/animal-feeding-records"
import { AnimalFinancialRecords } from "@/components/animal-financial-records"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function AnimalProfilePage({ params }: { params: { id: string } }) {
  const [animal, setAnimal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnimal = async () => {
      const supabase = getSupabaseBrowserClient()

      // In a real app, you would fetch the animal data from Supabase
      // const { data } = await supabase
      //   .from('animals')
      //   .select('*, animal_categories(name)')
      //   .eq('id', params.id)
      //   .single()

      // For demo purposes, we'll use sample data
      const animalData = sampleAnimals.find((a) => a.id === params.id)
      setAnimal(animalData)
      setLoading(false)
    }

    fetchAnimal()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/livestock">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Animal Not Found</h1>
        </div>
        <p>The animal you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/livestock">Back to Livestock</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/livestock">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{animal.name ? animal.name : animal.tag_id}</h1>
            <Badge
              variant={animal.status === "Active" ? "default" : animal.status === "Sold" ? "secondary" : "destructive"}
            >
              {animal.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {animal.category} • {animal.breed} • {animal.gender} • Tag ID: {animal.tag_id}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Cow className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="health">
            <Stethoscope className="h-4 w-4 mr-2" />
            Health
          </TabsTrigger>
          <TabsTrigger value="breeding">
            <Heart className="h-4 w-4 mr-2" />
            Breeding
          </TabsTrigger>
          <TabsTrigger value="feeding">
            <Utensils className="h-4 w-4 mr-2" />
            Feeding
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>General details about this animal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tag ID</p>
                    <p>{animal.tag_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{animal.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p>{animal.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Breed</p>
                    <p>{animal.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p>{animal.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p>{animal.age}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weight</p>
                    <p>
                      {animal.weight} {animal.weight_unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p>{animal.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acquisition Details</CardTitle>
                <CardDescription>Information about when and how this animal was acquired</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                    <p>{animal.date_of_birth || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Acquisition Date</p>
                    <p>{animal.acquisition_date || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Acquisition Cost</p>
                    <p>{animal.acquisition_cost ? `R ${animal.acquisition_cost}` : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Source</p>
                    <p>{animal.source || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information about this animal</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{animal.notes || "No notes available for this animal."}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Report Issue
              </Button>
              <Button>Edit Animal</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <AnimalHealthRecords animalId={params.id} />
        </TabsContent>

        <TabsContent value="breeding">
          <AnimalBreedingRecords animalId={params.id} />
        </TabsContent>

        <TabsContent value="feeding">
          <AnimalFeedingRecords animalId={params.id} />
        </TabsContent>

        <TabsContent value="financial">
          <AnimalFinancialRecords animalId={params.id} />
        </TabsContent>
      </Tabs>
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
    date_of_birth: "2020-05-15",
    acquisition_date: "2020-08-20",
    acquisition_cost: "12000",
    source: "Local Auction",
    notes: "High milk producer. Vaccinated against common diseases. Friendly temperament.",
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
    date_of_birth: "2019-03-10",
    acquisition_date: "2019-06-15",
    acquisition_cost: "15000",
    source: "Breeder",
    notes: "Strong bull with excellent genetics. Used for breeding program.",
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
    date_of_birth: "2021-09-12",
    acquisition_date: "2022-01-05",
    acquisition_cost: "3500",
    source: "Farm Direct",
    notes: "High quality wool producer. Sheared twice annually.",
  },
]

