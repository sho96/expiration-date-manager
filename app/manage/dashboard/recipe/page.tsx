"use client";

import { useState, useEffect, useCallback } from "react";
import { streamingFetch } from "@/utils/client/streaming";

import { micromark } from "micromark";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";

async function markdownToHtml(markdown: string) {
  const output = micromark(markdown, {
    extensions: [gfmTable()],
    htmlExtensions: [gfmTableHtml()],
  });
  return output;
}

export default function RenderStreamData() {
  const [data, setData] = useState<any[]>(["Click Generate!"]);
  const [html, setHtml] = useState("");
  //cookie to store language and model
  const [language, setLanguage] = useState("en");
  const [model, setModel] = useState("gpt-oss-120b");

  useEffect(() => {
    if (!localStorage){
      return;
    }
    setLanguage(localStorage.getItem("language") || "en");
    setModel(localStorage.getItem("model") || "gpt-oss-120b");
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("model", model);
  }, [language, model]);

  const handleGenerate = useCallback(() => {
    setData([]);
    setHtml(null);
    const asyncFetch = async () => {
      const stream = streamingFetch(
        `/api/manage/dashboard/recipe?language=${language}&model=${model}`
      );

      let count = 0;
      let joined = "";
      for await (let value of stream) {
        try {
          joined += value;
          count++;
          if (count % 10 === 0) {
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
  }, [language, model]);

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-4">
        <a href="/manage/dashboard" className="flex text-muted-foreground hover:text-foreground">
          <CircleArrowLeft className="mr-2" />
          Back to Dashboard
        </a>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground; mb-2">
            Recipe Generator
          </h1>
          <p className="text-muted-foreground">
            Let AI generate recipes for you!
          </p>
        </div>
        <div className="mb-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className={""}>
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
        <div className="mb-4">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className={""}>
              <SelectItem value="qwen-3-32b" className={""}>
                qwen-3-235b-a22b-instruct-2507
              </SelectItem>
              <SelectItem value="qwen-3-235b-a22b-thinking-2507" className={""}>
                qwen-3-235b-a22b-thinking-2507
              </SelectItem>
              <SelectItem value="qwen-3-coder-480b" className={""}>
                qwen-3-coder-480b
              </SelectItem>
              <SelectItem value="llama-3.3-70b" className={""}>
                llama-3.3-70b
              </SelectItem>
              <SelectItem value="gpt-oss-120b" className={""}>
                gpt-oss-120b
              </SelectItem>
              <SelectItem value="qwen-3-32b" className={""}>
                qwen-3-32b
              </SelectItem>
              <SelectItem value="llama3.1-8b" className={""}>
                llama3.1-8b
              </SelectItem>
              <SelectItem value="llama-4-scout-17b-16e-instruct" className={""}>
                llama-4-scout-17b-16e-instruct
              </SelectItem>
              <SelectItem
                value="llama-4-maverick-17b-128e-instruct"
                className={""}
              >
                llama-4-maverick-17b-128e-instruct
              </SelectItem>
              {/* Add more models as needed */}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Button variant={"outline"} size={"default"} disabled={!html} type="button" className="" onClick={handleGenerate}>Generate</Button>
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
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
