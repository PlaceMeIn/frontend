import {
  format,
  formatDistanceToNow,
  parseISO,
  differenceInDays,
} from "date-fns";



export function getColor(status: string) {
  switch (status) {
    case "ongoing":
      return "success";
    case "completed":
      return "neutral";
    case "canceled":
      return "error";
    default:
      return "primary";
  }
}

export function getIcon(status: string) {
  switch (status) {
    case "ongoing":
      return "i-lucide-play-circle";
    case "completed":
      return "i-lucide-check-circle";
    case "canceled":
      return "i-lucide-x-circle";
    default:
      return "i-lucide-notebook-pen";
  }
}

export function getLabel(status: string,start_date:string | null) {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "completed":
      return `Ended ${getRelativeDate(start_date)}`;
    case "canceled":
      return "Canceled";
    default:
      return "Register";
  }
}


export function formatTimeAgo (dateStr: string) {
  const date = parseISO(dateStr);
  const distance = formatDistanceToNow(date, { addSuffix: true });
  return distance;
}

export function getRelativeDate(dateStr: string) {
  const date = parseISO(dateStr);
  const distance = formatDistanceToNow(date, { addSuffix: true });
  return distance;
}



