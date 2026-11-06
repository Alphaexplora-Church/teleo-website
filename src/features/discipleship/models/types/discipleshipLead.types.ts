// src/features/discipleship/models/types/discipleshipLead.types.ts
// Core domain types for Discipler / Leader Discipleship views

export type LeadGroupStatus = "Active" | "Paused";
export type MemberStatus = "Active" | "Paused";

export interface GroupMemberItem {
  id: string;
  name: string;
  initials?: string;
  avatar_url?: string;
  joined_date: string;
  note?: string;
  status: MemberStatus;
}

export interface NextGatheringData {
  timing?: string;
  subtitle?: string;
  location?: string;
  virtual_link?: string;
  gathering_type?: string;
}

export interface CurrentStudyData {
  module_badge?: string;
  title?: string;
}

export interface JourneyStudyModule {
  id: string;
  module_badge: string;
  module_number?: number;
  title: string;
  description: string;
  sessions?: string;
  image_url?: string;
}

export interface LeadGroupItem {
  id: string;
  name: string;
  church_name?: string;
  leader_name?: string;
  members_count: number;
  max_members?: number;
  role?: string;
  next_gathering_preview: string;
  status: LeadGroupStatus;
  next_gathering?: NextGatheringData | null;
  current_study?: CurrentStudyData;
  members: GroupMemberItem[];
}

export interface ChurchLeadGroupData {
  church_id: number;
  church_name: string;
  groups_count: number;
  groups: LeadGroupItem[];
}
