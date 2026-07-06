import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Menu,
  X,
  RefreshCw,
  ChevronRight,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { INITIAL_DEALS, INITIAL_CUSTOMERS, STAGES } from '../const';

interface MobileJob {
  id: string;
  title: string;
  stage: string;
  dueDate: string;
  customerName: string;
  customerPhone?: string;
  value: number;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

export function MobileDashboard() {
  const [jobs, setJobs] = useState<MobileJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<MobileJob | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedToday: 0,
    pendingApprovals: 0,
    dailyRevenue: 0,
    teamMembers: 5
  });

  // Simulate fetching CRM data
  useEffect(() => {
    const updateData = () => {
      const deals = INITIAL_DEALS.map(deal => {
        const customer = INITIAL_CUSTOMERS.find(c => c.id === deal.customerId);
        return {
          id: deal.id,
          title: deal.title,
          stage: deal.stage,
          dueDate: deal.dueDate,
          customerName: customer?.company || deal.title,
          customerPhone: customer?.phone,
          value: parseFloat(deal.value.toString()),
          priority: (Math.random() > 0.6 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
          assignedTo: deal.assignedTo
        };
      });

      setJobs(deals);
      setStats({
        totalJobs: deals.length,
        completedToday: Math.floor(Math.random() * 5) + 1,
        pendingApprovals: Math.floor(Math.random() * 3) + 1,
        dailyRevenue: deals.reduce((sum, d) => sum + d.value, 0),
        teamMembers: 5
      });
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStageColor = (stage: string) => {
    const stageInfo = STAGES.find(s => s.id === stage);
    return stageInfo?.color || 'bg-gray-500/10 text-gray-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      default:
        return '🟢';
    }
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-cyan-600 p-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSelectedJob(null)}
            className="flex items-center gap-1 text-sm font-semibold"
          >
            ← Back
          </button>
          <h1 className="text-sm font-bold">Job Details</h1>
          <div className="w-6" />
        </div>

        {/* Job Details */}
        <div className="p-4 space-y-4">
          {/* Title & Customer */}
          <Card className="bg-slate-700/50 border-slate-600 p-4 space-y-2">
            <h2 className="text-lg font-bold text-white">{selectedJob.title}</h2>
            <p className="text-sm text-slate-300">{selectedJob.customerName}</p>
            <div className="flex gap-2 pt-2">
              <Badge className={`text-xs ${getStageColor(selectedJob.stage)}`}>
                {STAGES.find(s => s.id === selectedJob.stage)?.name}
              </Badge>
              <Badge className={`text-xs ${getPriorityColor(selectedJob.priority)}`}>
                {selectedJob.priority.toUpperCase()}
              </Badge>
            </div>
          </Card>

          {/* Contact Info */}
          {selectedJob.customerPhone && (
            <Card className="bg-slate-700/50 border-slate-600 p-4 space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase">Contact</h3>
              <a
                href={`tel:${selectedJob.customerPhone}`}
                className="flex items-center gap-3 p-3 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <Phone className="h-4 w-4 text-pink-400" />
                <span className="text-sm font-mono">{selectedJob.customerPhone}</span>
              </a>
            </Card>
          )}

          {/* Job Details */}
          <Card className="bg-slate-700/50 border-slate-600 p-4 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-mono font-bold text-pink-400">{selectedJob.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Job Value:</span>
                <span className="font-mono font-bold text-cyan-400">${selectedJob.value.toLocaleString()}</span>
              </div>
              {selectedJob.assignedTo && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned To:</span>
                  <span className="font-bold text-foreground">{selectedJob.assignedTo}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-2 pt-4">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              ✓ Mark Complete
            </Button>
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              ✎ Add Update
            </Button>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              📸 Attach Photo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-cyan-600 p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-lg font-black">CRM Mobile</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu */}
      {menuOpen && (
        <div className="bg-slate-800 border-b border-slate-700 p-4 space-y-2">
          <a href="/crm" className="block p-3 bg-slate-700/50 rounded-lg text-sm font-semibold hover:bg-slate-700">
            Open Full CRM
          </a>
          <button className="w-full p-3 bg-slate-700/50 rounded-lg text-sm font-semibold hover:bg-slate-700 text-left">
            🔄 Refresh Data
          </button>
          <button className="w-full p-3 bg-slate-700/50 rounded-lg text-sm font-semibold hover:bg-slate-700 text-left">
            ⚙️ Settings
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/20 p-4 text-center">
            <div className="text-2xl font-black text-cyan-400">{stats.totalJobs}</div>
            <div className="text-[10px] text-slate-400 uppercase mt-1">Active Jobs</div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 p-4 text-center">
            <div className="text-2xl font-black text-green-400">{stats.completedToday}</div>
            <div className="text-[10px] text-slate-400 uppercase mt-1">Done Today</div>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20 p-4 text-center">
            <div className="text-2xl font-black text-amber-400">{stats.pendingApprovals}</div>
            <div className="text-[10px] text-slate-400 uppercase mt-1">Approvals</div>
          </Card>
          <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border-pink-500/20 p-4 text-center">
            <div className="text-2xl font-black text-pink-400">${(stats.dailyRevenue / 1000).toFixed(1)}k</div>
            <div className="text-[10px] text-slate-400 uppercase mt-1">Revenue</div>
          </Card>
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-3">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-1">Active Jobs</h2>
        
        {jobs.length === 0 ? (
          <Card className="bg-slate-700/50 border-slate-600 p-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-slate-400">No active jobs</p>
          </Card>
        ) : (
          jobs.map(job => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="w-full text-left"
            >
              <Card className="bg-slate-700/50 border-slate-600 p-4 hover:bg-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getPriorityIcon(job.priority)}</span>
                      <h3 className="text-sm font-bold text-white truncate">{job.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{job.customerName}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-600">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[9px] ${getStageColor(job.stage)}`}>
                      {STAGES.find(s => s.id === job.stage)?.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {job.dueDate}
                  </div>
                </div>

                <div className="text-xs font-mono text-cyan-400 mt-2">
                  ${job.value.toLocaleString()}
                </div>
              </Card>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4">
        <a
          href="/crm"
          className="w-full bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg text-center block"
        >
          Open Full CRM Dashboard
        </a>
      </div>
    </div>
  );
}

export default MobileDashboard;
