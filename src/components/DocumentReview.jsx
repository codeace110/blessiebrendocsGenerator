import { useRef, useState } from 'react'

const DocumentReview = ({ record, onBack }) => {
  const printRef = useRef()
  const [isExporting, setIsExporting] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return 'N/A'
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const calculateTotal = (amount) => {
    return amount || 0
  }

  const exportAsImage = async () => {
    setIsExporting(true)
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default

      const element = printRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      })

      // Create download link
      const link = document.createElement('a')
      link.download = `${record.form_type}_${record.title || record.id}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error exporting as image:', error)
      alert('Error exporting image. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsPDF = async () => {
    setIsExporting(true)
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      const element = printRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`${record.form_type}_${record.title || record.id}.pdf`)
    } catch (error) {
      console.error('Error exporting as PDF:', error)
      alert('Error exporting PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const getFormTypeTitle = (formType) => {
    switch (formType) {
      case 'quotation':
        return 'QUOTATION'
      case 'technical':
        return 'TECHNICAL DOCUMENT'
      case 'billing':
        return 'INVOICE'
      default:
        return 'DOCUMENT'
    }
  }

  const renderDocumentContent = () => {
    switch (record.form_type) {
      case 'quotation':
        const quotationItems = record.quotation_items || []
        const quotationTotal = quotationItems.reduce((total, item) => {
          const qty = parseFloat(item.quantity) || 1
          const price = parseFloat(item.unit_price) || 0
          return total + (qty * price)
        }, 0)

        // Determine quotation type from data or default to repair
        const quotationType = record.quotation_type || 'repair'

        return (
          <div>
            <table className="w-full border-collapse border-2 border-gray-300 text-sm">
              <thead>
                <tr className="bg-blue-600 text-white text-left">
                  <th className="border border-gray-300 px-4 py-3 font-bold uppercase tracking-wide">
                    {quotationType === 'repair' ? 'Service Details' : 'Item Details'}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold uppercase tracking-wide">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold uppercase tracking-wide">Qty</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {quotationItems.map((item, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border border-gray-300 px-4 py-3">
                      <div>
                        <p className="font-semibold">{item.item_name}</p>
                        {item.item_description && (
                          <p className="text-sm text-gray-600 mt-1">{item.item_description}</p>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{formatAmount(item.unit_price)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{item.quantity || 1}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{formatAmount((item.quantity || 1) * item.unit_price)}</td>
                  </tr>
                ))}
                {record.remarks && (
                  <tr className="bg-blue-50">
                    <td colSpan="4" className="border border-gray-300 px-4 py-3">
                      <p className="text-sm">
                        <strong>
                          {quotationType === 'repair' ? 'Repair Notes:' : 'Additional Notes:'}
                        </strong> {record.remarks}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals Table */}
            <div className="flex justify-end mt-6">
              <table className="border-2 border-gray-300 bg-gray-50">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border border-gray-300 font-semibold bg-white">Subtotal</td>
                    <td className="px-4 py-2 text-right border border-gray-300">{formatAmount(quotationTotal)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-300 font-semibold bg-white">Total Amount</td>
                    <td className="px-4 py-2 text-right border border-gray-300">{formatAmount(quotationTotal)}</td>
                  </tr>
                  <tr className="bg-blue-600 text-white">
                    <td className="px-4 py-2 border border-gray-300 font-bold text-lg">QUOTATION TOTAL</td>
                    <td className="px-4 py-2 text-right border border-gray-300 font-bold text-lg">{formatAmount(quotationTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'technical':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-md font-bold text-gray-800 mb-3 text-blue-700">Document Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Job Order #:</span>
                    <span className="font-semibold text-gray-900">{record.reference_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Estimated Cost:</span>
                    <span className="font-semibold text-gray-900">{formatAmount(record.amount)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-md font-bold text-gray-800 mb-3 text-blue-700">Project Overview</h4>
                <p className="text-gray-700">{record.description || 'No overview provided'}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-md font-bold text-gray-800 mb-3 text-blue-700">Technical Specifications</h4>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{record.specifications || 'No specifications provided'}</pre>
              </div>
            </div>

            {record.requirements && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-md font-bold text-gray-800 mb-3 text-blue-700">System Requirements</h4>
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                  <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{record.requirements}</pre>
                </div>
              </div>
            )}

            {record.technical_details && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-md font-bold text-gray-800 mb-3 text-blue-700">Additional Technical Details</h4>
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{record.technical_details}</pre>
                </div>
              </div>
            )}
          </div>
        )

      case 'billing':
        const billingItems = record.billing_items || []
        const billingTotal = billingItems.reduce((total, item) => {
          const qty = parseFloat(item.quantity) || 1
          const amount = parseFloat(item.amount) || 0
          return total + (qty * amount)
        }, 0)

        return (
          <div>
            <table className="w-full border-collapse border-2 border-gray-300 text-sm">
              <thead>
                <tr className="bg-blue-600 text-white text-left">
                  <th className="border border-gray-300 px-4 py-3 font-bold uppercase tracking-wide">Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold uppercase tracking-wide">Qty</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold uppercase tracking-wide">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-bold uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {billingItems.map((item, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border border-gray-300 px-4 py-3">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{item.quantity || 1}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{formatAmount(item.amount)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{formatAmount((item.quantity || 1) * item.amount)}</td>
                  </tr>
                ))}
                {record.description && (
                  <tr className="bg-blue-50">
                    <td colSpan="4" className="border border-gray-300 px-4 py-3">
                      <p className="text-sm"><strong>Notes:</strong> {record.description}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals Table */}
            <div className="flex justify-end mt-6">
              <table className="border-2 border-gray-300 bg-gray-50">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border border-gray-300 font-semibold bg-white">Subtotal</td>
                    <td className="px-4 py-2 text-right border border-gray-300">{formatAmount(billingTotal)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-300 font-semibold bg-white">Total Amount</td>
                    <td className="px-4 py-2 text-right border border-gray-300">{formatAmount(billingTotal)}</td>
                  </tr>
                  <tr className="bg-blue-600 text-white">
                    <td className="px-4 py-2 border border-gray-300 font-bold text-lg">INVOICE TOTAL</td>
                    <td className="px-4 py-2 text-right border border-gray-300 font-bold text-lg">{formatAmount(billingTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Document Review</h2>
        <div className="flex space-x-3">
          <button
            onClick={exportAsImage}
            disabled={isExporting}
            className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isExporting ? '⏳' : '🖼️'} {isExporting ? 'Exporting...' : 'Export Image'}
          </button>
          <button
            onClick={exportAsPDF}
            disabled={isExporting}
            className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isExporting ? '⏳' : '📄'} {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            🖨️ Print
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Back to Records
          </button>
        </div>
      </div>

      {/* Print-friendly document layout */}
      <div ref={printRef} className="bg-white shadow-xl max-w-4xl mx-auto min-h-[11in] print:shadow-none print:max-w-none print:mx-0">
        {/* Compact Professional Header */}
        <div className="bg-white border-b-2 border-gray-300 pb-4">
          <div className="flex justify-between items-start px-6 pt-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 shadow-sm rounded overflow-hidden bg-gray-100 flex items-center justify-center">
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
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{record.company_name || 'BLESSIE.BRENT'}</h1>
                  <h2 className="text-xs font-semibold text-gray-600 uppercase">Computer & Electronics Repair Services</h2>
                </div>
              </div>
              <div className="text-xs text-gray-700 leading-tight">
                <p>{record.company_address_line1 || 'QUIRINO AVENUE, CORNER Camia St'}</p>
                <p>{record.company_address_line2 || 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines'}</p>
                <p>Phone: {record.company_phone || '(083) 553 1734'}</p>
                {record.company_tin && <p>TIN: {record.company_tin}</p>}
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="bg-gray-800 text-white px-4 py-3">
                <h2 className="text-lg font-bold tracking-wider mb-1">{getFormTypeTitle(record.form_type)}</h2>
                <div className="border-t border-white/30 mt-1 pt-1">
                  <p className="text-xs font-bold">#{record.invoice_number || (record.form_type === 'quotation' ? '000925' : record.id || '001')}</p>
                </div>
              </div>
              <div className="mt-2 text-right">
                <div className="bg-gray-100 p-2 border text-xs">
                  <div className="flex justify-between gap-4">
                    <span className="font-bold text-gray-700">DATE:</span>
                    <span className="font-semibold text-gray-900">{formatDate(record.created_at)}</span>
                  </div>
                  {record.form_type === 'billing' && record.due_date && (
                    <div className="flex justify-between gap-4 mt-1">
                      <span className="font-bold text-gray-700">DUE:</span>
                      <span className="font-semibold text-gray-900">{formatDate(record.due_date)}</span>
                    </div>
                  )}
                  {record.form_type !== 'billing' && (
                    <div className="flex justify-between gap-4 mt-1">
                      <span className="font-bold text-gray-700">VALID:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(new Date(record.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company & Customer Information - Compact Layout */}
        <div className="px-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="bg-gray-800 text-white px-2 py-1 font-bold text-xs mb-1">
                {record.form_type === 'billing' ? 'BILL FROM' : 'FROM'}
              </h3>
              <div className="p-2 border border-gray-300 bg-white text-sm">
                <div className="text-gray-700 space-y-1">
                  {record.form_type === 'billing' ? (
                    // For billing forms, show customer info in FROM section
                    <>
                      <p className="font-semibold text-sm">{record.customer_name}</p>
                      {record.customer_company && <p className="text-xs">{record.customer_company}</p>}
                      {record.customer_address_line1 && <p className="text-xs">{record.customer_address_line1}</p>}
                      {record.customer_address_line2 && <p className="text-xs">{record.customer_address_line2}</p>}
                      {record.customer_phone && <p className="text-xs">Phone: {record.customer_phone}</p>}
                    </>
                  ) : (
                    // For other forms, show company info in FROM section
                    <>
                      <p className="font-semibold text-sm">{record.company_name || 'BLESSIE.BRENT'}</p>
                      <p className="text-xs">{record.company_address_line1 || 'QUIRINO AVENUE, CORNER Camia St'}</p>
                      <p className="text-xs">{record.company_address_line2 || 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines'}</p>
                      <p className="text-xs">Phone: {record.company_phone || '(083) 553 1734'}</p>
                      {record.company_tin && <p className="text-xs">TIN: {record.company_tin}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="bg-gray-800 text-white px-2 py-1 font-bold text-xs mb-1">
                {record.form_type === 'quotation' ? 'QUOTE FOR' : record.form_type === 'billing' ? 'BILL TO' : 'BILL TO'}
              </h3>
              <div className="p-2 border border-gray-300 bg-white text-sm">
                <div className="text-gray-700 space-y-1">
                  {record.form_type === 'billing' ? (
                    // For billing forms, show company info in BILL TO section
                    <>
                      <p className="font-semibold text-sm">{record.company_name || 'BLESSIE.BRENT'}</p>
                      <p className="text-xs">{record.company_address_line1 || 'QUIRINO AVENUE, CORNER Camia St'}</p>
                      <p className="text-xs">{record.company_address_line2 || 'General Santos City (Dadiangas), 9500 South Cotabato, Philippines'}</p>
                      <p className="text-xs">Phone: {record.company_phone || '(083) 553 1734'}</p>
                      {record.company_tin && <p className="text-xs">TIN: {record.company_tin}</p>}
                    </>
                  ) : (
                    // For other forms, show customer info in BILL TO section
                    <>
                      <p className="font-semibold text-sm">{record.customer_name}</p>
                      {record.customer_company && <p className="text-xs">{record.customer_company}</p>}
                      {record.customer_address_line1 && <p className="text-xs">{record.customer_address_line1}</p>}
                      {record.customer_address_line2 && <p className="text-xs">{record.customer_address_line2}</p>}
                      {record.customer_phone && <p className="text-xs">Phone: {record.customer_phone}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Table */}
        <div className="px-6 mt-6">
          {renderDocumentContent()}
        </div>

        {/* Terms and Conditions */}
        <div className="px-6 mt-4">
          <h3 className="bg-gray-800 text-white px-3 py-1 font-bold text-xs mb-2">TERMS AND CONDITIONS</h3>
          <div className="p-3 border border-gray-300 bg-white">
            <div className="text-gray-700 space-y-1 text-xs">
              <p>1. Customer will be billed after indicating acceptance of this {record.form_type === 'quotation' ? 'repair quote' : record.form_type === 'technical' ? 'document' : 'invoice'}.</p>
              <p>2. Payment will be due upon completion of repair service.</p>
              <p>3. Device will be released only after full payment is received.</p>
              <p>4. Please contact us for any questions about your repair service.</p>

              {/* Prepared By Section */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="text-gray-600 mb-2"><em>Prepared by: {record.company_name || 'BLESSIE.BRENT'}</em></p>
                <div className="h-8 border-b-2 border-gray-400 w-64 bg-white"></div>
                <p className="mt-2 text-gray-600 text-xs">Authorized Signature: _______________________________ Date: _______________</p>
              </div>

              {/* Customer Acceptance Section */}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-gray-600 mb-1"><em>Customer Acceptance (sign below):</em></p>
                <div className="h-8 border-b-2 border-gray-400 w-64 bg-white"></div>
                <p className="mt-2 text-gray-600 text-xs">Print Name: _______________________________ Date: _______________</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 mt-6 pb-6">
          <div className="text-center text-xs text-gray-600 bg-gray-100 p-3 rounded">
            <p>If you have any questions about this {record.form_type === 'quotation' ? 'quote' : record.form_type === 'technical' ? 'technical repair' : 'billing or invoice'}, please contact</p>
            <p className="font-semibold mt-1">(083) 553 1734, @GensanLaptopPartsBlessiebrent</p>
            <p className="font-bold mt-2 text-gray-800 text-sm">
              {record.form_type === 'quotation' ? 'Thank You For Choosing Our Repair Services!' :
               record.form_type === 'technical' ? 'Thank You For Your Business!' :
               'Thank You For Your Business!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentReview