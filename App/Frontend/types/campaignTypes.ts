export interface CampaignType {
  id: number;
  campaignName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  status?: string;
}

export interface SowingType {
  id?: number;
  campaignId: number;
  cropType: string;
  variety: string;
  sowingDate: Date;
  density: number;
  rowSpacing: number;
  method: string;
  notes: string | null;
}

export interface FertilizationType {
  id?: number;
  campaignId: number;
  productName: string;
  dose: number;
  dateApplied: Date;
  method: string;
  notes: string | null;
}

export interface SprayingType {
  id?: number;
  campaignId: number;
  productName: string;
  dose: number;
  dateApplied: Date;
  target: string;
  method: string;
  notes: string | null;
}

export interface HarvestType {
  id?: number;
  campaignId: number;
  harvestDate: Date;
  totalYieldKg: number;
  moisturePercentage: number;
  notes: string | null;
}

export interface ObservationType {
  id?: number;
  campaignId: number;
  observationDate: Date;
  note: string;
}
