import React, { useState, useRef } from 'react';
import { Customer, Deal, Invoice } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  MessageSquare,
  Phone,
  Camera,
  Plus,
  Send,
  Bell,
  UserPlus,
  Search,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Sparkles,
  Zap,
  PhoneCall,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  customerId: string;
  customerName: string;
  type: 'email' | 'sms';
  trigger: 'proof_pending' | 'payment_due' | 'job_ready' | 'follow_up' | 'custom';
  message: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'phone_call' | 'walk_in' | 'referral' | 'social_media' | 'web_form';
  interest: string;
  notes: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
}

interface JobPhoto {
  id: string;
  dealId: string;
  jobTitle: string;
  dataUrl: string;
  notes: string;
  takenAt: string;
  takenBy: string;
}

interface CommunicationsHubProps {
  customers: Customer[];
  deals: Deal[];
  invoices: Invoice[];
  onAddCustomer: (customer: Customer) => void;
  onAddDeal: (deal: Omit<Deal, 'id' | 'updatedAt'>) => void;
}

const REMINDER_TEMPLATES = {
  proof_pending: {
    email: "Hi {name}, your design proof for {job} is ready for review! Please log in to your portal at coast2coast.com/portal to approve or request changes. Our team is standing by. — All-Pro Coast 2 Coast",
    sms: "Hi {name}! Your wrap proof is ready. Review & approve at coast2coast.com/portal — All-Pro C2C 🎨"
  },
  payment_due: {
    email: "Hi {name}, a friendly reminder that invoice #{invoice} for {job} is due on {date}. You can pay securely online at coast2coast.com/pay. Thank you! — All-Pro Coast 2 Coast",
    sms: "Hi {name}, Invoice #{invoice} is due soon. Pay online: coast2coast.com/pay — All-Pro C2C 💳"
  },
  job_ready: {
    email: "Great news, {name}! Your {job} is COMPLETE and ready for pickup at our Tulsa studio. Please call (918) 555-0199 to schedule your pickup. — All-Pro Coast 2 Coast",
    sms: "🎉 {name}, your {job} is DONE! Ready for pickup. Call (918) 555-0199 — All-Pro C2C"
  },
  follow_up: {
    email: "Hi {name}, just checking in on your recent experience with All-Pro Coast 2 Coast. We'd love to hear your feedback and help with any future projects! — All-Pro Team",
    sms: "Hi {name}! How did your recent job turn out? We'd love your feedback. Text us back! — All-Pro C2C ⭐"
  },
  custom: { email: '', sms: '' }
};

