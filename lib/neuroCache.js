import { kv } from "@vercel/kv";

// Génère une clé de cache unique
export function getCacheKey(univers, valeur, occasion, nbEnfants, profil) {
  return `neuro:${univers}-${valeur}-${occasion}-${nbEnfants}-${profil}`;
}

// Récupère depuis le cache
export async function getCachedStory(cacheKey) {
  try {
    const cached = await kv.get(cacheKey);
    return cached || null;
  } catch {
    return null;
  }
}

// Sauvegarde dans le cache
// TTL : 30 jours (2592000 secondes)
export async function cacheStory(cacheKey, story) {
  try {
    await kv.set(cacheKey, story, { ex: 2592000 });
  } catch (error) {
    console.error("Erreur cache neuro:", error);
  }
}
