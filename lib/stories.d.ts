export type StoryEntry = {
  titre: string;
  texte: string;
  citation: string;
  source: string;
  questions: string[];
  defi: string;
};

export const STORIES: Record<string, StoryEntry>;
export default STORIES;

export function normalize(str: string): string;

export function storyKey(
  univers: string,
  valeur: string,
  occasion: string,
  nbEnfants: 1 | 2
): string;

export function getStory(
  univers: string,
  valeur: string,
  occasion: string,
  nbEnfants: 1 | 2,
  prenom1?: string,
  prenom2?: string
): StoryEntry | null;

export function getStoryOrDefault(
  univers: string,
  valeur: string,
  occasion: string,
  nbEnfants: 1 | 2,
  prenom1?: string,
  prenom2?: string
): StoryEntry;

export function getAvailableStories(): string[];
