export interface ParsedComplaintMetadata {
  busLine?: string;
  direction?: string;
  date?: string;
  time?: string;
  extractedKeywords: string[];
}

export function parseComplaintText(text: string): ParsedComplaintMetadata {
  const result: ParsedComplaintMetadata = { extractedKeywords: [] };

  // Extract bus line (e.g. "line 42", "bus 17", "route 5")
  const lineMatch = text.match(/(?:line|bus|route)\s+(\w+)/i);
  if (lineMatch) result.busLine = lineMatch[1];

  // Extract date (YYYY-MM-DD or DD/MM/YYYY)
  const dateMatch = text.match(/\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/);
  if (dateMatch) result.date = dateMatch[1];

  // Extract time (HH:MM)
  const timeMatch = text.match(/\b(\d{2}:\d{2})\b/);
  if (timeMatch) result.time = timeMatch[1];

  // Extract direction keywords
  if (/\b(inbound|toward|to the city)\b/i.test(text))
    result.direction = "inbound";
  if (/\b(outbound|toward|from the city)\b/i.test(text))
    result.direction = "outbound";

  // Collect notable nouns/adjectives for AI analysis
  const notableWords =
    text.match(/\b(late|missed|rude|dirty|broken|unsafe|delayed)\b/gi) ?? [];
  result.extractedKeywords = [
    ...new Set(notableWords.map((w) => w.toLowerCase())),
  ];

  return result;
}
