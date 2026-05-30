import React, { useState } from 'react';
import { Deal, Customer, Invoice } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  UploadCloud, 
  CreditCard, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface ClientPortalProps {
  deals: Deal[];
  customers: Customer[];
  invoices: Invoice[];
  onUpdateDealProof: (dealId: string, status: Deal['proofStatus'], notes?: string) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => void;
}

export default function ClientPortal({
  deals,
  customers,
  invoices,
  onUpdateDealProof,
  onUpdateInvoiceStatus
}: ClientPortalProps) {
  // Simulate selecting which customer is logged into the portal
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  
  // File Upload states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);

  // Feedback states
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState<string | null>(null);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerDeals = deals.filter(d => d.customerId === selectedCustomerId);
  const customerInvoices = invoices.filter(i => i.customerId === selectedCustomerId);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).map(file => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      }));
      setUploadedFiles([...uploadedFiles, ...filesArray]);
      toast.success('Brand assets uploaded successfully! Our design team has been notified.');
    }
  };

  const handleApproveProof = (dealId: string) => {
    onUpdateDealProof(dealId, 'approved', 'Proof approved by client via portal.');
    toast.success('Design proof APPROVED! We are prepping material for production.');
  };

  const handleRequestRevision = (dealId: string) => {
    if (!revisionNotes.trim()) {
      toast.error('Please enter revision notes');
      return;
    }
    onUpdateDealProof(dealId, 'rejected', revisionNotes);
    toast.success('Revision request submitted. Our designer will send an updated proof soon.');
    setShowRevisionForm(null);
    setRevisionNotes('');
  };

  const handleSimulatePayment = (invoiceId: string) => {
    onUpdateInvoiceStatus(invoiceId, 'paid');
    toast.success('Payment simulated successfully! Thank you.');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Bar */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-pink-400" />
            Portal Simulator Mode
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Select a customer below to view the dashboard as if you were that client. Useful for showing design proofs and getting approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="custPortal" className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">VIEWING AS:</Label>
          <select
            id="custPortal"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-pink-500"
          >
            {customers.map(c => (
              <option key={c.id} value={c.id} className="bg-card">
                {c.company !== 'Personal Custom' ? c.company : c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCustomer && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Columns: Proofs & Invoices */}
          <div className="xl:col-span-2 space-y-6">
            {/* Design Proofing Panel */}
            <Card className="bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  Active Design Proofs
                </CardTitle>
                <CardDescription className="text-xs">
                  Review and approve design proofs for your upcoming print jobs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {customerDeals.filter(d => d.proofUrl).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-xs">No active design proofs awaiting approval.</p>
                  </div>
                ) : (
                  customerDeals.filter(d => d.proofUrl).map(deal => (
                    <div key={deal.id} className="space-y-4 p-4 rounded-xl bg-black/20 border border-white/5">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{deal.title}</h4>
                          <p className="text-[10px] text-muted-foreground font-mono">Service: {deal.serviceType}</p>
                        </div>
                        <Badge className={
                          deal.proofStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          deal.proofStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }>
                          {deal.proofStatus?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </div>

                      {/* Image Preview */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 relative group">
                        <img 
                          src={deal.proofUrl} 
                          alt="Design Proof" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <p className="text-[10px] text-white/90 font-medium">Click to zoom / view full spec sheet</p>
                        </div>
                      </div>

                      {/* Proof Feedback Notes */}
                      {deal.proofNotes && (
                        <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-muted-foreground">
                          <span className="font-bold text-[10px] text-cyan-400 uppercase block mb-0.5">Proofing History Notes:</span>
                          {deal.proofNotes}
                        </div>
                      )}

                      {/* Action buttons */}
                      {deal.proofStatus !== 'approved' && (
                        <div className="flex gap-2.5 justify-end pt-2">
                          <Button
                            onClick={() => setShowRevisionForm(deal.id)}
                            variant="outline"
                            className="h-8 text-[11px] rounded-lg border-white/10 text-muted-foreground hover:text-foreground"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                            Request Revision
                          </Button>
                          <Button
                            onClick={() => handleApproveProof(deal.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 h-8 text-[11px] rounded-lg text-white font-bold"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                            Approve Proof
                          </Button>
                        </div>
                      )}

                      {/* Revision Input Box */}
                      {showRevisionForm === deal.id && (
                        <div className="pt-3 border-t border-white/5 space-y-3">
                          <Label className="text-[10px] text-muted-foreground uppercase font-semibold">REVISION FEEDBACK NOTES</Label>
                          <textarea
                            rows={3}
                            value={revisionNotes}
                            onChange={(e) => setRevisionNotes(e.target.value)}
                            placeholder="Describe what needs to be changed (e.g., 'Make the logo 20% larger and center the text...')"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => setShowRevisionForm(null)}
                              variant="outline"
                              className="h-8 text-[10px] rounded-lg border-white/10"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleRequestRevision(deal.id)}
                              className="bg-pink-600 hover:bg-pink-700 h-8 text-[10px] rounded-lg text-white"
                            >
                              Submit Feedback
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Outstanding Balance / Invoices */}
            <Card className="bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-sm font-semibold tracking-wider uppercase text-pink-400 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-pink-400" />
                  Your Quotes & Invoices
                </CardTitle>
                <CardDescription className="text-xs">
                  Review estimates, pay deposits, or clear outstanding balances online.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-black/10">
                        <th className="py-3 px-4">Doc #</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {customerInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-muted-foreground">
                            No billing documents found.
                          </td>
                        </tr>
                      ) : (
                        customerInvoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                              {inv.invoiceNumber}
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
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
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
                              {inv.type === 'invoice' && inv.status === 'unpaid' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleSimulatePayment(inv.id)}
                                  className="h-7 px-2.5 text-[10px] rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold"
                                >
                                  Simulate Payment
                                </Button>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">No action required</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Upload brand assets */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-950/10 to-cyan-950/10 border-white/5 rounded-2xl p-5 space-y-5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-cyan-400" />
                  Artwork & Logo Upload
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Upload high-resolution vector logos (.AI, .EPS, .PDF) or reference images for your design.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                  isDragging 
                    ? 'border-pink-500 bg-pink-500/5' 
                    : 'border-white/10 bg-black/20 hover:border-pink-500/30'
                }`}
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">Drag & Drop Files Here</p>
                <p className="text-[10px] text-muted-foreground mt-1">or click to browse your computer</p>
              </div>

              {/* Uploaded Files list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Uploaded Assets</h4>
                  <div className="space-y-1.5">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-black/30 border border-white/5 text-[11px]">
                        <span className="font-medium text-foreground truncate max-w-[150px]">{file.name}</span>
                        <span className="font-mono text-muted-foreground shrink-0">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Shop Contact Card */}
            <Card className="bg-black/30 border-white/5 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="text-[10px] font-bold text-pink-400 tracking-wider uppercase">Need Help with Proofs?</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about dimensions, colors, or file formats, please call the studio or message us.
              </p>
              <div className="pt-2 border-t border-white/5 space-y-1.5 font-mono text-[11px] text-cyan-400">
                <p>Phone: (918) 555-0199</p>
                <p>Email: design@coast2coast.com</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
