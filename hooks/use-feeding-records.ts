"use client"

import { useSupabaseQuery, useSupabaseMutation } from "./use-supabase-query"
import type { Database } from "@/types/supabase"

type FeedingRecord = Database["public"]["Tables"]["feeding_records"]["Row"]

export function useFeedingRecords(animalId?: string) {
  const feedingRecordsQuery = useSupabaseQuery<FeedingRecord[]>("feeding_records", ["animal", animalId || "all"], {
    match: animalId ? { animal_id: animalId } : undefined,
    order: { column: "feeding_date", ascending: false },
    enabled: !!animalId,
  })

  const feedingRecordMutation = useSupabaseMutation<FeedingRecord>("feeding_records", {
    invalidateQueries: [["feeding_records", "animal", animalId || "all"]],
  })

  const createFeedingRecord = (data: Omit<FeedingRecord, "id" | "created_at" | "updated_at">) => {
    return feedingRecordMutation.mutateAsync({
      type: "insert",
      data: {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }

  const updateFeedingRecord = (id: string, data: Partial<Omit<FeedingRecord, "id" | "created_at" | "updated_at">>) => {
    return feedingRecordMutation.mutateAsync({
      type: "update",
      match: { id },
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const deleteFeedingRecord = (id: string) => {
    return feedingRecordMutation.mutateAsync({
      type: "delete",
      match: { id },
    })
  }

  return {
    feedingRecords: feedingRecordsQuery.data || [],
    isLoading: feedingRecordsQuery.isLoading,
    isError: feedingRecordsQuery.isError,
    error: feedingRecordsQuery.error,
    createFeedingRecord,
    updateFeedingRecord,
    deleteFeedingRecord,
    isMutating: feedingRecordMutation.isPending,
  }
}

