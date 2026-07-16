export const camelToSnakeCase = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};
