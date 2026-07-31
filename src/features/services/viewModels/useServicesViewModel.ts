// features/services/viewModels/useServicesViewModel.ts
// ViewModel Layer — owns all state, handlers, and derived data.
// The View imports ONLY from this hook; no business logic lives in the View.

import { useState, useRef, useCallback, useMemo } from 'react';
import {
  QUICK_SERVICES,
  UPCOMING_BOOKINGS,
  AFFILIATED_CHURCHES,
} from '../models/servicesTypes';
import type {
  QuickServiceItem,
  UpcomingBooking,
  AffiliatedChurch,
} from '../models/servicesTypes';

export interface ServicesViewState {
  quickServices: QuickServiceItem[];
  quickServicePages: QuickServiceItem[][];
  upcomingBookings: UpcomingBooking[];
  affiliatedChurches: AffiliatedChurch[];
  selectedServiceId: string | null;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  activeDot: number;
  totalDots: number;
  handleScroll: () => void;
  scrollToPage: (pageIndex: number) => void;
  onSelectService: (id: string) => void;
  onViewAllBookings: () => void;
  onViewAllChurches: () => void;
  onViewChurchServices: (churchId: string) => void;
}

import type { ChurchProfileTab } from '../../profile/churchprofile/models/churchProfileTypes';

export interface ServicesViewModelProps {
  /** Injected by AppShell — triggers navigation to the SelectChurch sub-page. */
  onNavigateToSelectChurch?: (serviceName?: string) => void;
  /** Injected by AppShell — triggers navigation to Church Profile with optional active tab. */
  onNavigateToChurchProfile?: (tab?: ChurchProfileTab) => void;
}

export const useServicesViewModel = (
  props?: ServicesViewModelProps,
): ServicesViewState => {
  // Tracks the active quick-service selection for future detail routing.
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Chunk quick services into pages of 6 items (2 rows x 3 columns per page)
  const ITEMS_PER_PAGE = 6;
  const quickServicePages = useMemo(() => {
    const pages: QuickServiceItem[][] = [];
    for (let i = 0; i < QUICK_SERVICES.length; i += ITEMS_PER_PAGE) {
      pages.push(QUICK_SERVICES.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages;
  }, []);

  // Horizontal scroll tracking for paginated carousel
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<number>(0);
  const totalDots = quickServicePages.length;

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth <= 0) return;
    const currentDot = Math.round(scrollLeft / clientWidth);
    setActiveDot(currentDot);
  }, []);

  const scrollToPage = useCallback((pageIndex: number) => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: pageIndex * clientWidth, behavior: 'smooth' });
    setActiveDot(pageIndex);
  }, []);

  const onSelectService = (id: string) => {
    setSelectedServiceId(id);
    const serviceItem = QUICK_SERVICES.find((s) => s.id === id);
    const label = serviceItem ? serviceItem.label : id;
    // Navigate to SelectChurch sub-page via shell callback.
    props?.onNavigateToSelectChurch?.(label);
  };

  const onViewAllBookings = () => {
    // TODO: Navigate to full bookings list screen.
  };

  const onViewAllChurches = () => {
    // TODO: Navigate to full affiliated churches screen.
  };

  const onViewChurchServices = (_churchId: string) => {
    props?.onNavigateToChurchProfile?.('services');
  };

  return {
    quickServices: QUICK_SERVICES,
    quickServicePages,
    upcomingBookings: UPCOMING_BOOKINGS,
    affiliatedChurches: AFFILIATED_CHURCHES,
    selectedServiceId,
    scrollRef,
    activeDot,
    totalDots,
    handleScroll,
    scrollToPage,
    onSelectService,
    onViewAllBookings,
    onViewAllChurches,
    onViewChurchServices,
  };
};
