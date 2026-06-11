export function getLoginUrl(returnPath?: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const state = encodeURIComponent(JSON.stringify({ origin, returnPath: returnPath || '/' }));
  return `${import.meta.env.VITE_OAUTH_PORTAL_URL || ''}/login?app_id=${import.meta.env.VITE_APP_ID || ''}&state=${state}`;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  totalSpent: number;
  notes?: string;
  createdAt: string;
}

export interface JobComment {
  id: string;
  author: string;
  role: 'Designer' | 'Print Tech' | 'Installer' | 'Manager' | 'Detailer';
  text: string;
  timestamp: string;
}

export interface Deal {
  id: string;
  customerId: string;
  title: string;
  serviceType: 'Vehicle Wrap' | 'Window Storefront' | 'Decals/Signs' | 'Custom Apparel' | 'Promotional Products' | 'Hydro Dipping' | 'Detailing/Tinting';
  value: number;
  stage: 'inquiry' | 'proofing' | 'production' | 'installation' | 'completed' | 'cancelled';
  specs: {
    vehicleType?: string;
    squareFootage?: number;
    materialType?: string;
    quantity?: number;
    apparelType?: string;
    tintPercentage?: string;
  };
  dueDate: string;
  notes?: string;
  assignedTo?: string;
  vinylUsed?: string;
  workDetails?: string;
  comments?: JobComment[];
  updatedAt: string;
  // Portal & Proofing extensions
  proofUrl?: string;
  proofStatus?: 'pending' | 'approved' | 'rejected';
  proofNotes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  dealId?: string;
  invoiceNumber: string;
  type: 'estimate' | 'invoice';
  status: 'draft' | 'sent' | 'approved' | 'unpaid' | 'paid' | 'overdue' | 'expired';
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  issueDate: string;
  dueDate: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  brand: '3M' | 'Avery Dennison' | 'KPMF' | 'Orafol' | 'Suntek' | 'Other';
  name: string;
  colorCode: string;
  finish: 'Gloss' | 'Satin' | 'Matte' | 'Carbon' | 'Chrome' | 'Perforated';
  sqFtTotal: number;
  sqFtUsed: number;
  sqFtRemaining: number;
  costPerSqFt: number;
  minAlertThreshold: number; // Send alert if remaining is below this
}

export interface CalendarEvent {
  id: string;
  dealId: string;
  title: string;
  customerName: string;
  type: 'installation' | 'tinting' | 'detailing' | 'proofing';
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  assignedTech: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export const STAGES = [
  { id: 'inquiry', name: 'Inquiry & Estimate', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  { id: 'proofing', name: 'Design & Proofing', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  { id: 'production', name: 'Material Prep & Production', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  { id: 'installation', name: 'Installation & Detailing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { id: 'completed', name: 'Completed & Delivered', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { id: 'cancelled', name: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20' }
] as const;

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_DEALS: Deal[] = [];

// All sample deal data has been cleared — start fresh with real jobs

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_EVENTS: CalendarEvent[] = [];

export interface VehicleSpec {
  type: string;
  category: 'Passenger' | 'Commercial' | 'Trailer' | 'Custom';
  panels: {
    sides: number;     // Left + Right sides combined
    hood: number;
    roof: number;
    rear: number;      // Tailgate or rear doors
    bumpers: number;   // Front + Rear bumpers combined
  };
  complexity: number;  // Multiplier for curves/rivets
  estLaborHours: number;
}

export const VEHICLE_DATABASE: VehicleSpec[] = [
  // Passenger Vehicles
  { type: 'Sedan (Standard)', category: 'Passenger', panels: { sides: 70, hood: 20, roof: 20, rear: 15, bumpers: 25 }, complexity: 1.25, estLaborHours: 12 },
  { type: 'Coupe (Sports)', category: 'Passenger', panels: { sides: 60, hood: 18, roof: 18, rear: 12, bumpers: 25 }, complexity: 1.30, estLaborHours: 14 },
  { type: 'Compact SUV / Crossover', category: 'Passenger', panels: { sides: 85, hood: 22, roof: 24, rear: 18, bumpers: 25 }, complexity: 1.20, estLaborHours: 14 },
  { type: 'Full SUV (Tahoe, etc.)', category: 'Passenger', panels: { sides: 110, hood: 26, roof: 35, rear: 24, bumpers: 25 }, complexity: 1.20, estLaborHours: 16 },
  { type: 'Crew Cab Truck (F-150, etc.)', category: 'Passenger', panels: { sides: 95, hood: 25, roof: 22, rear: 15, bumpers: 20 }, complexity: 1.15, estLaborHours: 12 },
  
  // Commercial Vehicles
  { type: 'Cargo Van (Transit/Promaster)', category: 'Commercial', panels: { sides: 140, hood: 22, roof: 45, rear: 30, bumpers: 20 }, complexity: 1.20, estLaborHours: 18 },
  { type: 'Sprinter High-Roof Van', category: 'Commercial', panels: { sides: 180, hood: 25, roof: 65, rear: 40, bumpers: 20 }, complexity: 1.25, estLaborHours: 24 },
  { type: '14ft Box Truck', category: 'Commercial', panels: { sides: 224, hood: 15, roof: 112, rear: 56, bumpers: 0 }, complexity: 1.05, estLaborHours: 16 },
  { type: '24ft Box Truck', category: 'Commercial', panels: { sides: 384, hood: 15, roof: 192, rear: 96, bumpers: 0 }, complexity: 1.05, estLaborHours: 24 },
  
  // Enclosed Trailers
  { type: '12ft Enclosed Trailer', category: 'Trailer', panels: { sides: 192, hood: 0, roof: 96, rear: 48, bumpers: 0 }, complexity: 1.10, estLaborHours: 12 },
  { type: '16ft Enclosed Trailer', category: 'Trailer', panels: { sides: 256, hood: 0, roof: 128, rear: 64, bumpers: 0 }, complexity: 1.10, estLaborHours: 16 },
  { type: '20ft Enclosed Trailer', category: 'Trailer', panels: { sides: 320, hood: 0, roof: 160, rear: 80, bumpers: 0 }, complexity: 1.10, estLaborHours: 20 },
  { type: '24ft Enclosed Trailer', category: 'Trailer', panels: { sides: 384, hood: 0, roof: 192, rear: 96, bumpers: 0 }, complexity: 1.10, estLaborHours: 24 },
  { type: '28ft Enclosed Trailer', category: 'Trailer', panels: { sides: 448, hood: 0, roof: 224, rear: 112, bumpers: 0 }, complexity: 1.10, estLaborHours: 28 },
  
  // Custom Option
  { type: 'Custom Spec Vehicle', category: 'Custom', panels: { sides: 0, hood: 0, roof: 0, rear: 0, bumpers: 0 }, complexity: 1.0, estLaborHours: 8 }
];

export const SHOP_MEMBERS = [
  { name: 'Stephanie', role: 'Manager' },
  { name: 'Sarah', role: 'Designer' },
  { name: 'Dave', role: 'Print Tech' },
  { name: 'Mike', role: 'Installer' },
  { name: 'Chris', role: 'Detailer' },
  { name: 'All-Pro Owner', role: 'Manager' }
] as const;
