#!/bin/bash
# Manage the Cloudflare Tunnel that publishes the local VoyantServer at https://voyant.fishee.org
#
#   bin/tunnel.sh run                foreground (used by launchd)
#   bin/tunnel.sh status             tunnel connections + public URL health check
#   bin/tunnel.sh logs
#   bin/tunnel.sh install-service    launchd agent: starts at login, restarts automatically
#   bin/tunnel.sh uninstall-service
#   bin/tunnel.sh dns                (re)create the CNAME voyant.fishee.org -> this tunnel
#
# One-time creation (already done on the Mac mini, kept here for reference):
#   cloudflared tunnel login                       # browser login, writes ~/.cloudflared/cert.pem
#   cloudflared tunnel create ge-voyant            # writes ~/.cloudflared/<id>.json; put <id> in cloudflared/config.yml
#   bin/tunnel.sh dns
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/cloudflared/config.yml"
CLOUDFLARED="${CLOUDFLARED:-/opt/homebrew/bin/cloudflared}"
LABEL="com.georgeeliotarchive.voyant-tunnel"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
TUNNEL_ID="$(grep -E '^tunnel:' "$CONFIG" | awk '{print $2}')"
HOSTNAME_PUBLIC="$(grep -E '^\s*- hostname:' "$CONFIG" | head -1 | awk '{print $3}')"
PUBLIC_URL="https://$HOSTNAME_PUBLIC"

require() {
  [ -x "$CLOUDFLARED" ] || { echo "cloudflared not found; brew install cloudflared" >&2; exit 1; }
  [ -f "$HOME/.cloudflared/$TUNNEL_ID.json" ] || { echo "missing credentials ~/.cloudflared/$TUNNEL_ID.json (see header of this script)" >&2; exit 1; }
  mkdir -p "$ROOT/logs"
}

healthy() {
  curl -s -m 15 -o /dev/null -w '%{http_code}' "$PUBLIC_URL/trombone?corpus=austen&tool=corpus.CorpusTerms&limit=1&noCache=1" 2>/dev/null | grep -q '^200$'
}

case "${1:-}" in
  run) require; exec "$CLOUDFLARED" --config "$CONFIG" tunnel run ;;
  status)
    "$CLOUDFLARED" --config "$CONFIG" tunnel info "$TUNNEL_ID" 2>/dev/null | grep -vE "outdated|^$" | head -8 || true
    if healthy; then echo "public   OK  $PUBLIC_URL/"; else echo "public   FAIL $PUBLIC_URL/ (is bin/voyant.sh status OK? DNS propagated?)"; fi
    if [ -f "$PLIST" ]; then echo "service  installed"; launchctl print "gui/$(id -u)/$LABEL" 2>/dev/null | grep -E "state =|pid =" | head -2 | sed 's/^/         /'; else echo "service  not installed"; fi ;;
  logs) tail -n 50 -f "$ROOT/logs/tunnel.log" ;;
  dns) require; "$CLOUDFLARED" --config "$CONFIG" tunnel route dns --overwrite-dns "$TUNNEL_ID" "$HOSTNAME_PUBLIC" ;;
  install-service)
    require; mkdir -p "$HOME/Library/LaunchAgents"
    sed -e "s|__ROOT__|$ROOT|g" -e "s|__LABEL__|$LABEL|g" "$ROOT/launchd/$LABEL.plist.template" > "$PLIST"
    launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
    launchctl bootstrap "gui/$(id -u)" "$PLIST"; launchctl enable "gui/$(id -u)/$LABEL"
    for _ in $(seq 1 45); do healthy && break; sleep 2; done
    "$0" status ;;
  uninstall-service) launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true; rm -f "$PLIST"; echo "tunnel agent removed" ;;
  *) sed -n '2,15p' "$0"; exit 1 ;;
esac
