export const getMediaUrl = (item: any, mediaPath: string): string => {
  if (!item?.url) return mediaPath;

  const baseUrl = item.url.replace(/^http:\/\//i, "https://");

  return `${baseUrl}${mediaPath}`;
};