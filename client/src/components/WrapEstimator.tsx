import React, { useState, useEffect } from 'react';
import { VEHICLE_DATABASE, Customer, Deal, VehicleSpec } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Printer, HelpCircle, Sparkles, Sliders, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';

interface WrapEstimatorProps {
  customers: Customer[];
  onAddDeal: (deal: Omit<Deal, 'id' | 'updatedAt'>) => void;
}

export default function WrapEstimator({ customers, onAddDeal }: WrapEstimatorProps) {
  // Current active spec selection
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>(VEHICLE_DATABASE[0].type);
  const [activeSpec, setActiveSpec] = useState<VehicleSpec>(VEHICLE_DATABASE[0]);

  // Active panels being wrapped (Boolean toggle states)
  const [wrapSides, setWrapSides] = useState(true);
  const [wrapHood, setWrapHood] = useState(true);
  const [wrapRoof, setWrapRoof] = useState(true);
  const [wrapRear, setWrapRoofRear] = useState(true);
  const [wrapBumpers, setWrapBumpers] = useState(true);

  // Manual Adjustments / Overrides
  const [customSidesSqFt, setCustomSidesSqFt] = useState(0);
  const [customHoodSqFt, setCustomHoodSqFt] = useState(0);
  const [customRoofSqFt, setCustomRoofSqFt] = useState(0);
  const [customRearSqFt, setCustomRearSqFt] = useState(0);
  const [customBumpersSqFt, setCustomBumpersSqFt] = useState(0);

  // General configuration rates
  const [ratePerSqFt, setRatePerSqFt] = useState(18); // default $18 per sq ft
  const [materialCost, setMaterialCost] = useState(4.5); // 3M/Avery cast vinyl cost
  const [complexityMultiplier, setComplexityMultiplier] = useState(1.25);
  const [designFee, setDesignFee] = useState(250);
  const [laborHours, setLaborHours] = useState(12);
  const [laborRate, setLaborRate] = useState(75);

  // Decals Add-on option
  const [addDecals, setAddDecals] = useState(false);
  const [decalCount, setDecalCount] = useState(10);
  const [decalRate, setDecalRate] = useState(15);

  // Calculated state values
  const [calculatedSqFt, setCalculatedSqFt] = useState(0);
  const [wrapBaseTotal, setWrapBaseTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);
  const [materialTotal, setMaterialTotal] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  // Link to CRM Customer database
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id || '');
  const [estimateTitle, setEstimateTitle] = useState('New Wrap Estimate');

  // Triggered when the user changes the vehicle model/size dropdown
  const handleVehicleTypeChange = (type: string) => {
    setSelectedVehicleType(type);
    const spec = VEHICLE_DATABASE.find(v => v.type === type);
    if (spec) {
      setActiveSpec(spec);
      setComplexityMultiplier(spec.complexity);
      setLaborHours(spec.estLaborHours);

      // Reset custom overrides to 0 to use database defaults
      setCustomSidesSqFt(0);
      setCustomHoodSqFt(0);
      setCustomRoofSqFt(0);
      setCustomRearSqFt(0);
      setCustomBumpersSqFt(0);

      // Reset panel selectors based on category (trailers don't have hood/bumpers)
      if (spec.category === 'Trailer') {
        setWrapSides(true);
        setWrapHood(false);
        setWrapRoof(true);
        setWrapRoofRear(true);
        setWrapBumpers(false);
      } else {
        setWrapSides(true);
        setWrapHood(true);
        setWrapRoof(true);
        setWrapRoofRear(true);
        setWrapBumpers(true);
      }
    }
  };

  // Live Calculation Effect Loop
  useEffect(() => {
    // Get actual sq ft per panel (either DB spec or custom input)
    const sidesVal = wrapSides ? (customSidesSqFt > 0 ? customSidesSqFt : activeSpec.panels.sides) : 0;
    const hoodVal = wrapHood ? (customHoodSqFt > 0 ? customHoodSqFt : activeSpec.panels.hood) : 0;
    const roofVal = wrapRoof ? (customRoofSqFt > 0 ? customRoofSqFt : activeSpec.panels.roof) : 0;
    const rearVal = wrapRear ? (customRearSqFt > 0 ? customRearSqFt : activeSpec.panels.rear) : 0;
    const bumpersVal = wrapBumpers ? (customBumpersSqFt > 0 ? customBumpersSqFt : activeSpec.panels.bumpers) : 0;

    const totalSqFt = sidesVal + hoodVal + roofVal + rearVal + bumpersVal;
    setCalculatedSqFt(totalSqFt);

    // Pricing formulas
    const wrapBase = totalSqFt * ratePerSqFt * complexityMultiplier;
    const labor = laborHours * laborRate;
    const material = totalSqFt * materialCost;
    const decals = addDecals ? decalCount * decalRate : 0;

    const subtotal = wrapBase + labor + designFee + decals;
    const totalCost = material + (addDecals ? decals * 0.3 : 0) + labor; // rough cost estimate

    setWrapBaseTotal(Math.round(wrapBase));
    setLaborTotal(Math.round(labor));
    setMaterialTotal(Math.round(material));
    setEstimatedPrice(Math.round(subtotal));

    const profit = subtotal - totalCost;
    const margin = subtotal > 0 ? (profit / subtotal) * 100 : 0;
    setProfitMargin(Math.round(margin));
  }, [
    activeSpec,
    wrapSides, wrapHood, wrapRoof, wrapRear, wrapBumpers,
    customSidesSqFt, customHoodSqFt, customRoofSqFt, customRearSqFt, customBumpersSqFt,
    ratePerSqFt, materialCost, complexityMultiplier, designFee, laborHours, laborRate,
    addDecals, decalCount, decalRate
  ]);

  useEffect(() => {
    setEstimateTitle(`${selectedVehicleType} Full Custom Wrap Estimate`);
  }, [selectedVehicleType]);

  const handleCreateDealFromEstimate = () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer first');
      return;
    }

    onAddDeal({
      customerId: selectedCustomer,
      title: estimateTitle,
      serviceType: 'Vehicle Wrap',
      value: estimatedPrice,
      stage: 'inquiry',
      specs: {
        vehicleType: selectedVehicleType,
        squareFootage: calculatedSqFt,
        materialType: `Custom Print Cast Vinyl (${complexityMultiplier}x Complexity)`,
        quantity: 1
      },
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Advanced Wrap Calculator Estimate:\n- Total Sq.Ft: ${calculatedSqFt}\n- Panels Included: ${wrapSides ? 'Sides, ' : ''}${wrapHood ? 'Hood, ' : ''}${wrapRoof ? 'Roof, ' : ''}${wrapRear ? 'Rear, ' : ''}${wrapBumpers ? 'Bumpers' : ''}\n- Complexity: ${complexityMultiplier}x\n- Labor Hours: ${laborHours} hrs @ $${laborRate}/hr\n- Design Fee: $${designFee}`
    });

    toast.success('Estimate successfully converted into a new Pipeline Inquiry!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Advanced Square Footage & Wrap Estimator
        </h2>
        <p className="text-sm text-muted-foreground">
          Select any vehicle type from our database and toggle individual panels (Sides, Hood, Roof, Bumpers) to dynamically calculate exact square footage and job cost.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advanced Spec Form */}
        <Card className="lg:col-span-2 bg-card/40 border-white/5 backdrop-blur-md rounded-2xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-cyan-400" />
              Vehicle Blueprint & Panel Selection
            </CardTitle>
            <CardDescription className="text-xs">
              Toggle specific panels being wrapped. Modify the square footage values directly if you have custom measurements.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Vehicle Database Selector */}
              <div className="space-y-2">
                <Label htmlFor="vType" className="text-xs font-semibold text-muted-foreground">
                  SELECT VEHICLE TYPE / SIZE
                </Label>
                <select
                  id="vType"
                  value={selectedVehicleType}
                  onChange={(e) => handleVehicleTypeChange(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                >
                  {VEHICLE_DATABASE.map((v) => (
                    <option key={v.type} value={v.type} className="bg-card">
                      [{v.category}] {v.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material Charge Rate */}
              <div className="space-y-2">
                <Label htmlFor="chargeRate" className="text-xs font-semibold text-muted-foreground">
                  WRAP CHARGE RATE (PER SQ. FT.)
                </Label>
                <div className="relative">
                  <Input
                    id="chargeRate"
                    type="number"
                    value={ratePerSqFt}
                    onChange={(e) => setRatePerSqFt(Number(e.target.value))}
                    className="bg-black/40 border-white/10 rounded-xl py-5 focus-visible:ring-pink-500/30"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-muted-foreground font-mono">
                    $/sq.ft
                  </span>
                </div>
              </div>
            </div>

            {/* Panel Toggles & Dimensions */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider border-b border-white/5 pb-2">
                Wrap Panels Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left/Right Sides */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setWrapSides(!wrapSides)} className="text-cyan-400 hover:text-cyan-300">
                      {wrapSides ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Sides (Left & Right)</h4>
                      <p className="text-[10px] text-muted-foreground">Standard: {activeSpec.panels.sides} sq.ft</p>
                    </div>
                  </div>
                  {wrapSides && (
                    <div className="w-24 relative">
                      <Input
                        type="number"
                        placeholder={`${activeSpec.panels.sides}`}
                        value={customSidesSqFt || ''}
                        onChange={(e) => setCustomSidesSqFt(Number(e.target.value))}
                        className="bg-black/40 border-white/10 rounded-lg h-8 py-1 text-xs text-right pr-6"
                      />
                      <span className="absolute right-2 top-2 text-[9px] text-muted-foreground">SF</span>
                    </div>
                  )}
                </div>

                {/* Hood */}
                {activeSpec.panels.hood > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setWrapHood(!wrapHood)} className="text-cyan-400 hover:text-cyan-300">
                        {wrapHood ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Hood Panel</h4>
                        <p className="text-[10px] text-muted-foreground">Standard: {activeSpec.panels.hood} sq.ft</p>
                      </div>
                    </div>
                    {wrapHood && (
                      <div className="w-24 relative">
                        <Input
                          type="number"
                          placeholder={`${activeSpec.panels.hood}`}
                          value={customHoodSqFt || ''}
                          onChange={(e) => setCustomHoodSqFt(Number(e.target.value))}
                          className="bg-black/40 border-white/10 rounded-lg h-8 py-1 text-xs text-right pr-6"
                        />
                        <span className="absolute right-2 top-2 text-[9px] text-muted-foreground">SF</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Roof */}
                {activeSpec.panels.roof > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setWrapRoof(!wrapRoof)} className="text-cyan-400 hover:text-cyan-300">
                        {wrapRoof ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Roof Panel</h4>
                        <p className="text-[10px] text-muted-foreground">Standard: {activeSpec.panels.roof} sq.ft</p>
                      </div>
                    </div>
                    {wrapRoof && (
                      <div className="w-24 relative">
                        <Input
                          type="number"
                          placeholder={`${activeSpec.panels.roof}`}
                          value={customRoofSqFt || ''}
                          onChange={(e) => setCustomRoofSqFt(Number(e.target.value))}
                          className="bg-black/40 border-white/10 rounded-lg h-8 py-1 text-xs text-right pr-6"
                        />
                        <span className="absolute right-2 top-2 text-[9px] text-muted-foreground">SF</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Rear Panel / Tailgate */}
                {activeSpec.panels.rear > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setWrapRoofRear(!wrapRear)} className="text-cyan-400 hover:text-cyan-300">
                        {wrapRear ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Rear Door / Tailgate</h4>
                        <p className="text-[10px] text-muted-foreground">Standard: {activeSpec.panels.rear} sq.ft</p>
                      </div>
                    </div>
                    {wrapRear && (
                      <div className="w-24 relative">
                        <Input
                          type="number"
                          placeholder={`${activeSpec.panels.rear}`}
                          value={customRearSqFt || ''}
                          onChange={(e) => setCustomRearSqFt(Number(e.target.value))}
                          className="bg-black/40 border-white/10 rounded-lg h-8 py-1 text-xs text-right pr-6"
                        />
                        <span className="absolute right-2 top-2 text-[9px] text-muted-foreground">SF</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bumpers */}
                {activeSpec.panels.bumpers > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setWrapBumpers(!wrapBumpers)} className="text-cyan-400 hover:text-cyan-300">
                        {wrapBumpers ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Bumpers (Front & Rear)</h4>
                        <p className="text-[10px] text-muted-foreground">Standard: {activeSpec.panels.bumpers} sq.ft</p>
                      </div>
                    </div>
                    {wrapBumpers && (
                      <div className="w-24 relative">
                        <Input
                          type="number"
                          placeholder={`${activeSpec.panels.bumpers}`}
                          value={customBumpersSqFt || ''}
                          onChange={(e) => setCustomBumpersSqFt(Number(e.target.value))}
                          className="bg-black/40 border-white/10 rounded-lg h-8 py-1 text-xs text-right pr-6"
                        />
                        <span className="absolute right-2 top-2 text-[9px] text-muted-foreground">SF</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Labor & Multipliers */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                Labor & Material Multipliers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Complexity Multiplier */}
                <div className="space-y-1">
                  <Label htmlFor="complexityMult" className="text-[10px] text-muted-foreground uppercase font-semibold">Complexity Factor</Label>
                  <Input
                    id="complexityMult"
                    type="number"
                    step="0.05"
                    value={complexityMultiplier}
                    onChange={(e) => setComplexityMultiplier(Number(e.target.value))}
                    className="bg-black/40 border-white/10 rounded-xl h-10"
                  />
                </div>

                {/* Labor Hours */}
                <div className="space-y-1">
                  <Label htmlFor="lHours" className="text-[10px] text-muted-foreground uppercase font-semibold">Labor Hours</Label>
                  <Input
                    id="lHours"
                    type="number"
                    value={laborHours}
                    onChange={(e) => setLaborHours(Number(e.target.value))}
                    className="bg-black/40 border-white/10 rounded-xl h-10"
                  />
                </div>

                {/* Design Fee */}
                <div className="space-y-1">
                  <Label htmlFor="dFee" className="text-[10px] text-muted-foreground uppercase font-semibold">Design & Proofing Fee ($)</Label>
                  <Input
                    id="dFee"
                    type="number"
                    value={designFee}
                    onChange={(e) => setDesignFee(Number(e.target.value))}
                    className="bg-black/40 border-white/10 rounded-xl h-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Summary Side-Card */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-950/20 via-card/80 to-cyan-950/20 border-pink-500/20 rounded-2xl relative overflow-hidden shadow-xl shadow-pink-500/5">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-pink-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-400" />
                Live Quote Summary
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time totals based on panel square footage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Grand Total Display */}
              <div className="text-center py-4 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase block">
                  TOTAL WRAP SQUARE FOOTAGE
                </span>
                <span className="text-3xl font-extrabold text-cyan-400 font-mono block mt-1">
                  {calculatedSqFt} sq.ft
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase block mt-3">
                  ESTIMATED PRICE
                </span>
                <span className="text-4xl font-extrabold text-foreground tracking-tight font-mono bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  ${estimatedPrice.toLocaleString()}
                </span>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 font-mono text-[10px]">
                    {profitMargin}% Profit Margin
                  </Badge>
                </div>
              </div>

              {/* Itemized List */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Wrap Material & Printing:</span>
                  <span className="font-mono text-foreground font-semibold">${wrapBaseTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Installation Labor:</span>
                  <span className="font-mono text-foreground font-semibold">${laborTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Graphic Design Fee:</span>
                  <span className="font-mono text-foreground font-semibold">${designFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-sm font-bold">
                  <span className="text-cyan-400">Total Quote:</span>
                  <span className="font-mono text-cyan-400">${estimatedPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Convert to CRM Deal */}
              <div className="border-t border-white/5 pt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkCust" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    LINK TO CRM CUSTOMER
                  </Label>
                  <select
                    id="linkCust"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="" className="bg-card">Select Customer...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id} className="bg-card">
                        {c.company !== 'Personal Custom' ? `${c.company} (${c.name})` : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eTitle" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    JOB TITLE
                  </Label>
                  <Input
                    id="eTitle"
                    value={estimateTitle}
                    onChange={(e) => setEstimateTitle(e.target.value)}
                    className="bg-black/40 border-white/10 rounded-xl h-9 text-xs"
                  />
                </div>

                <Button
                  onClick={handleCreateDealFromEstimate}
                  disabled={!selectedCustomer}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white text-xs font-bold py-5 rounded-xl shadow-md shadow-pink-500/15"
                >
                  Convert to Active Pipeline Inquiry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
