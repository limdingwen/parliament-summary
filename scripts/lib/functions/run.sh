function run() {
  curl -L -X POST "https://$1.supabase.co/functions/v1/$3" -H "Authorization: Bearer $2" --data "$4"
}