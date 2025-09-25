import { useState, useEffect } from 'react'

const DocumentForm = ({ formType, onSubmit, editingRecord }) => {
  const [formData, setFormData] = useState({
    title: '',
    customer_name: '',
    customer_company: '',
    customer_address_line1: '',
    customer_address_line2: '',
    customer_phone: '',
    description: '',
    amount: '',
    // Quotation specific fields
    item_name: '',
    item_description: '',
    quantity: '1',
    unit_price: '',
    remarks: '',
    quotation_items: [{ item_name: '', item_description: '', quantity: '1', unit_price: '' }],
    quotation_type: 'repair', // 'repair' or 'unit'
    // Technical form specific fields
    specifications: '',
    requirements: '',
    technical_details: '',
    reference_number: '',
    // Billing form specific fields
    invoice_number: '',
    due_date: '',
    billing_items: [{ description: '', amount: '', quantity: '1' }],
    // Company information fields
    company_name: 'BLESSIE.BRENT',
    company_tin: '',
    company_address_line1: 'QUIRINO AVENUE, CORNER Camia St',
    company_address_line2: 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines',
    company_phone: '(083) 553 1734'
  })

  // Populate form when editing
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        title: editingRecord.title || '',
        customer_name: editingRecord.customer_name || '',
        customer_company: editingRecord.customer_company || '',
        customer_address_line1: editingRecord.customer_address_line1 || '',
        customer_address_line2: editingRecord.customer_address_line2 || '',
        customer_phone: editingRecord.customer_phone || '',
        description: editingRecord.description || '',
        amount: editingRecord.amount || '',
        // Quotation specific fields
        item_name: editingRecord.item_name || '',
        item_description: editingRecord.item_description || '',
        quantity: editingRecord.quantity || '1',
        unit_price: editingRecord.unit_price || '',
        remarks: editingRecord.remarks || '',
        quotation_items: editingRecord.quotation_items || [{ item_name: '', item_description: '', quantity: '1', unit_price: '' }],
        quotation_type: editingRecord.quotation_type || 'repair',
        // Technical form specific fields
        specifications: editingRecord.specifications || '',
        requirements: editingRecord.requirements || '',
        technical_details: editingRecord.technical_details || '',
        reference_number: editingRecord.reference_number || '',
        // Billing form specific fields
        invoice_number: editingRecord.invoice_number || '',
        due_date: editingRecord.due_date || '',
        billing_items: editingRecord.billing_items || [{ description: '', amount: '', quantity: '1' }],
        // Company information fields
        company_name: editingRecord.company_name || 'BLESSIE.BRENT',
        company_tin: editingRecord.company_tin || '',
        company_address_line1: editingRecord.company_address_line1 || 'QUIRINO AVENUE, CORNER Camia St',
        company_address_line2: editingRecord.company_address_line2 || 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines',
        company_phone: editingRecord.company_phone || '(083) 553 1734'
      })
    } else {
      // Reset form for new document
      setFormData({
        title: '',
        customer_name: '',
        customer_company: '',
        customer_address_line1: '',
        customer_address_line2: '',
        customer_phone: '',
        description: '',
        amount: '',
        // Quotation specific fields
        item_name: '',
        item_description: '',
        quantity: '1',
        unit_price: '',
        remarks: '',
        quotation_items: [{ item_name: '', item_description: '', quantity: '1', unit_price: '' }],
        quotation_type: 'repair',
        // Technical form specific fields
        specifications: '',
        requirements: '',
        technical_details: '',
        reference_number: '',
        // Billing form specific fields
        invoice_number: '',
        due_date: '',
        billing_items: [{ description: '', amount: '', quantity: '1' }],
        // Company information fields
        company_name: 'BLESSIE.BRENT',
        company_tin: '',
        company_address_line1: 'QUIRINO AVENUE, CORNER Camia St',
        company_address_line2: 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines',
        company_phone: '(083) 553 1734'
      })
    }
  }, [editingRecord])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBillingItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      billing_items: prev.billing_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addBillingItem = () => {
    setFormData(prev => ({
      ...prev,
      billing_items: [...prev.billing_items, { description: '', amount: '', quantity: '1' }]
    }))
  }

  const removeBillingItem = (index) => {
    setFormData(prev => ({
      ...prev,
      billing_items: prev.billing_items.filter((_, i) => i !== index)
    }))
  }

  const handleQuotationItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      quotation_items: prev.quotation_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addQuotationItem = () => {
    setFormData(prev => ({
      ...prev,
      quotation_items: [...prev.quotation_items, { item_name: '', item_description: '', quantity: '1', unit_price: '' }]
    }))
  }

  const removeQuotationItem = (index) => {
    setFormData(prev => ({
      ...prev,
      quotation_items: prev.quotation_items.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submission started with formType:', formType)
    console.log('Form data:', formData)

    // Validate required fields
    if (!formData.title || !formData.customer_name) {
      console.log('Validation failed: missing required fields')
      alert('Please fill in all required fields')
      return
    }

    // Validate quotation items
    if (formType === 'quotation') {
      const validItems = formData.quotation_items.filter(item =>
        item.item_name && item.item_name.trim() !== ''
      )
      console.log('Quotation validation - valid items:', validItems.length, 'total items:', formData.quotation_items.length)
      if (validItems.length === 0) {
        alert('Please add at least one repair service')
        return
      }
    }

    // Validate billing items
    if (formType === 'billing') {
      const validItems = formData.billing_items.filter(item =>
        item.description && item.description.trim() !== ''
      )
      console.log('Billing validation - valid items:', validItems.length, 'total items:', formData.billing_items.length)
      if (validItems.length === 0) {
        alert('Please add at least one billing item')
        return
      }
    }

    // Get current date and calculate due date (30 days from now)
    const currentDate = new Date()
    const dueDate = new Date(currentDate)
    dueDate.setDate(currentDate.getDate() + 30)

    // Convert and validate all numeric fields
    const submitData = {
      ...formData,
      // Main amount field
      amount: formData.amount ? parseFloat(formData.amount) : null,
      // Quotation items - ensure all numeric fields are properly converted
      quotation_items: formData.quotation_items.map(item => ({
        ...item,
        quantity: item.quantity ? parseInt(item.quantity) : 1,
        unit_price: item.unit_price ? parseFloat(item.unit_price) : 0
      })),
      // Billing items - ensure all numeric fields are properly converted
      billing_items: formData.billing_items.map(item => ({
        ...item,
        quantity: item.quantity ? parseInt(item.quantity) : 1,
        amount: item.amount ? parseFloat(item.amount) : 0
      })),
      // Date fields
      due_date: formData.due_date || dueDate.toISOString().split('T')[0],
      created_at: currentDate.toISOString()
    }
    console.log('Submitting data:', submitData)

    try {
      console.log('Calling onSubmit...')
      await onSubmit(submitData)
      console.log('onSubmit completed successfully')

      // Reset form
      console.log('Resetting form data...')
      setFormData({
        title: '',
        customer_name: '',
        customer_company: '',
        customer_address_line1: '',
        customer_address_line2: '',
        customer_phone: '',
        description: '',
        amount: '',
        // Quotation specific fields
        item_name: '',
        item_description: '',
        quantity: '1',
        unit_price: '',
        remarks: '',
        quotation_items: [{ item_name: '', item_description: '', quantity: '1', unit_price: '' }],
        quotation_type: 'repair',
        // Technical form specific fields
        specifications: '',
        requirements: '',
        technical_details: '',
        reference_number: '',
        // Billing form specific fields
        invoice_number: '',
        due_date: '',
        billing_items: [{ description: '', amount: '', quantity: '1' }],
        // Company information fields
        company_name: 'BLESSIE.BRENT',
        company_tin: '',
        company_address_line1: 'QUIRINO AVENUE, CORNER Camia St',
        company_address_line2: 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines',
        company_phone: '(083) 553 1734'
      })
      console.log('Form reset completed')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error saving document. Please try again.')
    }
  }

  const renderFormFields = () => {
    switch (formType) {
      case 'quotation':
        const quotationTotal = formData.quotation_items.reduce((total, item) => {
          const qty = parseFloat(item.quantity) || 1
          const price = parseFloat(item.unit_price) || 0
          return total + (qty * price)
        }, 0)

        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  {formData.quotation_type === 'repair' ? 'Repair Quote Title *' : 'Quotation Title *'}
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={formData.quotation_type === 'repair' ? 'Repair Quote Title' : 'Quotation Title'}
                />
              </div>
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  id="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Customer Name"
                />
              </div>
            </div>

            {/* Customer Information Section */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="customer_company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select
                    name="customer_company"
                    id="customer_company"
                    value={formData.customer_company}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select company type...</option>
                    <option value="Inc.">Inc.</option>
                    <option value="Company">Company</option>
                    <option value="Corporation">Corporation</option>
                    <option value="LLC">LLC</option>
                    <option value="Ltd.">Ltd.</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="customer_address_line1" className="block text-sm font-medium text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="customer_address_line1"
                  id="customer_address_line1"
                  value={formData.customer_address_line1}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Street address, building, apartment..."
                />
              </div>
              <div className="mt-4">
                <label htmlFor="customer_address_line2" className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="customer_address_line2"
                  id="customer_address_line2"
                  value={formData.customer_address_line2}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="City, province, postal code..."
                />
              </div>
            </div>

           {/* Quotation Type Selector */}
           <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Quotation Type</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quotation_type: 'repair' }))}
                  className={`p-4 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                    formData.quotation_type === 'repair'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🔧</span>
                    <div className="text-left">
                      <div className="font-bold">Repair Services</div>
                      <div className="text-xs opacity-75">Device repair, maintenance, technical services</div>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quotation_type: 'unit' }))}
                  className={`p-4 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                    formData.quotation_type === 'unit'
                      ? 'bg-green-600 text-white border-green-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📦</span>
                    <div className="text-left">
                      <div className="font-bold">Units & Parts</div>
                      <div className="text-xs opacity-75">Computer parts, devices, equipment sales</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {formData.quotation_type === 'repair' ? 'Repair Services' : 'Items & Parts'}
              </h4>

              {formData.quotation_items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        {formData.quotation_type === 'repair' ? 'Device/Service *' : 'Item/Part Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={item.item_name}
                        onChange={(e) => handleQuotationItemChange(index, 'item_name', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder={
                          formData.quotation_type === 'repair'
                            ? 'e.g., iPhone 12 Screen Repair, Laptop Motherboard Repair'
                            : 'e.g., 16GB DDR4 RAM, 500GB SSD, Wireless Mouse'
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuotationItemChange(index, 'quantity', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="1"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit Price (₱)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleQuotationItemChange(index, 'unit_price', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeQuotationItem(index)}
                        className="w-full py-2 px-3 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={formData.quotation_items.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {formData.quotation_type === 'repair' ? 'Problem Description' : 'Item Description'}
                    </label>
                    <textarea
                      rows={2}
                      value={item.item_description}
                      onChange={(e) => handleQuotationItemChange(index, 'item_description', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={
                        formData.quotation_type === 'repair'
                          ? 'Describe the issue or problem with the device...'
                          : 'Detailed description, specifications, model number...'
                      }
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuotationItem}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + Add {formData.quotation_type === 'repair' ? 'Service' : 'Item'}
              </button>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                    {formData.quotation_type === 'repair' ? 'Repair Notes / Special Instructions' : 'Additional Notes / Specifications'}
                  </label>
                  <textarea
                    name="remarks"
                    id="remarks"
                    rows={3}
                    value={formData.remarks}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={
                      formData.quotation_type === 'repair'
                        ? 'Any special repair instructions, parts needed, or additional notes...'
                        : 'Additional specifications, warranty information, or special requirements...'
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount (₱)
                  </label>
                  <div className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-md">
                    <p className="text-lg font-bold text-gray-900">
                      ₱{quotationTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case 'technical':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Technical Report Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Technical Report Title"
                />
              </div>
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  id="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">
                  Job Order #
                </label>
                <input
                  type="text"
                  name="reference_number"
                  id="reference_number"
                  value={formData.reference_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="JO-001"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Estimated Cost (₱)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Repair Technical Details</h4>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Device Information
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Device model, brand, serial number, and general condition..."
                />
              </div>

              <div className="mt-4">
                <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                  Problem Analysis *
                </label>
                <textarea
                  name="specifications"
                  id="specifications"
                  rows={4}
                  required
                  value={formData.specifications}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Detailed analysis of the problem, diagnostic findings, and technical assessment..."
                />
              </div>

              <div className="mt-4">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Parts Required
                </label>
                <textarea
                  name="requirements"
                  id="requirements"
                  rows={3}
                  value={formData.requirements}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="List of parts needed for repair, availability, and sourcing information..."
                />
              </div>

              <div className="mt-4">
                <label htmlFor="technical_details" className="block text-sm font-medium text-gray-700">
                  Repair Notes
                </label>
                <textarea
                  name="technical_details"
                  id="technical_details"
                  rows={3}
                  value={formData.technical_details}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Step-by-step repair process, tools used, testing procedures, and quality checks..."
                />
              </div>
            </div>
          </>
        )

      case 'billing':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Repair Invoice Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Repair Invoice Title"
                />
              </div>
              <div>
                <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700">
                  Invoice Number
                </label>
                <input
                  type="text"
                  name="invoice_number"
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="INV-001"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  id="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  id="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Company Information Section */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Company Information</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label htmlFor="company_tin" className="block text-sm font-medium text-gray-700">
                    TIN Number
                  </label>
                  <input
                    type="text"
                    name="company_tin"
                    id="company_tin"
                    value={formData.company_tin}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="TIN Number"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="company_address_line1" className="block text-sm font-medium text-gray-700">
                  Company Address Line 1
                </label>
                <input
                  type="text"
                  name="company_address_line1"
                  id="company_address_line1"
                  value={formData.company_address_line1}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Street address, building..."
                />
              </div>
              <div className="mt-4">
                <label htmlFor="company_address_line2" className="block text-sm font-medium text-gray-700">
                  Company Address Line 2
                </label>
                <input
                  type="text"
                  name="company_address_line2"
                  id="company_address_line2"
                  value={formData.company_address_line2}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="City, province, postal code..."
                />
              </div>
              <div className="mt-4">
                <label htmlFor="company_phone" className="block text-sm font-medium text-gray-700">
                  Company Phone
                </label>
                <input
                  type="tel"
                  name="company_phone"
                  id="company_phone"
                  value={formData.company_phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Company Phone Number"
                />
              </div>
            </div>

           <div className="border-t pt-6">
             <h4 className="text-lg font-medium text-gray-900 mb-4">Repair Services</h4>

              {formData.billing_items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Repair Service Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.description}
                        onChange={(e) => handleBillingItemChange(index, 'description', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Screen replacement, Battery replacement, Motherboard repair"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleBillingItemChange(index, 'quantity', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="1"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit Price (₱)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => handleBillingItemChange(index, 'amount', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeBillingItem(index)}
                        className="w-full py-2 px-3 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={formData.billing_items.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addBillingItem}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + Add Item
              </button>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Repair Notes
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Additional repair notes, warranty information, or special instructions..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount (₱)
                  </label>
                  <div className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-md">
                    <p className="text-lg font-bold text-gray-900">
                      ₱{formData.billing_items.reduce((total, item) => {
                        const qty = parseFloat(item.quantity) || 1
                        const amount = parseFloat(item.amount) || 0
                        return total + (qty * amount)
                      }, 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 shadow-sm rounded overflow-hidden">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">LOGO</div>';
              }}
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 capitalize">
            {editingRecord ? `Edit ${formType} Document` : `${formType} Form`}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFormFields()}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingRecord ? 'Update Document' : 'Save Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DocumentForm