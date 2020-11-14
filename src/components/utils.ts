export const brandVariations = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];
export const brandSpacings = ['none', 'sm', 'md', 'lg'];

export const variationValidator = (value: string) => {
  return brandVariations.includes(value.toLowerCase());
};

export const spacingValidator = (value: string) => {
  return brandSpacings.includes(value.toLowerCase());
};
