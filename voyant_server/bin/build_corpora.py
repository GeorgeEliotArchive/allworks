#!/usr/bin/env python3
"""Build the George Eliot corpora and stoplist on the local VoyantServer.

For every entry in CORPORA the TEI file(s) from ../teiEncode are uploaded to the
running server (tool=corpus.CorpusCreator, inputFormat=tei), the resulting corpus
id is verified, and the results are written to:

    corpora.json               label -> corpus id, files, document/token counts
    voyant_urls.generated.js   drop-in replacement for OptionToVoyant in
                               pages/text-explorer/js/text_display.js

The custom stopword list (stoplists/eliot_stopwords.txt) is stored under the same
"keywords-..." ids that the old voyant-tools.org URLs used, so the stopList= part
of those URLs keeps working against the local server.

Usage:
    python3 bin/build_corpora.py [--server http://127.0.0.1:8888]
                                 [--public-base https://voyant.example.org]
                                 [--only "Silas Marner (1861)"]

Re-running is safe: a work is skipped when its TEI files are unchanged (sha256
recorded in corpora.json) and its corpus still exists on the server. Uploading
the same file again would mint a *new* corpus id, so avoid that unless needed
(--force rebuilds everything).
"""
import argparse
import hashlib
import json
import subprocess
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEI_DIR = ROOT.parent / "teiEncode"
STOPLIST_FILE = ROOT / "stoplists" / "eliot_stopwords.txt"

# Stoplist ids referenced by the old voyant-tools.org URLs in text_display.js.
# The three original lists lived only on voyant-tools.org and could not be
# recovered; all three ids now point to stoplists/eliot_stopwords.txt.
STOPLIST_IDS = [
    "2459d9912745179a64508611ee85dd7e",  # used by most works
    "1b19a870ee41122f9003df11a038375d",  # Silas Marner
    "19ea191a1678afdff2e05f8877e8abb3",  # Felix Holt, Middlemarch
]
PRIMARY_STOPLIST = STOPLIST_IDS[0]

# Label (exactly as in OptionToFilename / OptionToVoyant) -> TEI files (chronological).
FICTION = [
    "The Sad Fortunes of the Reverend Amos Barton.xml",
    "Mr.Gilfil's Love Story.xml",
    "Janet's Repentance.xml",
    "Adam Bede_refine_v1.1.xml",
    "The Lifted Veil.xml",
    "The Mill on the Floss.xml",
    "Silas Marner.xml",
    "Romola_refine_v1.xml",
    "Brother Jacob_refine_v1.xml",
    "Felix Holt, the Radical_refine_v1.xml",
    "Middlemarch_refine_v1.xml",
    "Daniel_Deronda_refine_v1.xml",
    "Impressions of Theophrastus Such.xml",
]
CORPORA = {
    "Mr. Gilfil's Love Story (1857)": ["Mr.Gilfil's Love Story.xml"],
    "Janet's Repentance (1857)": ["Janet's Repentance.xml"],
    "The Sad Fortunes of the Rev. Amos Barton (1857)": ["The Sad Fortunes of the Reverend Amos Barton.xml"],
    "Adam Bede (1859)": ["Adam Bede_refine_v1.1.xml"],
    "The Lifted Veil (1859)": ["The Lifted Veil.xml"],
    "The Mill on the Floss (1860)": ["The Mill on the Floss.xml"],
    "Silas Marner (1861)": ["Silas Marner.xml"],
    "Romola (1863)": ["Romola_refine_v1.xml"],
    "Brother Jacob (1864)": ["Brother Jacob_refine_v1.xml"],
    "Felix Holt, the Radical (1866)": ["Felix Holt, the Radical_refine_v1.xml"],
    "Middlemarch (1871-72)": ["Middlemarch_refine_v1.xml"],
    "Daniel Deronda (1876)": ["Daniel_Deronda_refine_v1.xml"],
    "Impressions of Theophrastus Such (1879)": ["Impressions of Theophrastus Such.xml"],
    "All Fiction": FICTION,                      # one document per work
    "All Nonfiction": ["nonfiction_v2.xml"],
    "The Spanish Gypsy (1868)": ["The_Spanish_Gypsy.xml"],
    "All Poetry Except The Spanish Gypsy": ["poetry_allinone.xml"],
}


def curl_json(url, *args, timeout=900):
    cmd = ["curl", "-sS", "-m", str(timeout), *args, url]
    out = subprocess.run(cmd, capture_output=True, text=True)
    if out.returncode != 0:
        sys.exit(f"curl failed: {' '.join(cmd)}\n{out.stderr}")
    try:
        return json.loads(out.stdout)
    except json.JSONDecodeError:
        sys.exit(f"non-JSON reply from {url}:\n{out.stdout[:500]}")


