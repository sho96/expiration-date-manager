"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import React, { useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"

const NewProductRegistrationDialog = ({ data, setData, close, registerNewProduct }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      code: ""
    }
  })

  useEffect(() => {
    if (data.code) {
      form.reset({
        name: "",
        type: "",
        code: data.code
      })
    }
  }, [data.code])
  const onOpenChange = useCallback((open) => {
    if (!open) {
      form.reset()
      close();
      setData({});
    }
  }, [form, setData, close])

  return (
    <Dialog open={!!data.code} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Product</DialogTitle>
          <DialogDescription>
            Register a new product for code: {data.code}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerNewProduct)}>
              {/* Product Name: select from existing or enter new */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        id="product-name"
                        list="product-names"
                        placeholder="Enter or select product name"
                        {...field}
                      />
                    </FormControl>
                    <datalist id="product-names">
                      {data.allProducts?.map(product => (
                        <option key={product.id} value={product.name} />
                      ))}
                    </datalist>
                    <FormDescription>
                      You can enter a new product name or select from existing ones.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Product Type: select from existing or enter new */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <FormControl>
                      <Input
                        id="product-type"
                        list="product-types"
                        placeholder="Enter or select product type"
                        {...field}
                      />
                    </FormControl>
                    <datalist id="product-types">
                      {data.allProductTypes?.map(type => (
                        <option key={type.id} value={type.name} />
                      ))}
                    </datalist>
                    <FormDescription>
                      You can enter a new product type or select from existing ones.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting} onClick={() => setSubmitting(true)}>Register</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default NewProductRegistrationDialog