// features/services/booking/viewModels/useBookingViewModel.ts
// ViewModel for BookingView (Service Overview & Requirements).
// Dumb View components call this hook and render returned values only.

import { useMemo } from 'react';
import type { ServiceDetail } from '../models/bookingTypes';
import {
  SERVICE_DETAILS_MAP,
  DEFAULT_SERVICE_DETAIL,
} from '../models/bookingTypes';

export interface UseBookingViewModelParams {
  serviceName?: string;
  churchName?: string;
  onProceedToSchedule?: () => void;
}

export interface UseBookingViewModelReturn {
  serviceDetails: ServiceDetail;
  churchTitle: string;
  handleProceedToSchedule: () => void;
}

export const useBookingViewModel = ({
  serviceName,
  churchName,
  onProceedToSchedule,
}: UseBookingViewModelParams = {}): UseBookingViewModelReturn => {
  // Resolve service details dynamically based on selected service name
  const serviceDetails = useMemo<ServiceDetail>(() => {
    if (!serviceName) return DEFAULT_SERVICE_DETAIL;

    const normalizedKey = serviceName.trim().toLowerCase().replace(/\s+/g, '-');
    const matched = SERVICE_DETAILS_MAP[normalizedKey];

    if (matched) return matched;

    // Fallback: use default detail with custom name
    return {
      ...DEFAULT_SERVICE_DETAIL,
      id: normalizedKey,
      name: serviceName,
    };
  }, [serviceName]);

  const churchTitle = churchName || "St. Jude's Cathedral";

  const handleProceedToSchedule = () => {
    if (onProceedToSchedule) {
      onProceedToSchedule();
    }
  };

  return {
    serviceDetails,
    churchTitle,
    handleProceedToSchedule,
  };
};
