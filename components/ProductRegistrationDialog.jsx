"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import React, { useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"

const ProductRegistrationDialog = ({ data, setData, close, registerProduct }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    product_id: data.id,
    expiration_date: null
  });
  
  useEffect(() => {
    if (data.id) {
      form.reset({
        product_id: data.id,
        expiration_date: null
      })
    }
  }, [data.id])

  const onOpenChange = useCallback((open) => {
    if (!open) {
      form.reset()
      close();
      setSubmitting(false);
      setData({});
    }
  }, [form, setData, close])

  return (
    <Dialog open={data.id} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scanned: {data.name}</DialogTitle>
          <DialogDescription>
            Enter Expiration Date for {data.name}
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={e => {
              e.preventDefault();
              setSubmitting(true);
              registerProduct(form.getValues());
            }}>
              <FormField
                control={form.control}
                name="expiration_date"
                rules={{ required: "Expiration date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline">
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={date => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the expiration date for this product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting}>Register Product</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ProductRegistrationDialog