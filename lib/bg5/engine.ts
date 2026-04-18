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
    `Variable signature: Motivation ${motivationSub.gate}.${motivationSub.line} / View ${viewSub.gate}.${viewSub.line}.`,
    `Design-side signatures: Digestion ${digestionSub.gate}.${digestionSub.line}, Environment ${environmentSub.gate}.${environmentSub.line}.`,
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
      "Swiss Ephemeris (sweph-wasm) + HD gate/line/color/tone math (hdkit-compatible) + BG5 phrasing layer.",
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
    "High complementarity across perspective and execution rhythms.",
    "Strong leverage when roles are allocated by natural processing style.",
    "Good potential for fast feedback and learning loops.",
    ...oc16Hints,
  ];

  const teamFrictions = [
    digestionSides.size > 1
      ? "Different work-processing rhythms: some teammates need fast iteration loops, others need recovery between pushes."
      : "Occasional overload when deadlines compress processing time for more sensitive digestion styles.",
    environmentSides.size > 1
      ? "Mixed environment needs: some people stabilize with enclosure and predictability, others need openness and peripheral awareness."
      : "Environment fit is relatively aligned; friction is more likely to come from role clarity than from space design.",
    motivationLabels.length > 1
      ? `Motivation diversity (${[...new Set(motivationLabels)].join(", ")}) can create tension if incentives and success metrics are vague.`
      : "Motivation style is similar across members; watch for groupthink if challenge and dissent are not welcomed.",
  ];

  const leverageMoves = [
    "Pair action-oriented members with review-oriented members during launches.",
    "Assign work packaging to members with strong contextual framing traits.",
    "Use two-phase meetings: async pre-read + focused live decision window.",
  ];

  const leakAreas = [
    "No explicit owner for post-meeting follow-ups.",
    "Context switching overhead between deep work and collaborative windows.",
    "Unclear criteria for escalation versus local resolution.",
    "Penta leak: unclear handoff between planning, execution, and quality control.",
  ];

  if (reportMode === "advanced") {
    teamPotential.push(
      "Advanced read: alignment quality improves when tone-side diversity is mapped into meeting design.",
    );
    leakAreas.push(
      "Advanced leak: mixed side-orientation without explicit collaboration protocol can degrade execution velocity.",
    );
  }

  return {
    reportMode,
    members,
    teamPotential,
    teamFrictions,
    leverageMoves,
    leakAreas,
    bestEnvironmentMix: bg5Friendly(`Team works best with hybrid zones that cover: ${environmentLabels.join(", ")}.`),
    collaborationModel: bg5Friendly(
      `Use a BG5-style collaboration cadence: weekly strategic sync + asynchronous daily execution, while honoring motivation mix (${[
        ...new Set(motivationLabels),
      ].join(", ")}).`,
    ),
  };
}
