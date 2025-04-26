"use client"

import { useSupabaseQuery } from "./use-supabase-query"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useSupabaseAuth } from "./use-supabase-auth"

export function useAnalytics(farmId?: string, timeframe: "daily" | "weekly" | "monthly" | "yearly" = "monthly") {
  const { user } = useSupabaseAuth()

  // Get livestock count by category
  const livestockByCategory = useSupabaseQuery<{ category: string; count: number }[]>(
    "animals",
    ["analytics", "category", farmId || "all"],
    {
      enabled: !!user,
      queryFn: async () => {
        if (!user) return []

        const supabase = getSupabaseBrowserClient()

        const query = supabase.rpc("get_livestock_by_category", {
          farm_id_param: farmId,
        })

        const { data, error } = await query

        if (error) throw error

        return data || []
      },
    },
  )

  // Get financial summary
  const financialSummary = useSupabaseQuery<
    {
      income: number
      expenses: number
      profit: number
      period: string
    }[]
  >("financial_records", ["analytics", "financial", timeframe, farmId || "all"], {
    enabled: !!user,
    queryFn: async () => {
      if (!user) return []

      const supabase = getSupabaseBrowserClient()

      const query = supabase.rpc("get_financial_summary", {
        farm_id_param: farmId,
        timeframe_param: timeframe,
      })

      const { data, error } = await query

      if (error) throw error

      return data || []
    },
  })

  // Get health statistics
  const healthStats = useSupabaseQuery<
    {
      record_type: string
      count: number
      total_cost: number
    }[]
  >("health_records", ["analytics", "health", farmId || "all"], {
    enabled: !!user,
    queryFn: async () => {
      if (!user) return []

      const supabase = getSupabaseBrowserClient()

      const query = supabase.rpc("get_health_statistics", {
        farm_id_param: farmId,
      })

      const { data, error } = await query

      if (error) throw error

      return data || []
    },
  })

  // Get breeding statistics
  const breedingStats = useSupabaseQuery<{
    success_rate: number
    total_offspring: number
    avg_gestation: number
  }>("breeding_records", ["analytics", "breeding", farmId || "all"], {
    enabled: !!user,
    queryFn: async () => {
      if (!user) return { success_rate: 0, total_offspring: 0, avg_gestation: 0 }

      const supabase = getSupabaseBrowserClient()

      const query = supabase.rpc("get_breeding_statistics", {
        farm_id_param: farmId,
      })

      const { data, error } = await query

      if (error) throw error

      return data || { success_rate: 0, total_offspring: 0, avg_gestation: 0 }
    },
  })

  return {
    livestockByCategory: {
      data: livestockByCategory.data || [],
      isLoading: livestockByCategory.isLoading,
      isError: livestockByCategory.isError,
    },
    financialSummary: {
      data: financialSummary.data || [],
      isLoading: financialSummary.isLoading,
      isError: financialSummary.isError,
    },
    healthStats: {
      data: healthStats.data || [],
      isLoading: healthStats.isLoading,
      isError: healthStats.isError,
    },
    breedingStats: {
      data: breedingStats.data || { success_rate: 0, total_offspring: 0, avg_gestation: 0 },
      isLoading: breedingStats.isLoading,
      isError: breedingStats.isError,
    },
  }
}

