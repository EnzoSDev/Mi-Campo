export interface EconomyData {
  incomes: number;
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
