import {
  format,
  formatDistanceToNow,
  parseISO,
  differenceInDays,
} from "date-fns";


export const getMediaUrl = (item: any, mediaPath: string): string => {
  if (!item?.url) return mediaPath;

  const baseUrl = item.url.replace(/^http:\/\//i, "https://");

  return `${baseUrl}${mediaPath}`;
};

export const formatTimeAgo = (dateStr: string) =>
  formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
