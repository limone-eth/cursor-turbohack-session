import { bg5Friendly } from "@/lib/bg5/terminology";

const MOTIVATION_HINTS: Record<string, string[]> = {
  Fear: [
    "Names risks early, which helps teams avoid blind spots.",
    "Prefers clarity on consequences before committing resources.",
  ],
  Hope: [
    "Keeps long-term direction visible when short-term noise spikes.",
    "Benefits from explicit milestones so optimism stays grounded.",
  ],
  Desire: [
    "Pushes for momentum once the value proposition feels real.",
    "Needs crisp prioritization so desire energy does not scatter.",
  ],
  Need: [
    "Asks for the minimum viable support structure before going fast.",
    "Stabilizes teams by clarifying dependencies and prerequisites.",
  ],
  Guilt: [
    "Notices when standards slip; can help teams recover quality.",
    "Works best when expectations are explicit and fair.",
  ],
  Innocence: [
    "Can simplify complex politics by focusing on clean facts.",
    "Benefits from protected time to think without performance pressure.",
  ],
};

const VIEW_HINTS: Record<string, string[]> = {
  Survival: ["Notices threats to delivery and continuity quickly.", "Prefers pragmatic plans with buffers."],
  Possibility: ["Generates options when the team feels stuck.", "Needs space to explore before narrowing."],
  Power: ["Clarifies leverage points and who can decide.", "Can push for accountability when ownership blurs."],
  Wanting: ["Surfaces missing incentives and misaligned asks.", "Helps translate wants into workable requests."],
  Probability: ["Weights scenarios and likelihoods in decisions.", "Reduces drama by making assumptions explicit."],
  Personal: ["Humanizes decisions; notices morale and trust impacts.", "Benefits from candid conversation about boundaries."],
};

export function motivationWorkHints(colorLabel: string): string[] {
  const key = colorLabel;
  return (MOTIVATION_HINTS[key] ?? []).map(bg5Friendly);
}

export function viewWorkHints(colorLabel: string): string[] {
  const key = colorLabel;
  return (VIEW_HINTS[key] ?? []).map(bg5Friendly);
}

export function oc16TeamHints(teamSize: number): string[] {
  if (teamSize <= 5) {
    return [
      bg5Friendly(
        "In a 3-5 person team, name who owns what and who closes each loop; small groups fail quietly when handoffs are fuzzy.",
      ),
      bg5Friendly(
        "Weekly, scan for missing owners, unclear authority, and fuzzy sequencing; these drain trust faster than hard skills gaps.",
      ),
    ];
  }

  return [
    bg5Friendly(
      "In larger groups, hierarchy, power dynamics, and coordination cost usually matter more than individual talent; design for that explicitly.",
    ),
  ];
}
