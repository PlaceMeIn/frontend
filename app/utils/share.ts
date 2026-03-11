export async function copyToClipboard(toCopy: string, message = 'Copied to clipboard') {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard API not supported");

    await navigator.clipboard.writeText(toCopy);

    // Show toast if called within a Vue setup context
    const toast = useToast?.();
    toast?.add?.({ title: message, color: 'success', icon: 'i-lucide-check-circle' });

    return { success: true };
  } catch (error: any) {
    console.error("Clipboard copy failed:", error);
    return { success: false, error: error?.message };
  }
}



interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
  fallbackToClipboard?: boolean;
}

export async function shareContent(options: ShareOptions) {
  const { fallbackToClipboard = true, ...shareData } = options;

  // Fallback if Web Share API not supported
  if (!navigator.share) {
    if (fallbackToClipboard) {
      const fallbackText = [shareData.title, shareData.text, shareData.url].filter(Boolean).join('\n');
      return copyToClipboard(fallbackText);
    }
    return { success: false, error: "Web Share API not supported on this device." };
  }

  try {
    // Handle file sharing
    if (shareData.files?.length) {
      if (!navigator.canShare || !navigator.canShare({ files: shareData.files })) {
        throw new Error("File sharing is not supported on this device.");
      }
    }

    await navigator.share(shareData);
    return { success: true };

  } catch (error: any) {
    if (error?.name === "AbortError") {
      return { success: false, cancelled: true };
    }

    console.error("Share failed:", error);

    if (fallbackToClipboard) {
      const fallbackText = [shareData.title, shareData.text, shareData.url].filter(Boolean).join('\n');
      return copyToClipboard(fallbackText);
    }

    return { success: false, error: error?.message };
  }
}