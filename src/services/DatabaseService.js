import { createClient } from '@supabase/supabase-js'

class DatabaseService {
  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance
    }

    // Validate environment variables
    this.validateEnvironment()

    // Initialize Supabase client
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )

    this.initialized = false
    DatabaseService.instance = this
  }

  validateEnvironment() {
    const requiredEnvVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ]

    const missing = requiredEnvVars.filter(varName => !import.meta.env[varName])

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}. ` +
        'Please check your .env.local file and ensure all Supabase credentials are set.'
      )
    }
  }

  // Static method to get the current instance
  static getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // Static method to get current database state
  static getCurrentState() {
    const instance = DatabaseService.getInstance()
    return {
      isInitialized: instance.initialized,
      hasSupabaseClient: !!instance.supabase,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Connected' : 'Not configured'
    }
  }

  async initialize() {
    if (this.initialized) {
      return // Already initialized
    }

    try {
      // Test connection by attempting a simple query
      const { error } = await this.supabase.from('documents').select('count').limit(1)

      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
        throw new Error(`Database connection failed: ${error.message}`)
      }

      this.initialized = true
    } catch (error) {
      throw new Error(`Failed to initialize database: ${error.message}`)
    }
  }

  async createDocumentsTable() {
    try {
      // Check if table exists by trying to select from it
      const { error } = await this.supabase.from('documents').select('id').limit(1)

      if (error && error.code === 'PGRST116') {
        console.log('Documents table does not exist, creating...')

        // For this demo, we'll assume the table is already created in Supabase
        // In a real scenario, you would run the SQL from db.sql
        console.log('Please create the documents table in your Supabase dashboard using the SQL from db.sql')
      }
    } catch (error) {
      console.warn('Error checking/creating table:', error)
    }
  }

  // Supabase operations
  async saveDocumentToSupabase(documentData) {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving document to Supabase:', error)
      throw error
    }
  }

  async getAllDocumentsFromSupabase() {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting documents from Supabase:', error)
      throw error
    }
  }

  async updateDocumentInSupabase(id, documentData) {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .update(documentData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating document in Supabase:', error)
      throw error
    }
  }

  async deleteDocumentFromSupabase(id) {
    try {
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting document from Supabase:', error)
      throw error
    }
  }

  // Create the documents table in Supabase
  async createDocumentsTable() {
    try {
      // Note: This would typically be done through Supabase dashboard or migration
      // For now, we'll assume the table is created manually
      console.log('Please ensure the documents table exists in your Supabase dashboard')
      console.log('Use the SQL from db.sql to create the table structure')
    } catch (error) {
      console.warn('Error with table creation:', error)
    }
  }

  // CREATE - Save a new document
  async saveDocument(documentData) {
    await this.initialize()

    try {
      return await this.saveDocumentToSupabase(documentData)
    } catch (error) {
      throw new Error(`Failed to save document: ${error.message}`)
    }
  }

  // READ - Get all documents
  async getAllDocuments() {
    await this.initialize()

    try {
      return await this.getAllDocumentsFromSupabase()
    } catch (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`)
    }
  }

  // READ - Get document by ID
  async getDocumentById(id) {
    await this.initialize()

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data || null
    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`)
    }
  }

  // UPDATE - Update existing document
  async updateDocument(id, documentData) {
    await this.initialize()

    try {
      return await this.updateDocumentInSupabase(id, documentData)
    } catch (error) {
      throw new Error(`Failed to update document: ${error.message}`)
    }
  }

  // DELETE - Delete document by ID
  async deleteDocument(id) {
    await this.initialize()

    try {
      await this.deleteDocumentFromSupabase(id)
      return true
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`)
    }
  }

  // Clear all documents
  async clearAllDocuments() {
    await this.initialize()

    try {
      const { error } = await this.supabase
        .from('documents')
        .delete()
        .neq('id', 0) // Delete all records

      if (error) throw error
      return true
    } catch (error) {
      throw new Error(`Failed to clear documents: ${error.message}`)
    }
  }

  // Export data to file
  async exportToFile() {
    try {
      const documents = await this.getAllDocuments()
      const dataStr = JSON.stringify({
        documents: documents,
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
      console.log('✅ Data exported successfully')
    } catch (error) {
      console.error('❌ Error exporting data:', error)
      throw new Error(`Failed to export data: ${error.message}`)
    }
  }

  // Import data from file
  async importFromFile(fileContent) {
    await this.initialize()

    try {
      const importedData = JSON.parse(fileContent)

      if (importedData.documents && Array.isArray(importedData.documents)) {
        const { data, error } = await this.supabase
          .from('documents')
          .insert(importedData.documents)
          .select()

        if (error) throw error
        console.log(`✅ Imported ${data.length} documents successfully`)
        return true
      } else {
        throw new Error('Invalid file format')
      }
    } catch (error) {
      console.error('❌ Error importing data:', error)
      throw new Error(`Failed to import data: ${error.message}`)
    }
  }
}

export default DatabaseService