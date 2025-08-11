"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Trash2, Barcode } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarcodeCard } from "@/components/barcode-card";
import toast from "react-hot-toast";


const page = () => {
  const [searchTerm, setSearchTerm] = useState('')
    const [barcodes, setBarcodes] = useState(null);
  
    const filteredBarcodes = useMemo(() => {
      if (!barcodes) return [];

      let filtered = barcodes;

      if (searchTerm){
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase()))
      }

      return filtered;
    }, [searchTerm, barcodes])
  
    useEffect(() => {
      fetch("/api/data/barcodes")
      .then(resp => resp.json())
      .then(resp => setBarcodes(resp));    
    }, []);

    const removeCode = useCallback(code => {
      fetch("/api/data/barcodes", {
        method: "DELETE",
        body: JSON.stringify({
          code
        })
      })
      .then(resp => resp.json())
      .then(resp => {
        setBarcodes(resp);
        toast.custom(<div><Trash2 className="w-4 h-4 mr-2" /> Code removed</div>, { duration: 2000 })
      })
    }, [barcodes])
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Barcode size={30} className="mr-3" />
            Barcodes
          </h1>
          <p className="text-muted-foreground">
            List of barcodes currently registered
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
                  placeholder="Search barcodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={""}>
          <CardHeader className={""}>
            <CardTitle className={""}>
              Registered Barcodes ({filteredBarcodes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={""}>
            {!barcodes ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">Loading...</p>
              </div>
            ) : filteredBarcodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">No barcodes found</p>
                <p>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBarcodes.map((item) => (
                  <BarcodeCard key={item.id} item={item} onDelete={removeCode} />
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
