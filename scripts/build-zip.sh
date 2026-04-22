#!/usr/bin/env bash
# Package the extension for Chrome Web Store submission.
# Includes only the runtime assets; excludes dev-only files.
set -euo pipefail

cd "$(dirname "$0")/.."
VERSION=$(node -e "console.log(require('./manifest.json').version)")
OUT_DIR="dist"
OUT_FILE="$OUT_DIR/caesar-cipher-decoder-$VERSION.zip"

mkdir -p "$OUT_DIR"
rm -f "$OUT_FILE"

zip -r "$OUT_FILE" \
  manifest.json \
  background.js \
  lib \
  result \
  icons \
  -x "*.DS_Store"

echo ""
echo "Built: $OUT_FILE"
echo "Size:  $(du -h "$OUT_FILE" | cut -f1)"
echo "Contents:"
unzip -l "$OUT_FILE"
