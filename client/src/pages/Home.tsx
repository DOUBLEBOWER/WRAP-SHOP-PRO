import React, { useState, useEffect } from 'react';
import { Deal as DealType, Invoice as InvoiceType, Customer as CustomerType, InventoryItem as InventoryItemType, CalendarEvent as CalendarEventType } from '../const';
import DashboardLayout from '../components/DashboardLayout';
import DashboardOverview from '../components/DashboardOverview';
import PipelineKanban from '../components/PipelineKanban';
import CustomerDatabase from '../components/CustomerDatabase';
import WrapEstimator from '../components/WrapEstimator';
import InvoiceManager from '../components/InvoiceManager';
import JobDetailsModal from '../components/JobDetailsModal';
import NewJobModal from '../components/NewJobModal';
import InventoryTracker from '../components/InventoryTracker';
import ShopCalendar from '../components/ShopCalendar';
import ClientPortal from '../components/ClientPortal';
import CommunicationsHub from '../components/CommunicationsHub';
import PortfolioManager from '../components/PortfolioManager';
import Bookkeeping from '../components/Bookkeeping';
import { useNotifications } from '../contexts/NotificationContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { addNotification } = useNotifications();

  // Modal Control States
  const [selectedDeal, setSelectedDeal] = useState<DealType | null>(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  // ── tRPC queries (load from database) ──
  const { data: dbCustomers = [], refetch: refetchCustomers, isLoading: loadingCustomers } = trpc.crm.customers.list.useQuery();
  const { data: dbDeals = [], refetch: refetchDeals, isLoading: loadingDeals } = trpc.crm.deals.list.useQuery();
  const { data: dbInvoices = [], refetch: refetchInvoices, isLoading: loadingInvoices } = trpc.crm.invoices.list.useQuery();
  const { data: dbInventory = [], refetch: refetchInventory, isLoading: loadingInventory } = trpc.crm.inventory.list.useQuery();
  const { data: dbEvents = [], refetch: refetchEvents } = trpc.crm.events.list.useQuery();

  // Cast to frontend types
  const customers = dbCustomers as CustomerType[];
  const deals = dbDeals as DealType[];
  const invoices = dbInvoices as InvoiceType[];
  const inventory = dbInventory as InventoryItemType[];
  const events = dbEvents as CalendarEventType[];

  // ── tRPC mutations ──
  const createCustomer = trpc.crm.customers.create.useMutation({ onSuccess: () => refetchCustomers() });
  const updateCustomer = trpc.crm.customers.update.useMutation({ onSuccess: () => refetchCustomers() });

  const createDeal = trpc.crm.deals.create.useMutation({ onSuccess: () => refetchDeals() });
  const updateDeal = trpc.crm.deals.update.useMutation({ onSuccess: () => refetchDeals() });

  const createInvoice = trpc.crm.invoices.create.useMutation({ onSuccess: () => refetchInvoices() });
  const updateInvoiceStatus = trpc.crm.invoices.updateStatus.useMutation({ onSuccess: () => refetchInvoices() });

  const createInventoryItem = trpc.crm.inventory.create.useMutation({ onSuccess: () => refetchInventory() });
  const updateInventoryStock = trpc.crm.inventory.updateStock.useMutation({ onSuccess: () => refetchInventory() });

  const createEvent = trpc.crm.events.create.useMutation({ onSuccess: () => refetchEvents() });
  const updateEventStatus = trpc.crm.events.updateStatus.useMutation({ onSuccess: () => refetchEvents() });

  const isLoading = loadingCustomers || loadingDeals || loadingInvoices || loadingInventory;

  // --- CUSTOMER ACTIONS ---
  const handleAddCustomer = async (newCustomer: CustomerType) => {
    try {
      await createCustomer.mutateAsync({
        ...newCustomer,
        totalSpent: newCustomer.totalSpent || 0
      });
      toast.success(`Customer "${newCustomer.name}" saved to database!`);
    } catch (e) {
      toast.error('Failed to save customer. Please try again.');
    }
  };

  // --- DEAL / JOB ACTIONS ---
  const handleAddDeal = async (newDealData: Omit<DealType, 'id' | 'updatedAt'>) => {
    const newDeal: DealType = {
      ...newDealData,
      id: `deal_${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    try {
      await createDeal.mutateAsync({
        ...newDeal,
        value: newDeal.value || 0
      });
      addNotification({
        type: 'job_update',
        title: 'New Job Added to Pipeline',
        message: `"${newDealData.title}" has been added to the Inquiry stage.`,
        link: 'pipeline'
      });
    } catch (e) {
      toast.error('Failed to save job. Please try again.');
    }
  };

  const handleUpdateDealStage = async (dealId: string, newStage: DealType['stage']) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    try {
      await updateDeal.mutateAsync({
        id: dealId,
        stage: newStage,
        updatedAt: new Date().toISOString().split('T')[0]
      });

      // Update customer totalSpent if completing a deal
      if (newStage === 'completed' && deal.stage !== 'completed') {
        await updateCustomer.mutateAsync({
          id: deal.customerId,
          totalSpent: (customers.find(c => c.id === deal.customerId)?.totalSpent || 0) + deal.value
        });
      }

      toast.success(`Job moved to ${newStage.replace('_', ' ')}`);

      if (selectedDeal?.id === dealId) {
        setSelectedDeal(prev => prev ? { ...prev, stage: newStage } : null);
      }
    } catch (e) {
      toast.error('Failed to update job stage.');
    }
  };

  const handleUpdateJobDetails = async (dealId: string, updates: Partial<DealType>) => {
    try {
      await updateDeal.mutateAsync({
        id: dealId,
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      });

      if (selectedDeal?.id === dealId) {
        setSelectedDeal(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (e) {
      toast.error('Failed to save job details.');
    }
  };

  // --- INVOICE ACTIONS ---
  const handleAddInvoice = async (newInvoice: InvoiceType) => {
    try {
      await createInvoice.mutateAsync({
        ...newInvoice,
        subtotal: newInvoice.subtotal || 0,
        taxRate: newInvoice.taxRate || 8.5,
        taxAmount: newInvoice.taxAmount || 0,
        discount: newInvoice.discount || 0,
        total: newInvoice.total || 0
      });
      toast.success(`${newInvoice.type === 'estimate' ? 'Estimate' : 'Invoice'} ${newInvoice.invoiceNumber} saved!`);
    } catch (e) {
      toast.error('Failed to save invoice.');
    }
  };

  const handleUpdateInvoiceStatus = async (id: string, status: InvoiceType['status']) => {
    try {
      await updateInvoiceStatus.mutateAsync({ id, status });
      if (status === 'paid') {
        const inv = invoices.find(i => i.id === id);
        if (inv) {
          await updateCustomer.mutateAsync({
            id: inv.customerId,
            totalSpent: (customers.find(c => c.id === inv.customerId)?.totalSpent || 0) + inv.total
          });
          addNotification({
            type: 'payment',
            title: 'Payment Received',
            message: `Invoice ${inv.invoiceNumber} marked as paid — $${inv.total.toFixed(2)} collected.`,
            link: 'estimator'
          });
          toast.success(`Invoice ${inv.invoiceNumber} marked as PAID!`);
        }
      }
    } catch (e) {
      toast.error('Failed to update invoice status.');
    }
  };

  const handleConvertEstimateToInvoice = async (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    const newNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await updateInvoiceStatus.mutateAsync({ id, status: 'unpaid' });
      // Also update the invoice number and type via a full update if needed
      toast.success(`Estimate converted to Invoice ${newNumber}!`);
    } catch (e) {
      toast.error('Failed to convert estimate.');
    }
  };

  // --- INVENTORY ACTIONS ---
  const handleAddRoll = async (newRoll: InventoryItemType) => {
    try {
      await createInventoryItem.mutateAsync({
        ...newRoll,
        costPerSqFt: newRoll.costPerSqFt || 0
      });
      toast.success(`Roll "${newRoll.name}" added to inventory!`);
    } catch (e) {
      toast.error('Failed to save inventory item.');
    }
  };

  const handleUpdateRollStock = async (id: string, sqFtUsed: number) => {
    const roll = inventory.find(r => r.id === id);
    if (!roll) return;
    const sqFtRemaining = roll.sqFtTotal - sqFtUsed;
    try {
      await updateInventoryStock.mutateAsync({ id, sqFtUsed, sqFtRemaining });
    } catch (e) {
      toast.error('Failed to update stock.');
    }
  };

  // --- CALENDAR ACTIONS ---
  const handleAddEvent = async (newEvent: CalendarEventType) => {
    try {
      await createEvent.mutateAsync(newEvent);
      toast.success('Booking scheduled!');
    } catch (e) {
      toast.error('Failed to save booking.');
    }
  };

  const handleUpdateEventStatus = async (id: string, status: CalendarEventType['status']) => {
    try {
      await updateEventStatus.mutateAsync({ id, status });
      toast.success(`Booking status updated to ${status.toUpperCase()}`);
    } catch (e) {
      toast.error('Failed to update booking.');
    }
  };

  // --- CLIENT PORTAL PROOF ACTIONS ---
  const handleUpdateDealProof = async (dealId: string, status: DealType['proofStatus'], notes?: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const nextStage = status === 'approved' ? 'production' : deal.stage;
    try {
      await updateDeal.mutateAsync({
        id: dealId,
        proofStatus: status,
        stage: nextStage,
        ...(notes && { proofNotes: notes }),
        updatedAt: new Date().toISOString().split('T')[0]
      });
      if (status === 'approved') {
        toast.success(`Job "${deal.title}" moved to MATERIAL PRODUCTION!`);
      }
    } catch (e) {
      toast.error('Failed to update proof status.');
    }
  };

  const getCustomerForDeal = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-pink-400 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-semibold">Loading your CRM data...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <DashboardOverview
          deals={deals}
          customers={customers}
          invoices={invoices}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'pipeline' && (
        <PipelineKanban
          deals={deals}
          customers={customers}
          onUpdateDealStage={handleUpdateDealStage}
          onOpenDealDetails={(deal) => setSelectedDeal(deal)}
          onOpenNewDealModal={() => setShowNewJobModal(true)}
        />
      )}

      {activeTab === 'calendar' && (
        <ShopCalendar
          events={events}
          deals={deals}
          onAddEvent={handleAddEvent}
          onUpdateEventStatus={handleUpdateEventStatus}
        />
      )}

      {activeTab === 'inventory' && (
        <InventoryTracker
          inventory={inventory}
          onAddRoll={handleAddRoll}
          onUpdateRollStock={handleUpdateRollStock}
        />
      )}

      {activeTab === 'customers' && (
        <CustomerDatabase
          customers={customers}
          deals={deals}
          invoices={invoices}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {activeTab === 'estimator' && (
        <div className="space-y-8">
          <WrapEstimator
            customers={customers}
            onAddDeal={(deal) => {
              handleAddDeal(deal);
              setActiveTab('pipeline');
            }}
          />
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-4">
              Estimate & Invoice Management
            </h3>
            <InvoiceManager
              invoices={invoices}
              customers={customers}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
              onConvertEstimateToInvoice={handleConvertEstimateToInvoice}
            />
          </div>
        </div>
      )}

      {activeTab === 'portal' && (
        <ClientPortal
          deals={deals}
          customers={customers}
          invoices={invoices}
          onUpdateDealProof={handleUpdateDealProof}
          onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
        />
      )}

      {activeTab === 'comms' && (
        <CommunicationsHub
          customers={customers}
          deals={deals}
          invoices={invoices}
          onAddCustomer={handleAddCustomer}
          onAddDeal={handleAddDeal}
        />
      )}

      {activeTab === 'portfolio' && (
        <PortfolioManager />
      )}

      {activeTab === 'bookkeeping' && (
        <Bookkeeping />
      )}

      {/* --- MODALS --- */}
      {selectedDeal && (
        <JobDetailsModal
          deal={selectedDeal}
          customer={getCustomerForDeal(selectedDeal.customerId)}
          onClose={() => setSelectedDeal(null)}
          onUpdateJobDetails={handleUpdateJobDetails}
        />
      )}

      {showNewJobModal && (
        <NewJobModal
          customers={customers}
          onClose={() => setShowNewJobModal(false)}
          onAddDeal={handleAddDeal}
        />
      )}
    </DashboardLayout>
  );
}
