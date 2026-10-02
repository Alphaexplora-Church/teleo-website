import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { DiscipleshipProcessChurchListConfig } from "../types/discipleshipProcessChurchList.types";

export const discipleshipProcessChurchListConst: DiscipleshipProcessChurchListConfig = {
  buttonBack: {
    icon: ChevronLeft,
    label: "Back",
    to: "/discipleship",
  },
  searchBar: {
    icon: Search,
    clearIcon: X,
    placeHolder: "Search church name or city...",
  },
  icons: {
    chevronRight: ChevronRight,
  },
  homeChurchHeader: "YOUR HOME CHURCH",
  allChurchesHeader: "EXPLORE OTHER CHURCHES",
  homeBadgeLabel: "Home Church",
  applicationPendingBadgeLabel: "Pending Application",
  activeGroupsSuffix: "active groups",
  availableSuffix: "Available",
  noResultsMessage: "No churches found matching your search.",
};
