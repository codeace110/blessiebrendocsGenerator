const RecordsView = ({ records, onSelectRecord, onEditRecord, onDeleteRecord, onBack }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDocumentNumber = (record) => {
    if (record.reference_number) {
      return record.reference_number
    }
    if (record.form_type === 'quotation') {
      return '000925'
    }
    return record.id || '001'
  }

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return 'N/A'
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const handleDelete = async (record, event) => {
    event.stopPropagation()

    if (window.confirm(`Are you sure you want to delete "${record.title}"? This action cannot be undone.`)) {
      try {
        await onDeleteRecord(record.id)
      } catch (error) {
        console.error('Error deleting record:', error)
        alert('Error deleting document. Please try again.')
      }
    }
  }

  const handleEdit = (record, event) => {
    event.stopPropagation()
    onEditRecord(record)
  }

  const getFormTypeColor = (formType) => {
    switch (formType) {
      case 'quotation':
        return 'bg-blue-100 text-blue-800'
      case 'technical':
        return 'bg-green-100 text-green-800'
      case 'billing':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (records.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <div className="mx-auto h-12 w-12 shadow-sm rounded overflow-hidden mb-4">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first document.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Document
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 shadow-sm rounded overflow-hidden">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-lg font-medium text-gray-900">Saved Documents</h2>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ← Back to Forms
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {records.map((record) => (
            <li key={record.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {record.title}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getFormTypeColor(record.form_type)}`}>
                        {record.form_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        #{getDocumentNumber(record)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatAmount(record.amount)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(record.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {record.form_type === 'quotation' ? 'Company:' : 'Customer:'} {record.customer_name}
                    </p>
                    {record.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {record.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => onSelectRecord(record)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => handleEdit(record, e)}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(record, e)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RecordsView