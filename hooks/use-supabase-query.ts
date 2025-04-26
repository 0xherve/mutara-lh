"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useSupabaseAuth } from "./use-supabase-auth"

// Generic fetch function for Supabase tables
export function useSupabaseQuery<T>(
  table: string,
  queryKey: string[],
  options: {
    select?: string
    match?: Record<string, any>
    order?: { column: string; ascending: boolean }
    limit?: number
    single?: boolean
    filters?: ((query: any) => any)[]
  } = {},
) {
  const { user } = useSupabaseAuth()

  return useQuery({
    queryKey: [table, ...queryKey],
    queryFn: async () => {
      if (!user) return null

      const supabase = getSupabaseBrowserClient()
      let query = supabase.from(table).select(options.select || "*")

      // Apply match conditions
      if (options.match) {
        Object.entries(options.match).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      // Apply custom filters
      if (options.filters) {
        options.filters.forEach((filter) => {
          query = filter(query)
        })
      }

      // Apply ordering
      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending })
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit)
      }

      // Get single result or array
      const { data, error } = options.single ? await query.single() : await query

      if (error) throw error

      return data as T
    },
    enabled: !!user,
  })
}

// Generic mutation function for Supabase tables
export function useSupabaseMutation<T>(
  table: string,
  options: {
    onSuccess?: (data: T) => void
    invalidateQueries?: string[][]
  } = {},
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      type,
      data,
      match,
    }: {
      type: "insert" | "update" | "delete"
      data?: any
      match?: Record<string, any>
    }) => {
      const supabase = getSupabaseBrowserClient()
      let query

      if (type === "insert") {
        query = supabase.from(table).insert(data)
      } else if (type === "update") {
        query = supabase.from(table).update(data)

        // Apply match conditions for update
        if (match) {
          Object.entries(match).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
      } else if (type === "delete") {
        query = supabase.from(table).delete()

        // Apply match conditions for delete
        if (match) {
          Object.entries(match).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
      }

      const { data: result, error } = await query

      if (error) throw error

      return result as T
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }

      // Call custom onSuccess handler
      if (options.onSuccess) {
        options.onSuccess(data)
      }
    },
  })
}

