export type ReportMode = "professional" | "advanced";

export type TeamMemberInput = {
  name: string;
  role?: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  resolvedPlace?: string;
};

export type ColorAxis = {
  left: string;
  right: string;
  colorLabel: string;
};

export type VariableDetail = ColorAxis & {
  color: number;
  tone: number;
  line: number;
  gate: number;
  side: "left" | "right";
  value: string;
};

export type VariableProfile = {
  motivation: VariableDetail;
  view: VariableDetail;
  digestion: VariableDetail;
  environment: VariableDetail;
};

export type MemberReport = {
  input: TeamMemberInput;
  signature: number;
  variables: VariableProfile;
  astro: {
    birthJulianDayUt: number;
    designJulianDayUt: number;
    personalitySunLongitude: number;
    designSunLongitude: number;
    personalityNorthNodeLongitude: number;
    personalitySouthNodeLongitude: number;
    designNorthNodeLongitude: number;
    designSouthNodeLongitude: number;
  };
  traits: string[];
  skills: string[];
  generalSkills: string[];
  flow: string;
  bestPractices: string[];
  bestEnvironment: string;
  collaborationStyle: string;
  possibleFrictions: string[];
  frictionSolutions: string[];
  calculationMethod: string;
};

export type TeamReport = {
  reportMode: ReportMode;
  members: MemberReport[];
  teamPotential: string[];
  teamFrictions: string[];
  leverageMoves: string[];
  leakAreas: string[];
  bestEnvironmentMix: string;
  collaborationModel: string;
};
