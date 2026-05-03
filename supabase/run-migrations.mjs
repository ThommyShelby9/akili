import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  'https://psnjtreyfbnuebulohbu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmp0cmV5ZmJudWVidWxvaGJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc3NzQzOCwiZXhwIjoyMDkzMzUzNDM4fQ.xgn0xE_HVJzXx7mt_JiIvNrK9Kza2J0tR_s_Vw2tBpE'
)

const migrations = [
  '001_create_profiles.sql',
  '002_create_scripts.sql',
  '003_create_executions.sql',
  '004_create_integrations.sql',
  '005_create_contacts.sql',
  '006_create_notifications.sql',
  '007_create_notification_preferences.sql',
]

const seeds = ['scripts_library.sql']

async function run() {
  console.log('Running migrations...\n')

  for (const file of migrations) {
    const sql = readFileSync(join(__dirname, 'migrations', file), 'utf8')
    console.log(`  → ${file}...`)
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    if (error) {
      // Try direct approach via postgrest
      console.log(`    ⚠ RPC not available, using raw SQL via fetch...`)
      const res = await fetch('https://psnjtreyfbnuebulohbu.supabase.co/pg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmp0cmV5ZmJudWVidWxvaGJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc3NzQzOCwiZXhwIjoyMDkzMzUzNDM4fQ.xgn0xE_HVJzXx7mt_JiIvNrK9Kza2J0tR_s_Vw2tBpE',
        },
        body: JSON.stringify({ query: sql })
      })
      if (!res.ok) {
        console.log(`    ✗ Failed: ${error.message}`)
      } else {
        console.log(`    ✓ Done`)
      }
    } else {
      console.log(`    ✓ Done`)
    }
  }

  console.log('\nRunning seeds...\n')
  for (const file of seeds) {
    const sql = readFileSync(join(__dirname, 'seeds', file), 'utf8')
    console.log(`  → ${file}...`)
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    if (error) {
      console.log(`    ⚠ ${error.message}`)
    } else {
      console.log(`    ✓ Done`)
    }
  }

  console.log('\n✓ Migration complete!')
}

run().catch(console.error)
