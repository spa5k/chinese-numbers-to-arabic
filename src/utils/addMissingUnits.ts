import { cnNumbers, reverseMultipliers } from "./chars";

/**
 * Converts a string like 8千3萬 into 8千3百萬 (8300*10000).
 * @param {string} str - The original string.
 * @returns {string} The converted, expanded string.
 */
export const addMissingUnits = (str: string): string => {
  const characters = [...str];
  let result = "";
  const reverse = reverseMultipliers;

  characters.forEach((character, i) => {
    if (i === 0) {
      // For the first character, we don't have a previous character yet, so
      // just skip it:
      result += character;
    } else {
      const arabic = Number.isNaN(character)
        ? cnNumbers[character]
        : Number.parseInt(character); // if it's already arabic, just use the arabic number
      const previousNumber = cnNumbers[characters[i - 1]] || characters[i - 1];
      const previousCharacterAsMultiplier = reverse[
        previousNumber.toString().replace("*", "")
      ]
        ? previousNumber.toString().replace("*", "")
        : undefined;
      const nextCharacterArabic = (cnNumbers[characters[i + 1]] || 0)
        .toString()
        .replace("*", "");

      if (
        // not a multiplier like '*100':
        typeof arabic === "number" &&
        // in the 1-9 range:
        arabic > 0 &&
        arabic < 10 &&
        // previous character is 10, 100, 1000 or 10000:
        previousCharacterAsMultiplier !== undefined &&
        // e.g. 1000 < 10000 for 8千3萬, or it's the last character in string:
        (Number.parseInt(previousCharacterAsMultiplier) <
          Number.parseInt(nextCharacterArabic) ||
          characters[i + 1] === undefined) &&
        // For numbers like 十五, there are no other units to be appended at the end
        previousCharacterAsMultiplier !== "10"
      ) {
        // E.g. for 8千3, add 百:
        const oneOrderSmaller = (
          Number.parseInt(previousCharacterAsMultiplier) / 10
        ).toString();
        const missingMultiplier = reverse[oneOrderSmaller];
        result += character + missingMultiplier;
      } else {
        result += character;
      }
    }
  });

  return result;
};
