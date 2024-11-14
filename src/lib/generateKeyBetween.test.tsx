import { describe, expect, test } from "vitest";
import { generateKeyBetween } from "./generateKeyBetween";

describe("generateKeyBetween", () => {
  describe("null inputs", () => {
    test("handles both null inputs", () => {
      expect(generateKeyBetween(null, null)).toMatch(/^[a-z]$/);
    });

    test("handles null before input", () => {
      const limit = "g";
      const result = generateKeyBetween(null, limit);
      expect(result < limit).toBe(true);
    });

    test("handles null after input", () => {
      const limit = "c";
      const result = generateKeyBetween(limit, null);
      expect(result > limit).toBe(true);
    });

  });

  describe("equal strings", () => {
    test("handles 'a' equal strings", () => {
      expect(generateKeyBetween("a", "a")).toBe("am");
    });

    test("handles 'xyz' equal strings", () => {
      expect(generateKeyBetween("xyz", "xyz")).toBe("xyzm");
    });
  });

  test("generates key between different strings", () => {
    const result = generateKeyBetween("a", "c");
    expect(result > "a" && result < "c").toBe(true);
  });

  describe("strings with common prefixes", () => {
    test("generates key between 'aba' and 'abz'", () => {
      const result = generateKeyBetween("aba", "abz");
      expect(result > "abc" && result < "abz").toBe(true);
    });

    test("generates key between 'abb' and 'abd'", () => {
      const result = generateKeyBetween("abb", "abd");
      expect(result > "abb" && result < "abd").toBe(true);
    });
  });

  describe("prefix relationships", () => {
    test("generates key between 'ab' and 'abc'", () => {
      const result = generateKeyBetween("ab", "abc");
      // expect(result).toMatch('abb');
      expect(result).toMatch(/^ab[a-z]$/);
      expect(result > "ab" && result < "abc").toBe(true);
    });
  });

  
});
