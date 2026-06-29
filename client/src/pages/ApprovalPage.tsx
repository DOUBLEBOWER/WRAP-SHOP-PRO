import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ApprovalPage() {
  const { token } = useParams<{ token: string }>();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: approval, isLoading, error } = trpc.design.getApprovalByToken.useQuery(
    { token: token || '' },
    { enabled: !!token }
  );

  const updateStatus = trpc.design.updateApprovalStatus.useMutation({
    onSuccess: () => {
      toast.success('Your response has been recorded!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit approval');
    }
  });

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await updateStatus.mutateAsync({
        token: token || '',
        status: 'approved',
        feedback
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await updateStatus.mutateAsync({
        token: token || '',
        status: 'rejected',
        feedback
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRevisions = async () => {
    setIsSubmitting(true);
    try {
      await updateStatus.mutateAsync({
        token: token || '',
        status: 'revisions_requested',
        feedback
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading design...</div>
      </div>
    );
  }

  if (error || !approval) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="p-8 max-w-md bg-slate-800 border-slate-700">
          <h1 className="text-2xl font-bold text-white mb-4">Design Not Found</h1>
          <p className="text-slate-300">The design approval link is invalid or has expired.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-cyan-600 p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Design Approval Request</h1>
            <p className="text-slate-100">Please review the design below and provide your feedback</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Design Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">{approval.designName}</h2>
              <p className="text-slate-400">From: {approval.clientName}</p>
            </div>

            {/* Design Image */}
            <div className="mb-8 bg-slate-900 rounded-lg overflow-hidden">
              <img
                src={approval.designImageUrl}
                alt={approval.designName}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>

            {/* Status Badge */}
            <div className="mb-8">
              <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: approval.status === 'pending' ? '#f59e0b' :
                                   approval.status === 'approved' ? '#10b981' :
                                   approval.status === 'rejected' ? '#ef4444' : '#8b5cf6',
                  color: 'white'
                }}>
                {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
              </div>
            </div>

            {/* Feedback Section */}
            {approval.status === 'pending' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Your Feedback (Optional)
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share any comments or suggestions..."
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-32"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    ✓ Approve Design
                  </Button>
                  <Button
                    onClick={handleRequestRevisions}
                    disabled={isSubmitting}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    ✎ Request Revisions
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    ✕ Reject Design
                  </Button>
                </div>
              </div>
            )}

            {/* Approved/Rejected Message */}
            {approval.status !== 'pending' && (
              <div className="bg-slate-700 rounded-lg p-6">
                <p className="text-white mb-4">
                  {approval.status === 'approved' && '✓ You approved this design'}
                  {approval.status === 'rejected' && '✕ You rejected this design'}
                  {approval.status === 'revisions_requested' && '✎ You requested revisions'}
                </p>
                {approval.feedback && (
                  <div className="bg-slate-600 rounded p-4">
                    <p className="text-slate-300 font-semibold mb-2">Your Feedback:</p>
                    <p className="text-slate-100">{approval.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
