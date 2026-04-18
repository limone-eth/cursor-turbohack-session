import {
  DIGESTION_BY_COLOR,
  ENVIRONMENT_BY_COLOR,
  MOTIVATION_BY_COLOR,
  VIEW_BY_COLOR,
} from "@/lib/bg5/mappings";
import {
  digestionNarrative,
  environmentNarrative,
  motivationNarrative,
  traitStarters,
  viewNarrative,
} from "@/lib/bg5/copybook";
import { motivationWorkHints, oc16TeamHints, viewWorkHints } from "@/lib/bg5/language";
import { bg5Friendly } from "@/lib/bg5/terminology";
import type { MemberReport, ReportMode, TeamMemberInput, TeamReport } from "@/lib/bg5/types";
import {
  findDesignJulianDayUt,
  getSweph,
  oppositeLongitude,
  sunLongitudeUt,
  trueNodeLongitudeUt,
  utcPartsToJulianDayUt,
  zonedDateTimeToUtcParts,
} from "@/lib/ephemeris/chart";
import { pickSideFromTone, substructureFromEclipticLongitude } from "@/lib/hd/substructure";

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

function pick<T>(arr: T[], seed: number, count: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(arr[(seed + i * 7) % arr.length]);
  }
  return [...new Set(out)];
}

function pickSideLabel(side: "left" | "right"): string {
  return side === "left" ? "Focused / active orientation" : "Peripheral / receptive orientation";
}

