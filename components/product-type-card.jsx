import React from 'react'
import { Card } from './ui/card'

export function ProductTypeCard({ category }) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <h3 className="font-semibold text-lg text-center">{category.name}</h3>
    </Card>
  )
}