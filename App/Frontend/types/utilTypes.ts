export interface RecentActivity {
  type: string;
  description: string;
  date: Date;
}

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  url: string;
  image?: string;
  source_name?: string;
  published_at?: string;
}
