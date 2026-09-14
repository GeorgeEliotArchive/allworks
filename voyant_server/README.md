# Local Voyant Tools for the George Eliot Archive

The Text Explorer (`pages/text-explorer`) embeds a Voyant *Cirrus* word cloud in an
iframe. Every URL in `OptionToVoyant` (`pages/text-explorer/js/text_display.js`)
points at `https://voyant-tools.org`, which has been returning HTTP 502 for weeks.
This folder contains everything needed to run our own VoyantServer on the Mac mini
and rebuild the corpora and stoplist from the files in this repository.

## What was checked (2026-09-13)

| Item | Result |
| --- | --- |
| voyant-tools.org | HTTP 502 on the landing page and on every corpus URL used by the site |
| beta.voyant-tools.org | up, could serve as a stop-gap, but our corpora/stoplists only existed on the main server |
| Latest VoyantServer | 2.6.23 (released 2026-08-19); unpacks as `VoyantServer2_6_22`, reports Voyant 2.6.22 / trombone 5.2.28 |
| Java | VoyantServer needs Java 11 (Java 16+ fails). Installed `openjdk@11` via Homebrew |
| Mac mini | Apple M2 Pro, 16 GB RAM, 265 GB free. No Java was installed; Docker Desktop is present but its daemon was not running, so the native Java route was used |
| Corpus ids | Old ids (`corpus=467f5317...`) were minted by voyant-tools.org and cannot be reused. Corpora are rebuilt from `teiEncode/*.xml` with `inputFormat=tei`; TEI extraction was verified (title, author and content words come out clean) |
| Stoplist ids | The three `keywords-...` lists only existed on voyant-tools.org. Our `voyant_tools/stopwords_cleaned.txt` is stored locally under the **same three ids**, so old-style URLs keep working once the host is swapped |
| iframe embedding | The server sends no `X-Frame-Options` header, so the Cirrus page embeds fine |

## Layout

```
voyant_server/
  README.md                       this file
  server-settings.txt             port, heap, data dir, open menu (single source of truth)
  bin/setup.sh                    installs Java 11, downloads/unpacks VoyantServer, seeds data/
  bin/voyant.sh                   start | stop | restart | status | run | logs | install-service | uninstall-service
  bin/build_corpora.py            uploads the TEI files, stores the stoplist, writes corpora.json + voyant_urls.generated.js
  bin/apply_links.py              swaps the OptionToVoyant constant in text_display.js (new links or legacy backup)
  bin/tunnel.sh                   Cloudflare Tunnel: run | status | logs | dns | install-service | uninstall-service
  cloudflared/config.yml          tunnel "ge-voyant" -> https://voyant.fishee.org -> http://localhost:8888
  legacy/OptionToVoyant.voyant-tools.org.{js,json}   backup of the ORIGINAL voyant-tools.org links
  launchd/*.plist.template        launchd agents (server + tunnel) that start at login and restart if they die
  stoplists/eliot_stopwords.txt   copy of voyant_tools/stopwords_cleaned.txt
  corpora.json                    generated: label -> corpus id, files, document/token counts
  voyant_urls.generated.js        generated: drop-in OptionToVoyant for text_display.js
  dist/                           (git-ignored) VoyantServer zip + unpacked distribution
  data/                           (git-ignored) persistent corpora, stored stoplists, Lucene indexes
  logs/                           (git-ignored) voyant.log
```

## Quick start on the Mac mini

```bash
cd ~/Dev/allworks/voyant_server
bin/setup.sh                 # idempotent; skips what is already there
bin/voyant.sh start          # background; logs in logs/voyant.log
python3 bin/build_corpora.py # ~1-2 min; rebuilds all 17 corpora + stoplist
open http://127.0.0.1:8888/
```

Make it a permanent service (starts at login, restarts automatically):

```bash
bin/voyant.sh install-service   # writes ~/Library/LaunchAgents/com.georgeeliotarchive.voyant.plist
bin/voyant.sh status
```

`bin/voyant.sh` launches the same Jetty process the official launcher would
(`org.aw20.jettydesktop.rte.JettyRunTime`), but in the foreground so launchd can
supervise it. The GUI launcher (`java -jar dist/VoyantServer*/VoyantServer.jar`)
still works and reads the same `server-settings.txt`, which the script copies into
the distribution folder on every start.

On the LAN the server is reachable at `http://10.0.0.132:8888/` (or
`http://Libos-Mac-mini.local:8888/`). Restrict it to this machine by uncommenting
`host = 127.0.0.1` in `server-settings.txt`.

## Public HTTPS link: Cloudflare Tunnel

The public site is served over HTTPS at
`https://georgeeliotarchive.github.io/allworks/pages/text-explorer/`, and browsers
block an `http://` iframe inside an `https://` page, so the Mac mini's LAN address
cannot be embedded directly. A Cloudflare Tunnel publishes the local server as

    https://voyant.fishee.org        ->  http://localhost:8888 on the Mac mini

