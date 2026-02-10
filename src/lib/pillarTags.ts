export type PillarType = "IA" | "Ingénierie" | "UX";

const pillarClasses = {
  IA: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  Ingenierie: "bg-teal/15 border-teal/30 text-teal-bright",
  UX: "bg-amber-500/15 border-amber-500/30 text-amber-400",
} as const;

export function getPillarColorClass(pillar: PillarType): string {
  const normalized = pillar.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return normalized === "Ingenierie"
    ? pillarClasses.Ingenierie
    : pillarClasses[pillar as keyof typeof pillarClasses];
}
