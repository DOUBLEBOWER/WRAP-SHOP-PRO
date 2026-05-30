import React, { useState } from 'react';
import { InventoryItem, INITIAL_INVENTORY } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, ShieldAlert, Archive, RefreshCw, PenTool, TrendingDown, X } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryTrackerProps {
  inventory: InventoryItem[];
  onAddRoll: (item: InventoryItem) => void;
  onUpdateRollStock: (id: string, sqFtUsed: number) => void;
}

export default function InventoryTracker({
  inventory,
  onAddRoll,
  onUpdateRollStock
}: InventoryTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // New Roll Form
  const [brand, setBrand] = useState<InventoryItem['brand']>('3M');
  const [name, setName] = useState('');
  const [finish, setFinish] = useState<InventoryItem['finish']>('Gloss');
  const [colorCode, setColorCode] = useState('#000000');
  const [sqFtTotal, setSqFtTotal] = useState(250);
  const [costPerSqFt, setCostPerSqFt] = useState(3.5);
  const [minAlertThreshold, setMinAlertThreshold] = useState(100);

  // Quick Adjustment states
  const [selectedRollId, setSelectedRollId] = useState<string | null>(null);
  const [adjustmentSqFt, setAdjustmentSqFt] = useState(10);

  const handleAddRollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Material name is required');
      return;
    }

    const newRoll: InventoryItem = {
      id: `roll_${Date.now()}`,
      brand,
      name,
      finish,
      colorCode,
      sqFtTotal,
      sqFtUsed: 0,
      sqFtRemaining: sqFtTotal,
      costPerSqFt,
      minAlertThreshold
    };

    onAddRoll(newRoll);
    toast.success(`Added new roll: ${brand} ${name}`);
    setShowAddModal(false);

    // Reset
    setName('');
    setColorCode('#000000');
    setSqFtTotal(250);
    setCostPerSqFt(3.5);
  };

  const handleQuickAdjust = (rollId: string, type: 'use' | 'restock') => {
    const roll = inventory.find(r => r.id === rollId);
    if (!roll) return;

    let newUsed = roll.sqFtUsed;
    if (type === 'use') {
      newUsed += adjustmentSqFt;
      if (newUsed > roll.sqFtTotal) {
        toast.error('Cannot use more square footage than available on the roll!');
        return;
      }
    } else {
      newUsed = Math.max(0, newUsed - adjustmentSqFt);
    }

    onUpdateRollStock(rollId, newUsed);
    toast.success(`Adjusted stock for ${roll.brand} ${roll.name}`);
    setSelectedRollId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">
            Vinyl & Material Inventory
          </h2>
          <p className="text-xs text-muted-foreground">
            Track active wrap film rolls, window tints, and receive low-stock warnings before print jobs start.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Log New Vinyl Roll
        </Button>
      </div>

      {/* Grid: Main inventory cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {inventory.map((roll) => {
          const isLow = roll.sqFtRemaining < roll.minAlertThreshold;
          const percentRemaining = Math.round((roll.sqFtRemaining / roll.sqFtTotal) * 100);

          return (
            <Card 
              key={roll.id} 
              className={`bg-card/40 border-white/5 backdrop-blur-md rounded-2xl relative overflow-hidden transition-all duration-300 ${
                isLow ? 'border-amber-500/30 shadow-lg shadow-amber-500/5' : ''
              }`}
            >
              {/* Top Colored Bar based on roll color */}
              <div className="h-2 w-full" style={{ backgroundColor: roll.colorCode }} />

              <CardContent className="p-5 space-y-4">
                {/* Brand & Finish */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                      {roll.brand}
                    </span>
                    <h3 className="font-bold text-sm text-foreground">{roll.name}</h3>
                  </div>
                  <Badge className="bg-white/5 border-white/5 text-muted-foreground text-[10px] font-semibold">
                    {roll.finish}
                  </Badge>
                </div>

                {/* Stock Level Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-muted-foreground">ROLL STOCK LEVEL</span>
                    <span className={`font-bold font-mono ${isLow ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {percentRemaining}% ({roll.sqFtRemaining} SF left)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                      }`}
                      style={{ width: `${percentRemaining}%` }}
                    />
                  </div>
                </div>

                {/* Low Stock Warning Badge */}
                {isLow && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-400 text-[10px] font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>Low stock alert! Restock roll soon.</span>
                  </div>
                )}

                {/* Quick adjustment button / inputs */}
                {selectedRollId === roll.id ? (
                  <div className="pt-2 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={adjustmentSqFt}
                        onChange={(e) => setAdjustmentSqFt(Number(e.target.value))}
                        className="bg-black/40 border-white/10 h-8 text-xs rounded-lg text-right pr-6"
                      />
                      <span className="absolute right-2 top-2 text-[9px] text-muted-foreground">SF</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleQuickAdjust(roll.id, 'use')}
                      className="bg-pink-600 hover:bg-pink-700 h-8 text-[10px] rounded-lg"
                    >
                      Use
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleQuickAdjust(roll.id, 'restock')}
                      className="bg-cyan-600 hover:bg-cyan-700 h-8 text-[10px] rounded-lg"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRollId(null)}
                      className="h-8 w-8 p-0 rounded-lg border-white/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => { setSelectedRollId(roll.id); setAdjustmentSqFt(10); }}
                    className="w-full bg-white/5 hover:bg-white/10 text-foreground border border-white/5 rounded-xl text-[11px] h-8 font-semibold"
                  >
                    Quick Stock Adjustment
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Roll Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4 rotate-45" />
            </button>

            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold tracking-wider text-cyan-400 uppercase">
                Log New Vinyl / Tint Roll
              </CardTitle>
              <CardDescription className="text-xs">
                Add a new roll of vinyl wrap film or window tint to active inventory.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleAddRollSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Brand</Label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="3M">3M</option>
                      <option value="Avery Dennison">Avery Dennison</option>
                      <option value="KPMF">KPMF</option>
                      <option value="Orafol">Orafol</option>
                      <option value="Suntek">Suntek</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Finish Type</Label>
                    <select
                      value={finish}
                      onChange={(e) => setFinish(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="Gloss">Gloss</option>
                      <option value="Satin">Satin</option>
                      <option value="Matte">Matte</option>
                      <option value="Carbon">Carbon</option>
                      <option value="Chrome">Chrome</option>
                      <option value="Perforated">Perforated</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rollName" className="text-xs text-muted-foreground">Color / Roll Name</Label>
                  <Input
                    id="rollName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Gloss Deep Green"
                    className="bg-black/40 border-white/10 rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rollColor" className="text-xs text-muted-foreground">Visual Swatch Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="rollColor"
                        type="color"
                        value={colorCode}
                        onChange={(e) => setColorCode(e.target.value)}
                        className="bg-black/40 border-white/10 rounded-xl p-1 h-9 w-12"
                      />
                      <span className="text-xs font-mono">{colorCode}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="totalSq" className="text-xs text-muted-foreground">Roll Total Area (Sq.Ft)</Label>
                    <Input
                      id="totalSq"
                      type="number"
                      value={sqFtTotal}
                      onChange={(e) => setSqFtTotal(Number(e.target.value))}
                      className="bg-black/40 border-white/10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="alertThreshold" className="text-xs text-muted-foreground">Alert Threshold (Sq.Ft)</Label>
                    <Input
                      id="alertThreshold"
                      type="number"
                      value={minAlertThreshold}
                      onChange={(e) => setMinAlertThreshold(Number(e.target.value))}
                      className="bg-black/40 border-white/10 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="costSq" className="text-xs text-muted-foreground">Cost per Sq.Ft ($)</Label>
                    <Input
                      id="costSq"
                      type="number"
                      step="0.1"
                      value={costPerSqFt}
                      onChange={(e) => setCostPerSqFt(Number(e.target.value))}
                      className="bg-black/40 border-white/10 rounded-xl"
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
                    Save Roll
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
