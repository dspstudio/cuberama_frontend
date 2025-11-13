'use client';
import React from 'react';
import AIInsights from './widgets/AIInsights';
import PatchNotes from './widgets/PatchNotes';
import { Inbox, Sparkles } from 'lucide-react';
import { PRICING_PLANS_EUR } from '../../constants';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

const transactions: { id: number, date: string, description: string, category: string, amount: number, status: string }[] = [
  // { id: 1, date: 'Mar 24, 2024', description: 'Starbucks Coffee', category: 'Food & Drink', amount: -5.75, status: 'Completed' },
  // { id: 2, date: 'Mar 23, 2024', description: 'Monthly Salary', category: 'Income', amount: 300.56, status: 'Completed' },
  // { id: 3, date: 'Mar 23, 2024', description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, status: 'Completed' },
  // { id: 4, date: 'Mar 22, 2024', description: 'Amazon Purchase', category: 'Shopping', amount: -45.50, status: 'Completed' },
  // { id: 5, date: 'Mar 21, 2024', description: 'Gas Station', category: 'Transport', amount: -35.20, status: 'Completed' },
  // { id: 6, date: 'Mar 20, 2024', description: 'Freelance Payment', category: 'Income', amount: 154.02, status: 'Completed' },
  // { id: 7, date: 'Mar 19, 2024', description: 'Grocery Store', category: 'Food & Drink', amount: -89.30, status: 'Completed' },
  // { id: 8, date: 'Mar 18, 2024', description: 'Pending Charge - Uber', category: 'Transport', amount: -12.45, status: 'Pending' },
];


const TransactionRow: React.FC<{ transaction: typeof transactions[0] }> = ({ transaction }) => {
  const amountColor = transaction.amount > 0 ? 'text-green-400' : 'text-slate-300';
const { user } = useAuth();

  return (
    <tr className="border-b border-white/5 last:border-b-0">
      <td className="py-4 px-6">
        <div className="font-medium text-white">{transaction.description}</div>
        <div className="text-xs text-slate-400">{transaction.category}</div>
      </td>
      <td className="py-4 px-6 text-sm text-slate-400 whitespace-nowrap">{transaction.date}</td>
      <td className={`py-4 px-6 text-sm font-semibold text-right ${amountColor}`}>
        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
      </td>
    </tr>
  );
};

const TransactionsSection: React.FC<{ transactions: typeof transactions }> = ({ transactions }) => {
  const { user } = useAuth();

  return (
    <div className="bg-[#161A25] border border-white/5 rounded-2xl flex flex-col">
      <div className="p-6 border-b border-white/5 flex-shrink-0">
          <h2 className="text-white font-semibold">Transactions</h2>
      </div>
      {transactions.length > 0 ? (
        <div className="overflow-y-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-black/10">
                        <th className="py-3 px-6 text-xs font-semibold uppercase text-slate-400 tracking-wider">Details</th>
                        <th className="py-3 px-6 text-xs font-semibold uppercase text-slate-400 tracking-wider">Date</th>
                        <th className="py-3 px-6 text-xs font-semibold uppercase text-slate-400 tracking-wider text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
                </tbody>
            </table>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <Inbox className="w-16 h-16 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">No License Yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6 max-w-xs">Once you make a transaction, it will appear here.</p>
          <Link
            href={PRICING_PLANS_EUR[1]['stripeLink'] + `&prefilled_email=${user?.email || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
          >
              <Sparkles className="h-5 w-5" />
              <span>Activate Cuberama Pro</span>
          </Link>
        </div>
      )}
    </div>
  );
};

const DashboardHome: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-grow">
        {/* Main Content: Takes 2/3 of the width */}
        <div className="xl:col-span-2">
            <AIInsights className="h-full" />
        </div>

        {/* Sidebar Widgets: Takes 1/3 of the width */}
        <div className="flex flex-col gap-8">
            <TransactionsSection transactions={transactions} />
            <PatchNotes />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
