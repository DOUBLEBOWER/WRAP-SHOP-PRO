import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export function useStoreCheckout() {
  const mutation = trpc.stripe.createStoreCheckout.useMutation({
    onError: (err) => {
      console.error('[Stripe] Checkout error:', err);
      toast.error('Payment setup failed. Please try again or call us at (918) 555-0199.');
    }
  });

  const checkout = async (
    items: { name: string; price: number; quantity: number; description?: string }[],
    customerEmail?: string,
    customerName?: string
  ) => {
    const result = await mutation.mutateAsync({
      items,
      customerEmail,
      customerName,
      origin: window.location.origin
    });

    if (result.url) {
      toast.success('Redirecting to secure Stripe checkout...');
      window.open(result.url, '_blank');
    }
  };

  return { checkout, isLoading: mutation.isPending };
}

export function useInvoiceCheckout() {
  const mutation = trpc.stripe.createInvoiceCheckout.useMutation({
    onError: (err) => {
      console.error('[Stripe] Invoice checkout error:', err);
      toast.error('Payment setup failed. Please try again or call us at (918) 555-0199.');
    }
  });

  const checkout = async (
    invoiceNumber: string,
    amount: number,
    description: string,
    customerEmail?: string,
    customerName?: string
  ) => {
    const result = await mutation.mutateAsync({
      invoiceNumber,
      amount,
      description,
      customerEmail,
      customerName,
      origin: window.location.origin
    });

    if (result.url) {
      toast.success('Redirecting to secure Stripe checkout...');
      window.open(result.url, '_blank');
    }
  };

  return { checkout, isLoading: mutation.isPending };
}
