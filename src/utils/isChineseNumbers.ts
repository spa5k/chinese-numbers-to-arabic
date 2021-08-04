import { cnNumbers } from "../utils/chars";

/**
 * Checks whether a character is a Chinese number character.
 * @param {number|string} A single character to be checked.
 * @returns {boolean} True if it's a Chinese number character or Chinese-style
 * Arabic numbers (０-９).
 */

export const isChineseNumber = (character: string): boolean => {
  if (!character || character.length !== 1) {
    throw new Error("Function isChineseNumber expects exactly one character.");
  }

  return !!cnNumbers[character];
};