export async function buildMemberReport(
  input: TeamMemberInput,
  reportMode: ReportMode,
): Promise<MemberReport> {
  const signature = hashString(
    `${input.name}|${input.role ?? ""}|${input.birthDate}|${input.birthTime}|${input.birthPlace}`,
  );

  if (!input.timezone || typeof input.latitude !== "number" || typeof input.longitude !== "number") {
    throw new Error("Missing geocoding data: timezone/lat/lon required for precise chart calculation.");
  }

  const swe = await getSweph();
  const utcParts = zonedDateTimeToUtcParts(input.timezone, input.birthDate, input.birthTime);
  const birthJd = utcPartsToJulianDayUt(swe, utcParts);
  const designJd = findDesignJulianDayUt(swe, birthJd);

  const personalitySunLon = sunLongitudeUt(swe, birthJd);
  const designSunLon = sunLongitudeUt(swe, designJd);
  const personalityNorthLon = trueNodeLongitudeUt(swe, birthJd);
  const personalitySouthLon = oppositeLongitude(personalityNorthLon);
  const designNorthLon = trueNodeLongitudeUt(swe, designJd);
  const designSouthLon = oppositeLongitude(designNorthLon);

  const motivationSub = substructureFromEclipticLongitude(personalitySunLon);
  const viewSub = substructureFromEclipticLongitude(personalityNorthLon);
  const digestionSub = substructureFromEclipticLongitude(designSunLon);
  const environmentSub = substructureFromEclipticLongitude(designNorthLon);

  const motivationSide = pickSideFromTone(motivationSub.tone);
  const viewSide = pickSideFromTone(viewSub.tone);
  const digestionSide = pickSideFromTone(digestionSub.tone);
  const environmentSide = pickSideFromTone(environmentSub.tone);

  const motivationAxis = MOTIVATION_BY_COLOR[motivationSub.color];
  const viewAxis = VIEW_BY_COLOR[viewSub.color];
  const digestionAxis = DIGESTION_BY_COLOR[digestionSub.color];
  const environmentAxis = ENVIRONMENT_BY_COLOR[environmentSub.color];

  const motivationValue = motivationSide === "left" ? motivationAxis.left : motivationAxis.right;
  const viewValue = viewSide === "left" ? viewAxis.left : viewAxis.right;
  const digestionValue = digestionSide === "left" ? digestionAxis.left : digestionAxis.right;
  const environmentValue = environmentSide === "left" ? environmentAxis.left : environmentAxis.right;

  const traitPool = [
    ...traitStarters({
      motivationLabel: motivationAxis.colorLabel,
      motivationSide: pickSideLabel(motivationSide),
      viewLabel: viewAxis.colorLabel,
      viewSide: pickSideLabel(viewSide),
      digestionLabel: digestionAxis.colorLabel,
      digestionSide: pickSideLabel(digestionSide),
      environmentLabel: environmentAxis.colorLabel,
      environmentSide: pickSideLabel(environmentSide),
    }),
    ...motivationWorkHints(motivationAxis.colorLabel),
    ...viewWorkHints(viewAxis.colorLabel),
    "Strong pattern recognition in team dynamics",
    "Consistent role clarity when commitments are explicit",
  ];

  const skillPool = [
    "Decision support in complexity",
    "Cross-functional collaboration",
    "Operational prioritization",
    "Stakeholder alignment",
    "Execution sequencing",
    "Communication framing",
  ];

  const generalSkillPool = [
    "Feedback integration",
    "Conflict de-escalation",
    "Meeting quality control",
    "Clear expectation setting",
    "Documentation discipline",
    "Ownership accountability",
  ];

  const frictionPool = [
    "Mismatch between pace and decision timing",
    "Overload from low-signal meetings",
    "Blurred ownership in shared tasks",
    "Different tolerance to uncertainty",
  ];

  const advancedTraits = [
    `Advanced mapping: personality motivation gate ${motivationSub.gate}, line ${motivationSub.line}; view gate ${viewSub.gate}, line ${viewSub.line}. (The plain-language blocks in the report explain what that tends to feel like at work.)`,
    `Design-side mapping: digestion gate ${digestionSub.gate}, line ${digestionSub.line}; environment gate ${environmentSub.gate}, line ${environmentSub.line}.`,
  ];

  const advancedFriction = [
    "Potential transference risk when motivation pressure overrides decision strategy.",
    "Tone mismatch can create perceived communication noise under stress.",
  ];

  return {
    input,
    signature,
    variables: {
      motivation: {
        ...motivationAxis,
        colorLabel: `${motivationSub.color} - ${motivationAxis.colorLabel}`,
        color: motivationSub.color,
        tone: motivationSub.tone,
        line: motivationSub.line,
        gate: motivationSub.gate,
        side: motivationSide,
        value: motivationValue,
      },
      view: {
        ...viewAxis,
        colorLabel: `${viewSub.color} - ${viewAxis.colorLabel}`,
        color: viewSub.color,
        tone: viewSub.tone,
        line: viewSub.line,
        gate: viewSub.gate,
        side: viewSide,
        value: viewValue,
      },
      digestion: {
        ...digestionAxis,
        colorLabel: `${digestionSub.color} - ${digestionAxis.colorLabel}`,
        color: digestionSub.color,
        tone: digestionSub.tone,
        line: digestionSub.line,
        gate: digestionSub.gate,
        side: digestionSide,
        value: digestionValue,
      },
      environment: {
        ...environmentAxis,
        colorLabel: `${environmentSub.color} - ${environmentAxis.colorLabel}`,
        color: environmentSub.color,
        tone: environmentSub.tone,
        line: environmentSub.line,
        gate: environmentSub.gate,
        side: environmentSide,
        value: environmentValue,
      },
    },
    astro: {
      birthJulianDayUt: birthJd,
      designJulianDayUt: designJd,
      personalitySunLongitude: personalitySunLon,
      designSunLongitude: designSunLon,
      personalityNorthNodeLongitude: personalityNorthLon,
      personalitySouthNodeLongitude: personalitySouthLon,
      designNorthNodeLongitude: designNorthLon,
      designSouthNodeLongitude: designSouthLon,
    },
    traits: reportMode === "advanced" ? pick([...traitPool, ...advancedTraits], signature, 6) : pick(traitPool, signature, 4),
    skills: pick(skillPool, signature + 13, 3),
    generalSkills: pick(generalSkillPool, signature + 29, 3),
    flow: bg5Friendly(
      `${motivationNarrative(motivationAxis.colorLabel, motivationValue)} ${digestionNarrative(
        digestionAxis.colorLabel,
        digestionValue,
      )}`,
    ),
    bestPractices: [
      "Use short alignment checkpoints before execution blocks.",
      `${viewNarrative(viewAxis.colorLabel, viewValue)}`,
      "Keep role boundaries explicit in collaborative tasks.",
    ].map(bg5Friendly),
    bestEnvironment: bg5Friendly(`${environmentNarrative(environmentAxis.colorLabel, environmentValue)}`),
    collaborationStyle: bg5Friendly(
      `Collaborates best through explicit agreements, visible ownership, and time-boxed feedback loops anchored in ${motivationValue.toLowerCase()} drive.`,
    ),
    possibleFrictions:
      reportMode === "advanced"
        ? pick([...frictionPool, ...advancedFriction], signature + 41, 4)
        : pick(frictionPool, signature + 41, 2),
    frictionSolutions: [
      "Define owner, deadline, and expected outcome at task kickoff.",
      "Use async updates first, then short decision meetings.",
      "Escalate blockers with options, not only problems.",
    ].map(bg5Friendly),
    calculationMethod:
      "Chart positions use a high-precision ephemeris; career variables follow BG5 / Human Design mechanics (gates, lines, tones, color).",
  };
}