export default function CommunicationsHub({
  customers,
  deals,
  invoices,
  onAddCustomer,
  onAddDeal
}: CommunicationsHubProps) {
  const [activeSection, setActiveSection] = useState<'reminders' | 'leads' | 'photos'>('reminders');

  // ---- REMINDERS STATE ----
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 'rem_1',
      customerId: 'cust_1',
      customerName: "Cain's Ballroom",
      type: 'email',
      trigger: 'proof_pending',
      message: REMINDER_TEMPLATES.proof_pending.email.replace('{name}', "Cain's Ballroom").replace('{job}', 'Window Graphics'),
      scheduledFor: '2026-06-01 09:00',
      status: 'pending'
    },
    {
      id: 'rem_2',
      customerId: 'cust_2',
      customerName: 'Green Pro LLC',
      type: 'sms',
      trigger: 'payment_due',
      message: REMINDER_TEMPLATES.payment_due.sms.replace('{name}', 'Green Pro').replace('{invoice}', 'INV-2026-001').replace('{job}', 'Ford Transit Wrap').replace('{date}', 'June 15'),
      scheduledFor: '2026-06-10 10:00',
      status: 'pending'
    }
  ]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderCustomerId, setReminderCustomerId] = useState(customers[0]?.id || '');
  const [reminderType, setReminderType] = useState<'email' | 'sms'>('sms');
  const [reminderTrigger, setReminderTrigger] = useState<Reminder['trigger']>('proof_pending');
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderSchedule, setReminderSchedule] = useState('');

  // ---- LEADS STATE ----
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'lead_1',
      name: 'Marcus Williams',
      phone: '918-555-3344',
      email: 'marcus.w@gmail.com',
      source: 'phone_call',
      interest: 'Full truck wrap for landscaping business (3 trucks)',
      notes: 'Called asking about fleet pricing. Very interested. Wants a quote by end of week.',
      createdAt: '2026-05-30',
      status: 'new'
    },
    {
      id: 'lead_2',
      name: 'Jenna Torres',
      phone: '918-555-7788',
      source: 'walk_in',
      interest: 'Window tinting for personal SUV + custom decals',
      notes: 'Walked in during lunch. Liked the portfolio on the wall. Will call back.',
      createdAt: '2026-05-29',
      status: 'contacted'
    }
  ]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSource, setLeadSource] = useState<Lead['source']>('phone_call');
  const [leadInterest, setLeadInterest] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [leadSearch, setLeadSearch] = useState('');

  // ---- PHOTOS STATE ----
  const [jobPhotos, setJobPhotos] = useState<JobPhoto[]>([]);
  const [selectedDealForPhoto, setSelectedDealForPhoto] = useState(deals[0]?.id || '');
  const [photoNotes, setPhotoNotes] = useState('');
  const [photoTakenBy, setPhotoTakenBy] = useState('Dave (Print Tech)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- REMINDER HANDLERS ----
  const handleTriggerChange = (trigger: Reminder['trigger']) => {
    setReminderTrigger(trigger);
    const cust = customers.find(c => c.id === reminderCustomerId);
    const custName = cust?.company !== 'Personal Custom' ? cust?.company : cust?.name;
    if (trigger !== 'custom' && custName) {
      const template = REMINDER_TEMPLATES[trigger][reminderType];
      setReminderMessage(template.replace('{name}', custName));
    }
  };

  const handleSendReminder = (reminder: Reminder) => {
    setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, status: 'sent' } : r));
    toast.success(`${reminder.type === 'sms' ? 'SMS' : 'Email'} reminder sent to ${reminder.customerName}!`);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === reminderCustomerId);
    const custName = cust?.company !== 'Personal Custom' ? cust?.company : cust?.name;
    const newReminder: Reminder = {
      id: `rem_${Date.now()}`,
      customerId: reminderCustomerId,
      customerName: custName || 'Unknown',
      type: reminderType,
      trigger: reminderTrigger,
      message: reminderMessage,
      scheduledFor: reminderSchedule,
      status: 'pending'
    };
    setReminders([newReminder, ...reminders]);
    toast.success(`Reminder scheduled for ${custName}`);
    setShowReminderForm(false);
    setReminderMessage('');
  };

  // ---- LEAD HANDLERS ----
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: leadName,
      phone: leadPhone,
      email: leadEmail || undefined,
      source: leadSource,
      interest: leadInterest,
      notes: leadNotes,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    setLeads([newLead, ...leads]);
    toast.success(`New lead "${leadName}" added to the pipeline!`);
    setLeadName(''); setLeadPhone(''); setLeadEmail(''); setLeadInterest(''); setLeadNotes('');
    setShowLeadForm(false);
  };

  const handleConvertLeadToCustomer = (lead: Lead) => {
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name: lead.name,
      company: 'Personal Custom',
      email: lead.email || '',
      phone: lead.phone,
      totalSpent: 0,
      notes: `Converted from lead. Original interest: ${lead.interest}. Notes: ${lead.notes}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onAddCustomer(newCustomer);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'converted' } : l));
    toast.success(`Lead "${lead.name}" converted to a CRM Customer!`);
  };

  // ---- PHOTO HANDLERS ----
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const deal = deals.find(d => d.id === selectedDealForPhoto);
      const newPhoto: JobPhoto = {
        id: `photo_${Date.now()}`,
        dealId: selectedDealForPhoto,
        jobTitle: deal?.title || 'Unknown Job',
        dataUrl,
        notes: photoNotes,
        takenAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        takenBy: photoTakenBy
      };
      setJobPhotos([newPhoto, ...jobPhotos]);
      setPhotoNotes('');
      toast.success(`Photo logged to job: "${deal?.title}"`);
    };
    reader.readAsDataURL(file);
  };

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.phone.includes(leadSearch) ||
    l.interest.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const sections = [
    { id: 'reminders', label: 'Email & SMS Reminders', icon: Bell },
    { id: 'leads', label: 'Lead Capture & Phone Intake', icon: PhoneCall },
    { id: 'photos', label: 'Job Photo Logger', icon: Camera }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Communications & Growth Hub
        </h2>
        <p className="text-sm text-muted-foreground">
          Send automated reminders, capture new leads from phone calls, and log job photos directly to active projects.
        </p>
      </div>

      {/* Section Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <Button
              key={s.id}
              variant={activeSection === s.id ? 'default' : 'outline'}
              onClick={() => setActiveSection(s.id as any)}
              className={`rounded-xl text-xs font-semibold gap-2 ${activeSection === s.id ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'border-white/10'}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </Button>
          );
        })}
      </div>

      {/* ===== SECTION 1: EMAIL & SMS REMINDERS ===== */}
      {activeSection === 'reminders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Scheduled Reminders</h3>
              <p className="text-xs text-muted-foreground">Automated email and SMS notifications for proofs, payments, and job pickups.</p>
            </div>
            <Button
              onClick={() => setShowReminderForm(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Schedule Reminder
            </Button>
          </div>

          {/* Quick Template Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { trigger: 'proof_pending', label: 'Proof Approval', icon: '🎨', color: 'border-purple-500/20 bg-purple-500/5' },
              { trigger: 'payment_due', label: 'Payment Due', icon: '💳', color: 'border-amber-500/20 bg-amber-500/5' },
              { trigger: 'job_ready', label: 'Job Ready', icon: '✅', color: 'border-emerald-500/20 bg-emerald-500/5' },
              { trigger: 'follow_up', label: 'Follow-Up', icon: '⭐', color: 'border-cyan-500/20 bg-cyan-500/5' }
            ].map(t => (
              <button
                key={t.trigger}
                onClick={() => { setShowReminderForm(true); setReminderTrigger(t.trigger as any); }}
                className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${t.color}`}
              >
                <span className="text-xl block mb-1">{t.icon}</span>
                <span className="text-xs font-bold text-foreground block">{t.label}</span>
                <span className="text-[10px] text-muted-foreground">Quick template</span>
              </button>
            ))}
          </div>

          {/* Reminders List */}
          <div className="space-y-3">
            {reminders.map(rem => (
              <Card key={rem.id} className="bg-card/40 border-white/5 rounded-2xl">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${rem.type === 'sms' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-purple-500/10 border border-purple-500/20'}`}>
                      {rem.type === 'sms' ? <MessageSquare className="h-4 w-4 text-cyan-400" /> : <Mail className="h-4 w-4 text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-foreground">{rem.customerName}</span>
                        <Badge className={`text-[9px] py-0 px-1.5 ${rem.type === 'sms' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                          {rem.type.toUpperCase()}
                        </Badge>
                        <Badge className={`text-[9px] py-0 px-1.5 ${rem.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {rem.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{rem.message}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Scheduled: {rem.scheduledFor}
                      </p>
                    </div>
                  </div>
                  {rem.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleSendReminder(rem)}
                      className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold shrink-0"
                    >
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Send Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Reminder Modal */}
          {showReminderForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <Card className="w-full max-w-lg bg-card border-white/10 rounded-2xl shadow-2xl">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-sm font-bold tracking-wider text-cyan-400 uppercase">Schedule Email / SMS Reminder</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCreateReminder} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Customer</Label>
                        <select value={reminderCustomerId} onChange={e => setReminderCustomerId(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                          {customers.map(c => (
                            <option key={c.id} value={c.id} className="bg-card">
                              {c.company !== 'Personal Custom' ? c.company : c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Channel</Label>
                        <div className="flex gap-2">
                          <Button type="button" variant={reminderType === 'sms' ? 'default' : 'outline'}
                            onClick={() => setReminderType('sms')}
                            className={`flex-1 rounded-xl text-xs h-9 ${reminderType === 'sms' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-white/10'}`}>
                            SMS
                          </Button>
                          <Button type="button" variant={reminderType === 'email' ? 'default' : 'outline'}
                            onClick={() => setReminderType('email')}
                            className={`flex-1 rounded-xl text-xs h-9 ${reminderType === 'email' ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/10'}`}>
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Reminder Type</Label>
                      <select value={reminderTrigger} onChange={e => handleTriggerChange(e.target.value as any)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                        <option value="proof_pending" className="bg-card">Design Proof Awaiting Approval</option>
                        <option value="payment_due" className="bg-card">Invoice Payment Due</option>
                        <option value="job_ready" className="bg-card">Job Ready for Pickup</option>
                        <option value="follow_up" className="bg-card">Post-Job Follow-Up</option>
                        <option value="custom" className="bg-card">Custom Message</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Message (auto-filled from template)</Label>
                      <textarea rows={4} value={reminderMessage} onChange={e => setReminderMessage(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500"
                        required />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Schedule Date & Time</Label>
                      <Input type="datetime-local" value={reminderSchedule} onChange={e => setReminderSchedule(e.target.value)}
                        className="bg-black/40 border-white/10 rounded-xl" required />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                      <Button type="button" variant="outline" onClick={() => setShowReminderForm(false)} className="rounded-xl text-xs border-white/10">Cancel</Button>
                      <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold px-5">Schedule Reminder</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ===== SECTION 2: LEAD CAPTURE ===== */}
      {activeSection === 'leads' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Lead Capture & Phone Intake</h3>
              <p className="text-xs text-muted-foreground">Log new inquiries from phone calls, walk-ins, and referrals. Convert to CRM customers with one click.</p>
            </div>
            <Button onClick={() => setShowLeadForm(true)} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold">
              <PhoneCall className="h-3.5 w-3.5 mr-1" />
              Log New Lead
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search leads by name, phone, or interest..." value={leadSearch}
              onChange={e => setLeadSearch(e.target.value)}
              className="bg-black/40 border-white/10 pl-9 rounded-xl h-9 text-xs" />
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeads.map(lead => (
              <Card key={lead.id} className="bg-card/40 border-white/5 rounded-2xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${lead.status === 'new' ? 'bg-cyan-500' : lead.status === 'contacted' ? 'bg-amber-500' : lead.status === 'converted' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <CardContent className="p-5 space-y-3 pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{lead.name}</h4>
                      <p className="text-[11px] text-cyan-400 font-mono">{lead.phone}</p>
                    </div>
                    <Badge className={
                      lead.status === 'new' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      lead.status === 'converted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }>
                      {lead.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="capitalize font-semibold text-foreground">{lead.source.replace('_', ' ')}</span>
                    <span>·</span>
                    <span>{lead.createdAt}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs">
                    <span className="text-[10px] font-bold text-pink-400 uppercase block mb-0.5">Interest:</span>
                    <span className="text-muted-foreground">{lead.interest}</span>
                  </div>

                  {lead.notes && (
                    <p className="text-[11px] text-muted-foreground italic">"{lead.notes}"</p>
                  )}

                  {lead.status !== 'converted' && lead.status !== 'lost' && (
                    <Button
                      onClick={() => handleConvertLeadToCustomer(lead)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-8"
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      Convert to CRM Customer
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Lead Modal */}
          {showLeadForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
              <Card className="w-full max-w-lg bg-card border-white/10 rounded-2xl shadow-2xl my-8">
                <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-sm font-bold tracking-wider text-cyan-400 uppercase">Log New Lead / Phone Inquiry</CardTitle>
                  <CardDescription className="text-xs">Capture a new potential customer from a call, walk-in, or referral.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleAddLead} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Contact Name</Label>
                        <Input value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="e.g., Marcus Williams" className="bg-black/40 border-white/10 rounded-xl" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Phone Number</Label>
                        <Input value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="918-555-0000" className="bg-black/40 border-white/10 rounded-xl" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Email (optional)</Label>
                        <Input type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} placeholder="email@example.com" className="bg-black/40 border-white/10 rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Lead Source</Label>
                        <select value={leadSource} onChange={e => setLeadSource(e.target.value as any)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                          <option value="phone_call" className="bg-card">📞 Phone Call</option>
                          <option value="walk_in" className="bg-card">🚶 Walk-In</option>
                          <option value="referral" className="bg-card">🤝 Referral</option>
                          <option value="social_media" className="bg-card">📱 Social Media</option>
                          <option value="web_form" className="bg-card">🌐 Web Form</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Service Interest</Label>
                      <Input value={leadInterest} onChange={e => setLeadInterest(e.target.value)} placeholder="e.g., Full vehicle wrap for 2 trucks" className="bg-black/40 border-white/10 rounded-xl" required />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Notes from the Call / Visit</Label>
                      <textarea rows={3} value={leadNotes} onChange={e => setLeadNotes(e.target.value)}
                        placeholder="Key details from the conversation..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                      <Button type="button" variant="outline" onClick={() => setShowLeadForm(false)} className="rounded-xl text-xs border-white/10">Cancel</Button>
                      <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold px-5">Save Lead</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ===== SECTION 3: JOB PHOTO LOGGER ===== */}
      {activeSection === 'photos' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Job Photo Logger</h3>
            <p className="text-xs text-muted-foreground">Photograph jobs in progress and attach them directly to active pipeline records for quality tracking.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Panel */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-5">
              <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="h-4 w-4" /> Capture & Upload Photo
              </h4>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Link to Job</Label>
                  <select value={selectedDealForPhoto} onChange={e => setSelectedDealForPhoto(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                    {deals.map(d => (
                      <option key={d.id} value={d.id} className="bg-card">{d.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Taken By</Label>
                  <select value={photoTakenBy} onChange={e => setPhotoTakenBy(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                    <option value="Dave (Print Tech)" className="bg-card">Dave (Print Tech)</option>
                    <option value="Mike (Installer)" className="bg-card">Mike (Installer)</option>
                    <option value="Chris (Detailer)" className="bg-card">Chris (Detailer)</option>
                    <option value="Sarah (Designer)" className="bg-card">Sarah (Designer)</option>
                    <option value="All-Pro Owner" className="bg-card">All-Pro Owner</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Photo Notes</Label>
                  <Input value={photoNotes} onChange={e => setPhotoNotes(e.target.value)}
                    placeholder="e.g., Sides weeded and masked, ready for install"
                    className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" />
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold py-5"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo / Upload Image
                </Button>
              </div>
            </Card>

            {/* Photo Gallery */}
            <div className="lg:col-span-2 space-y-4">
              {jobPhotos.length === 0 ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl text-muted-foreground text-center p-8">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-xs font-medium">No job photos logged yet.</p>
                  <p className="text-[11px] text-muted-foreground/70">Use the panel on the left to photograph a job in progress.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {jobPhotos.map(photo => (
                    <Card key={photo.id} className="bg-card/40 border-white/5 rounded-2xl overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={photo.dataUrl} alt="Job Photo" className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-3 space-y-1.5">
                        <h4 className="font-bold text-xs text-foreground line-clamp-1">{photo.jobTitle}</h4>
                        {photo.notes && <p className="text-[11px] text-muted-foreground">{photo.notes}</p>}
                        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                          <span>{photo.takenBy}</span>
                          <span>{photo.takenAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
