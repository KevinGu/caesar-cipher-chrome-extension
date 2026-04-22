import { test } from "node:test";
import { strict as assert } from "node:assert";
import { shiftChar, shiftString } from "../lib/caesar.js";

test("shiftChar: lowercase a with shift 3 → d", () => {
  assert.equal(shiftChar("a", 3), "d");
});

test("shiftChar: uppercase A with shift 3 → D", () => {
  assert.equal(shiftChar("A", 3), "D");
});

test("shiftChar: wraps around z → a at shift 1", () => {
  assert.equal(shiftChar("z", 1), "a");
});

test("shiftChar: wraps around Z → A at shift 1", () => {
  assert.equal(shiftChar("Z", 1), "A");
});

test("shiftChar: non-letters pass through unchanged", () => {
  assert.equal(shiftChar(" ", 5), " ");
  assert.equal(shiftChar("!", 5), "!");
  assert.equal(shiftChar("7", 5), "7");
  assert.equal(shiftChar("中", 5), "中");
});

test("shiftChar: shift 0 is identity", () => {
  assert.equal(shiftChar("h", 0), "h");
});

test("shiftChar: shift 26 is identity (full rotation)", () => {
  assert.equal(shiftChar("h", 26), "h");
});

test("shiftString: 'khoor' shift 3 decodes to 'hello'", () => {
  // 'khoor' = 'hello' encoded with shift +3, so we decode by shifting -3 ≡ +23
  assert.equal(shiftString("khoor", 23), "hello");
});

test("shiftString: preserves case and spaces", () => {
  assert.equal(shiftString("Hello World", 1), "Ifmmp Xpsme");
});

test("shiftString: preserves non-ASCII", () => {
  assert.equal(shiftString("abc 中文 xyz", 1), "bcd 中文 yza");
});

test("shiftString: empty string returns empty string", () => {
  assert.equal(shiftString("", 5), "");
});

test("shiftString: negative shift reverses encryption (decode path)", () => {
  // 'khoor zruog' is 'hello world' encrypted with Caesar +3;
  // decoding it with shift -3 must recover the plaintext.
  assert.equal(shiftString("khoor zruog", -3), "hello world");
});
