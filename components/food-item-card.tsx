import { FoodItem } from '../types/food'
import { getDaysUntilExpiration, getExpirationStatus } from '../utils/expiration'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Package, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FoodItemCardProps {
  item: FoodItem,
  onDelete: (id: string) => void
}

export function FoodItemCard({ item, onDelete }: FoodItemCardProps) {
  const daysUntil = getDaysUntilExpiration(item.expirationDate)
  const status = getExpirationStatus(daysUntil)
  
  const getStatusText = () => {
    if (daysUntil < 0) return `Expired ${Math.abs(daysUntil)} days ago`
    if (daysUntil === 0) return 'Expires today'
    if (daysUntil === 1) return 'Expires tomorrow'
    return `Expires in ${daysUntil} days`
  }

  return (
    <Card className={`${status.bgColor} border-l-4 ${status.color.replace('text-', 'border-')}`}>
      <CardContent className="pl-4 pr-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <Badge variant="secondary" className={`${status.color} ${status.bgColor}`}>
            {status.status.toUpperCase()}
          </Badge>
        </div>

        
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>{item.category}</span>
            {/* <span className="text-gray-400">•</span>
            <span>Qty: {item.quantity}</span> */}
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{getStatusText()}</span>
          </div>
          {/* 
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div> */}
          
          <div className="text-xs text-gray-500">
            Expires: {item.expirationDate.toLocaleDateString()}
          </div>

          <div>
            <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(item.id)}
            aria-label="Delete item"
            className={"w-[100%] opacity-10 hover:opacity-100"}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
