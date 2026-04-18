const BG5_GLOSSARY: Record<string, string> = {
  "human design": "BG5 Career & Business Mechanics",
  bodygraph: "career design chart",
  aura: "work impact field",
  strategy: "decision strategy",
  authority: "decision authority",
  generator: "builder energy profile",
  manifestor: "initiator energy profile",
  projector: "advisor energy profile",
  reflector: "evaluator energy profile",
  center: "competency center",
  channel: "team strength stream",
  gate: "behavioral key",
  conditioning: "external pressure",
  "strategy\\+authority": "decision strategy and decision authority",
  strategy: "interaction strategy",
  authority: "decision authority",
  manifestor: "initiator career type",
  projector: "advisor career type",
  generator: "builder career type",
  reflector: "evaluator career type",
  penta: "small-group field (Penta)",
  wa: "large-group field (WA)",
  "not-self": "distraction pattern",
};

export function bg5Friendly(text: string): string {
  return Object.entries(BG5_GLOSSARY).reduce((acc, [hdTerm, bg5Term]) => {
    const re = new RegExp(`\\b${hdTerm}\\b`, "gi");
    return acc.replace(re, bg5Term);
  }, text);
}
