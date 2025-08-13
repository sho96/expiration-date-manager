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
import { Button } from "@/components/ui/button";
import React from 'react'
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";



const SaveRecipeDialog = ({ opened, close, saveRecipe }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const onOpenChange = (open) => {
    if (!open) {
      form.reset();
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={opened} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Recipe</DialogTitle>
          <DialogDescription>
            Enter a title for this recipe
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveRecipe(form.getValues());
                setSubmitting(true);
              }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SaveRecipeDialog