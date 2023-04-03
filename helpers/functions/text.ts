import { basename, extname } from "path";
import sanitize from "sanitize-filename";
import { generate } from "shortid";

export const capitalize = (s: string) => {
  // s can be two words separated by a space
  const words = s.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
};

const sanitizeFilename = (name: string): string => {
  return sanitize(name).replace(/[^a-z0-9]/gi, "_");
};

export const getUniqueName = (filename: string) => {
  const ext = extname(filename);
  const fileName = basename(filename, ext);
  const sanitizedFilename = sanitizeFilename(fileName);
  const uid = generate();
  return `${sanitizedFilename}_${uid}${ext}`;
};
