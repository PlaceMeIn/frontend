export const getMediaUrl = (item:any,mediaPath: string): string => {
  if (!item.url) return mediaPath;
  return `${item.url}${mediaPath}`;
};