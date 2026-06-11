import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

// ---- Team Member Credentials ----
const TEAM_MEMBERS = [
  { id: 'emp_1', name: 'Sarah Johnson', role: 'Designer', pin: '1111', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', emoji: '🎨' },
  { id: 'emp_2', name: 'Dave Martinez', role: 'Print Tech', pin: '2222', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', emoji: '🖨️' },
  { id: 'emp_3', name: 'Mike Thompson', role: 'Installer', pin: '3333', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', emoji: '🔧' },
  { id: 'emp_4', name: 'Chris Davis', role: 'Detailer', pin: '4444', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', emoji: '✨' },
  { id: 'emp_5', name: 'All-Pro Owner', role: 'Manager', pin: '0000', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', emoji: '👑' }
];

type TeamMember = typeof TEAM_MEMBERS[0];

export default function TeamPortal() {
  const [loggedIn, setLoggedIn] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Deal | null>(null);
  const [newComment, setNewComment] = useState('');
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);

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
      setLoggedIn(selectedMember);
      setPin('');
      setPinError(false);
      toast.success(`Welcome back, ${selectedMember.name}!`);
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

  const handleAdvanceStage = (dealId: string, direction: 'forward' | 'back') => {
    const stageOrder: Deal['stage'][] = ['inquiry', 'proofing', 'production', 'installation', 'completed'];
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;
    const idx = stageOrder.indexOf(deal.stage);
    const nextIdx = direction === 'forward' ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= stageOrder.length) return;
    const nextStage = stageOrder[nextIdx];
    const updated = deals.map(d => d.id === dealId ? { ...d, stage: nextStage, updatedAt: new Date().toISOString().split('T')[0] } : d);
    setDeals(updated);
    if (selectedJob?.id === dealId) setSelectedJob(prev => prev ? { ...prev, stage: nextStage } : null);
    toast.success(`Job moved to ${STAGES.find(s => s.id === nextStage)?.name}`);
  };

  const getStageInfo = (stageId: string) => STAGES.find(s => s.id === stageId);

  // ---- LOGIN SCREEN ----
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
            <img src="/manus-storage/c2c_logo_d01c1ec7.webp" alt="All-Pro Coast 2 Coast LLC" className="h-9 w-auto object-contain" />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {!selectedMember ? (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-foreground">Who's clocking in?</h2>
                  <p className="text-sm text-muted-foreground">Select your name to sign in to the team portal.</p>
                </div>
                <div className="space-y-3">
                  {TEAM_MEMBERS.map(member => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01] ${member.bg}`}
                    >
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl bg-black/20`}>
                        {member.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-sm ${member.color}`}>{member.name}</h3>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-card/40 border-white/10 rounded-2xl p-6">
                <button
                  onClick={() => { setSelectedMember(null); setPin(''); setPinError(false); }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>

                <div className="text-center space-y-3 mb-6">
                  <div className="text-4xl">{selectedMember.emoji}</div>
                  <h3 className={`text-xl font-black ${selectedMember.color}`}>{selectedMember.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedMember.role}</p>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Enter Your PIN</Label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pin}
                      onChange={e => { setPin(e.target.value); setPinError(false); }}
                      placeholder="••••"
                      className={`bg-black/40 border-white/10 rounded-xl text-center text-2xl tracking-[0.5em] h-14 font-mono ${pinError ? 'border-red-500/50' : ''}`}
                      autoFocus
                    />
                    {pinError && <p className="text-xs text-red-400 text-center">Incorrect PIN. Try again.</p>}
                    <p className="text-[10px] text-muted-foreground text-center">Demo PINs: Sarah=1111, Dave=2222, Mike=3333, Chris=4444, Owner=0000</p>
                  </div>
                  <Button type="submit" disabled={pin.length < 4}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold py-5">
                    <LogIn className="h-4 w-4 mr-2" /> Sign In
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ---- JOB DETAIL VIEW ----
  if (selectedJob) {
    const stage = getStageInfo(selectedJob.stage);
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={() => setSelectedJob(null)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to My Jobs
            </button>
            <span className={`text-xs font-bold ${loggedIn.color}`}>{loggedIn.emoji} {loggedIn.name}</span>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Job Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`text-[10px] ${stage?.color}`}>{stage?.name}</Badge>
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-[10px]">{selectedJob.serviceType}</Badge>
            </div>
            <h2 className="text-xl font-black text-foreground">{selectedJob.title}</h2>
            <p className="text-sm text-cyan-400">{getCustomerName(selectedJob.customerId)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Details */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-4 w-4" /> Job Details
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-mono font-bold text-pink-400">{selectedJob.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Value:</span>
                  <span className="font-mono font-bold text-foreground">${selectedJob.value.toLocaleString()}</span>
                </div>
                {selectedJob.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned To:</span>
                    <span className="font-bold text-foreground">{selectedJob.assignedTo}</span>
                  </div>
                )}
                {selectedJob.vinylUsed && (
                  <div>
                    <span className="text-muted-foreground block">Material Used:</span>
                    <span className="font-bold text-foreground">{selectedJob.vinylUsed}</span>
                  </div>
                )}
                {selectedJob.specs.squareFootage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wrap Area:</span>
                    <span className="font-mono font-bold text-foreground">{selectedJob.specs.squareFootage} sq.ft</span>
                  </div>
                )}
                {selectedJob.workDetails && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-muted-foreground block mb-1">Production Notes:</span>
                    <p className="text-foreground leading-relaxed">{selectedJob.workDetails}</p>
                  </div>
                )}
              </div>

              {/* Stage Advance Buttons */}
              <div className="pt-3 border-t border-white/5 flex gap-2">
                {selectedJob.stage !== 'inquiry' && (
                  <Button size="sm" variant="outline" onClick={() => handleAdvanceStage(selectedJob.id, 'back')}
                    className="flex-1 border-white/10 text-xs rounded-xl">
                    ← Move Back
                  </Button>
                )}
                {selectedJob.stage !== 'completed' && (
                  <Button size="sm" onClick={() => handleAdvanceStage(selectedJob.id, 'forward')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl">
                    Advance Stage →
                  </Button>
                )}
              </div>
            </Card>

            {/* Team Chat */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 flex flex-col space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" /> Team Updates
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 max-h-[280px] pr-1">
                {(!selectedJob.comments || selectedJob.comments.length === 0) ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No updates yet. Post the first one!</p>
                ) : (
                  selectedJob.comments.map(comm => (
                    <div key={comm.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-foreground">{comm.author}</span>
                          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[9px] py-0 px-1">{comm.role}</Badge>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-mono">{comm.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{comm.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2 border-t border-white/5 pt-3">
                <Input value={newComment} onChange={e => setNewComment(e.target.value)}
                  placeholder={`Post as ${loggedIn.name.split(' ')[0]}...`}
                  className="bg-black/40 border-white/10 rounded-xl flex-1 text-xs" required />
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // ---- MAIN TEAM DASHBOARD ----
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/c2c_logo_d01c1ec7.webp" alt="All-Pro Coast 2 Coast LLC" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${loggedIn.bg} ${loggedIn.color}`}>
              <span>{loggedIn.emoji}</span>
              <span>{loggedIn.name}</span>
              <span className="text-muted-foreground font-normal">· {loggedIn.role}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => { setLoggedIn(null); setSelectedMember(null); }}
              className="border-white/10 rounded-xl text-xs h-8">
              <LogOut className="h-3.5 w-3.5 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 to-cyan-500/5 border border-white/5">
          <h2 className="text-lg font-black text-foreground">
            Good morning, {loggedIn.name.split(' ')[0]}! {loggedIn.emoji}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {loggedIn.role === 'Manager'
              ? `You have ${myJobs.filter(j => j.stage !== 'completed').length} active jobs across all stages.`
              : `You have ${myJobs.filter(j => j.stage !== 'completed').length} active jobs assigned to you.`}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Jobs', value: myJobs.filter(j => j.stage !== 'completed' && j.stage !== 'cancelled').length, color: 'text-pink-400' },
            { label: 'In Production', value: myJobs.filter(j => j.stage === 'production').length, color: 'text-cyan-400' },
            { label: 'Installing Today', value: myJobs.filter(j => j.stage === 'installation').length, color: 'text-amber-400' },
            { label: 'Completed', value: myJobs.filter(j => j.stage === 'completed').length, color: 'text-emerald-400' }
          ].map((stat, i) => (
            <Card key={i} className="bg-card/40 border-white/5 rounded-2xl p-4 text-center">
              <span className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] text-muted-foreground block mt-0.5 uppercase font-semibold">{stat.label}</span>
            </Card>
          ))}
        </div>

        {/* My Jobs List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            {loggedIn.role === 'Manager' ? 'All Active Jobs' : 'My Assigned Jobs'}
          </h3>

          {myJobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-2xl">
              <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No jobs assigned to you right now.</p>
            </div>
          ) : (
            myJobs.map(deal => {
              const stage = getStageInfo(deal.stage);
              return (
                <Card
                  key={deal.id}
                  onClick={() => setSelectedJob(deal)}
                  className="bg-card/40 border-white/5 rounded-2xl cursor-pointer hover:border-pink-500/20 transition-all group"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`text-[9px] py-0 px-1.5 ${stage?.color}`}>{stage?.name}</Badge>
                        <Badge className="bg-white/5 border-white/5 text-muted-foreground text-[9px] py-0 px-1.5">{deal.serviceType}</Badge>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{deal.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="text-cyan-400">{getCustomerName(deal.customerId)}</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3" /> {deal.dueDate}
                        </span>
                        {deal.comments && deal.comments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {deal.comments.length} updates
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-pink-400 text-sm">${deal.value.toLocaleString()}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-pink-400 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
