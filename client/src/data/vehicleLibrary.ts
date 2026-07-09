export interface Vehicle {
  id: string;
  name: string;
  category: string;
  year?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  wrappableSurfaces: string[];
}

export const VEHICLE_LIBRARY: Vehicle[] = [
  // SEDANS
  { id: 'sedan-compact', name: 'Compact Sedan', category: 'Sedan', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Trunk'] },
  { id: 'sedan-mid', name: 'Mid-Size Sedan', category: 'Sedan', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Trunk'] },
  { id: 'sedan-full', name: 'Full-Size Sedan', category: 'Sedan', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Trunk'] },
  { id: 'sedan-luxury', name: 'Luxury Sedan', category: 'Sedan', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Trunk'] },
  
  // COUPES & SPORTS CARS
  { id: 'coupe-2door', name: '2-Door Coupe', category: 'Coupe', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Trunk'] },
  { id: 'coupe-sports', name: 'Sports Car', category: 'Coupe', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Trunk'] },
  { id: 'coupe-convertible', name: 'Convertible', category: 'Coupe', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Trunk'] },
  
  // HATCHBACKS
  { id: 'hatchback-compact', name: 'Compact Hatchback', category: 'Hatchback', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Hatch'] },
  { id: 'hatchback-mid', name: 'Mid-Size Hatchback', category: 'Hatchback', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Hatch'] },
  { id: 'hatchback-hot', name: 'Hot Hatchback', category: 'Hatchback', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Hatch'] },
  
  // WAGONS
  { id: 'wagon-compact', name: 'Compact Wagon', category: 'Wagon', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area'] },
  { id: 'wagon-mid', name: 'Mid-Size Wagon', category: 'Wagon', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area'] },
  { id: 'wagon-performance', name: 'Performance Wagon', category: 'Wagon', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area'] },
  
  // SUVs - COMPACT
  { id: 'suv-compact', name: 'Compact SUV', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Pillars'] },
  { id: 'suv-subcompact', name: 'Subcompact SUV', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate'] },
  
  // SUVs - MID-SIZE
  { id: 'suv-mid-3row', name: 'Mid-Size SUV (3-Row)', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Pillars'] },
  { id: 'suv-mid-2row', name: 'Mid-Size SUV (2-Row)', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate'] },
  
  // SUVs - FULL-SIZE
  { id: 'suv-full-3row', name: 'Full-Size SUV (3-Row)', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Pillars', 'Spare Tire'] },
  { id: 'suv-full-2row', name: 'Full-Size SUV (2-Row)', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate'] },
  
  // SUVs - LUXURY
  { id: 'suv-luxury-compact', name: 'Luxury Compact SUV', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate'] },
  { id: 'suv-luxury-mid', name: 'Luxury Mid-Size SUV', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Pillars'] },
  { id: 'suv-luxury-full', name: 'Luxury Full-Size SUV', category: 'SUV', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Pillars'] },
  
  // CROSSOVERS
  { id: 'crossover-compact', name: 'Compact Crossover', category: 'Crossover', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate'] },
  { id: 'crossover-mid', name: 'Mid-Size Crossover', category: 'Crossover', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate'] },
  { id: 'crossover-full', name: 'Full-Size Crossover', category: 'Crossover', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate'] },
  
  // TRUCKS - COMPACT
  { id: 'truck-compact', name: 'Compact Truck', category: 'Truck', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Bed', 'Tailgate', 'Pillars'] },
  
  // TRUCKS - LIGHT DUTY
  { id: 'truck-light-single', name: 'Light Duty Truck (Single Cab)', category: 'Truck', wrappableSurfaces: ['Full Body', 'Hood', 'Door', 'Roof', 'Bed', 'Tailgate'] },
  { id: 'truck-light-access', name: 'Light Duty Truck (Access Cab)', category: 'Truck', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Bed', 'Tailgate', 'Pillars'] },
  { id: 'truck-light-crew', name: 'Light Duty Truck (Crew Cab)', category: 'Truck', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Bed', 'Tailgate', 'Pillars'] },
  
  // TRUCKS - HEAVY DUTY
  { id: 'truck-heavy-single', name: 'Heavy Duty Truck (Single Cab)', category: 'Truck', wrappableSurfaces: ['Full Body', 'Hood', 'Door', 'Roof', 'Bed', 'Tailgate', 'Fenders'] },
  { id: 'truck-heavy-crew', name: 'Heavy Duty Truck (Crew Cab)', category: 'Truck', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Bed', 'Tailgate', 'Pillars', 'Fenders'] },
  { id: 'truck-heavy-dually', name: 'Heavy Duty Dually Truck', category: 'Truck', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Bed', 'Tailgate', 'Pillars', 'Fenders', 'Wheels'] },
  
  // VANS - PASSENGER
  { id: 'van-minivan', name: 'Minivan', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Sliding Doors', 'Pillars'] },
  { id: 'van-passenger-compact', name: 'Compact Passenger Van', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Pillars'] },
  { id: 'van-passenger-full', name: 'Full-Size Passenger Van', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Liftgate', 'Pillars'] },
  
  // VANS - CARGO
  { id: 'van-cargo-compact', name: 'Compact Cargo Van', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area', 'Pillars'] },
  { id: 'van-cargo-mid', name: 'Mid-Size Cargo Van', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area', 'Pillars'] },
  { id: 'van-cargo-full', name: 'Full-Size Cargo Van', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area', 'Pillars'] },
  
  // VANS - COMMERCIAL
  { id: 'van-commercial-transit', name: 'Commercial Transit Van', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area', 'Pillars', 'Wheel Covers'] },
  { id: 'van-commercial-sprinter', name: 'Commercial Sprinter Van', category: 'Van', wrappableSurfaces: ['Full Body', 'Hood', 'Doors', 'Roof', 'Cargo Area', 'Pillars'] },
  
  // MOTORCYCLES
  { id: 'motorcycle-cruiser', name: 'Cruiser Motorcycle', category: 'Motorcycle', wrappableSurfaces: ['Body Panels', 'Tank', 'Fenders', 'Seat'] },
  { id: 'motorcycle-sport', name: 'Sport Motorcycle', category: 'Motorcycle', wrappableSurfaces: ['Body Panels', 'Tank', 'Fairings', 'Seat'] },
  { id: 'motorcycle-touring', name: 'Touring Motorcycle', category: 'Motorcycle', wrappableSurfaces: ['Body Panels', 'Tank', 'Fenders', 'Seat', 'Saddlebags'] },
  { id: 'motorcycle-adventure', name: 'Adventure Motorcycle', category: 'Motorcycle', wrappableSurfaces: ['Body Panels', 'Tank', 'Fenders', 'Seat'] },
  { id: 'motorcycle-dirt', name: 'Dirt Bike', category: 'Motorcycle', wrappableSurfaces: ['Body Panels', 'Tank', 'Fenders', 'Seat'] },
  
  // ATVs & QUADS
  { id: 'atv-quad', name: 'ATV/Quad', category: 'ATV', wrappableSurfaces: ['Body Panels', 'Fenders', 'Tank', 'Seat'] },
  { id: 'atv-utility', name: 'Utility ATV', category: 'ATV', wrappableSurfaces: ['Body Panels', 'Fenders', 'Tank', 'Seat', 'Cargo Bed'] },
  
  // BOATS
  { id: 'boat-speedboat', name: 'Speedboat', category: 'Boat', wrappableSurfaces: ['Hull', 'Cabin', 'Windshield', 'Trim'] },
  { id: 'boat-sailboat', name: 'Sailboat', category: 'Boat', wrappableSurfaces: ['Hull', 'Cabin', 'Sails'] },
  { id: 'boat-fishing', name: 'Fishing Boat', category: 'Boat', wrappableSurfaces: ['Hull', 'Cabin', 'Railings', 'Trim'] },
  { id: 'boat-pontoon', name: 'Pontoon Boat', category: 'Boat', wrappableSurfaces: ['Hull', 'Canopy', 'Railings'] },
  { id: 'boat-yacht', name: 'Yacht', category: 'Boat', wrappableSurfaces: ['Hull', 'Cabin', 'Railings', 'Trim'] },
  
  // RVs & MOTORHOMES
  { id: 'rv-class-a', name: 'Class A Motorhome', category: 'RV', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Slide-Outs', 'Awning'] },
  { id: 'rv-class-b', name: 'Class B Motorhome', category: 'RV', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Doors'] },
  { id: 'rv-class-c', name: 'Class C Motorhome', category: 'RV', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Slide-Outs'] },
  { id: 'rv-travel-trailer', name: 'Travel Trailer', category: 'RV', wrappableSurfaces: ['Sides', 'Roof', 'Doors', 'Hitch Area'] },
  { id: 'rv-fifth-wheel', name: 'Fifth Wheel Trailer', category: 'RV', wrappableSurfaces: ['Sides', 'Roof', 'Doors', 'Slide-Outs'] },
  
  // COMMERCIAL VEHICLES
  { id: 'commercial-box-truck', name: 'Box Truck', category: 'Commercial', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Cargo Box', 'Doors'] },
  { id: 'commercial-flatbed', name: 'Flatbed Truck', category: 'Commercial', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Bed', 'Railings'] },
  { id: 'commercial-dump', name: 'Dump Truck', category: 'Commercial', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Bed', 'Tailgate'] },
  { id: 'commercial-tanker', name: 'Tanker Truck', category: 'Commercial', wrappableSurfaces: ['Full Body', 'Hood', 'Tank', 'Railings'] },
  { id: 'commercial-semi', name: 'Semi Truck', category: 'Commercial', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Sleeper Cab', 'Fenders'] },
  { id: 'commercial-trailer', name: 'Trailer (Semi)', category: 'Commercial', wrappableSurfaces: ['Sides', 'Roof', 'Doors', 'Undercarriage'] },
  
  // BUSES
  { id: 'bus-school', name: 'School Bus', category: 'Bus', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Doors', 'Bumpers'] },
  { id: 'bus-transit', name: 'Transit Bus', category: 'Bus', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Doors', 'Windows'] },
  { id: 'bus-coach', name: 'Coach Bus', category: 'Bus', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Doors', 'Windows'] },
  { id: 'bus-shuttle', name: 'Shuttle Bus', category: 'Bus', wrappableSurfaces: ['Full Body', 'Hood', 'Sides', 'Roof', 'Doors'] },
  
  // SPECIALTY VEHICLES
  { id: 'specialty-golf-cart', name: 'Golf Cart', category: 'Specialty', wrappableSurfaces: ['Body Panels', 'Roof', 'Seat Covers'] },
  { id: 'specialty-golf-cart-enclosed', name: 'Enclosed Golf Cart', category: 'Specialty', wrappableSurfaces: ['Body Panels', 'Roof', 'Doors', 'Windows'] },
  { id: 'specialty-utility-vehicle', name: 'Utility Vehicle', category: 'Specialty', wrappableSurfaces: ['Body Panels', 'Roof', 'Doors', 'Cargo Area'] },
  { id: 'specialty-forklift', name: 'Forklift', category: 'Specialty', wrappableSurfaces: ['Body Panels', 'Mast', 'Seat Area'] },
  { id: 'specialty-construction', name: 'Construction Equipment', category: 'Specialty', wrappableSurfaces: ['Body Panels', 'Bucket/Blade', 'Cab'] },
  { id: 'specialty-trailer-utility', name: 'Utility Trailer', category: 'Specialty', wrappableSurfaces: ['Sides', 'Doors', 'Tailgate'] },
  { id: 'specialty-enclosed-trailer', name: 'Enclosed Trailer', category: 'Specialty', wrappableSurfaces: ['Sides', 'Roof', 'Doors', 'Hitch'] },
];

export const VEHICLE_CATEGORIES = [
  'Sedan',
  'Coupe',
  'Hatchback',
  'Wagon',
  'SUV',
  'Crossover',
  'Truck',
  'Van',
  'Motorcycle',
  'ATV',
  'Boat',
  'RV',
  'Commercial',
  'Bus',
  'Specialty'
];

export function getVehiclesByCategory(category: string): Vehicle[] {
  return VEHICLE_LIBRARY.filter(v => v.category === category);
}

export function getVehicleById(id: string): Vehicle | undefined {
  return VEHICLE_LIBRARY.find(v => v.id === id);
}

export function searchVehicles(query: string): Vehicle[] {
  const lowerQuery = query.toLowerCase();
  return VEHICLE_LIBRARY.filter(v => 
    v.name.toLowerCase().includes(lowerQuery) || 
    v.category.toLowerCase().includes(lowerQuery)
  );
}
