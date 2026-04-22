#!/usr/bin/env bash
# Build Chrome extension icons from the main-site logo.svg.
# Requires: librsvg (brew install librsvg)
set -euo pipefail

SRC="${1:-../caesar-cipher/public/logo.svg}"
OUT="icons"

if [ ! -f "$SRC" ]; then
  echo "Source SVG not found: $SRC" >&2
  echo "Usage: scripts/build-icons.sh [path/to/logo.svg]" >&2
  exit 1
fi

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "rsvg-convert not found. Install with: brew install librsvg" >&2
  exit 1
fi

mkdir -p "$OUT"
for size in 16 48 128; do
  rsvg-convert -w "$size" -h "$size" -o "$OUT/icon-$size.png" "$SRC"
  echo "  wrote $OUT/icon-$size.png (${size}×${size})"
done
echo "Done. Built 3 icons from $SRC."
