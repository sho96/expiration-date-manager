export interface FoodItem {
  id: string
  name: string
  category: string
  expirationDate: Date
}

export interface ExpirationStatus {
  status: 'expired' | 'today' | 'soon' | 'upcoming'
  daysUntilExpiration: number
  color: string
  bgColor: string
}
