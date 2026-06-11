import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Printer,
  Calendar,
  ShoppingBag,
  Users,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Instagram,
  Facebook
} from 'lucide-react';
import { toast } from 'sonner';

const PORTFOLIO = [
  {
    id: 1,
    title: 'Green Pro Fleet Van Wrap',
    category: 'Vehicle Wrap',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Cain\'s Ballroom Window Graphics',
    category: 'Storefront',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Custom Hydro Dip Helmet',
    category: 'Hydro Dipping',
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Tulsa Burger Co. Staff Shirts',
    category: 'Custom Apparel',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: '24ft Trailer Full Wrap',
    category: 'Vehicle Wrap',
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: 'Route 66 Storefront Signage',
    category: 'Decals & Signs',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    title: 'Chrome Die-Cut Sticker Pack',
    category: 'Custom Stickers',
    img: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    title: 'Window Tinting — Jeep Grand Cherokee',
    category: 'Window Tinting',
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
  }
];

const SERVICES = [
  { icon: '🚗', name: 'Vehicle Wraps', desc: 'Full & partial wraps for cars, trucks, vans, trailers, and fleet vehicles. 3M & Avery certified.' },
  { icon: '🪟', name: 'Window Tinting', desc: 'Professional carbon film tinting for all vehicle types. UV protection and privacy.' },
  { icon: '🏪', name: 'Storefront Graphics', desc: 'Window decals, banners, wall murals, and full storefront branding packages.' },
  { icon: '👕', name: 'Custom Apparel', desc: 'Screenprinted and embroidered t-shirts, hoodies, caps, and uniforms for teams and businesses.' },
  { icon: '✨', name: 'Auto Detailing', desc: 'Full interior & exterior detail, paint correction, ceramic coating, and protective film.' },
  { icon: '💧', name: 'Hydro Dipping', desc: 'Custom hydrographic printing for helmets, wheels, gun parts, and accessories.' },
  { icon: '🎨', name: 'Custom Stickers', desc: 'Die-cut, kiss-cut, holographic, and clear vinyl stickers in any shape and size.' },
  { icon: '🖼️', name: 'Photo & Art Prints', desc: 'High-resolution photo prints, canvas wraps, and fine art prints on premium paper.' }
];

