export async function putDataToClipboard(data: Record<string, string>) {
  if (typeof ClipboardItem !== 'undefined') {
    const clipboardItem = new ClipboardItem(
      Object.fromEntries(
        Object.entries(data).map(([type, content]) => [type, new Blob([content], { type })]),
      ),
    );
    await navigator.clipboard.write([clipboardItem]);
  } else {
    const fallbackText = data['text/plain'] || Object.values(data)[0];
    await navigator.clipboard.writeText(fallbackText);
  }
}
