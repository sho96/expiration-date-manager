import { FoodItem } from '../types/food'
import { getDaysUntilExpiration, getExpirationStatus } from '../utils/expiration'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Package, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BarcodeCard({ item, onDelete }) {
  return (
    <Card className={`border-l-4`}>
      <CardContent className="pl-4 pr-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.id}</h3>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>{item.name}</span>
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
