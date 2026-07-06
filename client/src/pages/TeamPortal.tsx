import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { INITIAL_DEALS, INITIAL_CUSTOMERS, Deal, STAGES } from '../const';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Printer,
  LogIn,
  LogOut,
  User,
  Layers,
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  Send,
  Eye,
  Wrench,
  ChevronRight,
  ArrowLeft,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  pin: string;
}

const ROLE_COLORS: Record<string, { color: string; bg: string; emoji: string }> = {
  'Manager': { color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', emoji: '⭐' },
  'Designer': { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', emoji: '🎨' },
  'Print Tech': { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', emoji: '🖨️' },
  'Installer': { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', emoji: '🔧' },
  'Detailer': { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', emoji: '✨' },
};

export default function TeamPortal() {
  const [loggedIn, setLoggedIn] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Deal | null>(null);
  const [newComment, setNewComment] = useState('');
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);

  // Fetch team members from database
  const { data: teamMembers = [], isLoading } = trpc.team.list.useQuery();

  const customers = INITIAL_CUSTOMERS;

  const getCustomerName = (customerId: string) => {
    const c = customers.find(c => c.id === customerId);
    return c?.company !== 'Personal Custom' ? c?.company : c?.name;
  };

  // Filter jobs relevant to the logged-in employee
  const myJobs = loggedIn ? deals.filter(deal => {
    if (loggedIn.role === 'Manager') return true; // Manager sees all
    return deal.assignedTo?.toLowerCase().includes(loggedIn.name.split(' ')[0].toLowerCase()) ||
      deal.assignedTo?.toLowerCase().includes(loggedIn.role.toLowerCase());
  }) : [];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    if (pin === selectedMember.pin) {
      toast.success(`Welcome back, ${selectedMember.name}!`);
      // Redirect to CRM immediately after successful login
      window.location.href = '/crm';
    } else {
      setPinError(true);
      setPin('');
      toast.error('Incorrect PIN. Please try again.');
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedJob || !loggedIn) return;

    const updatedDeals = deals.map(deal => {
      if (deal.id === selectedJob.id) {
        const comment = {
          id: `comm_${Date.now()}`,
          author: loggedIn.name.split(' ')[0],
          role: loggedIn.role as any,
          text: newComment,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        const updated = { ...deal, comments: [...(deal.comments || []), comment] };
        setSelectedJob(updated);
        return updated;
      }
      return deal;
    });

    setDeals(updatedDeals);
    setNewComment('');
    toast.success('Update posted to job!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  // If no team members in database, show message
  if (teamMembers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Team Portal</h1>
            <p className="text-slate-400 mb-4">No team members found. Please add team members in the CRM management panel first.</p>
            <a href="/crm" className="text-cyan-400 hover:text-cyan-300">← Back to CRM</a>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold">Team Portal</h1>
          </div>
          <a href="/" className="hover:text-cyan-400 transition flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back Home
          </a>
        </div>

        {!loggedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Member Selection */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Select Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teamMembers.map(member => {
                    const roleStyle = ROLE_COLORS[member.role] || {
                      color: 'text-slate-400',
                      bg: 'bg-slate-500/10 border-slate-500/20',
                      emoji: '👤'
                    };
                    return (
                      <button
                        key={member.id}
                        onClick={() => {
                          setSelectedMember(member);
                          setPinError(false);
                          setPin('');
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition ${
                          selectedMember?.id === member.id
                            ? `${roleStyle.bg} border-current`
                            : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <span className="text-3xl">{roleStyle.emoji}</span>
                        <div className="flex-1 text-left">
                          <div className={`font-bold ${roleStyle.color}`}>{member.name}</div>
                          <div className="text-sm text-slate-400">{member.role}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* PIN Entry */}
            {selectedMember && (
              <div>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Enter PIN</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePinSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="pin">4-Digit PIN</Label>
                        <Input
                          id="pin"
                          type="password"
                          placeholder="••••"
                          value={pin}
                          onChange={(e) => {
                            setPin(e.target.value);
                            setPinError(false);
                          }}
                          maxLength={4}
                          className={`bg-slate-700 border-slate-600 text-white text-center text-2xl tracking-widest ${
                            pinError ? 'border-red-500' : ''
                          }`}
                          autoFocus
                        />
                        {pinError && (
                          <p className="text-red-400 text-sm mt-2">Incorrect PIN. Try again.</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedMember(null);
                          setPin('');
                          setPinError(false);
                        }}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                      >
                        Back
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          // Logged in view (redirects immediately, so this is rarely shown)
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <p className="text-slate-400">Redirecting to CRM...</p>
          </Card>
        )}
      </div>
    </div>
  );
}
