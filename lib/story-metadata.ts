/** Champs attendus depuis les metadata Stripe (checkout). */
export type StoryMetadata = {
  prenom1: string;
  prenom2: string;
  univers: string;
  valeur: string;
  occasion: string;
  format: string;
  message: string;
  email: string;
  /** Âges saisis au checkout (métadonnées Stripe), ex. "7" */
  age_enfant1?: string;
  age_enfant2?: string;
  profils?: string;
  precisionsNeuro?: string;
};

export function prenomDisplay(meta: Pick<StoryMetadata, "prenom1" | "prenom2">): string {
  const a = meta.prenom1?.trim() || "";
  const b = meta.prenom2?.trim() || "";
  if (a && b) return `${a} et ${b}`;
  return a || b || "ton enfant";
}
