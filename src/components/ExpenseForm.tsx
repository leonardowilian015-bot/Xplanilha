import React, { useState, useEffect } from 'react';
import { Plus, Search, Tag, CheckCircle2, Clock } from 'lucide-react';
import { Category, CATEGORIES, AUTO_CATEGORIZATION_RULES, ExpenseStatus } from '../types';
import { cn } from '../lib/utils';

interface ExpenseFormProps {
  onAdd: (expense: { description: string; amount: number; category: Category; date: string; status: ExpenseStatus }) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Outros');
  const [status, setStatus] = useState<ExpenseStatus>('pago');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Auto-categorization logic
  useEffect(() => {
    const desc = description.toLowerCase();
    for (const [keyword, cat] of Object.entries(AUTO_CATEGORIZATION_RULES)) {
      if (desc.includes(keyword)) {
        setCategory(cat);
        break;
      }
    }
  }, [description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      category,
      date,
      status,
    });

    setDescription('');
    setAmount('');
    setCategory('Outros');
    setStatus('pago');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Plus size={20} />
          </div>
          <h2 className="text-lg font-semibold">Nova Despesa / Conta</h2>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setStatus('pago')}
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all",
              status === 'pago' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
            )}
          >
            <CheckCircle2 size={14} /> PAGO
          </button>
          <button
            type="button"
            onClick={() => setStatus('pendente')}
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all",
              status === 'pendente' ? "bg-white text-amber-600 shadow-sm" : "text-slate-400"
            )}
          >
            <Clock size={14} /> PENDENTE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Descrição</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado Pão de Açúcar"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Categoria</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
      >
        Adicionar Despesa
      </button>
    </form>
  );
}
