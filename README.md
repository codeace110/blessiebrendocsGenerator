# BLESSIE.BRENT Document Management System

A professional document management system for computer and electronics repair services with cloud database integration.

## Features

- **Three Document Types**: Quotation, Technical, and Billing forms
- **Cloud Database**: Supabase PostgreSQL with real-time sync
- **Multi-User Support**: Access from any device with internet connection
- **Professional CRUD Operations**: Create, Read, Update, Delete documents
- **Data Export/Import**: Backup and restore your data
- **Clean Interface**: Modern, responsive design with Tailwind CSS
- **Production Ready**: Deployed on Vercel with global CDN

## Database Integration

The system uses **Supabase** (PostgreSQL) for data persistence:

- **Cloud Database**: Real database with ACID compliance
- **Automatic Backups**: Supabase handles data backups
- **Row Level Security**: Built-in security policies
- **Real-time Sync**: Changes sync across all connected clients
- **Free Tier**: 500MB storage, 50M requests/month included

## Technology Stack

- **Frontend**: React 18 + Vite (ES6 modules)
- **Styling**: Tailwind CSS (utility-first CSS)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (global CDN)
- **State Management**: React hooks
- **Build Tool**: Vite (fast development and optimized production)

## Professional CRUD Operations

### Create
- Fill out the form for your document type
- Click "Save Document" to create a new record in the database

### Read
- Click "Records" to view all saved documents from the database
- Click "View" on any record to see full details
- Real-time updates when data changes

### Update
- Click "Edit" on any record to modify it
- Form will be pre-populated with existing data
- Click "Update Document" to save changes to database

### Delete
- Click "Delete" on any record to remove it
- Confirm deletion in the popup
- Permanently removed from database

## Usage

1. **Select Document Type**: Choose from Quotation, Technical, or Billing
2. **Fill Form**: Enter customer details and document information
3. **Save**: Click "Save Document" to store the record in Supabase
4. **View Records**: Click "Records" to see all saved documents
5. **Manage**: View, edit, or delete documents as needed

## Data Management

- **Export Data**: Click "📤 Export" to download your data as JSON file
- **Import Data**: Click "📥 Import" to restore from a backup file
- **Reset Database**: Click "🔄 Reset DB" to clear all data and start fresh
- **Debug Info**: Click "🐛 Debug" to check database connection status

## Cloud Database Benefits

- **Multi-Device Sync**: Access your data from any device
- **Data Persistence**: Documents survive browser restarts and device changes
- **Professional Storage**: ACID-compliant database with automatic backups
- **Scalable**: Handles multiple users and large datasets
- **Secure**: Row Level Security policies protect your data

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up Supabase**: Follow instructions in `SUPABASE-SETUP.md`
4. **Configure environment**: Copy `.env.example` to `.env.local` and add your Supabase credentials
5. **Start development**: `npm run dev`
6. **Deploy to Vercel**: The app is configured for automatic deployment

The system is designed to be professional and maintainable, with clear separation between UI components and data operations, featuring a modern cloud-first architecture.