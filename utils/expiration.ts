import { FoodItem, ExpirationStatus } from '../types/food'

export function getDaysUntilExpiration(expirationDate: Date): number {
  const today = new Date()
  const expDate = new Date(expirationDate)
  const diffTime = expDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getExpirationStatus(daysUntil: number): ExpirationStatus {
  if (daysUntil < 0) {
    return {
      status: 'expired',
      daysUntilExpiration: daysUntil,
      color: 'text-red-700',
      bgColor: 'bg-red-100'
    }
  } else if (daysUntil === 0) {
    return {
      status: 'today',
      daysUntilExpiration: daysUntil,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  } else if (daysUntil <= 3) {
    return {
      status: 'soon',
      daysUntilExpiration: daysUntil,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  } else if (daysUntil <= 7) {
    return {
      status: 'upcoming',
      daysUntilExpiration: daysUntil,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  }
  
  return {
    status: 'upcoming',
    daysUntilExpiration: daysUntil,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
}

export function filterItemsNearExpiration(items: FoodItem[], maxDays: number = 7): FoodItem[] {
  return items.filter(item => {
    const daysUntil = getDaysUntilExpiration(item.expirationDate)
    return daysUntil <= maxDays
  })
}

export function sortByExpiration(items: FoodItem[]): FoodItem[] {
  return [...items].sort((a, b) => 
    new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  )
}
