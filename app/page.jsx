import { Button } from "@/components/ui/button";
import { Barcode } from "lucide-react";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome Back!</h1>
      <Button className="mt-4 p-10"><Barcode/> Scan Barcode</Button>
    </div>
  );
}
