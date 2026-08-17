#!/usr/bin/env bash
set -euo pipefail

# Builds each site into dist/<site> and ships them all in a single `firebase deploy`.
# Every site is a hosting target of one Firebase project; firebase.json and .firebaserc
# in this repo hold the mapping, so there is nothing to keep in sync outside the tree.
#
#   ./deploy.sh            build and deploy all ten sites
#   ./deploy.sh biz wtf    build and deploy only those
#   ./deploy.sh --dry-run  build everything, deploy nothing

SITES=(biz art games rocks construction fit gallery world fans wtf)

cd "$(dirname "$0")"

usage() {
    echo "usage: ./deploy.sh [--dry-run] [site ...]"
    echo
    echo "  no site args   build and deploy all ten sites"
    echo "  site ...       build and deploy only those"
    echo "  --dry-run      build into dist/ but skip the deploy"
    echo
    echo "sites: ${SITES[*]}"
}

dry_run=0
args=()
for arg in "$@"; do
    case "$arg" in
        --dry-run) dry_run=1 ;;
        -h | --help)
            usage
            exit 0
            ;;
        -*)
            echo "unknown flag: $arg" >&2
            usage >&2
            exit 1
            ;;
        *) args+=("$arg") ;;
    esac
done

# `set --` so the empty-array case never has to be expanded under `set -u`.
if [ ${#args[@]} -eq 0 ]; then
    set -- "${SITES[@]}"
else
    set -- "${args[@]}"
fi

for site in "$@"; do
    known=0
    for candidate in "${SITES[@]}"; do
        if [ "$site" = "$candidate" ]; then
            known=1
        fi
    done
    if [ "$known" -eq 0 ]; then
        echo "unknown site: $site" >&2
        usage >&2
        exit 1
    fi
done

for site in "$@"; do
    # `fans` is a deploy target, not a SiteKey — it builds from biz.
    selected="$site"
    if [ "$site" = "fans" ]; then
        selected="biz"
    fi

    echo "==> building $site (selectedSite=$selected)"
    rm -rf out "dist/$site"
    selectedSite="$selected" spotifyEnabled=true gtagEnabled=true localImages=false pnpm static
    mkdir -p dist
    mv out "dist/$site"
done

if [ "$dry_run" -eq 1 ]; then
    echo "==> --dry-run: built $* into dist/, skipping deploy"
    exit 0
fi

only=""
for site in "$@"; do
    if [ -z "$only" ]; then
        only="hosting:$site"
    else
        only="$only,hosting:$site"
    fi
done

echo "==> deploying $*"
firebase deploy --only "$only"
