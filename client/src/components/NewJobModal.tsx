import React, { useState } from 'react';
import { Deal, Customer, STAGES } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface NewJobModalProps {
  customers: Customer[];
  onClose: () => void;
  onAddDeal: (deal: Omit<Deal, 'id' | 'updatedAt'>) => void;
}

export default function NewJobModal({
  customers,
  onClose,
  onAddDeal
}: NewJobModalProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [title, setTitle] = useState('');
  const [serviceType, setServiceType] = useState<Deal['serviceType']>('Vehicle Wrap');
  const [value, setValue] = useState(1500);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Specs
  const [vehicleType, setVehicleType] = useState('');
  const [squareFootage, setSquareFootage] = useState(0);
  const [materialType, setMaterialType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [apparelType, setApparelType] = useState('');
  const [tintPercentage, setTintPercentage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCustomerId) {
      toast.error('Title and Customer are required');
      return;
    }

    onAddDeal({
      customerId: selectedCustomerId,
      title,
      serviceType,
      value,
      stage: 'inquiry',
      specs: {
        ...(vehicleType && { vehicleType }),
        ...(squareFootage > 0 && { squareFootage }),
        ...(materialType && { materialType }),
        ...(quantity > 0 && { quantity }),
        ...(apparelType && { apparelType }),
        ...(tintPercentage && { tintPercentage })
      },
      dueDate,
      notes,
      comments: []
    });

    toast.success(`Successfully added new job: "${title}"`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg bg-card border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-base font-bold tracking-wider text-cyan-400 uppercase">
            Add Custom Pipeline Job
          </CardTitle>
          <CardDescription className="text-xs">
            Create a custom project and track its progress across your shop pipeline.
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle" className="text-xs text-muted-foreground">Job Title</Label>
              <Input
                id="jobTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Ford F-150 Half Wrap"
                className="bg-black/40 border-white/10 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Customer Selector */}
              <div className="space-y-1.5">
                <Label htmlFor="jobCust" className="text-xs text-muted-foreground">Link Customer</Label>
                <select
                  id="jobCust"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-card">
                      {c.company !== 'Personal Custom' ? c.company : c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div className="space-y-1.5">
                <Label htmlFor="jobService" className="text-xs text-muted-foreground">Service Type</Label>
                <select
                  id="jobService"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-pink-500 transition-colors"
                >
                  <option value="Vehicle Wrap" className="bg-card">Vehicle Wrap</option>
                  <option value="Window Storefront" className="bg-card">Window Storefront</option>
                  <option value="Decals/Signs" className="bg-card">Decals/Signs</option>
                  <option value="Custom Apparel" className="bg-card">Custom Apparel</option>
                  <option value="Promotional Products" className="bg-card">Promotional Products</option>
                  <option value="Hydro Dipping" className="bg-card">Hydro Dipping</option>
                  <option value="Detailing/Tinting" className="bg-card">Detailing/Tinting</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Job Value */}
              <div className="space-y-1.5">
                <Label htmlFor="jobValue" className="text-xs text-muted-foreground">Estimated Job Value ($)</Label>
                <div className="relative">
                  <Input
                    id="jobValue"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="bg-black/40 border-white/10 rounded-xl"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs text-muted-foreground font-mono">USD</span>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <Label htmlFor="jobDue" className="text-xs text-muted-foreground">Due Date</Label>
                <Input
                  id="jobDue"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Dynamic Specs Section based on service type */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Production Specs</h4>
              
              {serviceType === 'Vehicle Wrap' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Vehicle Model</Label>
                    <Input
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      placeholder="e.g., Ford F-150"
                      className="bg-black/40 border-white/10 h-8 text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Wrap Sq. Footage</Label>
                    <Input
                      type="number"
                      value={squareFootage || ''}
                      onChange={(e) => setSquareFootage(Number(e.target.value))}
                      placeholder="e.g., 150"
                      className="bg-black/40 border-white/10 h-8 text-xs rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}

              {serviceType === 'Detailing/Tinting' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Vehicle Model</Label>
                    <Input
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      placeholder="e.g., Jeep Cherokee"
                      className="bg-black/40 border-white/10 h-8 text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Tint Percentage</Label>
                    <Input
                      value={tintPercentage}
                      onChange={(e) => setTintPercentage(e.target.value)}
                      placeholder="e.g., 15% Carbon"
                      className="bg-black/40 border-white/10 h-8 text-xs rounded-lg"
                    />
                  </div>
                </div>
              )}

              {serviceType === 'Custom Apparel' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Apparel Blank</Label>
                    <Input
                      value={apparelType}
                      onChange={(e) => setApparelType(e.target.value)}
                      placeholder="e.g., Gildan Softstyle"
                      className="bg-black/40 border-white/10 h-8 text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="bg-black/40 border-white/10 h-8 text-xs rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Common material field */}
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Preferred Material / Brand</Label>
                <Input
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  placeholder="e.g., 3M 2080 Gloss Vinyl"
                  className="bg-black/40 border-white/10 h-8 text-xs rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobNotes" className="text-xs text-muted-foreground">Notes / Description</Label>
              <textarea
                id="jobNotes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Initial inquiry details..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl text-xs border-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold px-5"
              >
                Save & Launch Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
