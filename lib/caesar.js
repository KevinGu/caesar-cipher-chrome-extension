// Pure Caesar-cipher helpers. No DOM, no Chrome APIs, no I/O.
// Shared between the extension result page (via <script type="module">)
// and Node unit tests.

export function shiftChar(ch, n) {
  const code = ch.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + n) % 26 + 26) % 26 + 65);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + n) % 26 + 26) % 26 + 97);
  }
  return ch;
}

export function shiftString(s, n) {
  let out = "";
  for (const ch of s) {
    out += shiftChar(ch, n);
  }
  return out;
}
