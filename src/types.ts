export type Category = 'Alimentação' | 'Transporte' | 'Moradia' | 'Lazer' | 'Outros';
export type ExpenseStatus = 'pago' | 'pendente';

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  status: ExpenseStatus;
}

export const CATEGORIES: Category[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Outros',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Alimentação': '#10b981', // Emerald-500
  'Transporte': '#3b82f6', // Blue-500
  'Moradia': '#f59e0b',    // Amber-500
  'Lazer': '#8b5cf6',      // Violet-500
  'Outros': '#64748b',     // Slate-500
};

export const AUTO_CATEGORIZATION_RULES: Record<string, Category> = {
  'supermercado': 'Alimentação',
  'pão de açúcar': 'Alimentação',
  'carrefour': 'Alimentação',
  'extra': 'Alimentação',
  'restaurante': 'Alimentação',
  'ifood': 'Alimentação',
  'uber': 'Transporte',
  '99app': 'Transporte',
  'combustível': 'Transporte',
  'posto': 'Transporte',
  'aluguel': 'Moradia',
  'condomínio': 'Moradia',
  'luz': 'Moradia',
  'água': 'Moradia',
  'internet': 'Moradia',
  'cinema': 'Lazer',
  'netflix': 'Lazer',
  'spotify': 'Lazer',
  'viagem': 'Lazer',
  'shopping': 'Lazer',
};
