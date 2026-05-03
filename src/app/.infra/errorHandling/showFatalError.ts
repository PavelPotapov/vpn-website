export const showFatalError = (source: string, error: unknown) => {
  console.error(`[FATAL] ${source}:`, error);
};
