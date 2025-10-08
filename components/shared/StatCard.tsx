import { Card, CardContent } from "../ui/card";

export default function StatCard({
  title,
  value,
  icon,
  tint,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tint: "blue" | "green" | "amber" | "rose";
  subtitle?: string;
}) {
  const tints: Record<"blue" | "green" | "amber" | "rose", string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="px-5 py-4 flex items-center gap-4">
        <div className={`p-3 rounded-full ${tints[tint]}`}>{icon}</div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold tracking-tight leading-none">{value}</h3>
          {subtitle ? (
            <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
