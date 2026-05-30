import React, { useState } from 'react';
import { Deal, Customer, SHOP_MEMBERS, JobComment } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  MessageSquare, 
  Calendar, 
  User, 
  Tag, 
  PenTool, 
  Layers, 
  Clock, 
  Plus,
  Send,
  Wrench,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface JobDetailsModalProps {
  deal: Deal;
  customer: Customer | undefined;
  onClose: () => void;
  onUpdateJobDetails: (id: string, updates: Partial<Deal>) => void;
}

export default function JobDetailsModal({
  deal,
  customer,
  onClose,
  onUpdateJobDetails
}: JobDetailsModalProps) {
  // Shop Work Details state
  const [assignedTo, setAssignedTo] = useState(deal.assignedTo || '');
  const [vinylUsed, setVinylUsed] = useState(deal.vinylUsed || '');
  const [workDetails, setWorkDetails] = useState(deal.workDetails || '');

  // New Comment state
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [newCommentText, setNewCommentText] = useState('');

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateJobDetails(deal.id, {
      assignedTo,
      vinylUsed,
      workDetails
    });
    toast.success('Shop production details updated successfully!');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const member = SHOP_MEMBERS[selectedMemberIndex];
    const newComment: JobComment = {
      id: `comm_${Date.now()}`,
      author: member.name,
      role: member.role as any,
      text: newCommentText,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updatedComments = [...(deal.comments || []), newComment];
    onUpdateJobDetails(deal.id, {
      comments: updatedComments
    });

    setNewCommentText('');
    toast.success(`Comment posted as ${member.name} (${member.role})`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <Card className="w-full max-w-4xl bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden my-8">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <CardHeader className="border-b border-white/5 pb-4 bg-black/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pr-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-[10px] font-bold tracking-wider uppercase">
                  {deal.serviceType}
                </Badge>
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-bold tracking-wider uppercase font-mono">
                  ${deal.value.toLocaleString()}
                </Badge>
              </div>
              <CardTitle className="text-lg font-black text-foreground">
                {deal.title}
              </CardTitle>
              <CardDescription className="text-xs text-cyan-400/80 font-semibold">
                Customer: {customer?.company !== 'Personal Custom' ? customer?.company : customer?.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Job specs & Shop details editor */}
          <div className="p-6 space-y-6">
            {/* Tech Specs Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                Technical Specifications
              </h3>
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 grid grid-cols-2 gap-4 text-xs">
                {deal.specs.vehicleType && (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Vehicle Model</span>
                    <span className="text-foreground font-bold">{deal.specs.vehicleType}</span>
                  </div>
                )}
                {deal.specs.squareFootage && (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Wrap Square Footage</span>
                    <span className="text-foreground font-mono font-bold">{deal.specs.squareFootage} sq.ft</span>
                  </div>
                )}
                {deal.specs.materialType && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Preferred Vinyl / Material</span>
                    <span className="text-foreground font-bold">{deal.specs.materialType}</span>
                  </div>
                )}
                {deal.specs.quantity && (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Quantity</span>
                    <span className="text-foreground font-bold">{deal.specs.quantity}</span>
                  </div>
                )}
                {deal.specs.tintPercentage && (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Tint Percentage</span>
                    <span className="text-foreground font-bold">{deal.specs.tintPercentage}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Target Completion</span>
                  <span className="text-pink-400 font-bold font-mono flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {deal.dueDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Details Form */}
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <Wrench className="h-4 w-4" />
                Production & Installation Details
              </h3>

              <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5">
                {/* Assigned Technicians */}
                <div className="space-y-1.5">
                  <Label htmlFor="assignee" className="text-[10px] text-muted-foreground uppercase font-semibold">Assigned Techs / Installers</Label>
                  <Input
                    id="assignee"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g., Dave (Print Tech) & Mike (Installer)"
                    className="bg-black/40 border-white/10 rounded-lg h-9 text-xs"
                  />
                </div>

                {/* Specific Vinyl Film Used */}
                <div className="space-y-1.5">
                  <Label htmlFor="vinyl" className="text-[10px] text-muted-foreground uppercase font-semibold">Exact Material Used (Color/Roll ID)</Label>
                  <Input
                    id="vinyl"
                    value={vinylUsed}
                    onChange={(e) => setVinylUsed(e.target.value)}
                    placeholder="e.g., Avery SW900 Supreme Matte Black (Roll #8812)"
                    className="bg-black/40 border-white/10 rounded-lg h-9 text-xs"
                  />
                </div>

                {/* Internal Work Notes */}
                <div className="space-y-1.5">
                  <Label htmlFor="workNote" className="text-[10px] text-muted-foreground uppercase font-semibold">Internal Production Instructions</Label>
                  <textarea
                    id="workNote"
                    rows={3}
                    value={workDetails}
                    onChange={(e) => setWorkDetails(e.target.value)}
                    placeholder="Describe print settings, weeding progress, or install details..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold py-2 rounded-lg"
                >
                  Save Shop Details
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Team Discussion Chat */}
          <div className="p-6 flex flex-col justify-between h-[500px] lg:h-auto">
            <div className="space-y-4 flex-1 flex flex-col justify-between overflow-hidden">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                <MessageSquare className="h-4 w-4" />
                Team Discussion & Updates
              </h3>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1.5 max-h-[300px] lg:max-h-[350px]">
                {(!deal.comments || deal.comments.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground border border-dashed border-white/5 rounded-xl p-6">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-1" />
                    <p className="text-xs">No team comments posted yet.</p>
                    <p className="text-[10px] text-muted-foreground/80">Use the selector below to post updates as a team member.</p>
                  </div>
                ) : (
                  deal.comments.map((comm) => (
                    <div key={comm.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-foreground">{comm.author}</span>
                          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[9px] py-0 px-1 rounded">
                            {comm.role}
                          </Badge>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-mono">{comm.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Input / Sender Selector */}
            <form onSubmit={handleAddComment} className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="memberSelect" className="text-[10px] text-muted-foreground uppercase font-semibold shrink-0">
                  Post as Member:
                </Label>
                <select
                  id="memberSelect"
                  value={selectedMemberIndex}
                  onChange={(e) => setSelectedMemberIndex(Number(e.target.value))}
                  className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-pink-500"
                >
                  {SHOP_MEMBERS.map((m, idx) => (
                    <option key={idx} value={idx} className="bg-card">
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Input
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type an update or question for the team..."
                  className="bg-black/40 border-white/10 rounded-xl flex-1 text-xs"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-3.5"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
