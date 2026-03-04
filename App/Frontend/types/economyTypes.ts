export interface EconomyData {
  incomes: number;
  expenses: number;
  transactions: Transaction[];
}

export interface Transaction {
  category: string;
  type: "income" | "expense";
  concept: string;
  amount: number;
  date: Date;
  notes: string;
}
