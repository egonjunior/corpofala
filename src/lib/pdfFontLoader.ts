import type jsPDF from "jspdf";

/**
 * Fetches a TTF font file and returns it as a base64 string.
 */
async function fetchFontAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Registers Plus Jakarta Sans (Regular, Bold, Italic, BoldItalic) in jsPDF
 * so all Portuguese/Unicode characters render correctly.
 */
export async function registerFonts(pdf: jsPDF): Promise<void> {
  const fonts = [
    { file: "PlusJakartaSans-Regular.ttf", style: "normal" },
    { file: "PlusJakartaSans-Bold.ttf", style: "bold" },
    { file: "PlusJakartaSans-Italic.ttf", style: "italic" },
    { file: "PlusJakartaSans-BoldItalic.ttf", style: "bolditalic" },
  ];

  for (const font of fonts) {
    const base64 = await fetchFontAsBase64(`/fonts/${font.file}`);
    pdf.addFileToVFS(font.file, base64);
    pdf.addFont(font.file, "PlusJakartaSans", font.style);
  }

  // Set as default font
  pdf.setFont("PlusJakartaSans", "normal");
}
