function run() {
  echo "Waiting a while to make sure the deployment goes through..."
  sleep 3
  echo "Running function..."
  curl -L -X POST "https://$1.supabase.co/functions/v1/$3" -H "Authorization: Bearer $2" --data "$4"
}