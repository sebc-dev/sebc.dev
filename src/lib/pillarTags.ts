export type PillarType = "IA" | "Ingénierie" | "UX";

const pillarClasses: Record<PillarType, string> = {
  IA: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  Ingénierie: "bg-teal/15 border-teal/30 text-teal-bright",
  UX: "bg-amber-500/15 border-amber-500/30 text-amber-400",
};

export function getPillarColorClass(pillar: PillarType): string {
  return pillarClasses[pillar];
}
