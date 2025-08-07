import { FoodItem } from '../types/food'
import { getDaysUntilExpiration } from '../utils/expiration'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock, Calendar, TrendingDown } from 'lucide-react'
import colors from "./colors";

interface SummaryCardsProps {
  items: FoodItem[]
}

export function SummaryCards({ items }: SummaryCardsProps) {
  const expiredItems = items.filter(item => getDaysUntilExpiration(item.expirationDate) < 0)
  const todayItems = items.filter(item => getDaysUntilExpiration(item.expirationDate) === 0)
  const soonItems = items.filter(item => {
    const days = getDaysUntilExpiration(item.expirationDate)
    return days > 0 && days <= 3
  })
  const upcomingItems = items.filter(item => {
    const days = getDaysUntilExpiration(item.expirationDate)
    return days > 3 && days <= 7
  })

  const summaryData = [
    {
      title: 'Expired',
      count: expiredItems.length,
      icon: AlertTriangle,
      ...colors.expired
    },
    {
      title: 'Expires Today',
      count: todayItems.length,
      icon: Clock,
      ...colors.today
    },
    {
      title: 'Expires Soon (1-3 days)',
      count: soonItems.length,
      icon: Calendar,
      ...colors.soon
    },
    {
      title: 'Upcoming (4-7 days)',
      count: upcomingItems.length,
      icon: TrendingDown,
      ...colors.upcoming
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryData.map((item, index) => (
        <Card key={index} className={`${item.bgColor} ${item.borderColor} border`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent className={""}>
            <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
