import React, { useState } from 'react';
import { Invoice, Customer, InvoiceItem, INITIAL_INVOICES } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  X, 
  DollarSign, 
  FileCheck,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceManagerProps {
  invoices: Invoice[];
  customers: Customer[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  onConvertEstimateToInvoice: (id: string) => void;
}

export default function InvoiceManager({
  invoices,
  customers,
  onAddInvoice,
  onUpdateInvoiceStatus,
  onConvertEstimateToInvoice
}: InvoiceManagerProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [docType, setDocType] = useState<'estimate' | 'invoice'>('estimate');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [taxRate, setTaxRate] = useState(8.5); // Default Tulsa Tax rate
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: 'Custom Large Format Vinyl Print & Cut', quantity: 1, rate: 150, amount: 150 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: any) => {
    const updatedItems = [...items];
    const item = updatedItems[index];

    if (field === 'description') {
      item.description = value;
    } else if (field === 'quantity') {
      item.quantity = Number(value);
      item.amount = item.quantity * item.rate;
    } else if (field === 'rate') {
      item.rate = Number(value);
      item.amount = item.quantity * item.rate;
    }

    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() - discount) * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discount + calculateTax();
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax();
    const total = calculateTotal();

    const newDoc: Invoice = {
      id: `doc_${Date.now()}`,
      customerId: selectedCustomerId,
      invoiceNumber: `${docType === 'estimate' ? 'EST' : 'INV'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: docType,
      status: docType === 'estimate' ? 'sent' : 'unpaid',
      items: items.map((item, i) => ({ ...item, id: `item_${Date.now()}_${i}` })),
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      issueDate,
      dueDate,
      notes
    };

    onAddInvoice(newDoc);
    toast.success(`Successfully created ${docType === 'estimate' ? 'Estimate' : 'Invoice'} ${newDoc.invoiceNumber}`);
    
    // Reset Form
    setSelectedCustomerId('');
    setItems([{ description: 'Custom Large Format Vinyl Print & Cut', quantity: 1, rate: 150, amount: 150 }]);
    setNotes('');
    setDiscount(0);
    setActiveTab('list');
  };

  const getCustomerDetails = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => { setActiveTab('list'); setSelectedInvoice(null); }}
            className={`rounded-xl text-xs font-semibold ${activeTab === 'list' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
          >
            All Estimates & Invoices
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
            className={`rounded-xl text-xs font-semibold ${activeTab === 'create' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Create Estimate / Invoice
          </Button>
        </div>

        {selectedInvoice && (
          <Button
            onClick={handlePrint}
            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold"
          >
            <Printer className="h-3.5 w-3.5 mr-1" />
            Print to PDF
          </Button>
        )}
      </div>

      {/* Main View Area */}
      {activeTab === 'list' && !selectedInvoice && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Document List */}
          <Card className="xl:col-span-2 bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400">
                Documents Archive
              </CardTitle>
              <CardDescription className="text-xs">
                View, manage, and convert estimates into paid invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-black/10">
                      <th className="py-3 px-4">Doc #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date Due</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {invoices.map((inv) => {
                      const cust = getCustomerDetails(inv.customerId);
                      return (
                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                            {inv.invoiceNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-foreground">
                              {cust?.company !== 'Personal Custom' ? cust?.company : cust?.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{cust?.name}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge className={inv.type === 'estimate' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'}>
                              {inv.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge className={
                              inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              inv.status === 'unpaid' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              inv.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }>
                              {inv.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-muted-foreground">
                            {inv.dueDate}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                            ${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex justify-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedInvoice(inv)}
                                className="h-7 px-2 text-[10px] rounded-lg border-white/10"
                              >
                                View / Print
                              </Button>
                              {inv.type === 'estimate' && inv.status !== 'approved' && (
                                <Button
                                  size="sm"
                                  onClick={() => onConvertEstimateToInvoice(inv.id)}
                                  className="h-7 px-2 text-[10px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  Convert to Invoice
                                </Button>
                              )}
                              {inv.type === 'invoice' && inv.status === 'unpaid' && (
                                <Button
                                  size="sm"
                                  onClick={() => onUpdateInvoiceStatus(inv.id, 'paid')}
                                  className="h-7 px-2 text-[10px] rounded-lg bg-pink-600 hover:bg-pink-700 text-white"
                                >
                                  Mark Paid
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border-white/5 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-4">Financial Health</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Total Paid Invoices</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    ${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Outstanding Balance</span>
                  <span className="text-2xl font-bold text-amber-400 font-mono">
                    ${invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.total, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Pending Estimates</span>
                  <span className="text-2xl font-bold text-cyan-400 font-mono">
                    ${invoices.filter(i => i.type === 'estimate').reduce((sum, i) => sum + i.total, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Invoice Details / Print View */}
      {selectedInvoice && (
        <Card className="bg-white text-black p-8 md:p-12 max-w-4xl mx-auto rounded-2xl shadow-2xl print:shadow-none print:p-0 print:border-none">
          {/* Printable Area Wrapper */}
          <div className="space-y-8 print:space-y-6">
            {/* Branded Invoice Header */}
            <div className="flex flex-col md:flex-row md:justify-between border-b-2 border-gray-100 pb-6 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-700 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    C2C
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-wider text-black">
                      ALL-PRO COAST 2 COAST LLC
                    </h1>
                    <p className="text-[10px] font-bold text-cyan-600 tracking-widest uppercase">
                      Large Format Printing & Vehicle Wraps
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>Route 66 Creative Studio & Print Shop</p>
                  <p>5812 E 11th St, Tulsa, OK 74112</p>
                  <p>Phone: (918) 555-0199 | billing@coast2coast.com</p>
                </div>
              </div>

              <div className="text-left md:text-right space-y-1">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
                  {selectedInvoice.type}
                </h2>
                <p className="font-mono text-sm font-bold text-cyan-600">
                  {selectedInvoice.invoiceNumber}
                </p>
                <div className="text-xs text-gray-500 space-y-1 pt-2">
                  <p><span className="font-semibold">Date Issued:</span> {selectedInvoice.issueDate}</p>
                  <p><span className="font-semibold">Due Date:</span> {selectedInvoice.dueDate}</p>
                  <p>
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`font-bold uppercase ${
                      selectedInvoice.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {selectedInvoice.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bill To & Ship To Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Client / Customer Details
                </h3>
                {(() => {
                  const cust = getCustomerDetails(selectedInvoice.customerId);
                  return (
                    <div className="text-xs space-y-1 text-gray-700">
                      <p className="font-bold text-sm text-black">{cust?.company !== 'Personal Custom' ? cust?.company : cust?.name}</p>
                      <p><span className="font-semibold">Contact:</span> {cust?.name}</p>
                      <p><span className="font-semibold">Email:</span> {cust?.email}</p>
                      <p><span className="font-semibold">Phone:</span> {cust?.phone}</p>
                      {cust?.address && <p><span className="font-semibold">Address:</span> {cust?.address}</p>}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Invoice Line Items Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4 text-center w-20">Qty</th>
                    <th className="py-3 px-4 text-right w-28">Unit Rate</th>
                    <th className="py-3 px-4 text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-4 font-medium text-black">
                        {item.description}
                      </td>
                      <td className="py-4 px-4 text-center font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right font-mono">
                        ${item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-black">
                        ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals & Payment Info */}
            <div className="flex flex-col md:flex-row md:justify-between gap-6 pt-4">
              <div className="flex-1 space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Invoice Notes & Terms
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1.5 leading-relaxed">
                  <p>{selectedInvoice.notes || 'No custom notes provided for this document.'}</p>
                  <p className="font-semibold text-[10px] text-gray-500 uppercase tracking-wide mt-2">
                    Payment Instructions:
                  </p>
                  <p>All checks should be made payable to: <span className="font-bold text-black">All-Pro Coast 2 Coast LLC</span></p>
                  <p>We accept Cash, Card, Bank Wire, and major Fleet cards. Thank you!</p>
                </div>
              </div>

              <div className="w-full md:w-80 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span className="font-mono text-black font-semibold">${selectedInvoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-medium">
                    <span>Discount:</span>
                    <span className="font-mono">-${selectedInvoice.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Sales Tax ({selectedInvoice.taxRate}%):</span>
                  <span className="font-mono text-black">${selectedInvoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center text-base font-black text-black">
                  <span>Grand Total:</span>
                  <span className="font-mono text-cyan-600">${selectedInvoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Document Creator Form */}
      {activeTab === 'create' && (
        <Card className="bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400">
              New Estimate / Invoice Creator
            </CardTitle>
            <CardDescription className="text-xs">
              Draft a custom estimate or invoice with dynamic tax calculations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateDocument} className="space-y-6">
              {/* Document Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Document Type Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={docType === 'estimate' ? 'default' : 'outline'}
                      onClick={() => setDocType('estimate')}
                      className={`flex-1 rounded-xl text-xs ${docType === 'estimate' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}`}
                    >
                      Estimate
                    </Button>
                    <Button
                      type="button"
                      variant={docType === 'invoice' ? 'default' : 'outline'}
                      onClick={() => setDocType('invoice')}
                      className={`flex-1 rounded-xl text-xs ${docType === 'invoice' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
                    >
                      Invoice
                    </Button>
                  </div>
                </div>

                {/* Customer Linkage */}
                <div className="space-y-2">
                  <Label htmlFor="custSelect" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Link Customer
                  </Label>
                  <select
                    id="custSelect"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="" className="bg-card">Select Customer...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id} className="bg-card">
                        {c.company !== 'Personal Custom' ? `${c.company} (${c.name})` : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDateInput" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Due Date
                  </Label>
                  <Input
                    id="dueDateInput"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-black/40 border-white/10 rounded-xl py-5"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Line Items</h4>
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    size="sm"
                    className="h-8 rounded-lg bg-white/5 hover:bg-white/10 text-xs border border-white/5"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-3 items-end p-4 rounded-xl bg-white/5 border border-white/5">
                      {/* Description */}
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="e.g., 3M 2080 Gloss Vinyl Wrap Installation"
                          className="bg-black/40 border-white/10 rounded-lg h-9 text-xs"
                          required
                        />
                      </div>

                      {/* Quantity */}
                      <div className="w-full md:w-20 space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="bg-black/40 border-white/10 rounded-lg h-9 text-xs font-mono"
                          min="1"
                          required
                        />
                      </div>

                      {/* Rate */}
                      <div className="w-full md:w-28 space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Rate ($)</Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          className="bg-black/40 border-white/10 rounded-lg h-9 text-xs font-mono"
                          required
                        />
                      </div>

                      {/* Total Line Amount */}
                      <div className="w-full md:w-28 space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Total</Label>
                        <div className="h-9 flex items-center px-3 rounded-lg bg-black/20 border border-white/5 font-mono text-xs font-bold text-cyan-400">
                          ${item.amount.toLocaleString()}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className="bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/20 rounded-lg h-9 w-9 p-0 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals & Custom Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="docNotes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Custom Notes / Terms
                  </Label>
                  <textarea
                    id="docNotes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., 50% deposit required prior to material prep. Remainder due on delivery."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                {/* Calculation Block */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-mono text-foreground font-semibold">${calculateSubtotal().toLocaleString()}</span>
                  </div>

                  {/* Tax Rate Setting */}
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Sales Tax Rate:</span>
                    <div className="flex items-center gap-1.5 w-24">
                      <Input
                        type="number"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="bg-black/40 border-white/10 rounded-lg h-7 text-xs font-mono text-right"
                      />
                      <span>%</span>
                    </div>
                  </div>

                  {/* Discount Setting */}
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Discount ($):</span>
                    <div className="flex items-center gap-1.5 w-24">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="bg-black/40 border-white/10 rounded-lg h-7 text-xs font-mono text-right"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 flex justify-between items-center text-sm font-bold">
                    <span className="text-cyan-400">Total Price:</span>
                    <span className="font-mono text-cyan-400">${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('list')}
                  className="rounded-xl text-xs border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold px-6 py-5"
                >
                  Create & Send {docType === 'estimate' ? 'Estimate' : 'Invoice'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
