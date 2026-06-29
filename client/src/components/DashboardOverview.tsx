import React from 'react';
import { Deal, Customer, Invoice, STAGES } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Printer, 
  Layers, 
  Activity, 
  Clock, 
  AlertCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

interface DashboardOverviewProps {
  deals: Deal[];
  customers: Customer[];
  invoices: Invoice[];
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardOverview({
  deals,
  customers,
  invoices,
  onNavigateToTab
}: DashboardOverviewProps) {
  
  // Calculations
  const activeJobsCount = deals.filter(d => d.stage !== 'completed' && d.stage !== 'cancelled').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.total, 0);
  const totalCustomers = customers.length;

  // Chart Data: Pipeline Funnel Stages
  const funnelData = STAGES.filter(s => s.id !== 'cancelled').map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage.id);
    return {
      name: stage.name.split(' ')[0], // short name
      fullName: stage.name,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0),
      count: stageDeals.length
    };
  });

  // Chart Data: Revenue by Service Type
  const serviceTypeData = [
    { name: 'Wraps', value: deals.filter(d => d.serviceType === 'Vehicle Wrap').reduce((sum, d) => sum + d.value, 0) },
    { name: 'Storefront', value: deals.filter(d => d.serviceType === 'Window Storefront').reduce((sum, d) => sum + d.value, 0) },
    { name: 'Apparel', value: deals.filter(d => d.serviceType === 'Custom Apparel').reduce((sum, d) => sum + d.value, 0) },
    { name: 'Detail/Tint', value: deals.filter(d => d.serviceType === 'Detailing/Tinting').reduce((sum, d) => sum + d.value, 0) },
    { name: 'Promos', value: deals.filter(d => d.serviceType === 'Promotional Products').reduce((sum, d) => sum + d.value, 0) },
  ];

  // Recent Activity Alerts
  const recentAlerts = [
    { id: 1, type: 'warning', title: 'Design Proof Approval Pending', desc: "Cain's Ballroom Window Graphics proof sent 2 days ago.", time: '2h ago' },
    { id: 2, type: 'success', title: 'Full Van Wrap Printed', desc: 'Green Pro LLC Ford Transit Wrap is cured and ready for install.', time: '4h ago' },
    { id: 3, type: 'info', title: 'New Vehicle Wrap Estimate Created', desc: '24ft Enclosed Trailer Wrap inquiry added to pipeline.', time: '1d ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-cyan-500/10 border border-white/5 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Tulsa Shop Command Center
          </h2>
          <p className="text-sm text-muted-foreground">
            All-Pro Coast 2 Coast LLC — Real-time wrap production & sales pipeline.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2.5 relative z-10">
          <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/20 font-mono py-1 px-3 rounded-lg text-xs">
            Tulsa, OK
          </Badge>
          <Badge className="bg-pink-500/15 text-pink-400 border-pink-500/20 font-mono py-1 px-3 rounded-lg text-xs animate-pulse">
            Active Printing Queue
          </Badge>
        </div>
        {/* Glow behind */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-pink-500/5 rounded-full blur-2xl" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Paid Revenue */}
        <Card className="bg-card/40 border-white/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Revenue (Paid)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card className="bg-card/40 border-white/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Outstanding Balance</span>
              <span className="text-2xl font-black text-amber-400 font-mono">${pendingRevenue.toLocaleString()}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card className="bg-card/40 border-white/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Shop Jobs</span>
              <span className="text-2xl font-black text-pink-400 font-mono">{activeJobsCount} Jobs</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Layers className="h-5 w-5 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        {/* Customer Count */}
        <Card className="bg-card/40 border-white/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Clients</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">{totalCustomers} Profiles</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Value Chart */}
        <Card className="lg:col-span-2 bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Sales & Production Pipeline Value
            </CardTitle>
            <CardDescription className="text-xs">
              Value distribution across the key production stages.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={funnelData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.18 200)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="oklch(0.75 0.18 200)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(16, 16, 24, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="oklch(0.75 0.18 200)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Service Type */}
        <Card className="bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-pink-400 flex items-center gap-2">
              <Layers className="h-4 w-4 text-pink-400" />
              Revenue by Service
            </CardTitle>
            <CardDescription className="text-xs">
              Comparing wrap vs storefront and apparel performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceTypeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(16, 16, 24, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="oklch(0.65 0.24 330)" radius={[6, 6, 0, 0]} maxBarSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Shop Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shop Alerts */}
        <Card className="md:col-span-2 bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-cyan-400" />
              Production & Design Alerts
            </CardTitle>
            <CardDescription className="text-xs">
              Immediate action items required for active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10 text-amber-400' :
                  alert.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' :
                  'bg-cyan-500/5 border-cyan-500/10 text-cyan-400'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-foreground leading-tight">
                      {alert.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    {alert.desc}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-gradient-to-br from-purple-950/20 to-cyan-950/20 border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-pink-400 tracking-wider uppercase">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => onNavigateToTab('estimator')}
                className="w-full justify-start text-xs font-semibold py-5 bg-white/5 hover:bg-white/10 text-foreground border border-white/5 rounded-xl"
              >
                Calculate Wrap Cost
              </Button>
              <Button 
                onClick={() => onNavigateToTab('pipeline')}
                className="w-full justify-start text-xs font-semibold py-5 bg-white/5 hover:bg-white/10 text-foreground border border-white/5 rounded-xl"
              >
                Manage Active Print Jobs
              </Button>
              <Button 
                onClick={() => onNavigateToTab('customers')}
                className="w-full justify-start text-xs font-semibold py-5 bg-white/5 hover:bg-white/10 text-foreground border border-white/5 rounded-xl"
              >
                Lookup Customer Profile
              </Button>
              <a 
                href="/wrap-designer"
                className="w-full block"
              >
                <Button 
                  className="w-full justify-start text-xs font-semibold py-5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 text-pink-300 border border-pink-500/30 rounded-xl gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Wrap Design
                </Button>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 text-center">
            <span className="text-[10px] text-muted-foreground uppercase font-mono block">Current Active Workspace</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">Tulsa Studio Hub</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
