#!/bin/bash
# Manage the local VoyantServer for the George Eliot Archive.
#
#   bin/voyant.sh start              start in the background (logs/voyant.log)
#   bin/voyant.sh stop               stop the server
#   bin/voyant.sh restart
#   bin/voyant.sh status             pid + HTTP health check
#   bin/voyant.sh run                run in the foreground (used by launchd)
#   bin/voyant.sh logs               tail the log
#   bin/voyant.sh install-service    install + start the launchd agent (auto start at login, auto restart)
#   bin/voyant.sh uninstall-service
#
# Settings (port, memory, data_directory, open_menu, ...) come from ../server-settings.txt.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SETTINGS="$ROOT/server-settings.txt"
JAVA="${VOYANT_JAVA:-/opt/homebrew/opt/openjdk@11/bin/java}"
LOG_DIR="$ROOT/logs"
LOG="$LOG_DIR/voyant.log"
PIDFILE="$LOG_DIR/voyant.pid"
LABEL="com.georgeeliotarchive.voyant"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"

setting() {  # setting KEY [DEFAULT]
  local v
  v="$(grep -E "^[[:space:]]*$1[[:space:]]*=" "$SETTINGS" | head -1 | sed -E 's/^[^=]*=[[:space:]]*//' | sed -E 's/[[:space:]]+$//')"
  printf '%s' "${v:-${2:-}}"
}

PORT="$(setting port 8888)"
MEMORY="$(setting memory 1024)"
DATA_DIR="$(setting data_directory "$ROOT/data")"
OPEN_MENU="$(setting open_menu)"
ALLOW_INPUT="$(setting allow_input true)"
ALLOW_DOWNLOAD="$(setting allow_download true)"
ALLOW_PRIVATE_IP="$(setting allow_private_ip true)"
ADMIN_PORT="${VOYANT_ADMIN_PORT:-34000}"

DIST_DIR="$(ls -d "$ROOT"/dist/VoyantServer*/ 2>/dev/null | head -1 || true)"
DIST_DIR="${DIST_DIR%/}"

require_install() {
  [ -x "$JAVA" ] || { echo "Java 11 not found at $JAVA. Run bin/setup.sh first." >&2; exit 1; }
  [ -n "$DIST_DIR" ] && [ -f "$DIST_DIR/VoyantServer.jar" ] || { echo "VoyantServer not unpacked under $ROOT/dist. Run bin/setup.sh first." >&2; exit 1; }
  mkdir -p "$LOG_DIR" "$DATA_DIR"
  # Keep the GUI launcher (double-click VoyantServer.jar) in sync with our settings.
  cp "$SETTINGS" "$DIST_DIR/server-settings.txt"
}

jvm_flags() {
  # Same flags the official launcher (java -jar VoyantServer.jar --headless=true) generates,
  # verified by inspecting its child process. The data directory is passed as java.io.tmpdir;
  # trombone creates <data>/trombone5_2 underneath it.
  local flags=(-Dfile.encoding=UTF-8 "-Xmx${MEMORY}m" "-Djava.io.tmpdir=$DATA_DIR")
  [ "$ALLOW_PRIVATE_IP" = "true" ] && flags+=(-Dorg.voyanttools.server.allowprivateip=true)
  [ "$ALLOW_INPUT" = "false" ] && flags+=(-Dorg.voyanttools.server.allowinput=false)
  [ "$ALLOW_DOWNLOAD" = "false" ] && flags+=(-Dorg.voyanttools.server.allowdownload=false)
  if [ -n "$OPEN_MENU" ]; then
    # The official launcher passes this one URL-encoded under the "voyant" (not "server") prefix.
    local enc; enc="$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote_plus(sys.argv[1]))' "$OPEN_MENU")"
    flags+=("-Dorg.voyanttools.voyant.openmenu=$enc")
  fi
  printf '%s\n' "${flags[@]}"
}

pid_of_server() {
  pgrep -f "JettyRunTime $PORT / $DIST_DIR/_app" | head -1 || true
}

healthy() {
  curl -s -m 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/trombone?corpus=austen&tool=corpus.CorpusTerms&limit=1&noCache=1" 2>/dev/null | grep -q '^200$'
}

cmd_run() {
  require_install
  local flags=()
  while IFS= read -r f; do flags+=("$f"); done < <(jvm_flags)
  cd "$DIST_DIR"
  echo "*** Starting VoyantServer on port $PORT (data: $DATA_DIR, heap: ${MEMORY}m) ***"
  exec "$JAVA" "${flags[@]}" -classpath "$DIST_DIR/VoyantServer.jar" \
    org.aw20.jettydesktop.rte.JettyRunTime "$PORT" / "$DIST_DIR/_app" "$ADMIN_PORT"
}

cmd_start() {
  require_install
  if [ -n "$(pid_of_server)" ]; then echo "Already running (pid $(pid_of_server))."; return 0; fi
  nohup "$0" run >> "$LOG" 2>&1 &
  echo $! > "$PIDFILE"
  for _ in $(seq 1 60); do
    if healthy; then echo "VoyantServer is up: http://127.0.0.1:$PORT/"; return 0; fi
    sleep 1
  done
  echo "Server did not answer within 60s; see $LOG" >&2; return 1
}

cmd_stop() {
  local pid; pid="$(pid_of_server)"
  if [ -z "$pid" ]; then echo "Not running."; rm -f "$PIDFILE"; return 0; fi
  kill "$pid" 2>/dev/null || true
  for _ in $(seq 1 20); do [ -z "$(pid_of_server)" ] && break; sleep 1; done
  [ -n "$(pid_of_server)" ] && kill -9 "$(pid_of_server)" 2>/dev/null || true
  rm -f "$PIDFILE"; echo "Stopped."
}

cmd_status() {
  local pid; pid="$(pid_of_server)"
  if [ -n "$pid" ]; then echo "running  pid=$pid  port=$PORT  data=$DATA_DIR"; else echo "stopped  (port $PORT)"; fi
  if healthy; then echo "health   OK  http://127.0.0.1:$PORT/"; else echo "health   FAIL"; fi
  if [ -f "$PLIST" ]; then echo "service  installed ($PLIST)"; launchctl print "gui/$(id -u)/$LABEL" 2>/dev/null | grep -E "state|pid" | head -2 | sed 's/^/         /'; else echo "service  not installed"; fi
}

cmd_install_service() {
  require_install
  mkdir -p "$HOME/Library/LaunchAgents"
  sed -e "s|__ROOT__|$ROOT|g" -e "s|__LABEL__|$LABEL|g" "$ROOT/launchd/$LABEL.plist.template" > "$PLIST"
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  cmd_stop >/dev/null
  launchctl bootstrap "gui/$(id -u)" "$PLIST"
  launchctl enable "gui/$(id -u)/$LABEL"
  for _ in $(seq 1 60); do healthy && break; sleep 1; done
  cmd_status
}

cmd_uninstall_service() {
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  rm -f "$PLIST"; echo "launchd agent removed."
  cmd_stop
}

case "${1:-}" in
  run) cmd_run ;;
  start) cmd_start ;;
  stop) cmd_stop ;;
  restart) cmd_stop; cmd_start ;;
  status) cmd_status ;;
  logs) tail -n 50 -f "$LOG" ;;
  install-service) cmd_install_service ;;
  uninstall-service) cmd_uninstall_service ;;
  *) sed -n '2,15p' "$0"; exit 1 ;;
esac
