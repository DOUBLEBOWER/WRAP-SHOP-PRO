import React, { useState } from 'react';
import { Customer, Deal, Invoice } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Phone, MapPin, User, PenLine, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

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
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Add form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Edit form state (mirrors add form)
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // tRPC mutations
  const utils = trpc.useUtils();
  const updateCustomerMutation = trpc.crm.customers.update.useMutation({
    onSuccess: () => {
      utils.crm.customers.list.invalidate();
      toast.success('Customer updated successfully!');
      setEditingCustomer(null);
    },
    onError: () => toast.error('Failed to update customer.')
  });
  const deleteCustomerMutation = trpc.crm.customers.delete.useMutation({
    onSuccess: () => {
      utils.crm.customers.list.invalidate();
      toast.success('Customer removed from database.');
      setShowDeleteConfirm(null);
      if (selectedCustomer?.id === showDeleteConfirm) setSelectedCustomer(null);
    },
    onError: () => toast.error('Failed to delete customer.')
  });

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
    setName(''); setCompany(''); setEmail(''); setPhone(''); setAddress(''); setNotes('');
    setShowAddModal(false);
  };

  const handleStartEdit = (cust: Customer) => {
    setEditingCustomer(cust);
    setEditName(cust.name);
    setEditCompany(cust.company !== 'Personal Custom' ? cust.company : '');
    setEditEmail(cust.email);
    setEditPhone(cust.phone);
    setEditAddress(cust.address || '');
    setEditNotes(cust.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    updateCustomerMutation.mutate({
      id: editingCustomer.id,
      name: editName,
      company: editCompany || 'Personal Custom',
      email: editEmail,
      phone: editPhone,
      address: editAddress || undefined,
      notes: editNotes || undefined
    });
  };

  const handleDelete = (id: string) => {
    deleteCustomerMutation.mutate({ id });
  };

  const getCustomerJobs = (customerId: string) => deals.filter(d => d.customerId === customerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Customer Database
          </h2>
          <p className="text-sm text-muted-foreground">
            All data is saved permanently. Edit or remove any customer record at any time.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-md shadow-pink-500/15 rounded-xl self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customer List */}
        <Card className="xl:col-span-2 bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400">
                  Client Directory
                </CardTitle>
                <CardDescription className="text-xs">
                  {filteredCustomers.length} client{filteredCustomers.length !== 1 ? 's' : ''} found
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
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No customers yet. Add your first client above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-black/10">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Contact</th>
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
                            <div className="text-[10px] text-muted-foreground">{cust.name}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5 text-[11px]">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="h-3 w-3" /><span>{cust.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3 w-3" /><span>{cust.phone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-400">
                          ${Number(cust.totalSpent).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartEdit(cust)}
                              className="h-7 px-2 text-[10px] rounded-lg border-white/10 hover:border-cyan-500/40 hover:text-cyan-400"
                            >
                              <PenLine className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowDeleteConfirm(cust.id)}
                              className="h-7 px-2 text-[10px] rounded-lg border-white/10 hover:border-red-500/40 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <div className="space-y-6">
          {selectedCustomer ? (
            <Card className="bg-gradient-to-br from-purple-950/10 to-cyan-950/10 border-white/5 rounded-2xl p-6 space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total Revenue</span>
                  <span className="text-xl font-bold text-cyan-400 font-mono">${Number(selectedCustomer.totalSpent).toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total Jobs</span>
                  <span className="text-xl font-bold text-pink-400 font-mono">{getCustomerJobs(selectedCustomer.id).length}</span>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Notes</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-xl bg-white/5 border border-white/5">
                    {selectedCustomer.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <Button
                  size="sm"
                  onClick={() => handleStartEdit(selectedCustomer)}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold"
                >
                  <PenLine className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(selectedCustomer.id)}
                  className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl p-8 text-center text-muted-foreground min-h-[200px]">
              <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs">Click a customer to view details, edit, or delete.</p>
            </Card>
          )}
        </div>
      </div>

      {/* ── EDIT CUSTOMER MODAL ── */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <button onClick={() => setEditingCustomer(null)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base font-bold tracking-wider text-cyan-400 uppercase">Edit Customer</CardTitle>
              <CardDescription className="text-xs">Update the details for {editingCustomer.name}.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Contact Name</Label>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Company Name</Label>
                    <Input value={editCompany} onChange={e => setEditCompany(e.target.value)} placeholder="Leave blank for personal" className="bg-black/40 border-white/10 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="bg-black/40 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Internal Notes</Label>
                  <textarea rows={3} value={editNotes} onChange={e => setEditNotes(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                  <Button type="button" variant="outline" onClick={() => setEditingCustomer(null)} className="rounded-xl text-xs border-white/10">Cancel</Button>
                  <Button type="submit" disabled={updateCustomerMutation.isPending}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold px-5">
                    {updateCustomerMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-sm bg-card border-red-500/20 rounded-2xl shadow-2xl p-6 space-y-5 text-center">
            <div className="h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="h-7 w-7 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground">Delete Customer?</h3>
              <p className="text-xs text-muted-foreground">
                This will permanently remove <strong className="text-foreground">{customers.find(c => c.id === showDeleteConfirm)?.name}</strong> from your database. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1 rounded-xl border-white/10 text-xs">Cancel</Button>
              <Button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteCustomerMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                {deleteCustomerMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── ADD CUSTOMER MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowAddModal(false)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base font-bold tracking-wider text-cyan-400 uppercase">Add Customer Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Contact Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Company Name</Label>
                    <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" className="bg-black/40 border-white/10 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="918-555-0000" className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City, State ZIP" className="bg-black/40 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Internal Notes</Label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Preferred materials, special instructions..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl text-xs border-white/10">Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold px-5">
                    Save Customer
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
