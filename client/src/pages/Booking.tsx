import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Printer,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Car,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

const SERVICES = [
  { id: 'vehicle-wrap', name: 'Vehicle Wrap', emoji: '🚗', desc: 'Full or partial wrap for cars, trucks, vans, and trailers', duration: '1–3 days' },
  { id: 'window-tinting', name: 'Window Tinting', emoji: '🪟', desc: 'Professional carbon film tinting for all vehicle types', duration: '2–4 hours' },
  { id: 'detailing', name: 'Auto Detailing', emoji: '✨', desc: 'Full interior & exterior detail, paint correction', duration: '4–8 hours' },
  { id: 'storefront', name: 'Storefront Graphics', emoji: '🏪', desc: 'Window decals, banners, and signage installation', duration: '2–6 hours' },
  { id: 'hydro-dipping', name: 'Hydro Dipping', emoji: '💧', desc: 'Custom hydro dip for helmets, wheels, and accessories', duration: '1–2 days' },
  { id: 'apparel', name: 'Custom Apparel Order', emoji: '👕', desc: 'Screenprinted or embroidered shirts, caps, and hoodies', duration: '5–7 days' },
  { id: 'consultation', name: 'Free Consultation', emoji: '💬', desc: 'Discuss your project with our design team at no charge', duration: '30 min' }
];

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

interface BookingData {
  service: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  notes: string;
}

