import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { DiscipleshipProcessChurchListConfig } from "../types/discipleshipProcessChurchList.types";

export const DISCIPLESHIP_PROCESS_CHURCH_LIST_ICONS: Record<string, LucideIcon> = {
  back: ChevronLeft,
  chevronRight: ChevronRight,
  search: Search,
  clear: X,
};

export const discipleshipProcessChurchListConst: DiscipleshipProcessChurchListConfig = {
  buttonBack: {
    icon: DISCIPLESHIP_PROCESS_CHURCH_LIST_ICONS.back,
    label: "Back",
    to: "/discipleship",
  },
  searchBar: {
    icon: DISCIPLESHIP_PROCESS_CHURCH_LIST_ICONS.search,
    clearIcon: DISCIPLESHIP_PROCESS_CHURCH_LIST_ICONS.clear,
    placeHolder: "Search church name or city...",
  },
  icons: {
    chevronRight: DISCIPLESHIP_PROCESS_CHURCH_LIST_ICONS.chevronRight,
  },
  homeChurchHeader: "YOUR HOME CHURCH",
  allChurchesHeader: "EXPLORE OTHER CHURCHES",
  homeBadgeLabel: "Home Church",
  applicationPendingBadgeLabel: "Pending Application",
  activeGroupsSuffix: "active groups",
  availableSuffix: "Available",
  noResultsMessage: "No churches found matching your search.",
};
