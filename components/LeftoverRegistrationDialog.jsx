"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function LeftoverRegistrationDialog({
  opened,
  close,
  registerLeftover,
}) {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    name: "",
    expiration_date: null,
  });

  useEffect(() => {
    if (opened) {
      form.reset({
        name: "",
        expiration_date: null,
      });
    }
  }, [opened]);

  const onOpenChange = useCallback(
    (open) => {
      if (!open) {
        form.reset();
        close();
      }
    },
    [form, close]
  );

  return (
    <Dialog open={opened} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register new leftover</DialogTitle>
          <DialogDescription>
            Enter Expiration Date for this leftover
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                registerLeftover(form.getValues());
                setSubmitting(true);
              }}
            >
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the expiration date for this leftover.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting}>
                Register leftover
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
