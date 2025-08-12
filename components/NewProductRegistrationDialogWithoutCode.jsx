"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const NewProductRegistrationDialogWithoutCode = ({
  allProducts,
  allProductTypes,
  open,
  close,
  registerNewProduct,
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
    },
  });

  useEffect(() => {
    if (open) {
      setSubmitting(false);
      form.reset({
        name: "",
        type: "",
      });
    }
  }, [open]);
  const onOpenChange = useCallback(
    (open) => {
      if (!open) {
        form.reset();
        close();
        setSubmitting(false);
      }
    },
    [form, close]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Product</DialogTitle>
          <DialogDescription>
            Register a new product with a name and type
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                registerNewProduct(form.getValues());
              }}
            >
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
                      {allProducts?.map((product) => (
                        <option key={product.id} value={product.name} />
                      ))}
                    </datalist>
                    <FormDescription>
                      You can enter a new product name or select from existing
                      ones.
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
                      {allProductTypes?.map((type, index) => (
                        <option key={index} value={type} />
                      ))}
                    </datalist>
                    <FormDescription>
                      You can enter a new product type or select from existing
                      ones.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting}>
                Register
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewProductRegistrationDialogWithoutCode;
