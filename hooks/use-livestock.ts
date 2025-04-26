"use client"

import { useSupabaseQuery, useSupabaseMutation } from "./use-supabase-query"
import { useSupabaseAuth } from "./use-supabase-auth"
import type { Database } from "@/types/supabase"
import { getSupabaseBrowserClient } from "@/lib/supabase"

type Animal = Database["public"]["Tables"]["animals"]["Row"]
type AnimalWithCategory = Animal & { animal_categories: { name: string } }

export function useLivestock(farmId?: string) {
  const { user } = useSupabaseAuth()

  const animalsQuery = useSupabaseQuery<AnimalWithCategory[]>("animals", ["farm", farmId || "all"], {
    select: "*, animal_categories(name)",
    match: farmId ? { farm_id: farmId } : undefined,
    filters: farmId
      ? undefined
      : [
          (query) =>
            query.in(
              "farm_id",
              getSupabaseBrowserClient()
                .from("farms")
                .select("id")
                .eq("user_id", user?.id || ""),
            ),
        ],
    order: { column: "tag_id", ascending: true },
    enabled: !!farmId || !!user,
  })

  const animalMutation = useSupabaseMutation<Animal>("animals", {
    invalidateQueries: [["animals", "farm", farmId || "all"]],
  })

  const createAnimal = (data: Omit<Animal, "id" | "created_at" | "updated_at">) => {
    return animalMutation.mutateAsync({
      type: "insert",
      data: {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }

  const updateAnimal = (id: string, data: Partial<Omit<Animal, "id" | "created_at" | "updated_at">>) => {
    return animalMutation.mutateAsync({
      type: "update",
      match: { id },
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const deleteAnimal = (id: string) => {
    return animalMutation.mutateAsync({
      type: "delete",
      match: { id },
    })
  }

  return {
    animals: animalsQuery.data || [],
    isLoading: animalsQuery.isLoading,
    isError: animalsQuery.isError,
    error: animalsQuery.error,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    isMutating: animalMutation.isPending,
  }
}

