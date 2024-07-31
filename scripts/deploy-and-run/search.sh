#!/bin/bash
set -e

source ../.env
source ../lib/functions/deploy.sh
source ../lib/functions/run.sh

FUNCTION_NAME="search"

deploy "$SUPABASE_PROJECT_ID" "$FUNCTION_NAME"
run "$SUPABASE_PROJECT_ID" "$SUPABASE_ANON_KEY" "$FUNCTION_NAME" '{"query": "30 by 30"}'