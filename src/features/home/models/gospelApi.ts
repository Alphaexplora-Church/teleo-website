import type { DailyGospel, GospelApiResponse } from './gospelTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function fetchTodaysGospel(): Promise<DailyGospel> {
  const response = await fetch(`${API_BASE_URL}/api/gospel`);
  const payload: GospelApiResponse | null = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `Failed to fetch today's Gospel (${response.status})`);
  }

  if (!payload?.data?.reference || !payload.data.content || !payload.data.assigned_date) {
    throw new Error('Invalid Gospel response from server.');
  }

  return {
    reference: payload.data.reference,
    content: payload.data.content,
    assignedDate: payload.data.assigned_date,
  };
}
