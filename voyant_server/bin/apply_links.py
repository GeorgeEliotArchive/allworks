#!/usr/bin/env python3
"""Swap the OptionToVoyant constant in pages/text-explorer/js/text_display.js.

    python3 bin/apply_links.py                      # use voyant_urls.generated.js (local server / tunnel)
    python3 bin/apply_links.py legacy/OptionToVoyant.voyant-tools.org.js   # restore the original links
    python3 bin/apply_links.py some_file.js         # any file containing an OptionToVoyant = {...}; block

The file may also define `const VOYANT_BASE = "...";`, which is inserted (or replaced)
right before the constant. Nothing else in text_display.js is touched.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT.parent / "pages" / "text-explorer" / "js" / "text_display.js"
BLOCK_RE = re.compile(r"(?ms)^const OptionToVoyant = \{.*?^\};\n")
BASE_RE = re.compile(r"(?m)^const VOYANT_BASE = \"[^\"]*\";\n")


def main():
    src_file = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "voyant_urls.generated.js"
    if not src_file.is_absolute():
        src_file = Path.cwd() / src_file
    new_src = src_file.read_text(encoding="utf-8")
    new_block = BLOCK_RE.search(new_src)
    if not new_block:
        sys.exit(f"no 'const OptionToVoyant = {{...}};' block in {src_file}")
    new_base = BASE_RE.search(new_src)

    js = TARGET.read_text(encoding="utf-8")
    old_block = BLOCK_RE.search(js)
    if not old_block:
        sys.exit(f"no OptionToVoyant block found in {TARGET}")

    js = BASE_RE.sub("", js)                                  # drop any previous VOYANT_BASE line
    old_block = BLOCK_RE.search(js)
    replacement = (new_base.group(0) if new_base else "") + new_block.group(0)
    js = js[: old_block.start()] + replacement + js[old_block.end():]
    TARGET.write_text(js, encoding="utf-8")
    n = len(re.findall(r'^\s*"[^"]+":', new_block.group(0), re.M))
    print(f"updated {TARGET.relative_to(ROOT.parent)} from {src_file.name} ({n} entries"
          f"{', base ' + new_base.group(0).split(chr(34))[1] if new_base else ''})")


if __name__ == "__main__":
    main()
