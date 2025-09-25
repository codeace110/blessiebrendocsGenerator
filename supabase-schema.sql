-- Supabase Database Schema for Document Management System
-- BLESSIE.BRENT - Computer & Electronics Repair Services

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    form_type TEXT NOT NULL,
    title TEXT,
    customer_name TEXT,
    customer_company TEXT,
    customer_address_line1 TEXT,
    customer_address_line2 TEXT,
    customer_phone TEXT,
    description TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Quotation specific fields
    item_name TEXT,
    item_description TEXT,
    quantity INTEGER,
    unit_price DECIMAL(10,2),
    remarks TEXT,
    quotation_items JSONB,
    quotation_type TEXT,

    -- Technical form specific fields
    specifications TEXT,
    requirements TEXT,
    technical_details TEXT,
    reference_number TEXT,

    -- Billing form specific fields
    invoice_number TEXT,
    due_date DATE,
    billing_items JSONB,

    -- Company information fields
    company_name TEXT,
    company_tin TEXT,
    company_address_line1 TEXT,
    company_address_line2 TEXT,
    company_phone TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_form_type ON documents(form_type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_customer_name ON documents(customer_name);

-- Disable Row Level Security (RLS) for unrestricted access
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- Sample data insertion removed - start with clean database