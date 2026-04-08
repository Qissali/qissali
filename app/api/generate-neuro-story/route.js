import Anthropic from "@anthropic-ai/sdk";
import { getStory } from "@/lib/stories";
import { getNeuroSystemPrompt } from "@/lib/neuroPrompt";
import { getCacheKey, getCachedStory, cacheStory } from "@/lib/neuroCache";

export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const {
      univers,
      valeur,
      occasion,
      nbEnfants,
      prenom1,
      prenom2,
      profil,
      precisions,
    } = await request.json();

    const replace = (text) =>
      String(text || "")
        .replace(/\[PRENOM1\]/g, prenom1)
        .replace(/\[PRENOM2\]/g, prenom2 || prenom1)
        .replace(/\[PRENOM\]/g, prenom1);

    // 1. Vérifie le cache d'abord
    const cacheKey = getCacheKey(univers, valeur, occasion, nbEnfants, profil);
    const cached = await getCachedStory(cacheKey);
    if (cached) {
      console.log("✅ Histoire neuro depuis cache:", cacheKey);
      return Response.json({
        success: true,
        story: {
          ...cached,
          titre: replace(cached.titre),
          texte: replace(cached.texte),
          questions: cached.questions.map(replace),
          defi: replace(cached.defi),
          fromCache: true,
        },
      });
    }

    // 1. Récupère l'histoire standard
    const baseStory = getStory(univers, valeur, occasion, nbEnfants, prenom1, prenom2);

    if (!baseStory) {
      return Response.json({ error: "Histoire de base introuvable" }, { status: 404 });
    }

    // 2. Construit le prompt
    const systemPrompt = getNeuroSystemPrompt(profil, precisions);

    if (!systemPrompt) {
      return Response.json({ error: "Profil neuro non reconnu" }, { status: 400 });
    }

    const userMessage = `Voici l'histoire de base à adapter :

UNIVERS : ${univers}
VALEUR : ${valeur}
OCCASION : ${occasion}
PRÉNOM : ${prenom1}
${prenom2 ? `PRÉNOM 2 : ${prenom2}` : ""}

HISTOIRE DE BASE :
Titre : ${baseStory.titre}

${baseStory.texte}

Citation originale : ${baseStory.citation}
Source : ${baseStory.source}

Questions originales :
${baseStory.questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Défi original : ${baseStory.defi}

Adapte cette histoire pour un enfant avec le profil
indiqué. Garde l'essence, adapte le vécu.`;

    // 3. Appelle l'API Claude
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    // 4. Parse le JSON retourné
    const content = response.content[0].text;
    const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

    const adaptedStory = JSON.parse(cleanContent);

    // 5. Sauvegarde cache avec placeholders [PRENOM]
    const storyToCache = {
      ...adaptedStory,
      isNeuro: true,
      profil: profil,
    };
    await cacheStory(cacheKey, storyToCache);

    return Response.json({
      success: true,
      story: {
        ...adaptedStory,
        titre: replace(adaptedStory.titre),
        texte: replace(adaptedStory.texte),
        questions: adaptedStory.questions.map(replace),
        defi: replace(adaptedStory.defi),
        isNeuro: true,
        profil: profil,
        fromCache: false,
      },
    });
  } catch (error) {
    console.error("Erreur génération neuro:", error);
    return Response.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
