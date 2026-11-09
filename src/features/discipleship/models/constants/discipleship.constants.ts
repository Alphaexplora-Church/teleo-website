// src/features/discipleship/models/constants/discipleship.constants.ts
// Consolidated constants and default fallback data for the Discipleship feature.

import { Church, ArrowRight, ChevronRight, User, Calendar, BookOpen, Clock, MapPin, Video } from "lucide-react";
import type { DiscipleshipDashboardData, DiscipleshipIntakeQuestion } from "../types/discipleship.types";

export const EMPTY_DASHBOARD_DATA: DiscipleshipDashboardData = {
  applications: [],
  groups: [],
};

export const DEFAULT_INTAKE_QUESTIONS: DiscipleshipIntakeQuestion[] = [
  {
    id: "q-faith-journey",
    label: "Briefly describe where you are in your faith journey.",
    placeholder: "I've been attending church for a few months and want to grow deeper in faith...",
    field_type: "textarea",
    required: true,
    min_length: 10,
    max_length: 500,
  },
  {
    id: "q-expectations",
    label: "What are your hopes or expectations for this discipleship group?",
    placeholder: "I want to build accountability and study God's Word together with fellow believers...",
    field_type: "textarea",
    required: true,
    min_length: 10,
    max_length: 500,
  },
];

export const DISCIPLESHIP_ICONS = {
  church: Church,
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,
  user: User,
  calendar: Calendar,
  bookOpen: BookOpen,
  clock: Clock,
  mapPin: MapPin,
  video: Video,
};

