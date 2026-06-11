import React, { useState } from 'react';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_DEALS, 
  INITIAL_INVOICES, 
  INITIAL_INVENTORY,
  INITIAL_EVENTS,
  Customer, 
  Deal, 
  Invoice,
  InventoryItem,
  CalendarEvent
} from '../const';
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
import { useNotifications } from '../contexts/NotificationContext';
import { toast } from 'sonner';

export default function Home() {

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { addNotification } = useNotifications();

  // Core Reactive States
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Modal Control States
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  // --- CUSTOMER ACTIONS ---
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
  };

  // --- DEAL / JOB ACTIONS ---
  const handleAddDeal = (newDealData: Omit<Deal, 'id' | 'updatedAt'>) => {
    const newDeal: Deal = {
      ...newDealData,
      id: `deal_${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDeals([newDeal, ...deals]);
    addNotification({
      type: 'job_update',
      title: 'New Job Added to Pipeline',
      message: `"${newDealData.title}" has been added to the Inquiry stage.`,
      link: 'pipeline'
    });
  };

  const handleUpdateDealStage = (dealId: string, newStage: Deal['stage']) => {
    const updatedDeals = deals.map(deal => {
      if (deal.id === dealId) {
        // If moving to completed, let's update total customer spending
        if (newStage === 'completed' && deal.stage !== 'completed') {
          setCustomers(prevCusts => prevCusts.map(c => {
            if (c.id === deal.customerId) {
              return { ...c, totalSpent: c.totalSpent + deal.value };
            }
            return c;
          }));
        }
        return { ...deal, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return deal;
    });
    setDeals(updatedDeals);

    // If modal is currently open for this deal, update the modal state too
    if (selectedDeal?.id === dealId) {
      setSelectedDeal(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const handleUpdateJobDetails = (dealId: string, updates: Partial<Deal>) => {
    const updatedDeals = deals.map(deal => {
      if (deal.id === dealId) {
        return { ...deal, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return deal;
    });
    setDeals(updatedDeals);

    // Update the open modal state to show fresh details immediately
    if (selectedDeal?.id === dealId) {
      setSelectedDeal(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // --- INVOICE ACTIONS ---
  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prevInvoices => prevInvoices.map(inv => {
      if (inv.id === id) {
        // If status changes to Paid, let's add this to the customer's total spent
        if (status === 'paid' && inv.status !== 'paid') {
          setCustomers(prevCusts => prevCusts.map(c => {
            if (c.id === inv.customerId) {
              return { ...c, totalSpent: c.totalSpent + inv.total };
            }
            return c;
          }));
          toast.success(`Marked Invoice ${inv.invoiceNumber} as PAID. Customer balance updated!`);
          addNotification({
            type: 'payment',
            title: 'Payment Received',
            message: `Invoice ${inv.invoiceNumber} marked as paid — $${inv.total.toFixed(2)} collected.`,
            link: 'estimator'
          });
        }
        return { ...inv, status };
      }
      return inv;
    }));
  };

  const handleConvertEstimateToInvoice = (id: string) => {
    setInvoices(prevInvoices => prevInvoices.map(inv => {
      if (inv.id === id) {
        const newInvoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        toast.success(`Estimate ${inv.invoiceNumber} successfully converted to Invoice ${newInvoiceNumber}!`);
        return {
          ...inv,
          invoiceNumber: newInvoiceNumber,
          type: 'invoice',
          status: 'unpaid',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }
      return inv;
    }));
  };

  // --- INVENTORY ACTIONS ---
  const handleAddRoll = (newRoll: InventoryItem) => {
    setInventory([newRoll, ...inventory]);
  };

  const handleUpdateRollStock = (id: string, sqFtUsed: number) => {
    setInventory(prevInv => prevInv.map(item => {
      if (item.id === id) {
        const remaining = item.sqFtTotal - sqFtUsed;
        return {
          ...item,
          sqFtUsed,
          sqFtRemaining: remaining
        };
      }
      return item;
    }));
  };

  // --- CALENDAR ACTIONS ---
  const handleAddEvent = (newEvent: CalendarEvent) => {
    setEvents([newEvent, ...events]);
  };

  const handleUpdateEventStatus = (id: string, status: CalendarEvent['status']) => {
    setEvents(prevEvents => prevEvents.map(ev => {
      if (ev.id === id) {
        toast.success(`Booking status updated to ${status.toUpperCase()}`);
        return { ...ev, status };
      }
      return ev;
    }));
  };

  // --- CLIENT PORTAL PROOF ACTIONS ---
  const handleUpdateDealProof = (dealId: string, status: Deal['proofStatus'], notes?: string) => {
    const updatedDeals = deals.map(deal => {
      if (deal.id === dealId) {
        // If approved, let's auto-move the job stage to 'production'!
        let nextStage = deal.stage;
        if (status === 'approved') {
          nextStage = 'production';
          toast.success(`Job "${deal.title}" automatically moved to MATERIAL PRODUCTION stage!`);
        }
        return {
          ...deal,
          proofStatus: status,
          stage: nextStage,
          ...(notes && { proofNotes: notes }),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return deal;
    });
    setDeals(updatedDeals);
  };

  // --- HELPERS ---
  const getCustomerForDeal = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Dynamic Tab Rendering */}
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

      {/* --- MODALS --- */}
      
      {/* Job Details, Specs & Team Discussion Modal */}
      {selectedDeal && (
        <JobDetailsModal
          deal={selectedDeal}
          customer={getCustomerForDeal(selectedDeal.customerId)}
          onClose={() => setSelectedDeal(null)}
          onUpdateJobDetails={handleUpdateJobDetails}
        />
      )}

      {/* New Job Creation Modal */}
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
