"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodItemCard } from "@/components/food-item-card";
import { Search, Filter, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortByExpiration } from "@/utils/expiration";
import { getTodayStr } from "@/utils/client/date";
import toast from "react-hot-toast";

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [mockFoodItems, setMockFoodItems] = useState(null);

  const filteredItems = useMemo(() => {
    if (!mockFoodItems) return [];
    return sortByExpiration(mockFoodItems).map((item) => {
      return {
        ...item,
        expirationDate: new Date(item.expirationDate),
      };
    }).filter((item) => {
      if (searchTerm) {
        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (categoryFilter !== "all") {
        return item.category === categoryFilter;
      }
      return true;
    });
  }, [searchTerm, categoryFilter, mockFoodItems]);

  const categories = mockFoodItems
    ? [...new Set(mockFoodItems.map((item) => item.category))]
    : [];

  useEffect(() => {
    fetch("/api/data/items")
      .then((resp) => resp.json())
      .then((resp) => setMockFoodItems(resp));
  }, []);

  const removeItem = useCallback(
    (item) => {
      fetch("/api/data/items", {
        method: "DELETE",
        body: JSON.stringify({
          item_id: item.id,
          expired: item.expired,
          dateStr: getTodayStr(),
        }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setMockFoodItems(resp);
          toast.custom(
            <div>
              <Trash2 className="w-4 h-4" />
              <p>Item removed</p>
            </div>,
            { duration: 2000 }
          );
        });
    },
    [mockFoodItems]
  );
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Items</h1>
          <p className="text-muted-foreground">
            List of items currently registered
          </p>
        </div>

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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                  <SelectItem className={""} value="all">
                    All Categories
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem className={""} key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card className={""}>
          <CardHeader className={""}>
            <CardTitle className={""}>
              Registered Items ({filteredItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={""}>
            {!mockFoodItems ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">Loading...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">No items found</p>
                <p>
                  Try adjusting your filters or add some food items to track
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    onDelete={removeItem}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
