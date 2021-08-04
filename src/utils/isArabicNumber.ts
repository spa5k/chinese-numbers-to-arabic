/**
 * Checks whether a character is an Arabic number [0-9] and not a Chinese
 * number or another character.
 * @returns {boolean} True if character is from 0 to 9.
 */

export const isArabicNumber = (character: string): boolean => {
  if (!character || character.length !== 1) {
    throw new Error("Function isArabicNumber expects exactly one character.");
  }

  const arabicNumbers = [
    "0123456789０",
    "１",
    "２",
    "３",
    "４",
    "５",
    "６",
    "７",
    "８",
    "９",
  ];
  return arabicNumbers.includes(character);
};
