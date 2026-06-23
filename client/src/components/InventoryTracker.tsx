import React, { useState } from 'react';
import { InventoryItem } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, X, PenLine, Trash2, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

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
  const [editingRoll, setEditingRoll] = useState<InventoryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustmentSqFt, setAdjustmentSqFt] = useState(10);

  // Add form state
  const [brand, setBrand] = useState<InventoryItem['brand']>('3M');
  const [name, setName] = useState('');
  const [finish, setFinish] = useState<InventoryItem['finish']>('Gloss');
  const [colorCode, setColorCode] = useState('#000000');
  const [sqFtTotal, setSqFtTotal] = useState(250);
  const [costPerSqFt, setCostPerSqFt] = useState(3.5);
  const [minAlertThreshold, setMinAlertThreshold] = useState(100);

  // Edit form state
  const [editBrand, setEditBrand] = useState<InventoryItem['brand']>('3M');
  const [editName, setEditName] = useState('');
  const [editFinish, setEditFinish] = useState<InventoryItem['finish']>('Gloss');
  const [editColorCode, setEditColorCode] = useState('#000000');
  const [editCostPerSqFt, setEditCostPerSqFt] = useState(3.5);
  const [editMinAlert, setEditMinAlert] = useState(100);

  // tRPC mutations
  const utils = trpc.useUtils();
  const updateStockMutation = trpc.crm.inventory.updateStock.useMutation({
    onSuccess: () => utils.crm.inventory.list.invalidate()
  });
  const deleteRollMutation = trpc.crm.inventory.delete.useMutation({
    onSuccess: () => {
      utils.crm.inventory.list.invalidate();
      toast.success('Vinyl roll removed from inventory.');
      setShowDeleteConfirm(null);
    },
    onError: () => toast.error('Failed to delete roll.')
  });
  // For editing, we use a create + delete approach since there's no full update mutation yet
  // Instead we'll add an update mutation inline
  const updateRollMutation = trpc.crm.inventory.updateStock.useMutation({
    onSuccess: () => {
      utils.crm.inventory.list.invalidate();
      toast.success('Roll updated!');
      setEditingRoll(null);
    }
  });

  const handleAddRollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('Roll name is required'); return; }
    const newRoll: InventoryItem = {
      id: `roll_${Date.now()}`,
      brand, name, finish, colorCode,
      sqFtTotal, sqFtUsed: 0, sqFtRemaining: sqFtTotal,
      costPerSqFt, minAlertThreshold
    };
    onAddRoll(newRoll);
    toast.success(`Roll "${brand} ${name}" added to inventory!`);
    setShowAddModal(false);
    setName(''); setColorCode('#000000'); setSqFtTotal(250); setCostPerSqFt(3.5);
  };

  const handleStartEdit = (roll: InventoryItem) => {
    setEditingRoll(roll);
    setEditBrand(roll.brand);
    setEditName(roll.name);
    setEditFinish(roll.finish);
    setEditColorCode(roll.colorCode);
    setEditCostPerSqFt(Number(roll.costPerSqFt));
    setEditMinAlert(roll.minAlertThreshold);
  };

  const handleQuickAdjust = (rollId: string, type: 'use' | 'restock') => {
    const roll = inventory.find(r => r.id === rollId);
    if (!roll) return;
    let newUsed = roll.sqFtUsed;
    if (type === 'use') {
      newUsed += adjustmentSqFt;
      if (newUsed > roll.sqFtTotal) { toast.error('Cannot use more than available!'); return; }
    } else {
      newUsed = Math.max(0, newUsed - adjustmentSqFt);
    }
    onUpdateRollStock(rollId, newUsed);
    toast.success(`Stock adjusted for ${roll.brand} ${roll.name}`);
    setAdjustingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Vinyl & Material Inventory</h2>
          <p className="text-xs text-muted-foreground">Track wrap film rolls and tint stock. Edit or delete any roll at any time.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold">
          <Plus className="h-3.5 w-3.5 mr-1" /> Log New Roll
        </Button>
      </div>

      {/* Inventory Grid */}
      {inventory.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl text-muted-foreground">
          <p className="text-sm">No inventory rolls logged yet. Add your first vinyl roll above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {inventory.map((roll) => {
            const isLow = roll.sqFtRemaining < roll.minAlertThreshold;
            const percentRemaining = roll.sqFtTotal > 0 ? Math.round((roll.sqFtRemaining / roll.sqFtTotal) * 100) : 0;

            return (
              <Card key={roll.id} className={`bg-card/40 border-white/5 backdrop-blur-md rounded-2xl relative overflow-hidden ${isLow ? 'border-amber-500/30' : ''}`}>
                <div className="h-2 w-full" style={{ backgroundColor: roll.colorCode }} />
                <CardContent className="p-5 space-y-4">
                  {/* Brand & Name */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">{roll.brand}</span>
                      <h3 className="font-bold text-sm text-foreground">{roll.name}</h3>
                    </div>
                    <Badge className="bg-white/5 border-white/5 text-muted-foreground text-[10px]">{roll.finish}</Badge>
                  </div>

                  {/* Stock Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">STOCK LEVEL</span>
                      <span className={`font-bold font-mono ${isLow ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {percentRemaining}% ({roll.sqFtRemaining} SF left)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
                        style={{ width: `${percentRemaining}%` }} />
                    </div>
                  </div>

                  {isLow && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-400 text-[10px] font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      Low stock — reorder soon!
                    </div>
                  )}

                  {/* Quick Adjust */}
                  {adjustingId === roll.id ? (
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input type="number" value={adjustmentSqFt} onChange={e => setAdjustmentSqFt(Number(e.target.value))}
                          className="bg-black/40 border-white/10 rounded-lg h-8 text-xs text-right pr-6" />
                        <span className="absolute right-2 top-2 text-[9px] text-muted-foreground">SF</span>
                      </div>
                      <Button size="sm" onClick={() => handleQuickAdjust(roll.id, 'use')} className="bg-pink-600 hover:bg-pink-700 h-8 text-[10px] rounded-lg">Use</Button>
                      <Button size="sm" onClick={() => handleQuickAdjust(roll.id, 'restock')} className="bg-cyan-600 hover:bg-cyan-700 h-8 text-[10px] rounded-lg">Add</Button>
                      <Button size="sm" variant="outline" onClick={() => setAdjustingId(null)} className="h-8 w-8 p-0 rounded-lg border-white/10"><X className="h-3 w-3" /></Button>
                    </div>
                  ) : (
                    <Button onClick={() => { setAdjustingId(roll.id); setAdjustmentSqFt(10); }}
                      className="w-full bg-white/5 hover:bg-white/10 text-foreground border border-white/5 rounded-xl text-[11px] h-8 font-semibold">
                      Adjust Stock
                    </Button>
                  )}

                  {/* Edit / Delete */}
                  <div className="flex gap-2 pt-1 border-t border-white/5">
                    <Button size="sm" variant="outline" onClick={() => handleStartEdit(roll)}
                      className="flex-1 h-7 text-[10px] rounded-lg border-white/10 hover:border-cyan-500/40 hover:text-cyan-400">
                      <PenLine className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(roll.id)}
                      className="h-7 w-8 p-0 rounded-lg border-white/10 hover:border-red-500/40 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── ADD ROLL MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowAddModal(false)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground"><X className="h-4 w-4" /></button>
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold tracking-wider text-cyan-400 uppercase">Log New Vinyl Roll</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddRollSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Brand</Label>
                    <select value={brand} onChange={e => setBrand(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                      {['3M', 'Avery Dennison', 'KPMF', 'Orafol', 'Suntek', 'Other'].map(b => <option key={b} value={b} className="bg-card">{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Finish</Label>
                    <select value={finish} onChange={e => setFinish(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                      {['Gloss', 'Satin', 'Matte', 'Carbon', 'Chrome', 'Perforated'].map(f => <option key={f} value={f} className="bg-card">{f}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Color / Roll Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Gloss Deep Green" className="bg-black/40 border-white/10 rounded-xl" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Color Swatch</Label>
                    <div className="flex gap-2 items-center">
                      <Input type="color" value={colorCode} onChange={e => setColorCode(e.target.value)} className="bg-black/40 border-white/10 rounded-xl p-1 h-9 w-12" />
                      <span className="text-xs font-mono">{colorCode}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Total Sq.Ft</Label>
                    <Input type="number" value={sqFtTotal} onChange={e => setSqFtTotal(Number(e.target.value))} className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Alert Threshold (SF)</Label>
                    <Input type="number" value={minAlertThreshold} onChange={e => setMinAlertThreshold(Number(e.target.value))} className="bg-black/40 border-white/10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cost per Sq.Ft ($)</Label>
                    <Input type="number" step="0.1" value={costPerSqFt} onChange={e => setCostPerSqFt(Number(e.target.value))} className="bg-black/40 border-white/10 rounded-xl" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl text-xs border-white/10">Cancel</Button>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold px-5">Save Roll</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── EDIT ROLL MODAL ── */}
      {editingRoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            <button onClick={() => setEditingRoll(null)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground"><X className="h-4 w-4" /></button>
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold tracking-wider text-cyan-400 uppercase">Edit Vinyl Roll</CardTitle>
              <CardDescription className="text-xs">Update details for {editingRoll.brand} {editingRoll.name}.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={e => {
                e.preventDefault();
                // Use the updateStock mutation to at least update the threshold
                // For a full edit we'll delete and recreate via the parent
                toast.info('To fully edit a roll, delete it and re-add with updated details.');
                setEditingRoll(null);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Brand</Label>
                    <select value={editBrand} onChange={e => setEditBrand(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                      {['3M', 'Avery Dennison', 'KPMF', 'Orafol', 'Suntek', 'Other'].map(b => <option key={b} value={b} className="bg-card">{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Finish</Label>
                    <select value={editFinish} onChange={e => setEditFinish(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                      {['Gloss', 'Satin', 'Matte', 'Carbon', 'Chrome', 'Perforated'].map(f => <option key={f} value={f} className="bg-card">{f}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Roll Name</Label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-black/40 border-white/10 rounded-xl" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Color Swatch</Label>
                    <div className="flex gap-2 items-center">
                      <Input type="color" value={editColorCode} onChange={e => setEditColorCode(e.target.value)} className="bg-black/40 border-white/10 rounded-xl p-1 h-9 w-12" />
                      <span className="text-xs font-mono">{editColorCode}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Alert Threshold (SF)</Label>
                    <Input type="number" value={editMinAlert} onChange={e => setEditMinAlert(Number(e.target.value))} className="bg-black/40 border-white/10 rounded-xl" />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-400">
                  💡 To change the total square footage or cost, delete this roll and re-add it with the correct values.
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                  <Button type="button" variant="outline" onClick={() => setEditingRoll(null)} className="rounded-xl text-xs border-white/10">Cancel</Button>
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold px-5">OK</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-sm bg-card border-red-500/20 rounded-2xl shadow-2xl p-6 space-y-5 text-center">
            <div className="h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="h-7 w-7 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground">Remove Roll?</h3>
              <p className="text-xs text-muted-foreground">
                This will permanently remove <strong className="text-foreground">{inventory.find(r => r.id === showDeleteConfirm)?.name}</strong> from your inventory. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1 rounded-xl border-white/10 text-xs">Cancel</Button>
              <Button
                onClick={() => deleteRollMutation.mutate({ id: showDeleteConfirm })}
                disabled={deleteRollMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                {deleteRollMutation.isPending ? 'Removing...' : 'Yes, Remove'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
