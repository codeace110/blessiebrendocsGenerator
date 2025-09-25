class DatabaseService {
  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance
    }

    this.db = null
    this.dbFileName = 'documents_db.json'
    DatabaseService.instance = this
  }

  async initialize() {
    if (this.db) return // Already initialized

    try {
      // Load data from file (localStorage for now)
      const savedData = this.loadFromFile()

      this.db = {
        documents: savedData.documents || [],
        nextId: savedData.nextId || 1
      }

      // Seed database with sample data if empty
      if (this.db.documents.length === 0) {
        await this.seedDatabase()
      }

      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }

  // File operations
  loadFromFile() {
    try {
      const saved = localStorage.getItem(this.dbFileName)
      return saved ? JSON.parse(saved) : { documents: [], nextId: 1 }
    } catch (error) {
      console.warn('Error loading from file:', error)
      return { documents: [], nextId: 1 }
    }
  }

  saveToFile() {
    try {
      localStorage.setItem(this.dbFileName, JSON.stringify({
        documents: this.db.documents,
        nextId: this.db.nextId
      }))
    } catch (error) {
      console.error('Error saving to file:', error)
    }
  }

  async seedDatabase() {
    if (this.db.documents.length > 0) return // Already seeded

    const sampleData = [
      // Quotation samples
      {
        title: 'Laptop Screen Repair Quote',
        customer_name: 'Tech Solutions Inc.',
        customer_company: 'Inc.',
        customer_address_line1: '123 Business District',
        customer_address_line2: 'Makati City, Metro Manila',
        customer_phone: '+63 917 123 4567',
        form_type: 'quotation',
        quotation_type: 'repair',
        quotation_items: [
          {
            item_name: '15.6" Laptop Screen Replacement',
            item_description: 'Original LCD screen replacement for Dell Inspiron 15',
            quantity: '1',
            unit_price: '8500.00'
          },
          {
            item_name: 'Screen Installation Labor',
            item_description: 'Professional installation and testing',
            quantity: '1',
            unit_price: '1500.00'
          }
        ],
        remarks: '2-year warranty on screen replacement. Same-day service available.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Computer Parts Quotation',
        customer_name: 'Digital Systems Co.',
        customer_company: 'Corporation',
        customer_address_line1: '456 Industrial Avenue',
        customer_address_line2: 'Quezon City, Metro Manila',
        customer_phone: '+63 918 987 6543',
        form_type: 'quotation',
        quotation_type: 'unit',
        quotation_items: [
          {
            item_name: '16GB DDR4 RAM Module',
            item_description: 'Kingston 3200MHz SODIMM for laptops',
            quantity: '2',
            unit_price: '4500.00'
          },
          {
            item_name: '500GB NVMe SSD',
            item_description: 'Samsung 970 EVO Plus M.2 SSD',
            quantity: '1',
            unit_price: '3200.00'
          }
        ],
        remarks: 'Bulk pricing applied. Installation service available.',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Technical samples
      {
        title: 'Desktop Computer Diagnostic Report',
        customer_name: 'Maria Santos',
        form_type: 'technical',
        reference_number: 'JO-2024-001',
        amount: '750.00',
        description: 'HP Pavilion desktop computer with startup issues',
        specifications: 'Customer reports system fails to boot with error message "No boot device found". Diagnostic testing revealed faulty hard drive and corrupted Windows installation.',
        requirements: '1TB HDD replacement, Windows 10 reinstallation, data recovery if possible',
        technical_details: '1. Power on test - PASSED\n2. POST test - PASSED\n3. Hard drive test - FAILED\n4. Memory test - PASSED\n5. Windows boot repair attempted - FAILED',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'iPhone 12 Screen Repair Assessment',
        customer_name: 'Juan Dela Cruz',
        form_type: 'technical',
        reference_number: 'JO-2024-002',
        amount: '2500.00',
        description: 'iPhone 12 with cracked screen and touch issues',
        specifications: 'Screen is cracked but functional. Touch responsiveness is intermittent in lower right corner. Face ID not working.',
        requirements: 'Original iPhone 12 screen replacement, Face ID repair if possible',
        technical_details: '1. Visual inspection - Screen cracked but LCD intact\n2. Touch test - 90% functional\n3. Face ID test - FAILED\n4. Camera test - PASSED\n5. Speaker test - PASSED',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },

      // Billing samples
      {
        title: 'Laptop Repair Invoice',
        customer_name: 'Global Tech Enterprises',
        customer_company: 'Ltd.',
        customer_address_line1: '789 Corporate Plaza',
        customer_address_line2: 'Taguig City, Metro Manila',
        customer_phone: '+63 919 555 0123',
        form_type: 'billing',
        invoice_number: 'INV-2024-001',
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        billing_items: [
          {
            description: 'Laptop Motherboard Repair',
            quantity: '1',
            amount: '12500.00'
          },
          {
            description: 'Data Recovery Service',
            quantity: '1',
            amount: '3500.00'
          }
        ],
        description: 'Complete motherboard replacement and data recovery for ASUS ROG laptop',
        company_name: 'BLESSIE.BRENT',
        company_tin: '123-456-789-000',
        company_address_line1: 'QUIRINO AVENUE, CORNER Camia St',
        company_address_line2: 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines',
        company_phone: '(083) 553 1734',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Computer Maintenance Invoice',
        customer_name: 'Local Business Solutions',
        customer_company: 'Company',
        customer_address_line1: '321 Commerce Street',
        customer_address_line2: 'Pasay City, Metro Manila',
        customer_phone: '+63 917 777 8901',
        form_type: 'billing',
        invoice_number: 'INV-2024-002',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        billing_items: [
          {
            description: 'Annual Maintenance Contract',
            quantity: '1',
            amount: '15000.00'
          },
          {
            description: 'Software Updates & Optimization',
            quantity: '1',
            amount: '2500.00'
          }
        ],
        description: 'Annual maintenance service for 5 desktop computers including software updates and optimization',
        company_name: 'BLESSIE.BRENT',
        company_tin: '123-456-789-000',
        company_address_line1: 'QUIRINO AVENUE, CORNER Camia St',
        company_address_line2: 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines',
        company_phone: '(083) 553 1734',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Add sample data to database
    for (const data of sampleData) {
      await this.saveDocument(data)
    }

    console.log(`Database seeded with ${sampleData.length} sample documents`)
  }

  // CREATE - Save a new document
  async saveDocument(documentData) {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const newDocument = {
        id: this.db.nextId++,
        ...documentData,
        created_at: new Date().toISOString()
      }

      this.db.documents.push(newDocument)
      this.saveToFile() // Save to file
      return newDocument
    } catch (error) {
      console.error('Error saving document:', error)
      throw error
    }
  }

  // READ - Get all documents
  async getAllDocuments() {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      return [...this.db.documents].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      )
    } catch (error) {
      console.error('Error getting documents:', error)
      throw error
    }
  }

  // READ - Get document by ID
  async getDocumentById(id) {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const document = this.db.documents.find(doc => doc.id === parseInt(id))
      return document || null
    } catch (error) {
      console.error('Error getting document:', error)
      throw error
    }
  }

  // UPDATE - Update existing document
  async updateDocument(id, documentData) {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const index = this.db.documents.findIndex(doc => doc.id === parseInt(id))
      if (index === -1) {
        throw new Error('Document not found')
      }

      this.db.documents[index] = {
        ...this.db.documents[index],
        ...documentData,
        id: parseInt(id) // Ensure ID remains the same
      }

      this.saveToFile() // Save to file
      return this.db.documents[index]
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  // DELETE - Delete document by ID
  async deleteDocument(id) {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const index = this.db.documents.findIndex(doc => doc.id === parseInt(id))
      if (index === -1) {
        throw new Error('Document not found')
      }

      this.db.documents.splice(index, 1)
      this.saveToFile() // Save to file
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  // Clear all documents
  async clearAllDocuments() {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      this.db.documents = []
      this.db.nextId = 1
      this.saveToFile() // Save to file
      return true
    } catch (error) {
      console.error('Error clearing documents:', error)
      throw error
    }
  }

  // Export data to file
  exportToFile() {
    try {
      const dataStr = JSON.stringify({
        documents: this.db.documents,
        nextId: this.db.nextId,
        exported_at: new Date().toISOString()
      }, null, 2)

      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = `documents_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      console.log('Data exported successfully')
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  }

  // Import data from file
  async importFromFile(fileContent) {
    try {
      const importedData = JSON.parse(fileContent)

      if (importedData.documents && Array.isArray(importedData.documents)) {
        this.db.documents = importedData.documents
        this.db.nextId = importedData.nextId || Math.max(...this.db.documents.map(doc => doc.id)) + 1
        this.saveToFile()
        console.log(`Imported ${this.db.documents.length} documents`)
        return true
      } else {
        throw new Error('Invalid file format')
      }
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }
}

export default DatabaseService