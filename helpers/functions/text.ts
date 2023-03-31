export const capitalize = (s: string) => {
  // s can be two words separated by a space
  const words = s.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
};
