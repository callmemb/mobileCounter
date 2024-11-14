
const CHAR_TABLE = [..."abcdefghijklmnopqrstuvwxyz"];
const MIN_CHAR = CHAR_TABLE[0];
const MAX_CHAR = CHAR_TABLE[CHAR_TABLE.length - 1];

/**
 * Generates a key that is lexicographically between the given `before` and `after` strings.
 * If `before` is null or undefined, it is treated as the smallest possible string.
 * If `after` is null or undefined, it is treated as the biggest possible string`.
 *
 * No errors on stupid inputs, just stupid outputs.
 * On same before and after, returns before + "m" (stopping in replication of stupid order keys).
 * 
 * @param before - The string that should come before the generated key, or null/undefined.
 * @param after - The string that should come after the generated key, or null/undefined.
 * @returns A possibly shortest string that is lexicographically between `before` and `after`.
 */
export function generateKeyBetween(
  before: string | undefined | null,
  after: string | undefined | null
): string {
  if (!before) before = MIN_CHAR;
  if (!after) {
    let indexOfLastMaxCharInBefore = 0;
    while (before[indexOfLastMaxCharInBefore] === MAX_CHAR) {
      indexOfLastMaxCharInBefore++;
    }
    after = before.slice(0, indexOfLastMaxCharInBefore) + MAX_CHAR;
  }

  let indexOfLastSharedChar = 0;
  while (
    indexOfLastSharedChar < before.length &&
    before[indexOfLastSharedChar] === after[indexOfLastSharedChar]
  ) {
    indexOfLastSharedChar++;
  }

  const beforeChar = before[indexOfLastSharedChar] || MIN_CHAR;
  const afterChar = after[indexOfLastSharedChar] || MAX_CHAR;

  const beforeIdx = CHAR_TABLE.indexOf(beforeChar);
  const afterIdx = CHAR_TABLE.indexOf(afterChar);
  const midIdx = Math.floor((beforeIdx + afterIdx) / 2);
  const midChar = CHAR_TABLE[midIdx];
  return before.slice(0, indexOfLastSharedChar) + midChar;
}
