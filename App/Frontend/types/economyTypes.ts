export interface EconomyData {
  incomes: number;
  expenses: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  type: "income" | "expense";
  fieldName: string;
  lotName: string;
  campaignName: string;
  concept: string;
  category: string;
  amount: number;
  date: Date;
  notes: string;
}
