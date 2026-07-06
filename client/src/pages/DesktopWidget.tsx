import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
  Maximize2,
  X
} from 'lucide-react';
import { INITIAL_DEALS, INITIAL_CUSTOMERS, STAGES } from '../const';

interface WidgetJob {
  id: string;
  title: string;
  stage: string;
  dueDate: string;
  customerName: string;
  value: number;
  priority: 'high' | 'medium' | 'low';
}

export function DesktopWidget() {
  const [jobs, setJobs] = useState<WidgetJob[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedToday: 0,
    pendingApprovals: 0,
    teamMembers: 5
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate fetching CRM data
  useEffect(() => {
    const updateData = () => {
      const deals = INITIAL_DEALS.map(deal => ({
        id: deal.id,
        title: deal.title,
        stage: deal.stage,
        dueDate: deal.dueDate,
        customerName: INITIAL_CUSTOMERS.find(c => c.id === deal.customerId)?.company || deal.title,
        value: parseFloat(deal.value.toString()),
        priority: (Math.random() > 0.6 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
      }));

      setJobs(deals.slice(0, 5)); // Show top 5 jobs
      setStats({
        totalJobs: deals.length,
        completedToday: Math.floor(Math.random() * 5) + 1,
        pendingApprovals: Math.floor(Math.random() * 3) + 1,
        teamMembers: 5
      });
    };

    updateData();
    if (autoRefresh) {
      const interval = setInterval(updateData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-700 hover:to-cyan-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
          title="Open CRM Widget"
        >
          <Zap className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-hidden">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-cyan-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-white" />
            <h3 className="font-bold text-white">CRM Dashboard</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-1 rounded hover:bg-white/20 transition-colors ${autoRefresh ? 'text-white' : 'text-white/50'}`}
              title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded hover:bg-white/20 transition-colors text-white"
              title="Minimize"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-700 bg-slate-800/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalJobs}</div>
            <div className="text-[10px] text-slate-400 uppercase">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.completedToday}</div>
            <div className="text-[10px] text-slate-400 uppercase">Done Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.pendingApprovals}</div>
            <div className="text-[10px] text-slate-400 uppercase">Approvals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{stats.teamMembers}</div>
            <div className="text-[10px] text-slate-400 uppercase">Team</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="overflow-y-auto max-h-64 p-3 space-y-2">
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No active jobs</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 hover:bg-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{job.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{job.customerName}</p>
                  </div>
                  <Badge className={`text-[9px] whitespace-nowrap ${getPriorityColor(job.priority)}`}>
                    {job.priority.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Badge className={`text-[9px] ${getStageColor(job.stage)}`}>
                      {STAGES.find(s => s.id === job.stage)?.name || job.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {job.dueDate}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-600 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400">${job.value.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">ID: {job.id.substring(0, 6)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800/50 border-t border-slate-700 p-3 flex items-center justify-between text-[10px] text-slate-400">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <a href="/crm" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Open CRM →
          </a>
        </div>
      </Card>
    </div>
  );
}

export default DesktopWidget;
