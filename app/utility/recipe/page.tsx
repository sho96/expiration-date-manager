"use client";

import response_styles from "./response.module.css";

import { useState, useEffect, useCallback } from "react";
import { streamingFetch } from "@/utils/client/streaming";

import { micromark } from "micromark";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
import { gfmHtml } from "micromark-extension-gfm";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChefHat, CircleArrowLeft, ScrollText } from "lucide-react";
import { Input } from "@/components/ui/input";

import SaveRecipeDialog from "@/components/SaveRecipeDialog";
import toast from "react-hot-toast";

async function markdownToHtml(markdown: string) {
  const output: string = micromark(markdown, {
    extensions: [gfmTable()],
    htmlExtensions: [gfmTableHtml(), gfmHtml()],
  });
  return output;
}

export default function RenderStreamData() {
  const [data, setData] = useState<any[]>(["## Choose a recipe..."]);
  const [html, setHtml] = useState("");
  
  const [selectedRecipe, setSelectedRecipe] = useState("");

  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    if (!localStorage){
      return;
    }
    fetch("/api/utility/recipe")
      .then((r) => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error);
          return;
        }
        console.log(resp);
        setSavedRecipes(resp.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      })
  }, []);

  useEffect(() => {
    const asyncFetch = async () => {
      let omitIndex = 0;
      if (data.join("").startsWith("<think>")) {
        // omit the <think> tag until </think> is found
        omitIndex = data.join("").indexOf("</think>");
        if (omitIndex === -1) {
          setHtml("<h4>AI is thinking...</h4>");
          return;
        }
      }
      let string = data
        .join("")
        .slice(omitIndex + omitIndex == 0 ? 0 : "</think>".length);
      // remove until the last </think> tag
      if (string.lastIndexOf("</think>") !== -1) {
        string = string.slice(
          string.lastIndexOf("</think>") + "</think>".length
        );
      }
      const html = await markdownToHtml(string);
      setHtml(html);
    };
    asyncFetch();
  }, [data]);
  
  useEffect(() => {
    if (!selectedRecipe) {
      return;
    }
    setData([savedRecipes.find((recipe) => recipe.id === selectedRecipe).content]);
  }, [selectedRecipe, savedRecipes]);

  useEffect(() => {
    console.log(html);
  }, [html])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground; mb-3 flex items-center">
            <ScrollText size={30} className="mr-2"/>
            Recipe
          </h1>
          <p className="text-muted-foreground">
            See saved recipes
          </p>
        </div>
        <div className="mb-4">
          <Select onValueChange={setSelectedRecipe} value={selectedRecipe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a recipe..." />
            </SelectTrigger>
            <SelectContent className={"max-h-60 overflow-y-auto"}>
              {savedRecipes && savedRecipes.map((recipe) => (
                <SelectItem className="capitalize" key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {!html && (
          <div className="text-muted-foreground flex flex-col gap-2">
            <Skeleton className="h-[20px] w-[150px] rounded-full" />
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
            <Skeleton className="h-[20px] w-[120px] rounded-full" />
          </div>
        )}
        {html && (
          <div
            className={`prose prose-invert max-w-none ${response_styles.response}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
