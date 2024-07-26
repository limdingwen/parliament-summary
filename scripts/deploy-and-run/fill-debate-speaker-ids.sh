#!/bin/bash
set -e

source ../.env
source ../lib/functions/deploy.sh
source ../lib/functions/run.sh

FUNCTION_NAME="fill-debate-speaker-ids"

deploy "$SUPABASE_PROJECT_ID" "$FUNCTION_NAME"
run "$SUPABASE_PROJECT_ID" "$SUPABASE_FUNCTIONS_KEY" "$FUNCTION_NAME" "{}"