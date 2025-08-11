"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";

export default function Home() {
  const [session, setSession] = useState(null);
  const [nDays, setNDays] = useState(1);

  const handleLogin = useCallback(async () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session, nDays }),
    }).then(() => (window.location.href = "/manage/dashboard"));
  });

  return (
    <div className="p-4 flex flex-col gap-4 w-full max-w-100">
      <Input
        placeholder="password"
        type="password"
        className={"text-center"}
        onChange={(e) => setSession(e.target.value)}
      />
      <div className="flex flex-row gap-2 justify-center items-center">
        <p>Stay logged in for</p>
        <Input
          placeholder="Number of days"
          type="number"
          className={"text-center w-[100px]"}
          value={nDays}
          onChange={(e) => setNDays(e.target.value)}
          min={1}
          max={7}
        />
        <p>days</p>
      </div>
      <Button onClick={handleLogin}>Go to dashboard</Button>
    </div>
  );
}
