export const isUncensoredModel = (modelId: string): boolean => {
  return ['berrys-taylor', 'harrys-torrance', 'realistic-five', 'realistic-six', 'realistic-seven'].includes(modelId);
};