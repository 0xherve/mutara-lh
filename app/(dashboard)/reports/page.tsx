"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart2, PieChart } from "lucide-react"
import { useFarm } from "@/hooks/use-farm"
import { useAnalytics } from "@/hooks/use-analytics"
import { LoadingSpinner } from "@/components/loading-spinner"
import { LivestockDistributionChart } from "@/components/livestock-distribution-chart"
import { HealthStatisticsChart } from "@/components/health-statistics-chart"
import { DashboardChart } from "@/components/dashboard-chart"
import { BreedingSuccessChart } from "@/components/breeding-success-chart"

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")
  const { farms, isLoading: isLoadingFarms } = useFarm()
  const farmId = farms.length > 0 ? farms[0].id : undefined

  const { livestockByCategory, financialSummary, healthStats, breedingStats } = useAnalytics(farmId, timeframe)

  const isLoading =
    isLoadingFarms ||
    livestockByCategory.isLoading ||
    financialSummary.isLoading ||
    healthStats.isLoading ||
    breedingStats.isLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate insights on your livestock operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial">
            <FileText className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="livestock">
            <PieChart className="h-4 w-4 mr-2" />
            Livestock
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {livestockByCategory.data.reduce((sum, item) => sum + item.count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across {livestockByCategory.data.length} categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R {financialSummary.data.reduce((sum, item) => sum + item.income, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">For selected period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R {financialSummary.data.reduce((sum, item) => sum + item.expenses, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">For selected period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Breeding Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{breedingStats.data.success_rate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Overall success rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Income vs Expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart data={financialSummary.data} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Livestock Distribution</CardTitle>
                <CardDescription>Animals by category</CardDescription>
              </CardHeader>
              <CardContent>
                <LivestockDistributionChart data={livestockByCategory.data} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
              <CardDescription>Detailed financial analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <DashboardChart data={financialSummary.data} />
              </div>

              <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R {financialSummary.data.reduce((sum, item) => sum + item.income, 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      R {financialSummary.data.reduce((sum, item) => sum + item.expenses, 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R {financialSummary.data.reduce((sum, item) => sum + item.profit, 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Costs Analysis</CardTitle>
              <CardDescription>Breakdown of health-related expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthStatisticsChart data={healthStats.data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livestock" className="space-y-4">
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
                <CardTitle>Breeding Performance</CardTitle>
                <CardDescription>Success rates and offspring counts</CardDescription>
              </CardHeader>
              <CardContent>
                <BreedingSuccessChart data={breedingStats.data} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Statistics</CardTitle>
              <CardDescription>Health events by type</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthStatisticsChart data={healthStats.data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

