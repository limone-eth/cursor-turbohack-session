import { bg5Friendly } from "@/lib/bg5/terminology";

export function motivationNarrative(label: string, side: string): string {
  return bg5Friendly(
    `Motivation pattern: ${label} (${side}). In teams, this shows up as the underlying drive behind commitments, pacing, and how this person measures success in execution.`,
  );
}

export function viewNarrative(label: string, side: string): string {
  return bg5Friendly(
    `Perspective pattern: ${label} (${side}). This shapes what they notice first in a problem space, and what context they need before saying yes.`,
  );
}

export function digestionNarrative(label: string, side: string): string {
  return bg5Friendly(
    `Work processing pattern: ${label} (${side}). This is about how information, pressure, and tasks land, and what helps them stay regulated while performing.`,
  );
}

export function environmentNarrative(label: string, side: string): string {
  return bg5Friendly(
    `Environment pattern: ${label} (${side}). This points to the physical and social container that keeps their focus stable during deep work and collaboration.`,
  );
}

export function traitStarters(args: {
  motivationLabel: string;
  motivationSide: string;
  viewLabel: string;
  viewSide: string;
  digestionLabel: string;
  digestionSide: string;
  environmentLabel: string;
  environmentSide: string;
}): string[] {
  return [
    bg5Friendly(
      `Operates with ${args.motivationSide} ${args.motivationLabel} motivation when stakes are real.`,
    ),
    bg5Friendly(`Frames problems through a ${args.viewSide} ${args.viewLabel} lens.`),
    bg5Friendly(`Processes workload best with ${args.digestionSide} ${args.digestionLabel} rhythms.`),
    bg5Friendly(`Stabilizes focus in ${args.environmentSide} ${args.environmentLabel} environments.`),
  ];
}
