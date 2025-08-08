"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FoodItemCard } from '@/components/food-item-card'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sortByExpiration } from "@/utils/expiration";
import { LeftoverCard } from "@/components/leftover-card";
import { Button } from "@/components/ui/button";
import {LeftoverRegistrationDialog} from "@/components/LeftoverRegistrationDialog";

const page = () => {
  const [leftoverRegistrationDialogOpened, setLeftoverRegistrationDialogOpened] = useState(false);

  const [searchTerm, setSearchTerm] = useState('')
    const [leftovers, setLeftovers] = useState(null);
  
    const filteredLeftovers = useMemo(() => {
      if (!leftovers) return [];
      return sortByExpiration(leftovers).map(item => {
      return {
        ...item,
        expirationDate: new Date(item.expiration_date)
      }
    });
    }, [searchTerm, leftovers])
    
    useEffect(() => {
      fetch("/api/data/leftovers")
      .then(resp => resp.json())
      .then(resp => setLeftovers(resp));    
    }, []);

    const removeLeftover = useCallback(id => {
      fetch("/api/data/leftovers", {
        method: "DELETE",
        body: JSON.stringify({
          id
        })
      })
      .then(resp => resp.json())
      .then(resp => {
        setLeftovers(resp);
      })
    }, [leftovers])

    const registerLeftover = useCallback(data => {
      console.log(data);
      fetch("/api/data/leftovers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((r) => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error);
          return;
        }
        console.log(resp);
        setLeftovers(resp);
        setLeftoverRegistrationDialogOpened(false);
      })
    }, [leftovers])
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Leftovers
          </h1>
          <p className="text-muted-foreground">
            List of leftovers currently registered
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
                  placeholder="Search leftovers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={"mb-6"}>
          <Button onClick={() => setLeftoverRegistrationDialogOpened(true)}>+ Add Leftover</Button>
        </Card>
        <Card className={""}>
          <CardHeader className={""}>
            <CardTitle className={""}>
              Registered Leftovers ({filteredLeftovers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={""}>
            {!leftovers ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">Loading...</p>
              </div>
            ) : filteredLeftovers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">No leftovers found</p>
                <p>
                  Try adjusting your filters or register a leftover to track
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeftovers.map((leftover) => (
                  <LeftoverCard key={leftover.id} leftover={leftover} onDelete={removeLeftover} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <LeftoverRegistrationDialog opened={leftoverRegistrationDialogOpened} close={() => setLeftoverRegistrationDialogOpened(false)} registerLeftover={registerLeftover} />
      </div>
    </div>
  );
};

export default page;
