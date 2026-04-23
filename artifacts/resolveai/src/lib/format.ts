import { format, parseISO } from "date-fns";

export function formatDate(dateString: string) {
  try {
    return format(parseISO(dateString), "MMM d, yyyy h:mm a");
  } catch (error) {
    return dateString;
  }
}

export function formatShortDate(dateString: string) {
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (error) {
    return dateString;
  }
}

export function getSeverityColor(severity: string) {
  switch (severity?.toUpperCase()) {
    case "HIGH":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "MEDIUM":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
    case "LOW":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getSentimentColor(sentiment: string) {
  switch (sentiment?.toLowerCase()) {
    case "negative":
      return "text-destructive";
    case "neutral":
      return "text-muted-foreground";
    case "positive":
      return "text-emerald-600 dark:text-emerald-400";
    default:
      return "text-foreground";
  }
}