def check_server(server):
    r = curl_json(f"{server}/trombone?tool=corpus.CorpusTerms&corpus=austen&limit=1", timeout=15)
    print(f"server ok: Voyant {r.get('voyantVersion')} at {server}")


def store_stoplist(server):
    words = STOPLIST_FILE.read_text(encoding="utf-8")
    for sid in STOPLIST_IDS:
        r = curl_json(f"{server}/trombone?tool=resource.StoredResource&resourceId={sid}",
                      "--data-urlencode", f"storeResource@{STOPLIST_FILE}")
        got = r.get("storedResource", {}).get("id")
        if got != sid:
            sys.exit(f"stoplist store failed for {sid}: {r}")
    n = sum(1 for l in words.splitlines() if l.strip() and not l.startswith("#"))
    print(f"stoplist stored ({n} words) as keywords-{{{', '.join(STOPLIST_IDS)}}}")


def files_hash(files):
    h = hashlib.sha256()
    for f in files:
        h.update(f.encode("utf-8"))
        h.update((TEI_DIR / f).read_bytes())
    return h.hexdigest()


def corpus_exists(server, cid):
    r = curl_json(f"{server}/trombone?tool=corpus.CorpusMetadata&corpus={cid}", timeout=60)
    return "corpus" in r and not r.get("error")


def create_corpus(server, files):
    args = ["-F", "tool=corpus.CorpusCreator", "-F", "inputFormat=tei"]
    for f in files:
        p = TEI_DIR / f
        if not p.is_file():
            sys.exit(f"missing TEI file: {p}")
        # quote the path: curl's -F treats an unquoted comma (e.g. "Felix Holt, the Radical") as a separator
        args += ["-F", f'upload=@"{p}";type=application/xml']
    r = curl_json(f"{server}/trombone", *args)
    cid = r.get("stepEnabledCorpusCreator", {}).get("storedId")
    if not cid:
        sys.exit(f"corpus creation failed for {files}: {r}")
    meta = curl_json(f"{server}/trombone?tool=corpus.CorpusMetadata&corpus={cid}", timeout=120)
    m = meta.get("corpus", {}).get("metadata", {})
    return cid, int(m.get("documentsCount", 0)), int(m.get("lexicalTokensCount", 0))


def write_outputs(results, public_base):
    (ROOT / "corpora.json").write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        "// Generated by voyant_server/bin/build_corpora.py - do not edit by hand.",
        "// Replace the OptionToVoyant constant in pages/text-explorer/js/text_display.js with this.",
        f'const VOYANT_BASE = "{public_base}";',
        "const OptionToVoyant = {",
        '  "Search a text to explore": "",',
    ]
    for label, info in results.items():
        lines.append(f'  "{label}":')
        lines.append(f'    VOYANT_BASE + "/tool/Cirrus/?corpus={info["id"]}&stopList=keywords-{PRIMARY_STOPLIST}&whiteList=",')
    lines.append("};")
    (ROOT / "voyant_urls.generated.js").write_text("\n".join(lines) + "\n", encoding="utf-8")

    menu = ";".join(f'{info["id"]}:{label}' for label, info in results.items())
    print("\nopen_menu line for server-settings.txt (optional, shows the corpora in Voyant's Open menu):")
    print(f"open_menu = {menu}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--server", default="http://127.0.0.1:8888", help="local server to build on")
    ap.add_argument("--public-base", default=None,
                    help="base URL written into voyant_urls.generated.js (default: --server)")
    ap.add_argument("--only", action="append", help="build only this label (repeatable)")
    ap.add_argument("--force", action="store_true", help="rebuild even if files are unchanged")
    a = ap.parse_args()
    server = a.server.rstrip("/")
    public_base = (a.public_base or server).rstrip("/")

    check_server(server)
    store_stoplist(server)

    existing = {}
    if (ROOT / "corpora.json").exists():
        existing = json.loads((ROOT / "corpora.json").read_text(encoding="utf-8"))

    results = dict(existing)
    for label, files in CORPORA.items():
        if a.only and label not in a.only:
            continue
        fh = files_hash(files)
        prev = existing.get(label)
        if (not a.force and prev and prev.get("sha256") == fh and prev.get("files") == files
                and corpus_exists(server, prev["id"])):
            print(f"unchanged {label!r}: corpus={prev['id']}")
            continue
        print(f"building {label!r} from {len(files)} file(s) ...", end=" ", flush=True)
        cid, docs, tokens = create_corpus(server, files)
        results[label] = {"id": cid, "files": files, "documents": docs, "tokens": tokens, "sha256": fh}
        print(f"corpus={cid} docs={docs} tokens={tokens:,}")

    # keep the label order of CORPORA
    results = {k: results[k] for k in CORPORA if k in results}
    write_outputs(results, public_base)
    print(f"\nwrote {ROOT / 'corpora.json'} and {ROOT / 'voyant_urls.generated.js'}")


if __name__ == "__main__":
    main()
