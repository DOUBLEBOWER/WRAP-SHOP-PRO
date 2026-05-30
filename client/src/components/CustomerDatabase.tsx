import React, { useState } from 'react';
import { Customer, Deal, Invoice } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Phone, MapPin, DollarSign, Calendar, FileText, User } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerDatabaseProps {
  customers: Customer[];
  deals: Deal[];
  invoices: Invoice[];
  onAddCustomer: (customer: Customer) => void;
}

export default function CustomerDatabase({
  customers,
  deals,
  invoices,
  onAddCustomer
}: CustomerDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(cust => 
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error('Name, Email, and Phone are required');
      return;
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name,
      company: company || 'Personal Custom',
      email,
      phone,
      address,
      totalSpent: 0,
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddCustomer(newCustomer);
    toast.success(`Successfully added customer "${name}"`);
    
    // Reset Form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
    setShowAddModal(false);
  };

  const getCustomerJobs = (customerId: string) => {
    return deals.filter(deal => deal.customerId === customerId);
  };

  const getCustomerInvoices = (customerId: string) => {
    return invoices.filter(inv => inv.customerId === customerId);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Customer Database
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your client profiles, track their total spending, and view job and billing history.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-md shadow-pink-500/15 rounded-xl self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer Profile
        </Button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customer List Card */}
        <Card className="xl:col-span-2 bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400">
                  Client Directory
                </CardTitle>
                <CardDescription className="text-xs">
                  Showing {filteredCustomers.length} active clients
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, company, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/40 border-white/10 pl-9 rounded-xl h-9 text-xs focus-visible:ring-pink-500/30"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-black/10">
                    <th className="py-3 px-4">Client Name / Company</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Total Spent</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredCustomers.map((cust) => (
                    <tr 
                      key={cust.id} 
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedCustomer?.id === cust.id ? 'bg-pink-500/5' : ''}`}
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">
                          {cust.company !== 'Personal Custom' ? cust.company : cust.name}
                        </div>
                        {cust.company !== 'Personal Custom' && (
                          <div className="text-[10px] text-muted-foreground font-medium">{cust.name}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5 text-[11px]">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{cust.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground font-mono">
                        {cust.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-400">
                        ${cust.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCustomer(cust)}
                          className="h-7 px-2 text-[10px] rounded-lg border-white/10"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Profile View Panel */}
        <div className="space-y-6">
          {selectedCustomer ? (
            <Card className="bg-gradient-to-br from-purple-950/10 to-cyan-950/10 border-white/5 rounded-2xl p-6 space-y-6">
              {/* Profile Header */}
              <div className="space-y-3 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/10">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground leading-tight">
                      {selectedCustomer.company !== 'Personal Custom' ? selectedCustomer.company : selectedCustomer.name}
                    </h3>
                    {selectedCustomer.company !== 'Personal Custom' && (
                      <p className="text-xs text-muted-foreground">Contact: {selectedCustomer.name}</p>
                    )}
                  </div>
                </div>

                {selectedCustomer.address && (
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground pt-1">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-pink-400" />
                    <span>{selectedCustomer.address}</span>
                  </div>
                )}
              </div>

              {/* Total Spent Stat */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total Revenue</span>
                  <span className="text-xl font-bold text-cyan-400 font-mono">${selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total Jobs</span>
                  <span className="text-xl font-bold text-pink-400 font-mono">{getCustomerJobs(selectedCustomer.id).length} Jobs</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Internal Shop Notes</h4>
                <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-xl bg-white/5 border border-white/5">
                  {selectedCustomer.notes || 'No notes saved for this client.'}
                </p>
              </div>

              {/* Job History */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Job & Project History</h4>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {getCustomerJobs(selectedCustomer.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No jobs recorded yet.</p>
                  ) : (
                    getCustomerJobs(selectedCustomer.id).map(job => (
                      <div key={job.id} className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">{job.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{job.dueDate} | {job.serviceType}</p>
                        </div>
                        <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 font-mono font-bold text-[10px]">
                          ${job.value}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl p-8 text-center text-muted-foreground">
              <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs">Select a customer from the directory to view detailed transaction history, notes, and jobs.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4 rotate-45" />
            </button>

            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base font-bold tracking-wider text-cyan-400 uppercase">
                Add Customer Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Create a new record in your CRM client directory.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="custName" className="text-xs text-muted-foreground">Contact Name</Label>
                    <Input
                      id="custName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., John Doe"
                      className="bg-black/40 border-white/10 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="custCompany" className="text-xs text-muted-foreground">Company Name</Label>
                    <Input
                      id="custCompany"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g., Cain's Ballroom"
                      className="bg-black/40 border-white/10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="custEmail" className="text-xs text-muted-foreground">Email Address</Label>
                    <Input
                      id="custEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., john@cains.com"
                      className="bg-black/40 border-white/10 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="custPhone" className="text-xs text-muted-foreground">Phone Number</Label>
                    <Input
                      id="custPhone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., 918-555-0199"
                      className="bg-black/40 border-white/10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="custAddr" className="text-xs text-muted-foreground">Physical Address</Label>
                  <Input
                    id="custAddr"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., 423 N Main St, Tulsa, OK 74103"
                    className="bg-black/40 border-white/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="custNotes" className="text-xs text-muted-foreground">Internal Shop Notes</Label>
                  <textarea
                    id="custNotes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Prefer Avery Dennison wrap films, window graphics need pre-proofing."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl text-xs border-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold px-5"
                  >
                    Save Customer Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
