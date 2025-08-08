export interface Leftover {
  id: string
  name: string
  expirationDate: Date
}

export interface ExpirationStatus {
  status: 'expired' | 'today' | 'soon' | 'upcoming'
  daysUntilExpiration: number
  color: string
  bgColor: string
}
