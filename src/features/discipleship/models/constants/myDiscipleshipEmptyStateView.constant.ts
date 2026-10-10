import type { LucideIcon } from "lucide-react";
import { Church, ArrowRight, ChevronRight } from "lucide-react";

import type {
  MyDiscipleshipEmptyStateListPropsConfig,
  MyDiscipleshipEmptyStateProps,
} from "../types/myDiscipleshipEmptyStateView.types";

export const MY_DISCIPLESHIP_EMPTY_STATE_VIEW_ICONS: Record<string, LucideIcon> = {
  church: Church,
  joinArrow: ArrowRight,
  moreChevron: ChevronRight,
};

export const myDiscipleshipEmptyStateConst: MyDiscipleshipEmptyStateProps = {
  icon: MY_DISCIPLESHIP_EMPTY_STATE_VIEW_ICONS.church,
  titleHeader: "Groups",
  joinCard: {
    title: "You're not part of a Discipleship yet",
    description:
      "Connect with a local group to grow in faith, accountability, and community with fellow believers.",
    buttonJoin: {
      to: "/discipleship/church-list",
      icon: MY_DISCIPLESHIP_EMPTY_STATE_VIEW_ICONS.joinArrow,
      label: "Join a Discipleship",
    },
  },
};

export const myDiscipleshipEmptyStateListConst: MyDiscipleshipEmptyStateListPropsConfig =
{
  homeChurchHeader: "Your Home Church",
  exploreOtherHeader: "Explore Other Churches",
  noChurchesCallout: "No churches found",
  homeChurchBadgeLabel: "Home Church",
  activeGroupsLabel: "active groups",
  buttonMore: {
    label: "More Churches",
    to: "/discipleship/church-list",
    variant: "outline",
    icon: MY_DISCIPLESHIP_EMPTY_STATE_VIEW_ICONS.moreChevron,
  },
  maxDisplayedChurches: 3,
};
