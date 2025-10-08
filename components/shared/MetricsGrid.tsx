"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import * as React from "react";
import { MetricCard } from "@/types";

function badgeStyle(trend: "up" | "down" | "flat") {
  switch (trend) {
    case "up":   return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50";
    case "down": return "bg-rose-50 text-rose-700 ring-1 ring-rose-200/50";
    default:     return "bg-slate-50 text-slate-600 ring-1 ring-slate-200/50";
  }
}

function trendIcon(trend: "up" | "down" | "flat") {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
}

/** one skeleton card: keeps the same height as real card */
function MetricSkeleton() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-2xl">
      <CardContent className="p-5 sm:p-7">
        <div className="flex items-start justify-between mb-5">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-3.5 w-28 rounded-md" />
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
          <div className="relative">
            <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-slate-100/50" />
          </div>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/60 to-transparent h-px" />
        </div>

        <div className="space-y-2.5">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-3.5 w-full max-w-xs" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsGrid({
  cards,
  statusFilter,
  onClickCard,
  isLoading = false,
  skeletonCount = 4,
}: {
  cards: MetricCard[];
  statusFilter: string;
  onClickCard: (filterValue: string) => void;
  isLoading?: boolean;
  skeletonCount?: number;
  color?: string;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
      {cards.map((m, i) => {
        const Icon = m.icon;
        const isActive = statusFilter === m.filterValue;

        return (
          <Card
            key={i}
            onClick={() => onClickCard(m.filterValue)}
            className={[
              "group relative overflow-hidden cursor-pointer",
              "",
              "border transition-all duration-500 ease-out",
              "rounded-2xl shadow-sm border-slate-200 border",
              "hover:shadow-xl hover:shadow-slate-200/50",
              "active:scale-[0.98]",
              isActive
                ? "border-[#27AAE1]/40 ring-2 ring-[#27AAE1]/30 shadow-lg shadow-[#27AAE1]/10"
                : "border-slate-200/60 shadow-sm hover:border-slate-300/60",
            ].join(" ")}
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#27AAE1]/0 via-transparent to-[#27AAE1]/0 group-hover:from-[#27AAE1]/5 group-hover:to-[#27AAE1]/5 transition-all duration-500 pointer-events-none" />
            
            {/* Active indicator line */}
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#27AAE1]/0 via-[#27AAE1] to-[#27AAE1]/0 rounded-t-2xl" />
            )}

            <CardContent className="relative p-5 sm:p-7">
              <div className="flex items-start justify-between mb-5">
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {m.title}
                  </p>
                  <div className="flex items-baseline gap-2.5">
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {m.value}
                    </p>
                    <span
                      className={[
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide",
                        "transition-all duration-300 group-hover:scale-105",
                        badgeStyle(m.trend),
                      ].join(" ")}
                    >
                      {trendIcon(m.trend)}
                      {m.deltaLabel}
                    </span>
                  </div>
                </div>

                <div className={[
                  "relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center",
                  "rounded-2xl transition-all duration-500",
                  "bg-gradient-to-br from-slate-50 to-slate-100/50",
                  "ring-1 ring-slate-200/50",
                  "group-hover:scale-110 group-hover:rotate-3",
                  "group-hover:shadow-lg group-hover:shadow-slate-200/50",
                ].join(" ")}>
                  <Icon className={`h-7 w-7 transition-all duration-300 ${m.color} group-hover:scale-110`} />
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Elegant divider with gradient */}
              <div className="relative my-5 h-px overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#27AAE1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2 group-hover:text-slate-900 transition-colors">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#27AAE1]/10 ring-1 ring-[#27AAE1]/20 group-hover:bg-[#27AAE1]/20 transition-all duration-300">
                    <TrendingUp className="h-3.5 w-3.5 text-[#27AAE1]" />
                  </span>
                  {m.highlight}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed pl-8">
                  {m.caption}
                </p>
              </div>
            </CardContent>

            {/* Subtle corner accent */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-slate-100/30 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </Card>
        );
      })}
    </div>
  );
}