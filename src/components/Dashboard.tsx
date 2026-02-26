import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense, CATEGORY_COLORS, Category } from '../types';
import { Wallet, TrendingUp, CreditCard, PiggyBank, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  expenses: Expense[];
  monthlyIncome: number;
}

export function Dashboard({ expenses, monthlyIncome }: DashboardProps) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidTotal = expenses.filter(e => e.status === 'pago').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingTotal = expenses.filter(e => e.status === 'pendente').reduce((sum, exp) => sum + exp.amount, 0);
  const balance = monthlyIncome - total;
  const usagePercentage = monthlyIncome > 0 ? (total / monthlyIncome) * 100 : 0;

  const categoryData = Object.keys(CATEGORY_COLORS).map((cat) => {
    const value = expenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { name: cat, value };
  }).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{payload[0].name}</p>
          <p className="text-sm font-bold text-slate-900">
            R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Income Progress */}
      {monthlyIncome > 0 && (
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Uso do Orçamento</h3>
            <span className={`text-sm font-bold ${usagePercentage > 90 ? 'text-red-500' : 'text-emerald-500'}`}>
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
              className={`h-full transition-all ${
                usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Você gastou R$ {total.toLocaleString('pt-BR')} de R$ {monthlyIncome.toLocaleString('pt-BR')}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Gasto</p>
            <p className="text-xl font-bold text-slate-900">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <PiggyBank size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saldo</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">A Pagar</p>
            <p className="text-xl font-bold text-amber-600">
              R$ {pendingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Média</p>
            <p className="text-xl font-bold text-slate-900">
              R$ {(expenses.length ? total / expenses.length : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Maior</p>
            <p className="text-xl font-bold text-slate-900">
              R$ {(expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Distribuição por Categoria</h3>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                Adicione despesas para ver o gráfico
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Gastos por Categoria</h3>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                Adicione despesas para ver o gráfico
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
