export interface DailyGospel {
  reference: string;
  content: string;
  assignedDate: string;
}

export interface GospelApiResponse {
  status?: string;
  message?: string;
  data?: {
    reference?: string;
    content?: string;
    assigned_date?: string;
  };
}
