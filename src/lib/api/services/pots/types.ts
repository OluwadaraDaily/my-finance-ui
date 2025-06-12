export interface CreatePot {
  name: string;
  description?: string;
  target_amount: number;
  color?: string;
}

export interface Pot {
  id: number;
  saved_amount: number;
  name: string;
  description?: string;
  target_amount: number;
  color?: string;
  
}

export interface UpdatePot {
  name?: string;
  description?: string;
  target_amount?: number;
  color?: string;
  saved_amount?: number;
}

export interface PotSummary {
  total_saved_amount: number;
  total_target_amount: number;
  average_progress: number;
  pots: Pot[];
}