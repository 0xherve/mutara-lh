"use client"

import { useSupabaseQuery, useSupabaseMutation } from "./use-supabase-query"
import { useSupabaseAuth } from "./use-supabase-auth"
import type { Database } from "@/types/supabase"

type Farm = Database["public"]["Tables"]["farms"]["Row"]

export function useFarm() {
  const { user } = useSupabaseAuth()

  const farmsQuery = useSupabaseQuery<Farm[]>("farms", ["user"], {
    match: user ? { user_id: user.id } : undefined,
    order: { column: "name", ascending: true },
  })

  const farmMutation = useSupabaseMutation<Farm>("farms", {
    invalidateQueries: [["farms", "user"]],
  })

  const createFarm = (data: Omit<Farm, "id" | "created_at" | "updated_at">) => {
    if (!user) return Promise.reject("User not authenticated")

    return farmMutation.mutateAsync({
      type: "insert",
      data: {
        ...data,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }

  const updateFarm = (id: string, data: Partial<Omit<Farm, "id" | "created_at" | "updated_at">>) => {
    return farmMutation.mutateAsync({
      type: "update",
      match: { id },
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const deleteFarm = (id: string) => {
    return farmMutation.mutateAsync({
      type: "delete",
      match: { id },
    })
  }

  return {
    farms: farmsQuery.data || [],
    isLoading: farmsQuery.isLoading,
    isError: farmsQuery.isError,
    error: farmsQuery.error,
    createFarm,
    updateFarm,
    deleteFarm,
    isMutating: farmMutation.isPending,
  }
}

