/* eslint-disable sonarjs/cognitive-complexity */
/**
 * Returns the result of the conversion of Chinese number into an `Integer`.
 * @returns {number} The Chinese number converted to integer.
 */

import { addMissingUnits, sourceStringEndsWithAfterManNumber } from "../utils";
import {
  afterManMultipliers,
  characters,
  cnNumbers,
  SINGLE_ARABIC_NUMBER_REGEX,
} from "../utils/chars";

export const toInteger = (source: string): number => {
  let result = 0;
  let pairs: number[][] = [];
  let str = source.toString();
  let currentPair: number[] = [];
  let leadingNumber = Number.parseFloat(str);

  if (str === null || str === undefined || str === "") {
    throw new Error("Empty strings cannot be converted.");
  }

  // Just a plain Arabic number was provided. Don't do any complicated stuff.
  if (Number.parseFloat(str).toString() === str.trim()) {
    return Number.parseFloat(str) || 0;
  }

  // If the string does not contain Chinese numbers (like "345 abc"), we don't
  // have any business here:
  let atLeastOneChineseNumber = false;
  for (const character of str.split("")) {
    if (characters.includes(character)) {
      atLeastOneChineseNumber = true;
      break;
    }
  }
  if (!atLeastOneChineseNumber) {
    return Number.parseFloat(str) || 0;
  }

  str = str.replace(/[,\s]/gu, ""); // remove commas, spaces

  // Convert something like 8千3萬 into 8千3百萬 (8300*10000)
  str = addMissingUnits(str);

  // Here we will try to parse the leading part before the 萬 in numbers like
  // 一百六十八萬, converting it into 168萬. The rest of the code will take care
  // of the subsequent conversion. This must also work for numbers like 168萬5.
  const maanLikeCharacterAtTheEnd = sourceStringEndsWithAfterManNumber(str);
  if (maanLikeCharacterAtTheEnd) {
    const maanLocation = str.lastIndexOf(maanLikeCharacterAtTheEnd);
    const stringBeforeMaan = str.slice(0, Math.max(0, maanLocation));

    let convertedNumberBeforeMaan;
    if (stringBeforeMaan?.trim()) {
      convertedNumberBeforeMaan = toInteger(stringBeforeMaan);
    } else {
      convertedNumberBeforeMaan = 1; // for cases like 萬五
    }

    str = convertedNumberBeforeMaan.toString() + str.slice(maanLocation);

    // If the number begins with Arabic numerals, parse and remove them first.
    // Example: 83萬. This number will be multiplied by the remaining part at
    // the end of the function.
    // We're using parseFloat here instead of parseInt in order to have limited
    // support for decimals, e.g. "3.5萬"
    leadingNumber = Number.parseFloat(str);
    if (!Number.isNaN(leadingNumber)) {
      str = str.replace(leadingNumber.toString(), "");
    }
  }

  // Now parse the actual Chinese, character by character:
  const len = str.length;
  for (let i = 0; i < len; i++) {
    if (SINGLE_ARABIC_NUMBER_REGEX.test(str[i])) {
      // Just a normal arabic number. Add it to the pair.
      currentPair.push(Number.parseInt(str[i]));
    }

    if (cnNumbers[str[i]]) {
      let arabic: string | number = cnNumbers[str[i]]; // e.g. for '三', get 3

      if (typeof arabic === "number") {
        if (currentPair.length > 0) {
          // E.g. case like 三〇〇三 instead of 三千...
          // In this case, just concatenate the string, e.g. "2" + "0" = "20"
          const string = `${currentPair[0].toString()}${arabic}`.toString();
          currentPair[0] = Number.parseInt(string);
        } else {
          currentPair.push(arabic);
        }
      } else {
        // case like '*10000'
        const [action] = arabic;

        // remove '*' and convert to number
        arabic = Number.parseInt(arabic.replace("*", ""));

        currentPair.push(arabic);

        if (i === 0 && action === "*") {
          // This is a case like 2千萬", where the first character will be 千,
          // because "2" was cut off and stored in the leadingNumber:
          currentPair.push(1);
          pairs.push(currentPair);
          currentPair = [];
        } else {
          // accumulated two parts of a pair which will be multiplied, e.g. 二 + 十
          if (currentPair.length === 2) {
            pairs.push(currentPair);
            currentPair = [];
          } else {
            if (afterManMultipliers.includes(str[i])) {
              // For cases like '萬' in '一千萬' - multiply everything we had
              // so far (like 一千) by the current digit (like 萬).
              let numbersSoFar = 0;

              pairs.forEach((pair) => {
                numbersSoFar += pair[0] * pair[1];
              });

              // The leadingNumber is for cases like 1000萬.
              if (!Number.isNaN(leadingNumber)) {
                numbersSoFar *= leadingNumber;
                leadingNumber = Number.NaN;
              }

              // Replace all previous pairs with the new one:
              pairs = [[numbersSoFar, arabic]]; // e.g. [[1000, 10000]]
              currentPair = [];
            } else {
              // For cases like 十 in 十二:
              currentPair.push(1);
              pairs.push(currentPair);
              currentPair = [];
            }
          }
        }
      }
    }
  }

  // If number ends in 1-9, e.g. 二十二, we have one number left behind -
  // add it too and multiply by 1:
  if (currentPair.length === 1) {
    currentPair.push(1);
    pairs.push(currentPair);
  }

  if (pairs.length > 0 && !Number.isNaN(leadingNumber)) {
    pairs[0][0] *= leadingNumber; // e.g. 83萬 => 83 * [10000, 1]
  }

  // Multiply all pairs:
  pairs.forEach((pair) => {
    result += pair[0] * pair[1];
  });
  return result;
};
