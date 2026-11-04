import { Church, ArrowRight } from "lucide-react";
import type { DiscipleshipUserGuestViewConfig } from "../types/discipleshipUserGuestView.types";

export const DISCIPLESHIP_USER_GUEST_VIEW_ICONS = {
  church: Church,
  arrowRight: ArrowRight,
};

export const discipleshipUserGuestViewConst: DiscipleshipUserGuestViewConfig = {
  joinCard: {
    icon: DISCIPLESHIP_USER_GUEST_VIEW_ICONS.church,
    title: "You're not part of a Discipleship yet",
    description:
      "Connect with a local group to grow in faith, accountability, and community with fellow believers.",
    buttonJoin: {
      to: "/welcome",
      label: "Join a Discipleship",
      icon: DISCIPLESHIP_USER_GUEST_VIEW_ICONS.arrowRight,
      variant: "primary",
    },
  },
  churchList: {
    homeChurchHeader: "Your Home Church",
    exploreOtherHeader: "Explore Other Churches",
  },
};
