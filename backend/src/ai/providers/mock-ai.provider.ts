import { Injectable } from "@nestjs/common";
import { ComplaintCategory } from "../../database/enums/complaint.enums";
import {
  IAiProvider,
  AnalysisResult,
} from "../interfaces/ai-provider.interface";

const KEYWORD_MAP: Record<ComplaintCategory, string[]> = {
  [ComplaintCategory.MISSED_BUS]: [
    "missed",
    "didn't come",
    "no show",
    "not arrived",
    "skipped stop",
  ],
  [ComplaintCategory.LATE_BUS]: [
    "late",
    "delayed",
    "slow",
    "behind schedule",
    "waiting",
  ],
  [ComplaintCategory.SAFETY]: [
    "accident",
    "unsafe",
    "dangerous",
    "emergency",
    "crash",
    "injury",
    "fell",
  ],
  [ComplaintCategory.DRIVER_BEHAVIOR]: [
    "rude",
    "aggressive",
    "speeding",
    "driver",
    "behavior",
    "attitude",
  ],
  [ComplaintCategory.VEHICLE_CONDITION]: [
    "broken",
    "dirty",
    "smell",
    "air conditioning",
    "seats",
    "door",
  ],
  [ComplaintCategory.OTHER]: [],
};

@Injectable()
export class MockAiProvider implements IAiProvider {
  async categorize(text: string): Promise<ComplaintCategory> {
    const lower = text.toLowerCase();
    let bestCategory = ComplaintCategory.OTHER;
    let bestScore = 0;

    for (const [category, keywords] of Object.entries(KEYWORD_MAP) as [
      ComplaintCategory,
      string[],
    ][]) {
      if (category === ComplaintCategory.OTHER) continue;
      const score = keywords.filter((kw) => lower.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }

    return bestCategory;
  }

  async analyze(text: string): Promise<AnalysisResult> {
    const category = await this.categorize(text);
    const keywords = this.extractKeywords(text);
    const confidence = category === ComplaintCategory.OTHER ? 0.3 : 0.75;

    return {
      category,
      confidence,
      summary: `Complaint categorized as "${category}". Detected keywords: ${keywords.join(", ") || "none"}.`,
      keywords,
    };
  }

  private extractKeywords(text: string): string[] {
    const allKeywords = Object.values(KEYWORD_MAP).flat();
    const lower = text.toLowerCase();
    return allKeywords.filter((kw) => lower.includes(kw));
  }
}