const REVIEWS = [
  { name: 'Marcus W.', rating: 5, text: 'All-Pro wrapped my entire landscaping fleet — 3 vans. The quality is unreal and they finished ahead of schedule. Will be back for 3 more!', job: 'Fleet Van Wraps' },
  { name: 'Cain\'s Ballroom', rating: 5, text: 'They\'ve done our window graphics and banners for every major event. Fast, professional, and the prints always pop.', job: 'Storefront Graphics' },
  { name: 'Sarah J.', rating: 5, text: 'Got my Jeep tinted and a custom hydro dip on my helmet. Both came out absolutely perfect. Chris is a legend!', job: 'Tinting & Hydro Dip' }
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactService, setContactService] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const portfolioCategories = ['All', 'Vehicle Wrap', 'Storefront', 'Custom Apparel', 'Hydro Dipping', 'Custom Stickers', 'Window Tinting'];
  const filteredPortfolio = portfolioFilter === 'All' ? PORTFOLIO : PORTFOLIO.filter(p => p.category === portfolioFilter);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 1 business day. 🎨');
    setContactName(''); setContactEmail(''); setContactPhone(''); setContactService(''); setContactMessage('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ===== STICKY NAVIGATION ===== */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src="/manus-storage/c2c_logo_d01c1ec7.webp"
              alt="All-Pro Coast 2 Coast LLC"
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Portfolio', href: '#portfolio' },
              { label: 'Services', href: '#services' },
              { label: 'Reviews', href: '#reviews' },
              { label: 'Contact', href: '#contact' }
            ].map(item => (
              <a key={item.label} href={item.href}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <a href="/store">
              <Button variant="outline" className="border-white/10 rounded-xl text-xs font-bold h-9 gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" /> Shop
              </Button>
            </a>
            <a href="/book">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold h-9 gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Book Now
              </Button>
            </a>
            <a href="/team">
              <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-xl text-xs font-bold h-9 gap-1.5">
                <Users className="h-3.5 w-3.5" /> Team Login
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/5">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-black/90 px-4 py-4 space-y-2">
            {['#portfolio', '#services', '#reviews', '#contact'].map((href, i) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5">
                {['Portfolio', 'Services', 'Reviews', 'Contact'][i]}
              </a>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
              <a href="/store"><Button className="w-full bg-white/5 text-xs rounded-xl">Shop</Button></a>
              <a href="/book"><Button className="w-full bg-pink-600 text-xs rounded-xl">Book</Button></a>
              <a href="/team"><Button className="w-full bg-purple-600/20 text-purple-400 text-xs rounded-xl border border-purple-500/20">Team</Button></a>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black" />
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=60"
            alt="Vehicle Wrap"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
                📍 Tulsa, Oklahoma's #1 Custom Print Shop
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  We Wrap.
                </span>
                <br />
                <span className="text-white">We Print.</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  We Deliver.
                </span>
              </h2>
            </div>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              All-Pro Coast 2 Coast LLC is Tulsa's premier custom print shop. From full vehicle wraps and window tinting to custom apparel, hydro dipping, and storefront graphics — we bring your brand to life.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/book">
                <Button className="bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold px-6 py-5 text-sm gap-2 shadow-xl shadow-pink-500/20">
                  <Calendar className="h-4 w-4" />
                  Book a Free Consultation
                </Button>
              </a>
              <a href="#portfolio">
                <Button variant="outline" className="border-white/20 hover:bg-white/5 rounded-xl font-bold px-6 py-5 text-sm gap-2">
                  View Our Work
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {['✅ 3M & Avery Certified', '⚡ Fast Turnaround', '🏆 500+ Jobs Completed', '📍 Tulsa, OK'].map(b => (
                <span key={b} className="font-semibold">{b}</span>
              ))}
            </div>
          </div>

          {/* Hero Stats Card */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { num: '500+', label: 'Jobs Completed', color: 'text-pink-400' },
              { num: '5★', label: 'Average Rating', color: 'text-amber-400' },
              { num: '8+', label: 'Services Offered', color: 'text-cyan-400' },
              { num: '10yr', label: 'Tulsa Experience', color: 'text-purple-400' }
            ].map(stat => (
              <Card key={stat.label} className="bg-white/5 border-white/10 rounded-2xl p-5 text-center backdrop-blur-md">
                <span className={`text-3xl font-black font-mono ${stat.color}`}>{stat.num}</span>
                <span className="text-xs text-muted-foreground block mt-1 font-semibold">{stat.label}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
            What We Do
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">Our Services</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            From concept to completion, we handle every aspect of your custom print and wrap project right here in Tulsa.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(service => (
            <a key={service.name} href="/book">
              <Card className="bg-card/40 border-white/5 rounded-2xl h-full hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-5 space-y-3">
                  <span className="text-3xl block">{service.icon}</span>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-pink-400 transition-colors">{service.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{service.desc}</p>
                  <span className="text-[11px] text-pink-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Book Now <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* ===== PORTFOLIO SECTION ===== */}
      <section id="portfolio" className="py-20 px-4 bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
              Our Work
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">Portfolio Gallery</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Browse a selection of our recent projects across vehicle wraps, storefronts, apparel, and more.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {portfolioCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setPortfolioFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  portfolioFilter === cat
                    ? 'bg-pink-600 border-pink-600 text-white'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-pink-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPortfolio.map(item => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <Badge className="bg-pink-600 text-white border-0 text-[10px] font-bold self-start mb-1">{item.category}</Badge>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      <section id="reviews" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
            ⭐ Customer Reviews
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">What Tulsa Is Saying</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <Card key={i} className="bg-card/40 border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.text}"</p>
              <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-xs text-foreground">{review.name}</p>
                  <p className="text-[10px] text-muted-foreground">{review.job}</p>
                </div>
                <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-[10px]">Verified</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== CONTACT / QUOTE FORM ===== */}
      <section id="contact" className="py-20 px-4 bg-black/20 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div className="space-y-8">
            <div className="space-y-3">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
                Get In Touch
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-foreground">Request a Free Quote</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tell us about your project and we'll get back to you with a custom quote within 1 business day. No obligation, no pressure.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Phone className="h-4 w-4 text-pink-400" />, label: 'Phone', value: '(918) 555-0199' },
                { icon: <Mail className="h-4 w-4 text-cyan-400" />, label: 'Email', value: 'design@coast2coast.com' },
                { icon: <MapPin className="h-4 w-4 text-purple-400" />, label: 'Studio', value: '5812 E 11th St, Tulsa, OK 74112' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  {item.icon}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 to-cyan-950/20 border border-white/5 space-y-3">
              <h4 className="font-bold text-sm text-foreground">Hours of Operation</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between"><span>Monday – Friday</span><span className="text-foreground font-semibold">8:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="text-foreground font-semibold">9:00 AM – 3:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-muted-foreground">Closed</span></div>
              </div>
            </div>

            {/* Worker Login CTA */}
            <a href="/team">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/5 border border-purple-500/20 flex items-center gap-3 hover:from-purple-500/20 transition-all cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-purple-400">Team Member Login</p>
                  <p className="text-[11px] text-muted-foreground">Designers, installers, and techs — sign in here to view your jobs.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-purple-400" />
              </div>
            </a>
          </div>

          {/* Right: Contact Form */}
          <Card className="bg-card/40 border-white/5 rounded-2xl p-6">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold">First Name</label>
                  <Input value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Marcus" className="bg-black/40 border-white/10 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold">Phone Number</label>
                  <Input value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                    placeholder="918-555-0000" className="bg-black/40 border-white/10 rounded-xl" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-semibold">Email Address</label>
                <Input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                  placeholder="you@example.com" className="bg-black/40 border-white/10 rounded-xl" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-semibold">Service Interested In</label>
                <select value={contactService} onChange={e => setContactService(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-pink-500"
                  required>
                  <option value="" className="bg-card">Select a service...</option>
                  {SERVICES.map(s => (
                    <option key={s.name} value={s.name} className="bg-card">{s.icon} {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-semibold">Tell Us About Your Project</label>
                <textarea rows={4} value={contactMessage} onChange={e => setContactMessage(e.target.value)}
                  placeholder="Describe your vehicle, design ideas, quantity, timeline, or any other details..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                  required />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold py-5 text-sm">
                Send Quote Request
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <p className="text-[10px] text-muted-foreground text-center">
                We respond within 1 business day. No spam, ever.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 bg-black/40 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-muted-foreground">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center">
              <img
                src="/manus-storage/c2c_logo_d01c1ec7.webp"
                alt="All-Pro Coast 2 Coast LLC"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="leading-relaxed max-w-xs">
              Premium vehicle wraps, custom apparel, storefront graphics, hydro dipping, and more. Serving Tulsa and the surrounding area since 2014.
            </p>
            <p className="font-mono text-cyan-400 font-bold">(918) 555-0199</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Quick Links</h4>
            {[
              { label: 'Book Appointment', href: '/book' },
              { label: 'Online Store', href: '/store' },
              { label: 'Team Login', href: '/team' },
              { label: 'Portfolio', href: '#portfolio' },
              { label: 'Contact Us', href: '#contact' }
            ].map(l => (
              <a key={l.label} href={l.href} className="block hover:text-foreground transition-colors">{l.label}</a>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Services</h4>
            {SERVICES.slice(0, 5).map(s => (
              <p key={s.name} className="hover:text-foreground cursor-pointer transition-colors">{s.name}</p>
            ))}
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 text-center text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} All-Pro Coast 2 Coast LLC. All rights reserved. Tulsa, OK · Route 66 Country.
        </div>
      </footer>
    </div>
  );
}
