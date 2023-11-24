#!/bin/bash

# Fetch a list of all branches, both local and remote
git fetch --all --prune

# Iterate through all local branches
for branch in `git branch | cut -c3-`; do
    # Check if the branch still exists on the remote
    if ! git show-ref --verify --quiet refs/remotes/origin/$branch; then
        # If the branch no longer exists on the remote, delete it locally
        git branch -D $branch
    fi
done