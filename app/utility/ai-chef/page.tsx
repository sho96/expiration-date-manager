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
import { ChefHat, CircleArrowLeft } from "lucide-react";
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
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const [data, setData] = useState<any[]>(["## Click Generate!"]);
  const [html, setHtml] = useState("");
  //cookie to store language and model
  const [language, setLanguage] = useState("en");
  const [model, setModel] = useState("gpt-oss-120b");
  const [postscript, setPostscript] = useState("");

  const [savedRecipes, setSavedRecipes] = useState([]);

  const [saveRecipeDialogOpened, setSaveRecipeDialogOpened] = useState(false);

  useEffect(() => {
    if (!localStorage){
      return;
    }
    setLanguage(localStorage.getItem("language") || "en");
    setModel(localStorage.getItem("model") || "gpt-oss-120b");

    fetch("/api/utility/ai-chef/models")
      .then((r) => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error);
          return;
        }
        console.log(resp);
        setAvailableModels(resp);
      })

    fetch("/api/utility/ai-chef/recipe")
      .then((r) => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error);
          return;
        }
        console.log(resp);
        setSavedRecipes(resp.recipes);
      })
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("model", model);
  }, [language, model]);

  const handleSaveRecipe = useCallback((title) => {
    if (title.title && data){
      fetch("/api/utility/ai-chef/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.title, content: data.join("") }),
      })
      .then((r) => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error);
          return;
        }
        console.log(resp);
        setSaveRecipeDialogOpened(false);
        toast.success("Recipe saved!");
      })
    }
  }, [data]);

  const handleGenerateRecipe = useCallback(() => {
    setData([]);
    setHtml(null);
    const asyncFetch = async () => {
      const stream = streamingFetch(
        `/api/utility/ai-chef?language=${language}&model=${model}&type=dish&ps=${postscript}`
      );

      let count = 0;
      let joined = "";
      for await (let value of stream) {
        try {
          joined += value;
          count++;
          if (count % 50 === 0) {
            setData((prev) => [...prev, joined]);
            joined = "";
          }
        } catch (e: any) {
          console.warn(e.message);
        }
      }

      setData((prev) => [...prev, joined]);
    };
    asyncFetch();
  }, [language, model, postscript]);
  const handleGenerateDessertRecipe = useCallback(() => {
    setData([]);
    setHtml(null);
    const asyncFetch = async () => {
      const stream = streamingFetch(
        `/api/utility/ai-chef?language=${language}&model=${model}&type=dessert&ps=${postscript}`
      );

      let count = 0;
      let joined = "";
      for await (let value of stream) {
        try {
          joined += value;
          count++;
          if (count % 30 === 0) {
            setData((prev) => [...prev, joined]);
            joined = "";
          }
        } catch (e: any) {
          console.warn(e.message);
        }
      }

      setData((prev) => [...prev, joined]);
    };
    asyncFetch();
  }, [language, model, postscript]);

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
    console.log(html);
  }, [html])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground; mb-3 flex items-center">
            <ChefHat size={30} className="mr-2"/>
            AI Chef
          </h1>
          <p className="text-muted-foreground">
            Let AI generate a recipe based on your items and leftovers!
          </p>
        </div>
        <div className="mb-8 flex flex-col gap-4 items-start w-full max-w-100">
          <div className="flex flex-row gap-2 items-center">
            <label htmlFor="language" className="shrink">Language: </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="grow">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="grow">
                <SelectItem value="en" className={""}>
                  English
                </SelectItem>
                <SelectItem value="es" className={""}>
                  Spanish
                </SelectItem>
                <SelectItem value="ja" className={""}>
                  Japanese
                </SelectItem>
                {/* Add more languages as needed */}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <label htmlFor="model" className="">Chef: </label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="grow">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="grow">
                {availableModels && availableModels.map((model) => (
                  <SelectItem key={model} value={model} className={""}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <label htmlFor="postscript" className="">P.S. </label>
            <Input type="text" placeholder="Add Postscript..." className="" value={postscript} onChange={(e) => setPostscript(e.target.value)} />
          </div>
          <Button variant={"default"} size={"default"} disabled={!html} type="button" className="w-full" onClick={() => setSaveRecipeDialogOpened(true)}>Save Recipe</Button>
          <Button variant={"outline"} size={"default"} disabled={!html} type="button" className="w-full" onClick={handleGenerateRecipe}>Generate Dish</Button>
          <Button variant={"outline"} size={"default"} disabled={!html} type="button" className="w-full" onClick={handleGenerateDessertRecipe}>Generate Dessert</Button>
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
      <SaveRecipeDialog opened={saveRecipeDialogOpened} close={() => setSaveRecipeDialogOpened(false)} saveRecipe={handleSaveRecipe} />
    </div>
  );
}
