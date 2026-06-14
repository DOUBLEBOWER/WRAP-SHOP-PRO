import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign, TrendingUp, TrendingDown, Plus, Trash2,
  FileText, Download, PieChart, BarChart3, X, Receipt
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, LineChart, Line, CartesianGrid, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { toast } from 'sonner';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  taxable: boolean;
  notes?: string;
}

const INCOME_CATEGORIES = [
  'Vehicle Wrap', 'Window Tinting', 'Custom Apparel', 'Storefront Graphics',
  'Hydro Dipping', 'Detailing', 'Custom Stickers', 'Photo Prints',
  'Promotional Products', 'Deposit Received', 'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Vinyl & Wrap Film', 'Ink & Supplies', 'Apparel Blanks', 'Equipment',
  'Shop Rent', 'Utilities', 'Labor / Subcontractor', 'Shipping',
  'Marketing & Advertising', 'Software & Tools', 'Vehicle / Fuel',
  'Insurance', 'Taxes Paid', 'Office Supplies', 'Other Expense'
];

const OKLAHOMA_TAX_RATE = 0.085;

const CHART_COLORS = [
  'oklch(0.65 0.24 330)', 'oklch(0.75 0.18 200)', 'oklch(0.82 0.16 85)',
  'oklch(0.60 0.18 140)', 'oklch(0.55 0.20 280)', 'oklch(0.70 0.20 50)'
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Bookkeeping() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'ledger'>('dashboard');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  // Form state
  const [formType, setFormType] = useState<TransactionType>('income');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Vehicle Wrap');
  const [formAmount, setFormAmount] = useState('');
  const [formTaxable, setFormTaxable] = useState(true);
  const [formNotes, setFormNotes] = useState('');

  // Computed totals
  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const taxableIncome = transactions.filter(t => t.type === 'income' && t.taxable).reduce((s, t) => s + t.amount, 0);
    const taxOwed = taxableIncome * OKLAHOMA_TAX_RATE;
    return { income, expenses, profit: income - expenses, taxableIncome, taxOwed };
  }, [transactions]);

  // Monthly chart data
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return MONTHS.map((month, idx) => {
      const monthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && d.getMonth() === idx;
      });
      return {
        month,
        income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  // Category breakdown for pie
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchType = filterType === 'all' || t.type === filterType;
      const matchMonth = filterMonth === 'all' || t.date.startsWith(filterMonth);
      return matchType && matchMonth;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterMonth]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc || !formAmount) return;

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      date: formDate,
      description: formDesc,
      category: formCategory,
      type: formType,
      amount: parseFloat(formAmount),
      taxable: formTaxable,
      notes: formNotes || undefined
    };

    setTransactions(prev => [tx, ...prev]);
    toast.success(`${formType === 'income' ? 'Income' : 'Expense'} of $${parseFloat(formAmount).toLocaleString()} logged!`);

    // Reset form
    setFormDesc(''); setFormAmount(''); setFormNotes('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction removed.');
  };

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Type', 'Category', 'Description', 'Amount', 'Taxable', 'Notes'],
      ...transactions.map(t => [
        t.date, t.type, t.category, t.description,
        t.amount.toFixed(2), t.taxable ? 'Yes' : 'No', t.notes || ''
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coast2coast-bookkeeping-${new Date().getFullYear()}.csv`;
    a.click();
    toast.success('Exported to CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Bookkeeping & Financials
          </h2>
          <p className="text-sm text-muted-foreground">
            Track income, expenses, profit, and Oklahoma sales tax obligations for All-Pro Coast 2 Coast LLC.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleExportCSV} variant="outline" className="border-white/10 rounded-xl text-xs font-bold gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Log Transaction
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'dashboard', label: 'Financial Dashboard', icon: BarChart3 },
          { id: 'ledger', label: 'Transaction Ledger', icon: Receipt }
        ].map(v => {
          const Icon = v.icon;
          return (
            <Button
              key={v.id}
              variant={activeView === v.id ? 'default' : 'outline'}
              onClick={() => setActiveView(v.id as any)}
              className={`rounded-xl text-xs font-semibold gap-1.5 ${activeView === v.id ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'border-white/10'}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {v.label}
            </Button>
          );
        })}
      </div>

      {/* ===== DASHBOARD VIEW ===== */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Income', value: totals.income, color: 'text-emerald-400', icon: TrendingUp, bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Total Expenses', value: totals.expenses, color: 'text-red-400', icon: TrendingDown, bg: 'bg-red-500/10 border-red-500/20' },
              { label: 'Net Profit', value: totals.profit, color: totals.profit >= 0 ? 'text-cyan-400' : 'text-red-400', icon: DollarSign, bg: 'bg-cyan-500/10 border-cyan-500/20' },
              { label: 'Est. Tax Owed (OK 8.5%)', value: totals.taxOwed, color: 'text-amber-400', icon: FileText, bg: 'bg-amber-500/10 border-amber-500/20' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className={`bg-card/40 border-white/5 rounded-2xl`}>
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">{stat.label}</span>
                      <span className={`text-xl font-black font-mono ${stat.color}`}>
                        ${Math.abs(stat.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Monthly Chart */}
          <Card className="bg-card/40 border-white/5 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400">
                Monthly Income vs Expenses — {new Date().getFullYear()}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[260px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(16,16,24,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="income" name="Income" fill="oklch(0.60 0.18 140)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="expenses" name="Expenses" fill="oklch(0.58 0.22 25)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tax Summary */}
          <Card className="bg-gradient-to-br from-amber-950/20 to-card/40 border-amber-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4 w-4" /> Oklahoma Sales Tax Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Taxable Revenue</span>
                <span className="font-mono font-bold text-foreground text-base">${totals.taxableIncome.toFixed(2)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">OK Tax Rate</span>
                <span className="font-mono font-bold text-amber-400 text-base">8.5%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Estimated Tax Owed</span>
                <span className="font-mono font-bold text-amber-400 text-base">${totals.taxOwed.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              This is an estimate based on logged taxable income. Consult your accountant for official tax filings. Oklahoma state sales tax is 4.5% + Tulsa county/city rates.
            </p>
          </Card>
        </div>
      )}

      {/* ===== LEDGER VIEW ===== */}
      {activeView === 'ledger' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1.5">
              {(['all', 'income', 'expense'] as const).map(t => (
                <Button
                  key={t}
                  size="sm"
                  variant={filterType === t ? 'default' : 'outline'}
                  onClick={() => setFilterType(t)}
                  className={`rounded-xl text-xs h-8 capitalize ${filterType === t ? (t === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : t === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'bg-pink-600 hover:bg-pink-700') : 'border-white/10'}`}
                >
                  {t === 'all' ? 'All' : t === 'income' ? '↑ Income' : '↓ Expenses'}
                </Button>
              ))}
            </div>
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Months</option>
              {Array.from({ length: 12 }, (_, i) => {
                const d = new Date(new Date().getFullYear(), i, 1);
                const val = d.toISOString().substring(0, 7);
                return <option key={val} value={val} className="bg-card">{d.toLocaleString('default', { month: 'long', year: 'numeric' })}</option>;
              })}
            </select>
          </div>

          {/* Transactions Table */}
          <Card className="bg-card/40 border-white/5 rounded-2xl">
            <CardContent className="p-0">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No transactions logged yet.</p>
                  <p className="text-xs mt-1">Click "Log Transaction" to add your first entry.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-black/10">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Taxable</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {filteredTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-mono text-muted-foreground">{tx.date}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-foreground">{tx.description}</div>
                            {tx.notes && <div className="text-[10px] text-muted-foreground">{tx.notes}</div>}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{tx.category}</td>
                          <td className="py-3 px-4">
                            <Badge className={tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                              {tx.type === 'income' ? '↑ Income' : '↓ Expense'}
                            </Badge>
                          </td>
                          <td className={`py-3 px-4 text-right font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {tx.taxable ? (
                              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px]">Yes</Badge>
                            ) : (
                              <span className="text-muted-foreground text-[10px]">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleDelete(tx.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== ADD TRANSACTION MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-lg bg-card border-white/10 rounded-2xl shadow-2xl my-8 relative">
            <button onClick={() => setShowForm(false)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold tracking-wider text-cyan-400 uppercase">Log Transaction</CardTitle>
              <CardDescription className="text-xs">Record income or an expense for your books.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Income / Expense Toggle */}
                <div className="flex gap-2">
                  <Button type="button" variant={formType === 'income' ? 'default' : 'outline'}
                    onClick={() => { setFormType('income'); setFormCategory('Vehicle Wrap'); }}
                    className={`flex-1 rounded-xl text-xs font-bold ${formType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-white/10'}`}>
                    ↑ Income
                  </Button>
                  <Button type="button" variant={formType === 'expense' ? 'default' : 'outline'}
                    onClick={() => { setFormType('expense'); setFormCategory('Vinyl & Wrap Film'); }}
                    className={`flex-1 rounded-xl text-xs font-bold ${formType === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'border-white/10'}`}>
                    ↓ Expense
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Amount ($)</Label>
                    <Input type="number" step="0.01" min="0" value={formAmount} onChange={e => setFormAmount(e.target.value)}
                      placeholder="0.00" className="bg-black/40 border-white/10 rounded-xl" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Input value={formDesc} onChange={e => setFormDesc(e.target.value)}
                    placeholder={formType === 'income' ? 'e.g., Ford F-150 Full Wrap — John D.' : 'e.g., 3M 2080 Vinyl Roll Purchase'}
                    className="bg-black/40 border-white/10 rounded-xl" required />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-pink-500">
                    {(formType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                      <option key={c} value={c} className="bg-card">{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <input type="checkbox" id="taxable" checked={formTaxable} onChange={e => setFormTaxable(e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-black/40 text-amber-500" />
                  <label htmlFor="taxable" className="text-xs text-foreground cursor-pointer">
                    <span className="font-bold">Taxable</span>
                    <span className="text-muted-foreground ml-1">— Include in Oklahoma sales tax calculation</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
                  <Input value={formNotes} onChange={e => setFormNotes(e.target.value)}
                    placeholder="e.g., Paid by check #1042, Invoice INV-2026-001"
                    className="bg-black/40 border-white/10 rounded-xl" />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl text-xs border-white/10">Cancel</Button>
                  <Button type="submit" className={`rounded-xl text-xs font-bold px-6 ${formType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white`}>
                    Log {formType === 'income' ? 'Income' : 'Expense'}
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
