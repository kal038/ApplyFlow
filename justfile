# ---- config (edit these)
front_dir   := "frontend"
back_dir    := "backend-node"
open_urls   := "http://localhost:5173/"

# Detect a browser opener that works on this OS
opener := if `command -v xdg-open > /dev/null 2>&1 && echo found || echo ""` == "found" {
    "xdg-open"
} else if `command -v open > /dev/null 2>&1 && echo found || echo ""` == "found" {
    "open"
} else {
    "echo"
}

# List available recipes (default)
default:
    just --list

# Helper: install deps if needed
[private]
maybe-install dir:
    #!/usr/bin/env bash
    if [ ! -d {{dir}}/node_modules ] || [ {{dir}}/package-lock.json -nt {{dir}}/node_modules/.install-stamp ]; then
        echo "Installing deps in {{dir}}"
        cd {{dir}} && npm ci && mkdir -p node_modules && touch node_modules/.install-stamp
    else
        echo "Deps up-to-date in {{dir}}"
    fi

# Start both frontend and backend dev servers
dev: (maybe-install front_dir) (maybe-install back_dir)
    #!/usr/bin/env bash
    if command -v tmux > /dev/null 2>&1; then
        tmux new-session -d -s dev "cd {{back_dir}} && npm run dev"
        tmux split-window -h "cd {{front_dir}} && npm run dev"
        tmux select-layout tiled
        tmux attach -t dev
    else
        ( cd {{back_dir}} && npm run dev ) &
        ( cd {{front_dir}} && npm run dev ) &
        wait
    fi

# Open the app URL in a browser
open:
    #!/usr/bin/env bash
    for u in {{open_urls}}; do
        {{opener}} "$u" > /dev/null 2>&1 || true
    done

# Start dev servers and open the app URL
up: dev open

# Kill the tmux dev session
kill:
    -tmux kill-session -t dev > /dev/null 2>&1 || true
