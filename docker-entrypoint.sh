#!/bin/sh
set -eu

fix_chrome_sandbox() {
  if [ -d /home/node/.cache/dotslash ]; then
    find /home/node/.cache/dotslash -name chrome-sandbox -exec chown root:root {} \; -exec chmod 4755 {} \; || true
  fi
}

fix_chrome_sandbox

if [ -x /app/node_modules/@react-native/debugger-shell/bin/react-native-devtools ]; then
  runuser -u node -- /app/node_modules/@react-native/debugger-shell/bin/react-native-devtools --help >/dev/null 2>&1 || true
  fix_chrome_sandbox
fi

(
  while true; do
    fix_chrome_sandbox
    sleep 1
  done
) &

exec runuser -u node -- "$@"
