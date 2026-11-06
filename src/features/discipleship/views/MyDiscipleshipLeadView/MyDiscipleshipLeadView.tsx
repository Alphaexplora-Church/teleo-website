// src/features/discipleship/views/MyDiscipleshipLeadView/MyDiscipleshipLeadView.tsx
import { useState } from "react";
import { MyDiscipleshipGroupsLeadDashboardView } from "./MyDiscipleshipGroupsLead/MyDiscipleshipGroupsLeadDashboardView";
import { MyDiscipleshipGroupsLeadCardView } from "./MyDiscipleshipGroupsLead/MyDiscipleshipGroupsLeadCardView";
import type {
  ChurchLeadGroupData,
  LeadGroupItem,
} from "../../components/groups/ChurchLeadGroupSection";

const EMPTY_SECTIONS: ChurchLeadGroupData[] = [];

export interface MyDiscipleshipLeadViewProps {
  churchSections?: ChurchLeadGroupData[];
  onManageGroup?: (groupId: string, group: LeadGroupItem) => void;
  className?: string;
}

export function MyDiscipleshipLeadView({
  churchSections = EMPTY_SECTIONS,
  onManageGroup,
  className = "",
}: MyDiscipleshipLeadViewProps = {}) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleManageGroup = (groupId: string, group: LeadGroupItem) => {
    if (onManageGroup) {
      onManageGroup(groupId, group);
    } else {
      setSelectedGroupId(groupId);
    }
  };

  return (
    <div className={`w-full ${className}`.trim()}>
      {selectedGroupId ? (
        <MyDiscipleshipGroupsLeadCardView
          groupId={selectedGroupId}
          onBack={() => setSelectedGroupId(null)}
        />
      ) : (
        <MyDiscipleshipGroupsLeadDashboardView
          churchSections={churchSections}
          onManageGroup={handleManageGroup}
        />
      )}
    </div>
  );
}

export default MyDiscipleshipLeadView;