export default function Booking() {
  const [step, setStep] = useState(1); // 1=service, 2=datetime, 3=info, 4=confirm, 5=done
  const [booking, setBooking] = useState<BookingData>({
    service: '', date: '', time: '',
    firstName: '', lastName: '', email: '', phone: '',
    vehicleYear: '', vehicleMake: '', vehicleModel: '', notes: ''
  });

  const selectedService = SERVICES.find(s => s.id === booking.service);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(5);
    toast.success('Booking confirmed! We will send a confirmation to your email shortly.');
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src="/manus-storage/c2c_logo_d01c1ec7.webp" alt="All-Pro Coast 2 Coast LLC" className="h-10 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <MapPin className="h-3.5 w-3.5 text-pink-400" />
            Tulsa, OK
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="flex items-center gap-2 mb-8">
            {['Service', 'Date & Time', 'Your Info', 'Confirm'].map((label, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isDone = step > num;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                      isDone ? 'bg-emerald-500 text-white' :
                      isActive ? 'bg-pink-600 text-white' :
                      'bg-white/10 text-muted-foreground'
                    }`}>
                      {isDone ? <CheckCircle className="h-4 w-4" /> : num}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                  </div>
                  {idx < 3 && <div className={`flex-1 h-0.5 rounded-full ${step > num ? 'bg-emerald-500' : 'bg-white/10'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 pb-16">

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-foreground">What can we help you with?</h2>
              <p className="text-sm text-muted-foreground">Select the service you'd like to book at our Tulsa studio.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => { setBooking({ ...booking, service: service.id }); setStep(2); }}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 hover:scale-[1.01] group ${
                    booking.service === service.id
                      ? 'border-pink-500/50 bg-pink-500/10'
                      : 'border-white/5 bg-card/40 hover:border-pink-500/30 hover:bg-card/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{service.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-foreground">{service.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{service.desc}</p>
                      <Badge className="mt-2 bg-white/5 border-white/10 text-muted-foreground text-[10px]">
                        <Clock className="h-2.5 w-2.5 mr-1" />
                        {service.duration}
                      </Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-pink-400 transition-colors mt-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">{selectedService?.emoji} {selectedService?.name}</Badge>
              <h2 className="text-2xl font-black text-foreground">Pick a Date & Time</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred appointment slot. We'll confirm availability within 1 hour.</p>
            </div>

            <Card className="bg-card/40 border-white/5 rounded-2xl p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred Date</Label>
                <Input
                  type="date"
                  value={booking.date}
                  min={getMinDate()}
                  onChange={e => setBooking({ ...booking, date: e.target.value })}
                  className="bg-black/40 border-white/10 rounded-xl h-11 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred Time</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setBooking({ ...booking, time: slot })}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                        booking.time === slot
                          ? 'bg-pink-600 border-pink-600 text-white'
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:border-pink-500/40'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="border-white/10 rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!booking.date || !booking.time}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold"
              >
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">
                {selectedService?.emoji} {selectedService?.name} · {booking.date} @ {booking.time}
              </Badge>
              <h2 className="text-2xl font-black text-foreground">Your Contact Info</h2>
              <p className="text-sm text-muted-foreground">We'll use this to confirm your appointment and send reminders.</p>
            </div>

            <Card className="bg-card/40 border-white/5 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">First Name</Label>
                  <Input value={booking.firstName} onChange={e => setBooking({ ...booking, firstName: e.target.value })}
                    placeholder="Marcus" className="bg-black/40 border-white/10 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Last Name</Label>
                  <Input value={booking.lastName} onChange={e => setBooking({ ...booking, lastName: e.target.value })}
                    placeholder="Williams" className="bg-black/40 border-white/10 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email Address</Label>
                <Input type="email" value={booking.email} onChange={e => setBooking({ ...booking, email: e.target.value })}
                  placeholder="marcus@example.com" className="bg-black/40 border-white/10 rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone Number</Label>
                <Input value={booking.phone} onChange={e => setBooking({ ...booking, phone: e.target.value })}
                  placeholder="918-555-0000" className="bg-black/40 border-white/10 rounded-xl" required />
              </div>

              {/* Vehicle fields for wrap/tinting/detailing */}
              {['vehicle-wrap', 'window-tinting', 'detailing'].includes(booking.service) && (
                <>
                  <div className="border-t border-white/5 pt-4">
                    <Label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Car className="h-3.5 w-3.5" /> Vehicle Information
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Year</Label>
                        <Input value={booking.vehicleYear} onChange={e => setBooking({ ...booking, vehicleYear: e.target.value })}
                          placeholder="2023" className="bg-black/40 border-white/10 rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Make</Label>
                        <Input value={booking.vehicleMake} onChange={e => setBooking({ ...booking, vehicleMake: e.target.value })}
                          placeholder="Ford" className="bg-black/40 border-white/10 rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Model</Label>
                        <Input value={booking.vehicleModel} onChange={e => setBooking({ ...booking, vehicleModel: e.target.value })}
                          placeholder="Transit" className="bg-black/40 border-white/10 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Additional Notes (optional)</Label>
                <textarea rows={3} value={booking.notes} onChange={e => setBooking({ ...booking, notes: e.target.value })}
                  placeholder="Tell us more about your project, design ideas, or special requests..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500" />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="border-white/10 rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!booking.firstName || !booking.email || !booking.phone}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold"
              >
                Review Booking <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-foreground">Confirm Your Booking</h2>
              <p className="text-sm text-muted-foreground">Review your appointment details before submitting.</p>
            </div>

            <Card className="bg-card/40 border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <span className="text-3xl">{selectedService?.emoji}</span>
                <div>
                  <h3 className="font-black text-base text-foreground">{selectedService?.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedService?.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Date</span>
                  <span className="font-bold text-foreground font-mono">{booking.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Time</span>
                  <span className="font-bold text-foreground font-mono">{booking.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Name</span>
                  <span className="font-bold text-foreground">{booking.firstName} {booking.lastName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Phone</span>
                  <span className="font-bold text-foreground font-mono">{booking.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Email</span>
                  <span className="font-bold text-foreground">{booking.email}</span>
                </div>
                {booking.vehicleMake && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Vehicle</span>
                    <span className="font-bold text-foreground">{booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}</span>
                  </div>
                )}
                {booking.notes && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Notes</span>
                    <span className="text-muted-foreground">{booking.notes}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-[11px] text-cyan-400 font-medium">
                📍 All-Pro Coast 2 Coast LLC · 5812 E 11th St, Tulsa, OK 74112 · (918) 555-0199
              </div>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(3)} className="border-white/10 rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold py-5">
                <Sparkles className="h-4 w-4 mr-2" />
                Confirm Appointment
              </Button>
            </div>
          </form>
        )}

        {/* STEP 5: Done */}
        {step === 5 && (
          <div className="max-w-xl mx-auto text-center space-y-8 py-12">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-foreground">You're All Set!</h2>
              <p className="text-muted-foreground">
                Your <strong className="text-foreground">{selectedService?.name}</strong> appointment has been submitted for{' '}
                <strong className="text-pink-400 font-mono">{booking.date} @ {booking.time}</strong>.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll send a confirmation to <strong className="text-foreground">{booking.email}</strong> and call you at{' '}
                <strong className="text-foreground font-mono">{booking.phone}</strong> to confirm within 1 hour.
              </p>
            </div>

            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 text-left space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">What Happens Next?</h4>
              {[
                'Our team reviews your booking and confirms availability',
                'You receive an email & SMS confirmation with directions',
                'A reminder is sent 24 hours before your appointment',
                'Show up at our Tulsa studio and we take care of the rest!'
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="h-5 w-5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-[10px] shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.href = '/store'} variant="outline" className="border-white/10 rounded-xl">
                Browse Our Store
              </Button>
              <Button onClick={() => { setStep(1); setBooking({ service: '', date: '', time: '', firstName: '', lastName: '', email: '', phone: '', vehicleYear: '', vehicleMake: '', vehicleModel: '', notes: '' }); }}
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold">
                Book Another Appointment
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/30 py-6 text-center text-[11px] text-muted-foreground">
        <p>All-Pro Coast 2 Coast LLC · 5812 E 11th St, Tulsa, OK 74112 · (918) 555-0199 · design@coast2coast.com</p>
      </footer>
    </div>
  );
}
