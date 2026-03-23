import { ComplaintCategory } from "../../database/enums/complaint.enums";

export interface AnalysisResult {
  category: ComplaintCategory;
  confidence: number;
  summary: string;
  keywords: string[];
}

export interface IAiProvider {
  analyze(text: string): Promise<AnalysisResult>;
  categorize(text: string): Promise<ComplaintCategory>;
}

export const AI_PROVIDER = "AI_PROVIDER";
