"use client"

import { useSupabaseQuery, useSupabaseMutation } from "./use-supabase-query"
import type { Database } from "@/types/supabase"

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Row"]

export function useFinancialRecords(farmId?: string, animalId?: string) {
  const financialRecordsQuery = useSupabaseQuery<FinancialRecord[]>(
    "financial_records",
    ["farm", farmId || "all", "animal", animalId || "all"],
    {
      match: {
        ...(farmId ? { farm_id: farmId } : {}),
        ...(animalId ? { animal_id: animalId } : {}),
      },
      order: { column: "transaction_date", ascending: false },
      enabled: !!farmId || !!animalId,
    },
  )

  const financialRecordMutation = useSupabaseMutation<FinancialRecord>("financial_records", {
    invalidateQueries: [["financial_records", "farm", farmId || "all", "animal", animalId || "all"]],
  })

  const createFinancialRecord = (data: Omit<FinancialRecord, "id" | "created_at" | "updated_at">) => {
    return financialRecordMutation.mutateAsync({
      type: "insert",
      data: {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }

  const updateFinancialRecord = (
    id: string,
    data: Partial<Omit<FinancialRecord, "id" | "created_at" | "updated_at">>,
  ) => {
    return financialRecordMutation.mutateAsync({
      type: "update",
      match: { id },
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const deleteFinancialRecord = (id: string) => {
    return financialRecordMutation.mutateAsync({
      type: "delete",
      match: { id },
    })
  }

  return {
    financialRecords: financialRecordsQuery.data || [],
    isLoading: financialRecordsQuery.isLoading,
    isError: financialRecordsQuery.isError,
    error: financialRecordsQuery.error,
    createFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
    isMutating: financialRecordMutation.isPending,
  }
}

