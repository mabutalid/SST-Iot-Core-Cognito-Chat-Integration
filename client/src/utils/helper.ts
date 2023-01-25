export const Capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const CapitalizeFirstLetters = (str: string) => {
  const words = str.split(" ");
  const result = [];

  for (const word of words) result.push(Capitalize(word));

  return result.join(" ");
};
