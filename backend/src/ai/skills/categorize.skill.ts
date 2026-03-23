import { ComplaintCategory } from "../../database/enums/complaint.enums";

const KEYWORD_MAP: Record<string, ComplaintCategory> = {
  missed: ComplaintCategory.MISSED_BUS,
  "no show": ComplaintCategory.MISSED_BUS,
  late: ComplaintCategory.LATE_BUS,
  delayed: ComplaintCategory.LATE_BUS,
  waiting: ComplaintCategory.LATE_BUS,
  accident: ComplaintCategory.SAFETY,
  unsafe: ComplaintCategory.SAFETY,
  dangerous: ComplaintCategory.SAFETY,
  rude: ComplaintCategory.DRIVER_BEHAVIOR,
  aggressive: ComplaintCategory.DRIVER_BEHAVIOR,
  driver: ComplaintCategory.DRIVER_BEHAVIOR,
  broken: ComplaintCategory.VEHICLE_CONDITION,
  dirty: ComplaintCategory.VEHICLE_CONDITION,
  smell: ComplaintCategory.VEHICLE_CONDITION,
};

export function categorizeByKeywords(text: string): ComplaintCategory {
  const lower = text.toLowerCase();
  for (const [keyword, category] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      return category;
    }
  }
  return ComplaintCategory.OTHER;
}
