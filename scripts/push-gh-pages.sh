#!/bin/sh

# usage: push-gh-pages DIRECTORY # DIRECTORY is where GitHub pages contents are in (eg. build)
# From https://gist.github.com/motemen/8595451
# LICENSE: Public Domain

set -e

remote=$(git config remote.origin.url)
described_rev=$(git rev-parse HEAD | git name-rev --stdin)

pages_dir="$1"

if [ ! -d "$pages_dir" ]
then
    echo "Usage: $0 DIRECTORY"
    exit 1
fi

cd "$pages_dir"

cdup=$(git rev-parse --show-cdup)
if [ "$cdup" != '' ]
then
    rm -rf .git
    git init
    git remote add origin "$remote"
fi

git checkout -b gh-pages

git add .
git commit -m "pages built at $described_rev" -e
git push origin gh-pages --force
