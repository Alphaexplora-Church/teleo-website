// src/features/discipleship/models/mocks/discipleshipJourneyModules.mocks.ts

export interface JourneyStudyModule {
  id: string;
  module_badge: string; // hal. "Module 1"
  title: string; // hal. "Foundations of Discipleship"
  description: string; // summary para sa modal list
}

export const mockDiscipleshipJourneyModules: JourneyStudyModule[] = [
  {
    id: "mod-001",
    module_badge: "Module 1",
    title: "Foundations of Discipleship",
    description:
      "Core biblical truths, identity in Christ, and daily spiritual disciplines.",
  },
  {
    id: "mod-002",
    module_badge: "Module 2",
    title: "Romans 8: Life in the Spirit",
    description:
      "Deep dive into grace, victory over sin, and living free from condemnation.",
  },
  {
    id: "mod-003",
    module_badge: "Module 3",
    title: "Walking in Wisdom",
    description:
      "Practical guidance from Proverbs on speech, relationships, work, and integrity.",
  },
  {
    id: "mod-004",
    module_badge: "Module 4",
    title: "The Gospel of Mark",
    description:
      "A fast-paced journey through the servant ministry and sacrifice of Jesus Christ.",
  },
  {
    id: "mod-005",
    module_badge: "Module 5",
    title: "Healthy Community & Fellowship",
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
