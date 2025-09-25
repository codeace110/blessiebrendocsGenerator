import { useState, useEffect } from 'react'
import DocumentForm from './components/DocumentForm'
import RecordsView from './components/RecordsView'
import DocumentReview from './components/DocumentReview'
import DatabaseService from './services/DatabaseService'

function App() {
  const [currentView, setCurrentView] = useState('form')
  const [selectedFormType, setSelectedFormType] = useState('quotation')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [records, setRecords] = useState([])
  const [dbService] = useState(() => new DatabaseService())

  const handleFormSubmit = async (formData) => {
    try {
      await dbService.initialize()
      const newRecord = await dbService.saveDocument({
        ...formData,
        form_type: selectedFormType
      })
      setRecords([...records, newRecord])
      alert('Document saved successfully!')
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Error saving document. Please try again.')
    }
  }

  const handleViewRecords = async () => {
    try {
      await dbService.initialize()
      const allRecords = await dbService.getAllDocuments()
      setRecords(allRecords)
      setCurrentView('records')
    } catch (error) {
      console.error('Error loading records:', error)
      alert('Error loading records. Please try again.')
    }
  }

  const handleSelectRecord = (record) => {
    setSelectedRecord(record)
    setCurrentView('review')
  }

  const handleBackToForm = () => {
    setCurrentView('form')
    setSelectedRecord(null)
  }

  const handleBackToRecords = () => {
    setCurrentView('records')
    setSelectedRecord(null)
  }

  const handleEditRecord = (record) => {
    // For now, just show an alert - in a real app you might navigate to edit mode
    alert(`Edit functionality for "${record.title}" will be implemented.`)
  }

  const handleDeleteRecord = async (recordId) => {
    try {
      await dbService.initialize()
      await dbService.deleteDocument(recordId)

      // Remove from local state
      setRecords(records.filter(record => record.id !== recordId))
      alert('Document deleted successfully!')
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  const handleResetDatabase = async () => {
    if (window.confirm('This will clear all existing data. Continue?')) {
      try {
        await dbService.initialize()
        await dbService.clearAllDocuments()

        // Reload records (will be empty)
        const allRecords = await dbService.getAllDocuments()
        setRecords(allRecords)

        alert('Database reset successfully! All data has been cleared.')
      } catch (error) {
        console.error('Error resetting database:', error)
        alert('Error resetting database. Please try again.')
      }
    }
  }

  const handleExportData = () => {
    try {
      dbService.initialize()
      dbService.exportToFile()
      alert('Data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error exporting data. Please try again.')
    }
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          await dbService.initialize()
          await dbService.importFromFile(e.target.result)

          // Reload records
          const allRecords = await dbService.getAllDocuments()
          setRecords(allRecords)

          alert('Data imported successfully!')
        } catch (error) {
          console.error('Error importing data:', error)
          alert('Error importing data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  // Initialize database on app start
  const initializeDatabase = async () => {
    try {
      await dbService.initialize()

      // Load existing records
      const allRecords = await dbService.getAllDocuments()
      setRecords(allRecords)

      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Error initializing database:', error)
    }
  }

  // Initialize database on component mount
  useEffect(() => {
    initializeDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 shadow-lg rounded-lg overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                  BLESSIE.BRENT
                </h1>
                <p className="text-gray-500 text-xs">Laptop Parts & Computer Accessories</p>
              </div>
            </div>
            <nav className="flex space-x-3">
              <button
                onClick={() => setCurrentView('form')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentView === 'form'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📝 Forms
              </button>
              <button
                onClick={handleViewRecords}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentView === 'records'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📋 Records
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 rounded-md text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 border border-green-200 hover:border-green-300"
                title="Export data to file"
              >
                📤 Export
              </button>
              <label className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300 cursor-pointer">
                📥 Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleResetDatabase}
                className="px-4 py-2 rounded-md text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-all duration-200 border border-orange-200 hover:border-orange-300"
                title="Clear all database data"
              >
                🔄 Reset DB
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {currentView === 'form' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 rounded mr-3"></span>
                  Select Document Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['quotation', 'technical', 'billing'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedFormType(type)}
                      className={`p-4 rounded-lg text-sm font-semibold capitalize transition-all duration-200 border-2 ${
                        selectedFormType === type
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {type === 'quotation' ? '💰' : type === 'technical' ? '🔧' : '🧾'}
                        </span>
                        <span>{type} Form</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DocumentForm
              formType={selectedFormType}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}

        {currentView === 'records' && (
          <RecordsView
            records={records}
            onSelectRecord={handleSelectRecord}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecord}
            onBack={handleBackToForm}
          />
        )}

        {currentView === 'review' && selectedRecord && (
          <DocumentReview
            record={selectedRecord}
            onBack={handleBackToRecords}
          />
        )}
      </main>
    </div>
  )
}

export default App