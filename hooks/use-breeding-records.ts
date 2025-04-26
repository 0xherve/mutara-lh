"use client"

import { useSupabaseQuery, useSupabaseMutation } from "./use-supabase-query"
import type { Database } from "@/types/supabase"

type BreedingRecord = Database["public"]["Tables"]["breeding_records"]["Row"]

export function useBreedingRecords(animalId?: string) {
  const breedingRecordsQuery = useSupabaseQuery<BreedingRecord[]>("breeding_records", ["animal", animalId || "all"], {
    filters: animalId ? [(query) => query.or(`female_id.eq.${animalId},male_id.eq.${animalId}`)] : undefined,
    order: { column: "breeding_date", ascending: false },
    enabled: !!animalId,
  })

  const breedingRecordMutation = useSupabaseMutation<BreedingRecord>("breeding_records", {
    invalidateQueries: [["breeding_records", "animal", animalId || "all"]],
  })

  const createBreedingRecord = (data: Omit<BreedingRecord, "id" | "created_at" | "updated_at">) => {
    return breedingRecordMutation.mutateAsync({
      type: "insert",
      data: {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }

  const updateBreedingRecord = (
    id: string,
    data: Partial<Omit<BreedingRecord, "id" | "created_at" | "updated_at">>,
  ) => {
    return breedingRecordMutation.mutateAsync({
      type: "update",
      match: { id },
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const deleteBreedingRecord = (id: string) => {
    return breedingRecordMutation.mutateAsync({
      type: "delete",
      match: { id },
    })
  }

  return {
    breedingRecords: breedingRecordsQuery.data || [],
    isLoading: breedingRecordsQuery.isLoading,
    isError: breedingRecordsQuery.isError,
    error: breedingRecordsQuery.error,
    createBreedingRecord,
    updateBreedingRecord,
    deleteBreedingRecord,
    isMutating: breedingRecordMutation.isPending,
  }
}

