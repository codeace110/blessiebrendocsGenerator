# Supabase Integration Setup

This application now uses Supabase as the database backend instead of browser localStorage. Follow these steps to set it up:

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

## 2. Get Your Credentials

1. Go to your project dashboard
2. Navigate to Settings → API
3. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIs...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIs...`

## 3. Create Database Table

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create the documents table

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## 5. Deploy to Vercel

The application will automatically use Supabase when deployed to Vercel. Make sure your environment variables are set in the Vercel dashboard:

1. Go to your Vercel project
2. Navigate to Settings → Environment Variables
3. Add the same variables from your `.env.local`

## Features

✅ **Real database persistence** - Documents survive browser restarts
✅ **Multi-user support** - Multiple users can access the same data
✅ **Production ready** - Works perfectly on Vercel
✅ **Free tier compatible** - Uses Supabase's generous free tier
✅ **Automatic backups** - Supabase handles data backups

## Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| **Supabase** | 500MB storage | More than enough for documents |
| **Supabase** | 50M requests/month | ~1,600 requests/day |
| **Vercel** | 100GB bandwidth | Plenty for document app |
| **Vercel** | 100 hours compute | More than enough |

## Troubleshooting

### "Database not initialized"
- Check if your Supabase credentials are correct
- Ensure the documents table exists in your Supabase dashboard

### "Permission denied"
- Make sure your RLS policies allow the operations
- Check if you're using the correct API keys

### Documents not saving
- Check browser console for error messages
- Verify your Supabase project is active
- Ensure the documents table has the correct structure

## Migration from localStorage

The application automatically migrates from localStorage to Supabase. Your existing data will be preserved during the transition.

## Security Notes

- The anon key is safe to expose in client-side code
- The service role key should only be used server-side
- Row Level Security (RLS) is enabled for data protection