using the Cloudflare account already logged in on this machine (`~/.cloudflared/cert.pem`,
zone `fishee.org`). Tunnel name `ge-voyant`, credentials in `~/.cloudflared/<tunnel-id>.json`
(never committed), config in `cloudflared/config.yml`. No port forwarding or public IP is
needed; outbound connections only.

```bash
bin/tunnel.sh status              # connections + public health check
bin/tunnel.sh install-service     # launchd agent com.georgeeliotarchive.voyant-tunnel (installed)
bin/tunnel.sh dns                 # re-create the CNAME if it is ever lost
```

To use a different hostname, change `hostname:` in `cloudflared/config.yml`, run
`bin/tunnel.sh dns`, then `bin/tunnel.sh install-service`, and regenerate the links
with `--public-base`.

## Wiring the Text Explorer

```bash
python3 bin/build_corpora.py --public-base https://voyant.fishee.org   # writes voyant_urls.generated.js
python3 bin/apply_links.py                                              # patches text_display.js
```

`apply_links.py` replaces only the `OptionToVoyant` constant (and a `VOYANT_BASE`
line before it) in `pages/text-explorer/js/text_display.js`. Each URL has the form

```
VOYANT_BASE + "/tool/Cirrus/?corpus=<id>&stopList=keywords-2459d9912745179a64508611ee85dd7e&whiteList="
```

**Restoring the original voyant-tools.org links** (for example if the public
service comes back and the team prefers it):

```bash
python3 bin/apply_links.py legacy/OptionToVoyant.voyant-tools.org.js
```

The backup is byte-for-byte the constant from git commit 184df68; a JSON copy sits
next to it. Note that the old corpus and stoplist ids only work if voyant-tools.org
still has them cached.

For local testing without the tunnel, generate with `--public-base http://127.0.0.1:8888`
and open the page from a local `http://` server (`python3 -m http.server 8000` in the
repo root, then `http://localhost:8000/pages/text-explorer/`).

## Corpora

| Label in Text Explorer | Source in `teiEncode/` |
| --- | --- |
| each individual work | its `*_refine*.xml` / `*.xml` file, one document |
| All Fiction | the 13 fiction works as 13 documents, chronological (switch to `all_fictions_simple.xml` in `CORPORA` if a single document is preferred) |
| All Nonfiction | `nonfiction_v2.xml` |
| The Spanish Gypsy (1868) | `The_Spanish_Gypsy.xml` |
| All Poetry Except The Spanish Gypsy | `poetry_allinone.xml` |

Every upload mints a new corpus id, so the builder records a sha256 of each
work's files in `corpora.json` and skips works that are unchanged and still
present on the server. After editing a TEI file, rerun the builder (or
`--only "<label>"`), then re-paste the generated constant into `text_display.js`.
`--force` rebuilds everything. Old corpora are left on disk in `data/`; delete
`data/` and rerun with `--force` to start clean.

The builder also prints an `open_menu = ...` line; copy it into
`server-settings.txt` and restart so the corpora appear in Voyant's *Open* menu.

## Upgrading VoyantServer

```bash
bin/voyant.sh stop
VOYANT_VERSION=2.6.24 bin/setup.sh   # downloads into dist/, keeps data/
rm -rf dist/VoyantServer2_6_22        # remove the old unpacked copy
bin/voyant.sh start
```

Because `data_directory` points outside the distribution folder, corpora and the
stoplist survive upgrades (Voyant migrates older data formats itself).

## Troubleshooting

* `bin/voyant.sh status` shows pid, HTTP health and launchd state; `bin/voyant.sh logs` tails the log.
* "Port 8888 appears to be in use": `bin/voyant.sh stop`, or `pkill -f JettyRunTime`.
* OutOfMemoryError in the log: lower `memory` in `server-settings.txt` and restart.
* Java errors mentioning `sun.security.action` or modules mean a Java newer than 11 is being used;
  set `VOYANT_JAVA=/opt/homebrew/opt/openjdk@11/bin/java`.
* Health check used by the scripts: `curl "http://127.0.0.1:8888/trombone?corpus=austen&tool=corpus.CorpusTerms&limit=1"`.
* Public URL fails but local is fine: `bin/tunnel.sh status` / `bin/tunnel.sh logs`; check the CNAME with
  `dig +short @1.1.1.1 CNAME voyant.fishee.org` (should be `<tunnel-id>.cfargotunnel.com`).
* Both services are per-user launchd agents: the Mac mini must be logged in (auto-login recommended).

## References

* VoyantServer releases: https://github.com/voyanttools/VoyantServer/releases
* VoyantServer wiki (shared server, local sources, local stoplists, nginx): https://github.com/voyanttools/VoyantServer/wiki
* Voyant docs mirror while the main site is down: https://beta.voyant-tools.org/docs/
