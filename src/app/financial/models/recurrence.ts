export interface Recurrence {
  id: string;
  store_id: string;
  type: 'PAYABLE' | 'RECEIVABLE' | 'TRANSFER';
  description: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  status: 'active' | 'paused' | 'finished';
  start_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  day_of_month: number;
  party_id?: string;
  category_id?: string;
  cost_center_id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Optional relational data for display
  party_data?: { name: string };
  category_data?: { name: string };
  cost_center_data?: { name: string };
}
