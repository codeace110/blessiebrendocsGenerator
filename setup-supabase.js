import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const envContent = readFileSync('.env.local', 'utf8')
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1]
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔧 Testing Supabase connection...')

  try {
    // Test connection by trying to query the documents table
    const { data, error } = await supabase
      .from('documents')
      .select('count')
      .limit(1)

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Table "documents" does not exist in your Supabase database')
        console.log('💡 You need to create the table first. Please follow these steps:')
        console.log('')
        console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
        console.log('2. Select your project: ftzeunlsbfnlmovuhnps')
        console.log('3. Go to SQL Editor')
        console.log('4. Copy and paste the SQL from supabase-schema.sql')
        console.log('5. Run the SQL to create the documents table')
        console.log('')
        console.log('📄 SQL Schema file: supabase-schema.sql')
        return false
      } else if (error.message.includes('row-level security policy') || error.message.includes('RLS')) {
        console.log('❌ Row Level Security (RLS) policy issue detected')
        console.log('💡 You need to update the RLS policies. Please run this SQL in your Supabase SQL Editor:')
        console.log('')
        console.log('DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON documents;')
        console.log('DROP POLICY IF EXISTS "Allow anonymous read access" ON documents;')
        console.log('CREATE POLICY "Allow all operations" ON documents FOR ALL USING (true);')
        console.log('')
        console.log('This will allow your app to insert, update, and delete records.')
        return false
      } else {
        console.log('❌ Connection error:', error.message)
        console.log('Error code:', error.code)
        return false
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('✅ Table "documents" exists and is accessible')
      return true
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

async function testTableOperations() {
  console.log('🧪 Testing table operations...')

  try {
    // Test insert
    const testRecord = {
      form_type: 'quotation',
      title: 'Connection Test',
      customer_name: 'Test Customer',
      description: 'Testing database connection',
      amount: 1000.00,
      created_at: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from('documents')
      .insert([testRecord])
      .select()

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message)
      return false
    }

    console.log('✅ Insert test successful!')

    // Test select
    const { data: selectData, error: selectError } = await supabase
      .from('documents')
      .select('*')
      .eq('title', 'Connection Test')

    if (selectError) {
      console.log('❌ Select test failed:', selectError.message)
      return false
    }

    console.log('✅ Select test successful! Found', selectData.length, 'records')

    // Clean up test record
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('title', 'Connection Test')

    if (deleteError) {
      console.log('⚠️  Delete test warning:', deleteError.message)
    } else {
      console.log('✅ Delete test successful!')
    }

    return true

  } catch (error) {
    console.error('❌ Table operations test failed:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting Supabase setup and connection test...')
  console.log('📡 Supabase URL:', supabaseUrl)
  console.log('')

  // Test connection first
  const connectionOk = await testConnection()

  if (connectionOk) {
    console.log('')
    console.log('🎉 Connection successful! Now testing table operations...')
    const operationsOk = await testTableOperations()

    if (operationsOk) {
      console.log('')
      console.log('🎉 All tests passed! Your Supabase database is ready.')
      console.log('✅ You can now use the document management system')
    } else {
      console.log('')
      console.log('❌ Table operations failed. Please check your database permissions.')
    }
  } else {
    console.log('')
    console.log('❌ Setup incomplete. Please create the documents table first.')
  }

  console.log('')
  console.log('🔗 Next steps:')
  console.log('1. If table creation is needed, run the SQL from supabase-schema.sql')
  console.log('2. Start your app: npm run dev')
  console.log('3. Try creating a document form')
  console.log('4. Check if it appears in the Records view')
}

main()