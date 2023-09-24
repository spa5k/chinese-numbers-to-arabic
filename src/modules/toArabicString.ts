import { NUMBER_IN_STRING_REGEX } from "../utils";
import { toInteger } from "./toInteger";

/**
 * Converts multiple Chinese numbers in a string into Arabic numbers, and
 * returns the translated string containing the original text but with Arabic
 * numbers only.
 * @param {number} [minimumCharactersInNumber] - Optionally, how many
 *    characters minimum must be in a number to be converted. Sometimes a
 *    good setting would be 2, because otherwise we will convert geographic
 *    names like 九龍站 into 9龍站.
 * @returns {string} The translated string with Arabic numbers only.
 */
export const toArabicString = (
  source: string,
  minimumCharactersInNumber = 1
): string => {
  if (typeof source !== "string") {
    return source;
  }
  // Replace each number in the string with the tranlation. Before the
  // translation, we remove spaces from the string for number like
  // 4,000,000 and 4 000 000.

  return source.replace(NUMBER_IN_STRING_REGEX, (match) => {
    if (match.length >= minimumCharactersInNumber) {
      return toInteger(match.replace(/[\s,_]/gu, "")).toString();
    }
    return match;
  });
};
