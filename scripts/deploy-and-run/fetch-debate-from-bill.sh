#!/bin/bash
set -e

source ../.env
source ../lib/functions/deploy.sh
source ../lib/functions/run.sh

FUNCTION_NAME="fetch-debate-from-bill"

deploy "$SUPABASE_PROJECT_ID" "$FUNCTION_NAME"
run "$SUPABASE_PROJECT_ID" "$SUPABASE_ANON_KEY" "$FUNCTION_NAME" '{"billId": 794}'