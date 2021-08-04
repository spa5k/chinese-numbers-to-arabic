/**
 * Checks whether the character is a comma or space, i.e. a character that
 * can occur within a number (1,000,000) but is not a number itself.
 * @returns {boolean} True if the character is a comma or space.
 */
export const isCommaOrSpace = (character: string): boolean => {
  if (!character || character.toString().length !== 1) {
    throw new Error("Function isCommaOrSpace expects exactly one character.");
  }

  const charactersWithinNumber = ",. ";

  return charactersWithinNumber.includes(character);
};
