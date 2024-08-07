#!/bin/bash
set -e

source ../.env
source ../lib/functions/deploy.sh
source ../lib/functions/run.sh

FUNCTION_NAME="refresh-debate-bill-match-view"

deploy "$SUPABASE_PROJECT_ID" "$FUNCTION_NAME"
run "$SUPABASE_PROJECT_ID" "$SUPABASE_SERVICE_ROLE_KEY" "$FUNCTION_NAME" '{}'