export async function buildTeamReport(
  inputs: TeamMemberInput[],
  reportMode: ReportMode = "professional",
): Promise<TeamReport> {
  const members = await Promise.all(inputs.map((member) => buildMemberReport(member, reportMode)));
  const environmentLabels = [...new Set(members.map((member) => member.variables.environment.value))];
  const motivationLabels = members.map((member) => member.variables.motivation.value);
  const digestionSides = new Set(members.map((member) => member.variables.digestion.side));
  const environmentSides = new Set(members.map((member) => member.variables.environment.side));
  const oc16Hints = oc16TeamHints(members.length);

  const teamPotential = [
    "You likely have complementary angles on problems: if you assign work to match how people process, quality goes up.",
    "Fast feedback loops are possible when expectations and owners are explicit.",
    ...oc16Hints,
  ];

  const teamFrictions = [
    digestionSides.size > 1
      ? "Different work rhythms: some people need quick iteration; others need breathing room between pushes."
      : "Under tight deadlines, people with slower digestion rhythms may feel steamrolled; watch meeting density.",
    environmentSides.size > 1
      ? "Mixed workspace needs: some focus in enclosed, predictable settings; others need open, peripheral awareness."
      : "Workspace fit is fairly aligned: most friction will come from unclear roles, not the room itself.",
    motivationLabels.length > 1
      ? `Different core drives (${[...new Set(motivationLabels)].join(", ")}). If goals and rewards are fuzzy, people can pull in different directions.`
      : "Similar drives across the group: invite dissent on purpose so you do not slide into groupthink.",
  ];

  const frictionSupport = [
    digestionSides.size > 1
      ? "Alternate formats: live working session + a written recap so slower processors can catch up without another meeting."
      : "After intense weeks, add a lighter day or async catch-up so people can metabolize work at their pace.",
    environmentSides.size > 1
      ? "Offer both quiet focus blocks and open collaboration windows; label them on the calendar so people can plan."
      : "Keep role boundaries visible in shared docs so environment is not doing the emotional work of unclear ownership.",
    motivationLabels.length > 1
      ? "Publish a one-page success definition per initiative: what 'good' looks like, how wins are recognized, and who decides trade-offs."
      : "Rotate who plays 'critical friend' in reviews so healthy challenge stays normal.",
    "Use short decision meetings only after a pre-read; decisions should leave with owner, date, and next step.",
  ];

  const leverageMoves = [
    "Pair people who love momentum with people who love review during launches.",
    "Let the person with the strongest 'big picture' framing own the story deck; executors own the task board.",
    "Two-step meetings: async context first, then a tight live block for decisions only.",
  ];

  const leakAreas = [
    "Follow-ups after meetings can float with no named owner.",
    "Jumping between deep work and collaboration without boundaries drains energy.",
    "People are unsure when to escalate versus solve locally.",
    "Handoffs between planning, doing, and checking quality are implicit instead of named.",
  ];

  const leakSupport = [
    "End every meeting with a visible list: action, owner, due date, posted in one shared thread.",
    "Protect deep-work blocks on the calendar; cluster meetings so collaboration has a start and end.",
    "Write a half-page escalation guide: what counts as blocker, who to ping, expected response time.",
    "Name a 'quality checkpoint' owner for each deliverable so review does not fall through cracks.",
  ];

  if (reportMode === "advanced") {
    teamPotential.push(
      "Advanced: when tone styles differ, design meetings so each person gets the kind of signal they need (written vs verbal, fast vs slow).",
    );
    leakAreas.push(
      "Advanced: mixed collaboration styles without a simple protocol can silently slow shipping; spell out how you work together.",
    );
    leakSupport.push(
      "For mixed styles, publish a lightweight 'how we collaborate' doc: channels, response times, and decision rules.",
    );
  }

  return {
    reportMode,
    members,
    teamPotential,
    teamFrictions,
    frictionSupport,
    leverageMoves,
    leakAreas,
    leakSupport,
    bestEnvironmentMix: bg5Friendly(
      `This team stays regulated when the environment can flex across: ${environmentLabels.join(", ")}.`,
    ),
    collaborationModel: bg5Friendly(
      `Cadence that tends to work: one weekly strategy touchpoint plus async execution updates, respecting the mix of drives (${[
        ...new Set(motivationLabels),
      ].join(", ")}).`,
    ),
  };
}
