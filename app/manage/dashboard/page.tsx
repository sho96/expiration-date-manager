'use client'

import { useState, useMemo, useEffect } from 'react'
import { FoodItem } from '@/types/food'
import { filterItemsNearExpiration, sortByExpiration } from '@/utils/expiration'
import { SummaryCards } from '@/components/summary-cards'
import { FoodItemCard } from '@/components/food-item-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import useSWR from 'swr'

// Mock data for demonstration
/* const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Milk',
    category: 'Dairy',
    expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Expired 1 day ago
  },
  {
    id: '2',
    name: 'Bread',
    category: 'Bakery',
    expirationDate: new Date(Date.now()), // Expires today
  },
  {
    id: '3',
    name: 'Yogurt',
    category: 'Dairy',
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
  },
  {
    id: '4',
    name: 'Bananas',
    category: 'Fruits',
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expires in 2 days
  },
  {
    id: '5',
    name: 'Chicken Breast',
    category: 'Meat',
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Expires in 3 days
  },
  {
    id: '6',
    name: 'Lettuce',
    category: 'Vegetables',
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Expires in 5 days
  },
  {
    id: '7',
    name: 'Eggs',
    category: 'Dairy',
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
  }
] */

export default function ExpirationDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [daysFilter, setDaysFilter] = useState('7')
  const [mockFoodItems, setMockFoodItems] = useState<FoodItem[] | null>(null);

  const filteredItems = useMemo(() => {
    if (!mockFoodItems) return [];
    let items = filterItemsNearExpiration(mockFoodItems, parseInt(daysFilter))
    
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter)
    }
    
    const sorted = sortByExpiration(items)
    console.log(sorted);
    return sorted.map(item => {
      return {
        ...item,
        expirationDate: new Date(item.expirationDate)
      }
    });
  }, [searchTerm, categoryFilter, daysFilter, mockFoodItems])

  const categories = mockFoodItems ? [...new Set(mockFoodItems.map(item => item.category))] : []

  useEffect(() => {
    fetch("/api/manage/dashboard")
    .then(resp => resp.json())
    .then(resp => setMockFoodItems(resp));    
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Expiration Dashboard</h1>
          <p className="text-gray-600">Track your food items and never let anything go to waste</p>
        </div>
        <SummaryCards items={filteredItems} />

        <Card className="mb-6">
          <CardHeader className={""}>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className={""}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type={"text"}
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className={""}>
                  <SelectItem className={""} value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem className={""} key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={daysFilter} onValueChange={setDaysFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Days until expiration" />
                </SelectTrigger>
                <SelectContent className={""}>
                  <SelectItem className={""} value="1">Next 1 day</SelectItem>
                  <SelectItem className={""} value="3">Next 3 days</SelectItem>
                  <SelectItem className={""} value="7">Next 7 days</SelectItem>
                  <SelectItem className={""} value="14">Next 14 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card className={""}>
          <CardHeader className={""}>
            <CardTitle className={""}>Items Near Expiration ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent className={""}>
            {!mockFoodItems ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">Loading...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No items found</p>
                <p>Try adjusting your filters or add some food items to track</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <FoodItemCard key={item.id} item={item} onDelete={null}/>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
