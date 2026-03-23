import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CATEGORY_HE: Record<string, string> = {
  missed_bus: "פספוס אוטובוס",
  late_bus: "איחור אוטובוס",
  safety: "בטיחות",
  driver_behavior: "התנהגות נהג",
  vehicle_condition: "מצב הרכב",
  other: "אחר",
};

export function formatCategory(category: string): string {
  return (
    CATEGORY_HE[category] ??
    category
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

const ENUM_HE: Record<string, string> = {
  pending: "ממתין",
  resolved: "טופל",
  inbound: "הלוך",
  outbound: "חזור",
};

export function formatEnum(val: string): string {
  return ENUM_HE[val] ?? val.charAt(0).toUpperCase() + val.slice(1);
}
