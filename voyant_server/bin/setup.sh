#!/bin/bash
# One-time (idempotent) setup of the local VoyantServer on this Mac.
#   1. Java 11 via Homebrew (VoyantServer 2.6.x needs Java 11; Java 16+ breaks it)
#   2. Download + unpack the VoyantServer release into dist/
#   3. Seed the persistent data directory with the shipped sample corpora
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="${VOYANT_VERSION:-2.6.23}"
ZIP="$ROOT/dist/VoyantServer-$VERSION.zip"
URL="https://github.com/voyanttools/VoyantServer/releases/download/$VERSION/VoyantServer.zip"
JAVA=/opt/homebrew/opt/openjdk@11/bin/java

echo "== 1/3 Java 11"
if [ ! -x "$JAVA" ]; then
  command -v brew >/dev/null || { echo "Homebrew is required: https://brew.sh" >&2; exit 1; }
  brew install openjdk@11
fi
"$JAVA" -version

echo "== 2/3 VoyantServer $VERSION"
mkdir -p "$ROOT/dist"
if [ ! -f "$ZIP" ]; then
  echo "downloading $URL (about 500 MB)"
  curl -L --progress-bar -o "$ZIP" "$URL"
fi
if ! ls -d "$ROOT"/dist/VoyantServer*/ >/dev/null 2>&1; then
  unzip -q "$ZIP" -d "$ROOT/dist"
fi
DIST_DIR="$(ls -d "$ROOT"/dist/VoyantServer*/ | head -1)"; DIST_DIR="${DIST_DIR%/}"
echo "unpacked in $DIST_DIR"

echo "== 3/3 data directory"
DATA_DIR="$(grep -E '^data_directory' "$ROOT/server-settings.txt" | sed -E 's/^[^=]*=[[:space:]]*//')"
DATA_DIR="${DATA_DIR:-$ROOT/data}"
mkdir -p "$DATA_DIR" "$ROOT/logs"
if [ ! -d "$DATA_DIR/trombone5_2" ] && [ -d "$DIST_DIR/data/trombone5_2" ]; then
  cp -R "$DIST_DIR/data/trombone5_2" "$DATA_DIR/"
  echo "seeded $DATA_DIR with the shipped sample corpora (austen, shakespeare, frank)"
fi
echo
echo "Done. Next:"
echo "  bin/voyant.sh start            # or: bin/voyant.sh install-service"
echo "  python3 bin/build_corpora.py   # build the George Eliot corpora + stoplist"
