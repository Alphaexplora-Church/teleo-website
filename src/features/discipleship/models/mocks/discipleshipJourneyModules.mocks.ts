// src/features/discipleship/models/mocks/discipleshipJourneyModules.mocks.ts

export interface JourneyStudyModule {
  id: string;
  module_badge: string; // e.g. "Module 1"
  module_number?: number;
  title: string; // e.g. "Gospel of Mark: The Servant King"
  description: string; // summary or notes
  sessions?: string; // e.g. "10 sessions"
  image_url?: string;
}

export const mockDiscipleshipJourneyModules: JourneyStudyModule[] = [
  {
    id: "mod-001",
    module_number: 1,
    module_badge: "Module 1",
    title: "Gospel of Mark: The Servant King",
    sessions: "10 sessions",
    description:
      "A fast-paced journey through the servant ministry and sacrifice of Jesus Christ.",
  },
  {
    id: "mod-002",
    module_number: 2,
    module_badge: "Module 2",
    title: "Romans 8: Life in the Spirit",
    sessions: "8 sessions",
    description:
      "Deep dive into grace, victory over sin, and living free from condemnation.",
  },
  {
    id: "mod-003",
    module_number: 3,
    module_badge: "Module 3",
    title: "Ephesians: Walking in Unity",
    sessions: "6 sessions",
    description:
      "Understanding our spiritual identity, the armor of God, and church community.",
  },
  {
    id: "mod-004",
    module_number: 4,
    module_badge: "Module 4",
    title: "Sermon on the Mount",
    sessions: "7 sessions",
    description:
      "Christ's foundational teachings in Matthew 5-7 on Kingdom living and discipleship.",
  },
  {
    id: "mod-005",
    module_number: 5,
    module_badge: "Module 5",
    title: "Foundations of Discipleship",
    sessions: "8 sessions",
    description:
      "Core biblical truths, identity in Christ, and daily spiritual disciplines.",
  },
  {
    id: "mod-006",
    module_number: 6,
    module_badge: "Module 6",
    title: "Walking in Wisdom",
    sessions: "6 sessions",
    description:
      "Practical guidance from Proverbs on speech, relationships, work, and integrity.",
  },
  {
    id: "mod-007",
    module_number: 7,
    module_badge: "Module 7",
    title: "Healthy Community & Fellowship",
    sessions: "8 sessions",
    description:
      "Building Christ-centered relationships, mutual accountability, and unity.",
  },
];

export function getJourneyModuleById(
  moduleId: string,
): JourneyStudyModule | undefined {
  return mockDiscipleshipJourneyModules.find((m) => m.id === moduleId);
}

export function findModuleByTitle(
  title?: string,
): JourneyStudyModule | undefined {
  if (!title) return undefined;
  return mockDiscipleshipJourneyModules.find(
    (m) => m.title.toLowerCase() === title.toLowerCase(),
  );
}
