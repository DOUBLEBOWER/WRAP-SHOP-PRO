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

export const STAGES = [
  { id: 'inquiry', name: 'Inquiry & Estimate', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  { id: 'proofing', name: 'Design & Proofing', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  { id: 'production', name: 'Material Prep & Production', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  { id: 'installation', name: 'Installation & Detailing', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { id: 'completed', name: 'Completed & Delivered', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { id: 'cancelled', name: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20' }
] as const;

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'Cain\'s Ballroom Event Coord',
    company: 'Cain\'s Ballroom',
    email: 'events@cainsballroom.com',
    phone: '918-584-2306',
    address: '423 N Main St, Tulsa, OK 74103',
    totalSpent: 12450,
    notes: 'Frequent customer for live music night window graphics, banners, and promotional apparel.',
    createdAt: '2026-01-15'
  },
  {
    id: 'cust_2',
    name: 'Green Pro LLC Fleet Manager',
    company: 'Green Pro LLC',
    email: 'fleet@greenpro.com',
    phone: '918-555-0192',
    address: '1024 E Admiral Blvd, Tulsa, OK 74120',
    totalSpent: 28500,
    notes: 'Commercial landscaping fleet. Done 4 full van wraps already. 3 more pending.',
    createdAt: '2026-02-10'
  },
  {
    id: 'cust_3',
    name: 'Tulsa Burger Co. Owner',
    company: 'Tulsa Burger Co.',
    email: 'hello@tulsaburger.com',
    phone: '918-555-4422',
    address: '215 S Elgin Ave, Tulsa, OK 74120',
    totalSpent: 4200,
    notes: 'Window storefront decals, custom t-shirts for staff, and printed menus.',
    createdAt: '2026-03-01'
  },
  {
    id: 'cust_4',
    name: 'Sarah Jenkins',
    company: 'Personal Custom',
    email: 'sarah.j@gmail.com',
    phone: '918-555-8833',
    address: '7412 S Yale Ave, Tulsa, OK 74136',
    totalSpent: 1850,
    notes: 'Window tinting on SUV, custom hydro dipped motorcycle helmet.',
    createdAt: '2026-04-12'
  },
  {
    id: 'cust_5',
    name: 'Route 66 Auto Sales',
    company: 'Route 66 Auto Sales',
    email: 'inventory@route66autos.com',
    phone: '918-555-6611',
    address: '5812 E 11th St, Tulsa, OK 74112',
    totalSpent: 9200,
    notes: 'Frequent window tinting, promotional decals, and custom metal signage.',
    createdAt: '2026-04-20'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal_1',
    customerId: 'cust_2',
    title: 'Ford Transit Full Fleet Wrap',
    serviceType: 'Vehicle Wrap',
    value: 3850,
    stage: 'production',
    specs: {
      vehicleType: 'Cargo Van',
      squareFootage: 180,
      materialType: '3M 2080 Gloss Green & Black',
      quantity: 1
    },
    dueDate: '2026-06-05',
    notes: 'Wrap design approved. Printing currently in progress. Installation scheduled for June 4th.',
    assignedTo: 'Dave (Print Tech) & Mike (Installer)',
    vinylUsed: '3M 2080-G12 Gloss Deep Orange & Gloss Black',
    workDetails: 'Sides are weeded and masked. Hood graphics need weeding tomorrow morning.',
    comments: [
      { id: 'c1', author: 'Dave', role: 'Print Tech', text: 'Printed panels are cured and laminated with premium cast gloss overlaminate.', timestamp: '2026-05-28 14:30' },
      { id: 'c2', author: 'Mike', role: 'Installer', text: 'Confirmed van is scheduled for clean and prep tomorrow morning.', timestamp: '2026-05-29 09:15' }
    ],
    updatedAt: '2026-05-28'
  },
  {
    id: 'deal_2',
    customerId: 'cust_1',
    title: 'Live Music Night Banners & Window Graphics',
    serviceType: 'Window Storefront',
    value: 1200,
    stage: 'proofing',
    specs: {
      materialType: 'Perforated Window Vinyl & 13oz Matte Banner',
      quantity: 4
    },
    dueDate: '2026-06-10',
    notes: 'Proof sent to coordinator. Waiting on final size confirmation for the side glass panes.',
    assignedTo: 'Sarah (Designer)',
    vinylUsed: 'Avery Dennison MPI 2528 Perforated Window Film',
    workDetails: 'First proof sent. Customer requested a slightly larger font for the Friday date line.',
    comments: [
      { id: 'c3', author: 'Sarah', role: 'Designer', text: 'Sent proof #1 to events@cainsballroom.com. Awaiting feedback.', timestamp: '2026-05-29 11:00' }
    ],
    updatedAt: '2026-05-29'
  },
  {
    id: 'deal_3',
    customerId: 'cust_3',
    title: 'Staff Custom T-Shirts & Caps',
    serviceType: 'Custom Apparel',
    value: 1800,
    stage: 'completed',
    specs: {
      apparelType: 'Gildan Softstyle T-Shirt & Yupoong Classic Snapback',
      quantity: 150
    },
    dueDate: '2026-05-25',
    notes: 'Printed, cured, packaged and picked up by customer. Paid in full.',
    assignedTo: 'Dave (Print Tech)',
    workDetails: '100 Shirts and 50 caps completed, boxed and delivered.',
    comments: [
      { id: 'c4', author: 'Dave', role: 'Print Tech', text: 'Screenprinting complete. Cured at 320 degrees. Quality check passed.', timestamp: '2026-05-24 16:45' }
    ],
    updatedAt: '2026-05-25'
  },
  {
    id: 'deal_4',
    customerId: 'cust_4',
    title: 'Jeep Grand Cherokee Full Tint + Helmet Hydro Dip',
    serviceType: 'Detailing/Tinting',
    value: 950,
    stage: 'installation',
    specs: {
      vehicleType: 'Full SUV',
      tintPercentage: '15% Carbon Film All Around',
      quantity: 1
    },
    dueDate: '2026-06-02',
    notes: 'Helmet hydro dipping completed. Vehicle tinting is scheduled for tomorrow morning.',
    assignedTo: 'Chris (Detailer)',
    vinylUsed: 'Suntek Carbon Film 15%',
    workDetails: 'Helmet dipped in custom skull pattern, cleared with 2K high gloss clearcoat. Tinting starts 9 AM.',
    comments: [
      { id: 'c5', author: 'Chris', role: 'Detailer', text: 'Hydro dip clearcoat is cured. Looks absolutely killer. Buffing it out now.', timestamp: '2026-05-30 08:30' }
    ],
    updatedAt: '2026-05-30'
  },
  {
    id: 'deal_5',
    customerId: 'cust_5',
    title: 'Custom Decals & Promotional Keychains',
    serviceType: 'Promotional Products',
    value: 650,
    stage: 'inquiry',
    specs: {
      quantity: 500,
      materialType: 'Die-Cut Gloss Vinyl Decals & Acrylic Keychains'
    },
    dueDate: '2026-06-15',
    notes: 'Initial estimate sent. Customer requested to see a sample of the acrylic keychain before proceeding.',
    assignedTo: 'Sarah (Designer)',
    comments: [],
    updatedAt: '2026-05-30'
  },
  {
    id: 'deal_6',
    customerId: 'cust_2',
    title: '24ft Enclosed Trailer Wrap',
    serviceType: 'Vehicle Wrap',
    value: 5400,
    stage: 'inquiry',
    specs: {
      vehicleType: '24ft Trailer',
      squareFootage: 480,
      materialType: 'Avery Dennison MPI 1105 Gloss Wrap',
      quantity: 1
    },
    dueDate: '2026-06-25',
    notes: 'New inquiry for their large enclosed equipment trailer. Sent estimate of $5,400 based on 480 sq ft of wrap area.',
    assignedTo: 'Sarah (Designer)',
    comments: [],
    updatedAt: '2026-05-30'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    customerId: 'cust_2',
    dealId: 'deal_1',
    invoiceNumber: 'INV-2026-001',
    type: 'invoice',
    status: 'unpaid',
    items: [
      { id: 'item_1_1', description: 'Ford Transit Full Vehicle Wrap - 180 sq.ft @ $20/sq.ft (Complexity Multiplier 1.2x)', quantity: 1, rate: 3600, amount: 3600 },
      { id: 'item_1_2', description: 'Premium Gloss Wrap Material (3M 2080)', quantity: 1, rate: 250, amount: 250 }
    ],
    subtotal: 3850,
    taxRate: 8.5,
    taxAmount: 327.25,
    discount: 0,
    total: 4177.25,
    issueDate: '2026-05-28',
    dueDate: '2026-06-15',
    notes: '50% deposit paid. Balance of $2,088.63 due upon completion of installation.'
  },
  {
    id: 'inv_2',
    customerId: 'cust_1',
    dealId: 'deal_2',
    invoiceNumber: 'EST-2026-002',
    type: 'estimate',
    status: 'sent',
    items: [
      { id: 'item_2_1', description: 'Cain\'s Ballroom Custom Perforated Window Graphics (Design, Print, Install)', quantity: 2, rate: 450, amount: 900 },
      { id: 'item_2_2', description: 'Live Music Night Heavy Duty Matte Banner (13oz)', quantity: 2, rate: 150, amount: 300 }
    ],
    subtotal: 1200,
    taxRate: 8.5,
    taxAmount: 102,
    discount: 0,
    total: 1302,
    issueDate: '2026-05-29',
    dueDate: '2026-06-29',
    notes: 'Estimate valid for 30 days. Design proofs will be sent within 48 hours of approval.'
  },
  {
    id: 'inv_3',
    customerId: 'cust_3',
    dealId: 'deal_3',
    invoiceNumber: 'INV-2026-003',
    type: 'invoice',
    status: 'paid',
    items: [
      { id: 'item_3_1', description: 'Custom Printed Staff T-Shirts (Gildan Softstyle with 2-color screenprint)', quantity: 100, rate: 10, amount: 1000 },
      { id: 'item_3_2', description: 'Custom Embroidered Yupoong Classic Snapback Caps', quantity: 50, rate: 16, amount: 800 }
    ],
    subtotal: 1800,
    taxRate: 8.5,
    taxAmount: 153,
    discount: 100, // $100 off bundle discount
    total: 1853,
    issueDate: '2026-05-20',
    dueDate: '2026-05-25',
    notes: 'Paid in full via Credit Card on pickup. Thank you for your business!'
  }
];

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
  { name: 'Sarah', role: 'Designer' },
  { name: 'Dave', role: 'Print Tech' },
  { name: 'Mike', role: 'Installer' },
  { name: 'Chris', role: 'Detailer' },
  { name: 'All-Pro Owner', role: 'Manager' }
] as const;
