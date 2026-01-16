"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboardData } from "@/hooks/useDashboardData"
import { DashboardHeader } from "./DashboardHeader"
import { OverviewTab } from "./OverviewTab"
import { WatchlistTab } from "./WatchlistTab"
import { HistoryTab } from "./HistoryTab"
import { PurchasesTab } from "./PurchasesTab"

export function UserDashboardContent() {
  const data = useDashboardData()

  if (data.loading) return <div className="p-6">Loading dashboard...</div>
  if (!data.user) return <div className="p-6 text-red-500">Failed to load user</div>

  return (
    <div>
      <DashboardHeader user={data.user} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="history">Watch History</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab {...data} />
        </TabsContent>

        <TabsContent value="watchlist">
          <WatchlistTab watchlist={data.watchlist} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab history={data.watchHistory} />
        </TabsContent>

        <TabsContent value="purchases">
          <PurchasesTab purchases={data.purchases} loading={data.purchasesLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
