"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MilkIcon as Cow, Stethoscope, Heart, DollarSign, CalendarClock } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { RecentTasks } from "@/components/recent-tasks"
import { useFarm } from "@/hooks/use-farm"
import { useLivestock } from "@/hooks/use-livestock"
import { useFinancialRecords } from "@/hooks/use-financial-records"
import { useTasks } from "@/hooks/use-tasks"
import { useAnalytics } from "@/hooks/use-analytics"
import { LivestockDistributionChart } from "@/components/livestock-distribution-chart"
import { HealthStatisticsChart } from "@/components/health-statistics-chart"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly")
  const { farms, isLoading: isLoadingFarms } = useFarm()
  const farmId = farms.length > 0 ? farms[0].id : undefined

  const { animals, isLoading: isLoadingAnimals } = useLivestock(farmId)
  const { financialRecords, isLoading: isLoadingFinancial } = useFinancialRecords(farmId)
  const { tasks, isLoading: isLoadingTasks } = useTasks(farmId)
  const { livestockByCategory, financialSummary, healthStats, breedingStats } = useAnalytics(farmId, timeframe)

  const pendingTasks = tasks.filter((task) => task.status === "Pending")

  const isLoading =
    isLoadingFarms ||
    isLoadingAnimals ||
    isLoadingFinancial ||
    isLoadingTasks ||
    livestockByCategory.isLoading ||
    financialSummary.isLoading ||
    healthStats.isLoading ||
    breedingStats.isLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Calculate financial metrics
  const income = financialRecords
    .filter((record) => record.transaction_type === "Income")
    .reduce((sum, record) => sum + record.amount, 0)

  const expenses = financialRecords
    .filter((record) => record.transaction_type === "Expense")
    .reduce((sum, record) => sum + record.amount, 0)

  const profit = income - expenses

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {farms.length > 0 ? farms[0].name : "Farm"} Dashboard
        </h1>
        <p className="text-muted-foreground">Overview of your livestock management statistics.</p>
      </div>

      <Tabs defaultValue={timeframe} className="space-y-4" onValueChange={(value) => setTimeframe(value as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
                <Cow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{animals.length}</div>
                <p className="text-xs text-muted-foreground">Across {livestockByCategory.data.length} categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Records</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthStats.data.reduce((sum, stat) => sum + stat.count, 0)}</div>
                <p className="text-xs text-muted-foreground">Total health events recorded</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Breeding Success</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{breedingStats.data.success_rate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Success rate for breeding</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <p className="text-xs text-muted-foreground">Tasks requiring attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
                <Cow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{animals.length}</div>
                <p className="text-xs text-muted-foreground">Across {livestockByCategory.data.length} categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R{" "}
                  {financialSummary.data
                    .filter((item) => item.period === "current")
                    .reduce((sum, item) => sum + item.income, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This week's revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R{" "}
                  {financialSummary.data
                    .filter((item) => item.period === "current")
                    .reduce((sum, item) => sum + item.expenses, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This week's costs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <p className="text-xs text-muted-foreground">Tasks requiring attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
                <Cow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{animals.length}</div>
                <p className="text-xs text-muted-foreground">Across {livestockByCategory.data.length} categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R{" "}
                  {financialSummary.data
                    .filter((item) => item.period === "current")
                    .reduce((sum, item) => sum + item.income, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This month's revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R{" "}
                  {financialSummary.data
                    .filter((item) => item.period === "current")
                    .reduce((sum, item) => sum + item.expenses, 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This month's costs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <p className="text-xs text-muted-foreground">Tasks requiring attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Monthly income and expenses</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart data={financialSummary.data} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTasks tasks={pendingTasks.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Livestock Distribution</CardTitle>
            <CardDescription>Animals by category</CardDescription>
          </CardHeader>
          <CardContent>
            <LivestockDistributionChart data={livestockByCategory.data} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Statistics</CardTitle>
            <CardDescription>Health events by type</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthStatisticsChart data={healthStats.data} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

