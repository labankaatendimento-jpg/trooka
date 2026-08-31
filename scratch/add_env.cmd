@echo off
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production --value "https://irouregsafylipfekfqg.supabase.co" --yes --force
npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview --value "https://irouregsafylipfekfqg.supabase.co" --yes --force
npx vercel env add NEXT_PUBLIC_SUPABASE_URL development --value "https://irouregsafylipfekfqg.supabase.co" --yes --force

npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3VyZWdzYWZ5bGlwZmVrZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDAwMDEsImV4cCI6MjEwMzc3NjAwMX0.ZFkowY5Hwlq69PnQiOeBSufNEkatDAdJZtM3CQ9J-qs" --yes --force
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3VyZWdzYWZ5bGlwZmVrZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDAwMDEsImV4cCI6MjEwMzc3NjAwMX0.ZFkowY5Hwlq69PnQiOeBSufNEkatDAdJZtM3CQ9J-qs" --yes --force
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3VyZWdzYWZ5bGlwZmVrZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDAwMDEsImV4cCI6MjEwMzc3NjAwMX0.ZFkowY5Hwlq69PnQiOeBSufNEkatDAdJZtM3CQ9J-qs" --yes --force

npx vercel --prod
