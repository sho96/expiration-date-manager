"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductTypeCard } from "@/components/product-type-card";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productTypes, setProductTypes] = useState(null);

  const filteredProductTypes = useMemo(() => {
    if (!productTypes) return [];

    let filtered = productTypes;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    console.log(filtered);

    return filtered;
  }, [searchTerm, productTypes]);

  useEffect(() => {
    fetch("/api/data/product-types")
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp);
        return resp;
      })
      .then((resp) => setProductTypes(resp));
  }, []);
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Product Types
          </h1>
          <p className="text-muted-foreground">
            List of product types currently registered
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
                  placeholder="Search product types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            {!productTypes ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProductTypes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-lg mb-2">No product types found</p>
                  </div>
                ) : (
                  filteredProductTypes.map((productType) => (
                    <ProductTypeCard
                      key={productType.id}
                      category={productType}
                    />
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
