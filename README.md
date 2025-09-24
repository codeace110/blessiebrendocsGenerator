# BLESSIE.BRENT Document Management System

A simple document management system for computer and electronics repair services.

## Features

- **Three Document Types**: Quotation, Technical, and Billing forms
- **Simple CRUD Operations**: Create, Read, Update, Delete documents
- **Clean Interface**: Easy-to-use forms and record management
- **Local Storage**: Data persists in browser memory

## Database Schema (db.sql)

The system uses a simple SQL schema with the following structure:

```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_type TEXT NOT NULL,
    title TEXT,
    customer_name TEXT,
    description TEXT,
    amount REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Additional fields for different document types...
);
```

## Simple CRUD Operations

### Create
- Fill out the form for your document type
- Click "Save Document" to create a new record

### Read
- Click "Records" to view all saved documents
- Click "View" on any record to see details

### Update
- Click "Edit" on any record (placeholder for future implementation)

### Delete
- Click "Delete" on any record to remove it
- Confirm deletion in the popup

## Usage

1. **Select Document Type**: Choose from Quotation, Technical, or Billing
2. **Fill Form**: Enter customer details and document information
3. **Save**: Click "Save Document" to store the record
4. **View Records**: Click "Records" to see all saved documents
5. **Manage**: View, edit, or delete documents as needed

## Reset Database

Click "Reset DB" to clear all data and start fresh.

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Simple in-memory storage (easily replaceable with SQL database)
- **State Management**: React hooks

## Development

```bash
npm install
npm run dev
```

The system is designed to be simple and maintainable, with clear separation between UI components and data operations.