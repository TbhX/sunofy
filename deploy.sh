#!/bin/bash
# Sunofy Cloudflare Pages Deployment Script
# Run this script to deploy to Cloudflare Pages
#
# Usage:
#   CLOUDFLARE_API_TOKEN=your_token CLOUDFLARE_ACCOUNT_ID=your_account_id bash deploy.sh
#
# Environment variables required:
#   CLOUDFLARE_API_TOKEN - Cloudflare API token with Pages edit permission
#   CLOUDFLARE_ACCOUNT_ID - Cloudflare account ID

set -e

# Configuration
PROJECT_NAME="sunofy"
BUILD_OUTPUT_DIR=".next"

# Validate environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "Error: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables are required"
    exit 1
fi

# Ensure build exists
if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
    echo "Build directory $BUILD_OUTPUT_DIR does not exist. Running build..."
    npm run build
fi

# Clear webpack cache to prevent file size issues (25MB limit on Cloudflare Pages)
rm -rf .next/cache/webpack 2>/dev/null || true

# Deploy using Wrangler
echo "Deploying Sunofy to Cloudflare Pages..."
CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID" \
npx wrangler pages deploy "$BUILD_OUTPUT_DIR" --project-name="$PROJECT_NAME"

echo ""
echo "Deployment complete!"
echo "Live URL: https://$PROJECT_NAME.pages.dev"