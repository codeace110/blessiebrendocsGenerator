-- Simple Database Schema for Document Management System
-- BLESSIE.BRENT - Computer & Electronics Repair Services

CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_type TEXT NOT NULL,
    title TEXT,
    customer_name TEXT,
    description TEXT,
    amount REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Quotation specific fields
    item_name TEXT,
    item_description TEXT,
    quantity INTEGER,
    unit_price REAL,
    remarks TEXT,
    quotation_items TEXT,
    -- Technical form specific fields
    specifications TEXT,
    requirements TEXT,
    technical_details TEXT,
    reference_number TEXT,
    -- Billing form specific fields
    invoice_number TEXT,
    due_date TEXT,
    billing_items TEXT
);

-- Insert sample data (optional - can be removed)
INSERT OR IGNORE INTO documents (form_type, title, customer_name, description, amount) VALUES
('quotation', 'Sample Quotation', 'Sample Customer', 'Sample description', 1000.00);