"use client";

import { FoodItem } from "../types/food";
import {
  getDaysUntilExpiration,
  getExpirationStatus,
} from "../utils/expiration";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Leftover } from "@/types/leftover";
import { useState } from "react";

interface onDeleteProps {
  id: string;
  expired: boolean;
}
interface LeftoverCardProps {
  leftover: Leftover;
  onDelete?: (leftover: onDeleteProps) => void;
}

export function LeftoverCard({ leftover, onDelete }: LeftoverCardProps) {
  const [pressed, setPressed] = useState(false);
  const daysUntil = getDaysUntilExpiration(leftover.expirationDate);
  const status = getExpirationStatus(daysUntil);

  const getStatusText = () => {
    if (daysUntil < 0) return `Expired ${Math.abs(daysUntil)} days ago`;
    if (daysUntil === 0) return "Expires today";
    if (daysUntil === 1) return "Expires tomorrow";
    return `Expires in ${daysUntil} days`;
  };

  return (
    <Card
      className={`${status.bgColor} border-l-4 ${status.color.replace(
        "text-",
        "border-"
      )} p-4`}
    >
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{leftover.name}</h3>
          <Badge
            variant="secondary"
            className={`${status.color} ${status.bgColor}`}
          >
            {status.status.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{getStatusText()}</span>
          </div>
          {/* 
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{leftover.location}</span>
          </div> */}

          <div className="text-xs text-muted-foreground">
            Expires: {leftover.expirationDate.toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="">
        {onDelete && (
          <Button
            variant={"destructive"}
            size="icon"
            disabled={pressed}
            onClick={() => {
              setPressed(true);
              onDelete({
                id: leftover.id,
                expired: daysUntil < 0,
              });
            }}
            aria-label="Delete item"
            className={"w-[100%] opacity-30 hover:opacity-100"}
          >
            <Trash2 />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
