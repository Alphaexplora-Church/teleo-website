import { Church } from "lucide-react";
import { ArrowRight } from "lucide-react";

import type {
  MyDiscipleshipEmptyStateListPropsConfig,
  MyDiscipleshipEmptyStateProps,
} from "./myDiscipleshipEmptyState.types";

export const myDiscipleshipEmptyStateConst: MyDiscipleshipEmptyStateProps = {
  icon: Church,
  titleHeader: "Groups",
  joinCard: {
    title: "You're not part of a Discipleship yet",
    description:
      "Connect with a local group to grow in faith, accountability, and community with fellow believers.",
    buttonJoin: {
      to: "",
      icon: ArrowRight,
      label: "Join a Disciple",
    },
  },
};

export const myDiscipleshipEmptyStateListConst: MyDiscipleshipEmptyStateListPropsConfig = {
  homeChurchHeader: "Your Home Church",
  exploreOtherHeader: "Explore Other Churches",
  noChurchesCallout: "No churches found",
  homeChurchBadgeLabel: "Home Church",
  activeGroupsLabel: "active groups",
};
