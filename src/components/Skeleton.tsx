import React from "react";
import { cn } from "../lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-on-surface-variant/10", className)}
      {...props}
    />
  );
}

export function MetricSkeleton() {
  return (
    <div className="bg-surface-container-high rounded-2xl p-5 border-t-2 border-on-surface-variant/10">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32 mb-4" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6 min-h-[350px] flex flex-col border border-on-surface-variant/5">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
        </div>
      </div>
      <div className="flex-1 flex items-end gap-4 px-4 pb-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1" 
            style={{ height: `${Math.random() * 60 + 20}%` }} 
          />
        ))}
      </div>
    </div>
  );
}
