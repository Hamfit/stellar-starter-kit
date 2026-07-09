#!/usr/bin/env bash

set -euo pipefail

echo "========================================="
echo "Starting Stellar Quickstart Node (Local)"
echo "========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed. Please install docker first."
    exit 1
fi

# Run the container
docker run --rm -it \
  --name stellar-quickstart \
  -p 8000:8000 \
  stellar/quickstart:latest \
  --local
