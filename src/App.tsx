import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Expense, Category, ExpenseStatus } from './types';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { LayoutDashboard, ListTodo, Sparkles, Github, Wallet, Download, Upload, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { isAfter, isBefore, addDays, parseISO, format } from 'date-fns';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('smart-cost-expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    const saved = localStorage.getItem('smart-cost-income');
    return saved ? parseFloat(saved) : 0;
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('smart-cost-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('smart-cost-income', monthlyIncome.toString());
  }, [monthlyIncome]);

  const addExpense = (newExp: { description: string; amount: number; category: Category; date: string; status: ExpenseStatus }) => {
    const expense: Expense = {
      ...newExp,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const toggleStatus = (id: string) => {
    setExpenses((prev) => prev.map(exp => 
      exp.id === id ? { ...exp, status: exp.status === 'pago' ? 'pendente' : 'pago' } : exp
    ));
  };

  const importData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.expenses) setExpenses(data.expenses);
        if (data.monthlyIncome) setMonthlyIncome(data.monthlyIncome);
        alert('Dados importados com sucesso!');
      } catch (err) {
        alert('Erro ao importar arquivo. Verifique se o formato está correto.');
      }
    };
    reader.readAsText(file);
  };

  const exportData = () => {
    const data = {
      expenses,
      monthlyIncome,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartcost-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const upcomingBills = expenses.filter(e => {
    if (e.status === 'pago') return false;
    const dueDate = parseISO(e.date);
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return isBefore(dueDate, nextWeek);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SmartCost</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Planilha Inteligente</p>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'list' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ListTodo size={16} />
              <span className="hidden sm:inline">Despesas</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={importData} 
              className="hidden" 
              accept=".json"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              title="Importar Backup"
            >
              <Upload size={18} />
            </button>
            <button 
              onClick={exportData}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              title="Exportar Backup (Salvar)"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Alerts / Reminders */}
        {upcomingBills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3"
          >
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">Lembrete de Contas Próximas</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {upcomingBills.map(bill => (
                  <div key={bill.id} className="bg-white/50 border border-amber-100 px-3 py-1 rounded-lg text-xs font-medium text-amber-800">
                    {bill.description} - {format(parseISO(bill.date), 'dd/MM')} (R$ {bill.amount.toLocaleString('pt-BR')})
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('list')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest"
            >
              Ver Todas
            </button>
          </motion.div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ExpenseForm onAdd={addExpense} />
          </div>
          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Wallet size={20} />
                </div>
                <h2 className="text-lg font-semibold">Salário Mensal</h2>
              </div>
              <p className="text-sm text-slate-500 mb-4">Defina sua renda mensal para calcular quanto sobra no final do mês.</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                <input
                  type="number"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-lg"
                />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Saldo Previsto</p>
                  <p className={cn(
                    "text-xl font-bold",
                    (monthlyIncome - expenses.reduce((s, e) => s + e.amount, 0)) >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    R$ {(monthlyIncome - expenses.reduce((s, e) => s + e.amount, 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Status</p>
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter",
                    (monthlyIncome - expenses.reduce((s, e) => s + e.amount, 0)) >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>
                    {(monthlyIncome - expenses.reduce((s, e) => s + e.amount, 0)) >= 0 ? "No Azul" : "No Vermelho"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' ? (
              <Dashboard expenses={expenses} monthlyIncome={monthlyIncome} />
            ) : (
              <div className="max-w-5xl mx-auto">
                <ExpenseList expenses={expenses} onDelete={deleteExpense} onToggleStatus={toggleStatus} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles size={16} />
            <span className="text-sm font-medium">SmartCost &copy; 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Privacidade</a>
            <a href="#" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Termos</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
