#!/usr/bin/env bash
# Package the extension for a browser target.
# Usage: scripts/build-zip.sh [chrome|edge|firefox]
# chrome and edge share the same artifact (MV3 Chromium); firefox uses
# manifest.firefox.json (background.scripts + gecko id).
set -euo pipefail

TARGET="${1:-chrome}"
case "$TARGET" in
  chrome|edge) MANIFEST="manifest.json" ;;
  firefox)     MANIFEST="manifest.firefox.json" ;;
  *)
    echo "Unknown target: $TARGET" >&2
    echo "Usage: $0 [chrome|edge|firefox]" >&2
    exit 1
    ;;
esac

cd "$(dirname "$0")/.."

if [ ! -f "$MANIFEST" ]; then
  echo "Manifest not found: $MANIFEST" >&2
  exit 1
fi

VERSION=$(node -e "console.log(require('./$MANIFEST').version)")
OUT_DIR="dist"
OUT_FILE="$OUT_DIR/caesar-cipher-decoder-$TARGET-$VERSION.zip"
STAGE="$OUT_DIR/.stage-$TARGET"

mkdir -p "$OUT_DIR"
rm -rf "$STAGE"
rm -f "$OUT_FILE"
mkdir -p "$STAGE"

cp "$MANIFEST" "$STAGE/manifest.json"
cp background.js "$STAGE/"
cp -R lib result icons "$STAGE/"
find "$STAGE" -name ".DS_Store" -delete

OUT_ABS="$PWD/$OUT_FILE"
( cd "$STAGE" && zip -r "$OUT_ABS" . >/dev/null )

rm -rf "$STAGE"

echo ""
echo "Built: $OUT_FILE  (target: $TARGET)"
echo "Size:  $(du -h "$OUT_FILE" | cut -f1)"
echo "Contents:"
unzip -l "$OUT_FILE"
