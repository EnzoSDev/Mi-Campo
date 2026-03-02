export interface EconomyData {
  income: number;
  expenses: number;
  incomesData: Transaction[];
  expensesData: Transaction[];
}

export interface Transaction {
  concept: string;
  amount: number;
  date: Date;
  notes: string;
}
