"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProductRegistrationDialog from "@/components/ProductRegistrationDialog";
import toast from "react-hot-toast";

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState(null);

  const [productRegistrationData, setProductRegistrationData] = useState({});

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    console.log(filtered);

    return filtered;
  }, [searchTerm, categoryFilter, products]);

  const categories = products
    ? [...new Set(products.map((item) => item.category))]
    : [];

  const registerProduct = useCallback(
    (data) => {
      console.log(data);
      fetch("/api/manage/manual-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          console.log(resp);
          return resp;
        })
        .then((resp) => {
          if (resp.error) {
            alert(resp.error);
            return;
          }
          console.log(resp);
          setProductRegistrationData({});
          setProducts(resp);
          toast.success(`Added ${resp.filter((item) => item.id === data.product_id)[0].name}`);
        });
    },
    [products]
  );

  useEffect(() => {
    fetch("/api/manage/manual-registration")
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp);
        return resp;
      })
      .then((resp) => setProducts(resp));
  }, []);
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Manual Registration
          </h1>
          <p className="text-muted-foreground">
            Add an item from the list of currently registered products
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
                  placeholder="Search products..."
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
        <div className="overflow-x-auto rounded-lg shadow border-1 border-muted-foreground">
          <table className="min-w-full divide-y divide-muted-foreground">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-muted-foreground">
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No products found.
                  </td>
                </tr>
              )}
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <Button onClick={() => setProductRegistrationData(product)}>
                      <Plus className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ProductRegistrationDialog
          data={productRegistrationData}
          setData={setProductRegistrationData}
          close={() => setProductRegistrationData({})}
          registerProduct={registerProduct}
        />
      </div>
    </div>
  );
};

export default page;
