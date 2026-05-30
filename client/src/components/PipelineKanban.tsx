import React, { useState } from 'react';
import { Deal, Customer, STAGES } from '../const';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Calendar, User, DollarSign, PenTool, CheckCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface PipelineKanbanProps {
  deals: Deal[];
  customers: Customer[];
  onUpdateDealStage: (dealId: string, newStage: Deal['stage']) => void;
  onOpenDealDetails: (deal: Deal) => void;
  onOpenNewDealModal: () => void;
}

export default function PipelineKanban({
  deals,
  customers,
  onUpdateDealStage,
  onOpenDealDetails,
  onOpenNewDealModal
}: PipelineKanbanProps) {
  
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? (customer.company !== 'Personal Custom' ? customer.company : customer.name) : 'Unknown Customer';
  };

  const getStageDeals = (stageId: Deal['stage']) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getServiceColor = (serviceType: Deal['serviceType']) => {
    switch (serviceType) {
      case 'Vehicle Wrap':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Window Storefront':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Custom Apparel':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Detailing/Tinting':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const handleMoveStage = (dealId: string, currentStage: Deal['stage'], direction: 'forward' | 'backward') => {
    const stageOrder: Deal['stage'][] = ['inquiry', 'proofing', 'production', 'installation', 'completed'];
    const currentIndex = stageOrder.indexOf(currentStage);
    
    if (currentIndex === -1) return;
    
    let nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < stageOrder.length) {
      const nextStage = stageOrder[nextIndex];
      onUpdateDealStage(dealId, nextStage);
      
      const deal = deals.find(d => d.id === dealId);
      toast.success(`Moved "${deal?.title}" to ${STAGES.find(s => s.id === nextStage)?.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kanban Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Production & Sales Pipeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Track active jobs from initial inquiry to design proofing, material printing, and installation.
          </p>
        </div>
        <Button 
          onClick={onOpenNewDealModal}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-md shadow-pink-500/15 rounded-xl self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Job
        </Button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.filter(s => s.id !== 'cancelled').map((stage) => {
          const stageDeals = getStageDeals(stage.id as Deal['stage']);
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div 
              key={stage.id} 
              className="flex flex-col min-w-[250px] bg-black/20 rounded-2xl border border-white/5 p-3.5 space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                    stage.id === 'inquiry' ? 'bg-cyan-400' :
                    stage.id === 'proofing' ? 'bg-purple-400' :
                    stage.id === 'production' ? 'bg-pink-400' :
                    stage.id === 'installation' ? 'bg-amber-400' :
                    'bg-emerald-400'
                  }`} />
                  <h3 className="font-semibold text-xs text-foreground tracking-wider uppercase">
                    {stage.name.split(' ')[0]} {/* Shorter name for tight column */}
                  </h3>
                </div>
                <Badge variant="outline" className="bg-white/5 border-white/5 font-mono text-[10px]">
                  {stageDeals.length}
                </Badge>
              </div>

              {/* Column Value */}
              <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1 font-mono">
                <span>Total Value:</span>
                <span className="text-cyan-400 font-bold">${totalValue.toLocaleString()}</span>
              </div>

              {/* Column Body / Deal Cards */}
              <div className="flex-1 space-y-3 min-h-[350px] overflow-y-auto max-h-[600px] pr-1">
                {stageDeals.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl p-6 text-center text-muted-foreground">
                    <p className="text-[11px]">No active jobs in this stage</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="group bg-card/40 border border-white/5 rounded-xl p-3.5 space-y-3 hover:bg-card/80 hover:border-pink-500/20 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Colored Left Highlight */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${
                        stage.id === 'inquiry' ? 'bg-cyan-400' :
                        stage.id === 'proofing' ? 'bg-purple-400' :
                        stage.id === 'production' ? 'bg-pink-400' :
                        stage.id === 'installation' ? 'bg-amber-400' :
                        'bg-emerald-400'
                      }`} />

                      {/* Deal Title */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-xs text-foreground leading-tight line-clamp-2">
                            {deal.title}
                          </h4>
                          <span className="text-[11px] font-mono font-bold text-pink-400 shrink-0">
                            ${deal.value}
                          </span>
                        </div>
                        <p className="text-[10px] text-cyan-400/80 font-medium">
                          {getCustomerName(deal.customerId)}
                        </p>
                      </div>

                      {/* Service Tag & Spec Badges */}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={`text-[9px] font-semibold tracking-wide py-0.5 px-1.5 rounded-md border ${getServiceColor(deal.serviceType)}`}>
                          {deal.serviceType}
                        </Badge>
                        {deal.specs.vehicleType && (
                          <Badge variant="outline" className="text-[9px] py-0.5 px-1.5 bg-white/5 border-white/5 text-muted-foreground rounded-md">
                            {deal.specs.vehicleType}
                          </Badge>
                        )}
                        {deal.specs.squareFootage && (
                          <Badge variant="outline" className="text-[9px] py-0.5 px-1.5 bg-white/5 border-white/5 text-muted-foreground rounded-md font-mono">
                            {deal.specs.squareFootage} sq.ft
                          </Badge>
                        )}
                      </div>

                      {/* Due Date & Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3 text-muted-foreground/60" />
                          <span>{deal.dueDate}</span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenDealDetails(deal)}
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-cyan-400 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          
                          {/* Navigation Buttons inside Column */}
                          {stage.id !== 'inquiry' && (
                            <button
                              onClick={() => handleMoveStage(deal.id, deal.stage, 'backward')}
                              className="p-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-pink-400 transition-colors font-mono font-bold"
                              title="Move Back"
                            >
                              &lt;
                            </button>
                          )}
                          {stage.id !== 'completed' && (
                            <button
                              onClick={() => handleMoveStage(deal.id, deal.stage, 'forward')}
                              className="p-1 rounded-md bg-white/5 hover:bg-white/10 hover:text-emerald-400 transition-colors font-mono font-bold"
                              title="Move Forward"
                            >
                              &gt;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
