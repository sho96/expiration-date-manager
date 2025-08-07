import { FoodItem } from '../types/food'
import { getDaysUntilExpiration } from '../utils/expiration'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock, Calendar, TrendingDown } from 'lucide-react'

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
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Expires Today',
      count: todayItems.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Expires Soon (1-3 days)',
      count: soonItems.length,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Upcoming (4-7 days)',
      count: upcomingItems.length,
      icon: TrendingDown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
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
