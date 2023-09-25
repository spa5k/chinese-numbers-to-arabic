import { afterManMultipliers, SINGLE_ARABIC_NUMBER_REGEX } from "./chars";
/**
 * Checks whether the last number in the source string is a [萬万億亿], or
 * another number. Ignores non-number characters at the end of the string
 * such as dots, letters etc.
 * @param {string} str
 * @returns {string} The maan-like character if the last Chinese number character
 * in the string is any of the characters 萬万億亿, or null if the last
 * number in the string is Arabic or a Chinese number other than the four
 * above.
 */
export const sourceStringEndsWithAfterManNumber = (
  str: string,
): string | null => {
  if (!str) {
    return str;
  }

  // Split string into characters, reverse order:
  const characters = [...str].reverse();

  for (const character of characters) {
    if (SINGLE_ARABIC_NUMBER_REGEX.test(character)) {
      // If the string ends with an Arabic number, that's a no. It definitely
      // doesn't end up with a maan-like character.
      // return null;
    }

    if (afterManMultipliers.includes(character)) {
      // We found it - the string ends with a maan-like character:
      return character;
    }

    if (characters.includes(character)) {
      // We found a non-maan-like character, like 九:
      // return null;
    }

    // Otherwise keep looping
  }

  // Fallback case:
  return null;
};
