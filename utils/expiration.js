import colors from '@/components/colors'

export function getDaysUntilExpiration(expirationDate) {
  const today = new Date()
  const expDate = new Date(expirationDate)
  const diffTime = expDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getExpirationStatus(daysUntil) {
  if (daysUntil < 0) {
    return {
      status: 'expired',
      daysUntilExpiration: daysUntil,
      ...colors.expired
    }
  } else if (daysUntil === 0) {
    return {
      status: 'today',
      daysUntilExpiration: daysUntil,
      ...colors.today
    }
  } else if (daysUntil <= 3) {
    return {
      status: 'soon',
      daysUntilExpiration: daysUntil,
      ...colors.soon
    }
  } else if (daysUntil <= 7) {
    return {
      status: 'upcoming',
      daysUntilExpiration: daysUntil,
      ...colors.upcoming
    }
  }
  
  return {
    status: 'upcoming',
    daysUntilExpiration: daysUntil,
    ...colors.upcoming
  }
}

export function filterItemsNearExpiration(items, maxDays) {
  return items.filter(item => {
    const daysUntil = getDaysUntilExpiration(item.expirationDate)
    console.log(item, daysUntil);
    return daysUntil <= maxDays
  })
}

export function sortByExpiration(items) {
  return [...items].sort((a, b) => 
    new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  )
}
