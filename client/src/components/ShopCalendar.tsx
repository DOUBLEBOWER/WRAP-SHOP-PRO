import React, { useState } from 'react';
import { CalendarEvent, Deal, SHOP_MEMBERS } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, Plus, User, CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShopCalendarProps {
  events: CalendarEvent[];
  deals: Deal[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEventStatus: (id: string, status: CalendarEvent['status']) => void;
}

export default function ShopCalendar({
  events,
  deals,
  onAddEvent,
  onUpdateEventStatus
}: ShopCalendarProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [selectedDealId, setSelectedDealId] = useState(deals[0]?.id || '');
  const [eventType, setEventType] = useState<CalendarEvent['type']>('installation');
  const [start, setStart] = useState(new Date().toISOString().split('T')[0]);
  const [end, setEnd] = useState(new Date().toISOString().split('T')[0]);
  const [assignedTech, setAssignedTech] = useState('Mike (Installer)');

  // Simple Month Navigator states
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 30)); // Set to May 2026 based on system date

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    const formattedDay = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.start === formattedDay || (formattedDay >= e.start && formattedDay <= e.end));
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deal = deals.find(d => d.id === selectedDealId);
    if (!deal) return;

    const newEvent: CalendarEvent = {
      id: `ev_${Date.now()}`,
      dealId: selectedDealId,
      title: `${deal.title.split(' ').slice(0, 3).join(' ')} Schedule`,
      customerName: deal.title, // fallback or simple display
      type: eventType,
      start,
      end,
      assignedTech,
      status: 'scheduled'
    };

    onAddEvent(newEvent);
    toast.success(`Scheduled ${eventType} for ${deal.title}`);
    setShowAddModal(false);
  };

  const getEventBadgeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'installation':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'tinting':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'detailing':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
            Interactive Shop Calendar
          </h2>
          <p className="text-xs text-muted-foreground">
            Schedule installations, detailing, and window tinting. Drag and drop jobs to prevent bay double-bookings.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Schedule Install / Bay Booking
        </Button>
      </div>

      {/* Month Selector Bar */}
      <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0 border-white/10">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0 border-white/10">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid Display */}
        <Card className="xl:col-span-2 bg-card/40 border-white/5 backdrop-blur-md rounded-2xl p-4">
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b border-white/5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {/* Empty boxes for offset */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-24 rounded-xl border border-transparent bg-transparent" />
            ))}

            {/* Days Grid */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayEvents = getEventsForDay(day);

              return (
                <div 
                  key={`day-${day}`} 
                  className="h-24 rounded-xl border border-white/5 bg-black/10 p-2 flex flex-col justify-between hover:border-pink-500/20 transition-all duration-200"
                >
                  <span className="font-mono text-[10px] font-bold text-muted-foreground">{day}</span>
                  <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5">
                    {dayEvents.map(ev => (
                      <div 
                        key={ev.id} 
                        className={`text-[8px] font-bold p-1 rounded border leading-tight truncate ${getEventBadgeColor(ev.type)}`}
                        title={`${ev.title} - Tech: ${ev.assignedTech}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* List of scheduled jobs */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-950/10 to-cyan-950/10 border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Active Bay Bookings</h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {events.map(ev => (
                <div key={ev.id} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={`text-[9px] py-0 px-1 rounded uppercase ${getEventBadgeColor(ev.type)}`}>
                        {ev.type}
                      </Badge>
                      <h4 className="font-bold text-foreground mt-1 leading-tight">{ev.title}</h4>
                    </div>
                    <Badge className={
                      ev.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      ev.status === 'in-progress' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }>
                      {ev.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-mono">
                    <Clock className="h-3.5 w-3.5 text-pink-400" />
                    <span>{ev.start} to {ev.end}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <User className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Tech: {ev.assignedTech}</span>
                  </div>

                  {ev.status !== 'completed' && (
                    <div className="pt-2 flex gap-1.5 justify-end">
                      {ev.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateEventStatus(ev.id, 'in-progress')}
                          className="h-7 px-2 text-[9px] rounded bg-pink-600 hover:bg-pink-700 text-white"
                        >
                          Start Work
                        </Button>
                      )}
                      {ev.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateEventStatus(ev.id, 'completed')}
                          className="h-7 px-2 text-[9px] rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold tracking-wider text-cyan-400 uppercase">
                Schedule Bay Booking
              </CardTitle>
              <CardDescription className="text-xs">
                Reserve space and schedule a technician for wrap install, tint, or detail.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleAddEventSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Link Pipeline Job</Label>
                  <select
                    value={selectedDealId}
                    onChange={(e) => setSelectedDealId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    {deals.map(d => (
                      <option key={d.id} value={d.id} className="bg-card">
                        {d.title} (${d.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Booking Type</Label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="installation">Installation</option>
                      <option value="tinting">Window Tinting</option>
                      <option value="detailing">Detailing</option>
                      <option value="proofing">Design Proofing</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Assign Technician</Label>
                    <select
                      value={assignedTech}
                      onChange={(e) => setAssignedTech(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      {SHOP_MEMBERS.map((m, idx) => (
                        <option key={idx} value={`${m.name} (${m.role})`} className="bg-card">
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Start Date</Label>
                    <Input
                      type="date"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="bg-black/40 border-white/10 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">End Date</Label>
                    <Input
                      type="date"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className="bg-black/40 border-white/10 rounded-xl text-xs"
                      required
                    />
                  </div>
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
                    className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold px-5"
                  >
                    Confirm Booking
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
