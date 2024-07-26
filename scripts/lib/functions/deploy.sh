function deploy() {
  supabase functions deploy "$2" --project-ref "$1"
}