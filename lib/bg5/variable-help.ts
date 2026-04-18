import type { VariableDetail } from "@/lib/bg5/types";

const MOTIVATION: Record<string, string> = {
  Fear:
    "This is about how pressure and risk shape their drive. They often stay sharp by naming what could go wrong and protecting what matters.",
  Hope:
    "This is a forward-looking drive: meaning and possibility pull them forward. They need a credible story of why this matters to stay engaged.",
  Desire:
    "This is momentum and appetite for progress. Once the value feels real, they push hard; clear priorities keep that energy focused.",
  Need:
    "This is about prerequisites and support. They move best when basics (time, resources, clarity) are in place before speed increases.",
  Guilt:
    "This is standards and responsibility. They notice when quality or fairness slips; explicit, fair expectations help them contribute without burning out.",
  Innocence:
    "This is clarity and straight facts over office politics. They do better with straightforward information and space to think without constant performance pressure.",
};

const VIEW: Record<string, string> = {
  Survival:
    "This is how they scan a situation: continuity, delivery risk, and what keeps the lights on. They need practical context before committing.",
  Possibility:
    "This is options and 'what else could we do?' They open paths when the team is stuck; give exploration time before you force a single answer.",
  Power:
    "This is leverage: who decides, who can move what. They help when ownership is fuzzy; pair them with clear decision rights.",
  Wanting:
    "This is incentives and honest wants. They surface misaligned asks; help them turn desires into concrete, doable requests.",
  Probability:
    "This is likelihood and assumptions. They reduce drama by making guesses explicit and comparing scenarios.",
  Personal:
    "This is people impact: trust, morale, boundaries. Decisions feel better to them when the human side is spoken about openly.",
};

const DIGESTION: Record<string, string> = {
  Appetite:
    "This is work rhythm: how tasks and pressure land. Some need steady, consecutive focus; others alternate intensity and recovery.",
  Taste:
    "This is how they take in information and stimulus (open vs closed channels). Too much noise or the wrong pacing wears them down.",
  Thirst:
    "This is processing temperature: fast/hot vs cool/slow. Match meeting length and interruption style to how they metabolize work.",
  Touch:
    "This is nervous-system pacing during work (calm vs wired). Sudden overload or chaotic context hits harder for some variants.",
  Sound:
    "This is auditory and communication load. Loud, overlapping voices or constant pings can drain them faster than others.",
  Light:
    "This is visual and environmental stimulation (bright/direct vs softer/indirect spaces) and how long they can focus.",
};

const ENVIRONMENT: Record<string, string> = {
  Caves:
    "Physical and social container: selective vs blending spaces. Some need enclosed focus; others need to blend with the room.",
  Markets:
    "Buzz and exchange of a market feel: internal hub vs outward-facing energy. Match desk and meeting layout to this.",
  Kitchens:
    "Collaborative, hands-on energy: wet (fluid, many handoffs) vs dry (cleaner boundaries between roles).",
  Mountains:
    "Elevation and visibility: active presence vs more passive observation from a distance.",
  Valleys:
    "Breadth of view: narrow focus corridors vs wide, panoramic awareness of what is around the team.",
  Shores:
    "Edge between stability and change: natural flow vs more structured, built transitions.",
};

export function explainVariable(
  kind: "motivation" | "view" | "digestion" | "environment",
  detail: VariableDetail,
): { headline: string; meaning: string; inPractice: string } {
  const map =
    kind === "motivation"
      ? MOTIVATION
      : kind === "view"
        ? VIEW
        : kind === "digestion"
          ? DIGESTION
          : ENVIRONMENT;
  const theme = detail.colorLabel.replace(/^\d+\s*-\s*/, "").trim();
  const meaning =
    map[theme] ??
    "This color describes a style of working together; the label is shorthand from BG5 / Human Design career mechanics.";
  const headline =
    kind === "motivation"
      ? "Motivation - what consistently energizes them at work"
      : kind === "view"
        ? "View - what they notice first in a problem or plan"
        : kind === "digestion"
          ? "Digestion - how work pace and stimulation land in their system"
          : "Environment - the kind of space and social field that stabilizes focus";
  const inPractice = `Their current leaning on this axis is "${detail.value}" (one of two poles within the ${theme} theme).`;
  return { headline, meaning, inPractice };
}
