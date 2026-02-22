import { createContext, useContext, type ReactNode } from "react";

const PDFModeContext = createContext(false);

export const PDFModeProvider = ({ children }: { children: ReactNode }) => (
  <PDFModeContext.Provider value={true}>{children}</PDFModeContext.Provider>
);

export const usePDFMode = () => useContext(PDFModeContext);
