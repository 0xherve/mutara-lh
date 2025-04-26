"use client"

import { useSupabaseQuery, useSupabaseMutation } from "./use-supabase-query"
import type { Database } from "@/types/supabase"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

export function useTasks(farmId?: string, animalId?: string) {
  const tasksQuery = useSupabaseQuery<Task[]>("tasks", ["farm", farmId || "all", "animal", animalId || "all"], {
    match: {
      ...(farmId ? { farm_id: farmId } : {}),
      ...(animalId ? { animal_id: animalId } : {}),
    },
    order: { column: "due_date", ascending: true },
    enabled: !!farmId || !!animalId,
  })

  const taskMutation = useSupabaseMutation<Task>("tasks", {
    invalidateQueries: [["tasks", "farm", farmId || "all", "animal", animalId || "all"]],
  })

  const createTask = (data: Omit<Task, "id" | "created_at" | "updated_at">) => {
    return taskMutation.mutateAsync({
      type: "insert",
      data: {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }

  const updateTask = (id: string, data: Partial<Omit<Task, "id" | "created_at" | "updated_at">>) => {
    return taskMutation.mutateAsync({
      type: "update",
      match: { id },
      data: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const deleteTask = (id: string) => {
    return taskMutation.mutateAsync({
      type: "delete",
      match: { id },
    })
  }

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask,
    updateTask,
    deleteTask,
    isMutating: taskMutation.isPending,
  }
}

