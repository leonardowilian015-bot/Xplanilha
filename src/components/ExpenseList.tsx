import { Trash2, Calendar, Tag, Layers, List, CheckCircle2, Clock } from 'lucide-react';
import { Expense, CATEGORY_COLORS, CATEGORIES } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete, onToggleStatus }: ExpenseListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedExpenses = CATEGORIES.reduce((acc, cat) => {
    const catExpenses = expenses.filter(e => e.category === cat);
    if (catExpenses.length > 0) {
      acc[cat] = catExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Suas Despesas</h2>
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewMode('grouped')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grouped' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            <Layers size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Histórico Completo</h2>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              {expenses.length} itens
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Valor</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {sortedExpenses.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                        Nenhuma despesa registrada ainda.
                      </td>
                    </motion.tr>
                  ) : (
                    sortedExpenses.map((expense) => (
                      <motion.tr
                        key={expense.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-sm font-medium">
                              {format(parseISO(expense.date), 'dd MMM', { locale: ptBR })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-800">{expense.description}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                            />
                            <span className="text-xs font-medium text-slate-600">{expense.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-bold text-slate-900">
                            R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => onDelete(expense.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedExpenses).map(([category, items]) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center" style={{ borderLeft: `4px solid ${CATEGORY_COLORS[category as any]}` }}>
                <h3 className="font-bold text-slate-800">{category}</h3>
                <span className="text-sm font-bold text-slate-900">
                  R$ {items.reduce((s, i) => s + i.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="p-3 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.description}</p>
                      <p className="text-[10px] text-slate-400">{format(parseISO(item.date), 'dd/MM/yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleStatus(item.id)}
                        className={cn(
                          "p-1 rounded transition-colors",
                          item.status === 'pago' ? "text-emerald-500" : "text-amber-500"
                        )}
                      >
                        {item.status === 'pago' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      </button>
                      <span className="text-sm font-bold text-slate-700">R$ {item.amount.toLocaleString('pt-BR')}</span>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          {Object.keys(groupedExpenses).length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 italic">
              Nenhuma despesa para agrupar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
