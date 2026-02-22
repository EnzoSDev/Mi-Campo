export interface CampaignType {
  id: number;
  campaignName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  status?: string;
}
