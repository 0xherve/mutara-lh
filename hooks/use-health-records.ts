"use client"

import { useSupabaseQuery, useSupabaseMutation } from "./use-supabase-query"
import type { Database } from "@/types/supabase"

type HealthRecord = Database["public"]["Tables"]["health_records"]["Row"]

export function useHealthRecords(animalId?: string) {
  const healthRecordsQuery = useSupabaseQuery<HealthRecord[]>("health_records", ["animal", animalId || "all"], {
    match: animalId ? { animal_id: animalId } : undefined,
    order: { column: "record_date", ascending: false },
    enabled: !!animalId,
  })

  const healthRecordMutation = useSupabaseMutation<HealthRecord>("health_records", {
    invalidateQueries: [["health_records", "animal", animalId || "all"]],
  })

  const createHealthRecord = (data: Omit<HealthRecord, "id" | "created_at" | "updated_at">) => {
    return healthRecordMutation.mutateAsync({
      type: "insert",
      data: {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }

  const updateHealthRecord = (id: string, data: Partial<Omit<HealthRecord, "id" | "created_at" | "updated_at">>) => {
    return healthRecordMutation.mutateAsync({
      type: "update",
      match: { id },
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const deleteHealthRecord = (id: string) => {
    return healthRecordMutation.mutateAsync({
      type: "delete",
      match: { id },
    })
  }

  return {
    healthRecords: healthRecordsQuery.data || [],
    isLoading: healthRecordsQuery.isLoading,
    isError: healthRecordsQuery.isError,
    error: healthRecordsQuery.error,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    isMutating: healthRecordMutation.isPending,
  }
}

