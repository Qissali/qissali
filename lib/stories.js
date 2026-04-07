/**
 * Clés : `${segment(univers)}-${segment(valeur)}-${segment(occasion)}-${nbEnfants}`
 * Variantes aïd/aid gérées dans getStory (voir keyVariants).
 */

/** @typedef {{ titre: string; texte: string; citation: string; source: string; questions: string[]; defi: string }} StoryEntry */

/**
 * @param {string} s
 */
function segment(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/'/g, "");
}

/**
 * @param {string} univers
 * @param {string} valeur
 * @param {string} occasion
 * @param {1|2} nbEnfants
 */
export function storyKey(univers, valeur, occasion, nbEnfants) {
  const n = nbEnfants === 2 ? 2 : 1;
  return `${segment(univers)}-${segment(valeur)}-${segment(occasion)}-${n}`;
}

/**
 * @param {string} str
 * @param {string} prenom1
 * @param {string} prenom2
 */
function replacePrenoms(str, prenom1, prenom2) {
  const a = String(prenom1 || "").trim();
  const b = String(prenom2 || "").trim();
  let out = String(str || "");
  out = out.replace(/\[PRENOM\]/g, a);
  out = out.replace(/\[PRENOM_1\]/g, a);
  out = out.replace(/\[PRENOM_2\]/g, b);
  out = out.replace(/\[PRENOM2\]/g, b);
  return out;
}

/**
 * Titre d'affiche : si le modèle commence par « et … », préfixe « L'histoire de [PRENOM] ».
 * @param {StoryEntry} entry
 */
function buildFullTitre(entry) {
  const t = entry.titre.trim();
  if (/^L['']histoire\s+de\s+/i.test(t)) return t;
  if (/^et\s+/i.test(t)) return `L'histoire de [PRENOM] ${t}`;
  return `L'histoire de [PRENOM] — ${t}`;
}

/**
 * @param {StoryEntry} entry
 * @param {string} prenom1
 * @param {string} prenom2
 */
function applyPrenomsToStory(entry, prenom1, prenom2) {
  const titreTemplate = buildFullTitre(entry);
  return {
    titre: replacePrenoms(titreTemplate, prenom1, prenom2),
    texte: replacePrenoms(entry.texte, prenom1, prenom2),
    citation: replacePrenoms(entry.citation, prenom1, prenom2),
    source: replacePrenoms(entry.source, prenom1, prenom2),
    questions: entry.questions.map((q) => replacePrenoms(q, prenom1, prenom2)),
    defi: replacePrenoms(entry.defi, prenom1, prenom2),
  };
}

/** @type {StoryEntry} */
const DEFAULT_STORY = {
  titre: "et la lumière du cœur",
  texte: `Il était une fois [PRENOM], qui marchait sur un chemin doux entre les étoiles et les prières du soir. Chaque pas rappelait que la générosité et la patience sont des trésors qu'Allah aime voir briller dans les cœurs des enfants.

Un jour, une petite épreuve vint au détour du sentier. [PRENOM] se souvint alors des paroles du Prophète Muhammad ﷺ sur la bienveillance, et choisit la voie du bien, même quand ce n'était pas la plus facile.

Ce soir-là, en fermant les yeux, [PRENOM] remercia Allah pour cette histoire à vivre encore et encore.`,
  citation: "La charité n'a jamais appauvri personne.",
  source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
  questions: [
    "Qu'est-ce qui t'a le plus touché dans cette histoire ?",
    "Comment [PRENOM] a-t-il / elle montré du courage ou de la générosité ?",
    "Et toi, qu'aimerais-tu faire de beau demain ?",
  ],
  defi: "Fais un geste gentil cette semaine, même tout petit, et raconte-le à quelqu'un que tu aimes.",
};

/** @type {Record<string, StoryEntry>} */
export const STORIES = {
  // ─── PRINCESSE / GÉNÉROSITÉ / AÏD EL-FITR / 1 ENFANT ───
  "princesse-générosité-aid-el-fitr-1": {
    titre: "et le plus grand trésor du royaume",
    texte: `Il était une fois, dans un royaume où les jardins sentaient toujours le jasmin et le miel, une petite princesse prénommée [PRENOM].

[PRENOM] n'était pas comme les princesses des autres histoires. Elle ne passait pas ses journées à se regarder dans les miroirs ou à attendre qu'on lui apporte des cadeaux. Non. [PRENOM] aimait courir pieds nus dans l'herbe du matin, parler aux oiseaux depuis sa fenêtre, et écouter les histoires que lui racontait sa grand-mère après la prière du soir.

Sa grand-mère lui disait souvent une chose :

"Le plus grand trésor d'une princesse, ma chérie, ce n'est pas sa couronne. C'est son cœur."

[PRENOM] ne comprenait pas toujours ce que ça voulait dire. Jusqu'au jour de l'Aïd.

Ce matin-là, elle se réveilla avant tout le monde. Le soleil venait à peine de se lever, et déjà des odeurs merveilleuses montaient de la cuisine. Les gâteaux au miel de maman. Les cornes de gazelle saupoudrées de sucre. Le thé à la menthe qui chantait dans la bouilloire.

[PRENOM] sauta de son lit, enfila sa plus belle robe — celle en soie rose avec des étoiles dorées brodées sur les manches — et se précipita dans le couloir.

"Aïd Moubarak !" cria-t-elle de toutes ses forces.

"Aïd Moubarak, ma princesse !" répondit papa depuis le salon.

Il était assis sur le grand canapé bordeaux, en habit de fête, avec un sourire qui illuminait toute la pièce. Dans sa main, une petite bourse en velours violet, fermée par un ruban doré.

"C'est pour toi", dit-il en la lui tendant.

[PRENOM] s'approcha, les yeux écarquillés. Elle défit le ruban tout doucement, comme si elle ouvrait quelque chose de précieux. À l'intérieur : des pièces brillantes, rondes et dorées, qui tintèrent joyeusement dans sa paume.

Elle les compta. Une, deux, trois... dix pièces. Dix pièces rien que pour elle.

Elle les serra fort dans sa main et courut vers le jardin, le cœur léger comme un oiseau.

C'est là qu'elle la vit.

Assise seule sous le grand oranger, les genoux serrés contre la poitrine, une petite fille que [PRENOM] connaissait bien. C'était Lina, la fille de Monsieur Karim, le jardinier du palais.

Mais ce matin, Lina ne jouait pas. Elle regardait le sol, les épaules basses.

[PRENOM] s'approcha doucement et s'assit à côté d'elle dans l'herbe.

"Tu n'as pas l'air joyeuse pour l'Aïd", dit-elle.

"C'est que... cette année, chez nous, c'est difficile", murmura Lina. "Papa a été malade longtemps. On n'a pas pu acheter de nouvelles affaires."

[PRENOM] regarda sa bourse. Les dix pièces dorées brillaient dans sa main.

Elle pensa au jouet qu'elle voulait acheter depuis des semaines. À la poupée dans la vitrine du marché, avec ses habits brodés et ses longs cheveux noirs.

Puis elle regarda Lina. Ses yeux rouges. Ses épaules tombées.

Alors, dans sa tête, la voix de sa grand-mère s'éleva.

"Le Prophète ﷺ nous a enseigné, ma chérie, que jamais une aumône n'a appauvri son donneur. Jamais."

[PRENOM] regarda ses pièces une dernière fois. Si le Prophète ﷺ l'avait dit, alors c'était vrai. Elle n'avait pas peur.

Elle ouvrit sa bourse, prit cinq pièces — la moitié exacte de son trésor — et les déposa doucement dans la main de Lina.

"Aïd Moubarak", dit [PRENOM] avec un grand sourire.

Lina la regarda, stupéfaite.

"Mais... c'est ton argent de l'Aïd ! Je ne peux pas..."

"Si", dit [PRENOM] doucement. "Ma grand-mère dit toujours que le plus grand trésor d'une princesse, c'est son cœur. Alors je préfère garder mon cœur plein plutôt que ma bourse."

Un long silence passa. Puis Lina sourit — un sourire immense, sincère, qui remonta jusqu'à ses yeux et les fit briller comme deux étoiles.

Les deux petites filles restèrent assises sous l'oranger un long moment, à manger des gâteaux au miel et à regarder les oiseaux danser dans le ciel bleu de l'Aïd.

Ce soir-là, au moment de se coucher, [PRENOM] avait toujours cinq pièces dans sa bourse. Mais quand elle ferma les yeux, elle se sentit plus légère que jamais.

Sa grand-mère passa la tête dans la chambre pour lui souhaiter bonne nuit.

"Tu sais", dit [PRENOM] dans le noir, "je crois que j'ai compris ce que tu voulais dire. Pour le trésor."

Sa grand-mère sourit dans l'obscurité.

"Je sais, ma chérie. Ça se voit sur ton visage."

Et dans le ciel au-dessus du royaume, une étoile brilla un peu plus fort que toutes les autres. Juste pour [PRENOM].`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Est-ce que tu penses que [PRENOM] a bien fait de donner ses pièces à Lina ? Pourquoi ?",
      "Comment tu crois que Lina s'est sentie après ?",
      "Et toi, si tu avais été à la place de [PRENOM], qu'est-ce que tu aurais fait ?",
    ],
    defi: "Fais un geste généreux cette semaine — même tout petit — et raconte-le à maman ou papa ce soir !",
  },

  // ─── LICORNE / GÉNÉROSITÉ / AÏD EL-FITR / 2 ENFANTS ───
  "licorne-générosité-aid-el-fitr-2": {
    titre: "et la licorne qui brillait dans le cœur",
    texte: `Il était une fois deux sœurs inséparables, [PRENOM] et [PRENOM2].

[PRENOM] était l'aînée. Elle avait les yeux sérieux de celles qui réfléchissent avant de parler, et un rire qui éclatait d'un coup, comme une surprise.

[PRENOM2] était la petite. Elle riait pour un rien, courait partout, et croyait très fort à la magie.

Ce matin-là, c'était l'Aïd. La maison sentait les gâteaux au miel, le musc doux de maman. Les deux sœurs avaient prié ensemble avec maman, côte à côte sur le grand tapis vert.

Après la prière, papa les appela dans le salon.

"Fermez les yeux", dit-il.

Elles obéirent, les mains tendues, le cœur qui battait vite.

"Ouvrez !"

Dans leurs mains : deux petites licornes en peluche, aux crins arc-en-ciel, avec une corne argentée qui scintillait dans la lumière du matin.

[PRENOM2] serra la sienne si fort contre elle qu'elle faillit l'étouffer.

"Elle est MAGIQUE !" cria-t-elle.

Après le petit-déjeuner, les deux sœurs descendirent dans le jardin. C'est là qu'elles virent Inès.

Inès habitait juste de l'autre côté du muret. Elle était là, assise, qui les regardait avec de grands yeux ronds et silencieux. Elle n'avait pas de licorne. Elle n'avait reçu aucun cadeau ce matin.

[PRENOM2] tira la manche de sa sœur et murmura :

"Tu as vu ses yeux ?"

"Oui", dit [PRENOM] doucement. "J'ai vu."

Un silence passa entre elles — un silence de celles qui se comprennent sans parler.

[PRENOM] regarda sa licorne. Ses crins arc-en-ciel. Sa corne argentée.

Et puis, dans sa tête, la voix de maman s'éleva.

"Le Prophète ﷺ nous a enseigné, mes chéries, que jamais une aumône n'a appauvri son donneur. Ce qu'on donne avec le cœur, Allah le multiplie."

[PRENOM] regarda sa sœur. [PRENOM2] la regardait aussi.

Et sans qu'aucune des deux ait besoin de prononcer un seul mot, elles surent exactement quoi faire.

Ensemble, main dans la main, elles s'approchèrent d'Inès.

[PRENOM] tendit sa licorne. [PRENOM2] hésita une toute petite seconde — juste une — puis tendit la sienne aussi.

"Prends-les toutes les deux", dit [PRENOM2]. "Comme ça elles seront des sœurs, comme nous."

Inès les regarda, bouche ouverte, les yeux brillants.

"Mais... c'est vos cadeaux de l'Aïd !"

"Les sœurs qui s'aiment font les choses ensemble", dit [PRENOM] en souriant. "Et aujourd'hui, on a décidé ensemble."

Ce soir-là, les deux sœurs n'avaient plus leurs licornes. Maman les avait serrées très fort contre elle sans rien dire pendant un long moment. Puis elle avait chuchoté :

"Je suis tellement fière de vous, mes étoiles."

Au moment de dormir, [PRENOM2] glissa sa main dans celle de sa sœur dans le noir.

"Je crois que la vraie magie... c'est pas dans la licorne", dit-elle doucement.

"Non", murmura [PRENOM]. "C'est dans le cœur."

Et cette nuit-là, les deux sœurs rêvèrent toutes les deux de la même chose : une licorne immense, aux crins d'or et d'arc-en-ciel, qui galopait dans un ciel plein d'étoiles, juste au-dessus de leur maison.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Est-ce que vous pensez que [PRENOM] et [PRENOM2] ont bien fait ? Pourquoi ?",
      "C'était plus facile ou plus difficile de décider ensemble ?",
      "Comment vous croyez qu'Inès s'est sentie ce soir-là ?",
    ],
    defi: "Choisissez ensemble un geste généreux à faire cette semaine — et faites-le main dans la main !",
  },

  // ─── SUPER-HÉROS / GÉNÉROSITÉ / AÏD EL-FITR / 1 ENFANT ───
  "super-héros-générosité-aid-el-fitr-1": {
    titre: "et le jour où il devint un vrai héros",
    texte: `Il était une fois un petit garçon prénommé [PRENOM] qui rêvait de devenir le plus grand héros du monde.

Pas pour la gloire. Pas pour les applaudissements. Pour une seule raison : protéger ceux qui en avaient besoin.

Ce matin-là, c'était l'Aïd. Après la prière — [PRENOM] avait prié avec papa, debout à côté de lui comme un grand — la famille rentra à la maison pour le petit-déjeuner de fête.

C'est là que papy arriva, avec son grand sourire et sa djellaba blanche.

"Viens ici, champion", dit-il en tendant les bras.

Papy glissa une enveloppe dans la poche de [PRENOM]. À l'intérieur : des billets. Vrais, neufs, qui craquaient entre ses doigts.

[PRENOM] savait exactement ce qu'il allait faire. Depuis des semaines, il avait repéré un bouclier de super-héros dans la vitrine — bleu et argenté, qui s'allumait dans le noir.

Mais en sortant de la mosquée après la grande prière du midi, [PRENOM] vit quelque chose qui l'arrêta net.

Sur les marches, un petit garçon était assis seul. Pas d'habit de fête. Pas de sachet de gâteaux. Pas de sourire.

[PRENOM] s'arrêta devant lui.

"Tu attends quelqu'un ?" demanda-t-il.

"Non. Ma maman travaille aujourd'hui. Et on n'a pas vraiment fêté l'Aïd cette année."

Il dit ça simplement, sans se plaindre. Comme si c'était normal.

[PRENOM] sentit quelque chose se serrer dans sa poitrine. Un signal. Comme dans les films quand le héros comprend que c'est le moment d'agir.

Il glissa la main dans sa poche. L'enveloppe était là, bien gonflée.

Le bouclier bleu et argenté apparut dans sa tête.

Et puis la voix de papy s'éleva dans sa mémoire :

"Le Prophète ﷺ a dit, mon grand, que jamais une aumône n'a appauvri son donneur. Les vrais riches ne sont pas ceux qui ont le plus — ce sont ceux qui donnent le plus."

[PRENOM] regarda le garçon. Regarda son enveloppe. Regarda le garçon encore.

Les super-héros ne gardent pas leurs pouvoirs pour eux.

Il sortit la moitié de ses billets et les tendit au garçon.

"Tiens. Aïd Moubarak."

Le garçon leva les yeux vers lui, complètement stupéfait.

"Pourquoi tu fais ça ? Tu me connais même pas."

[PRENOM] haussa les épaules avec un petit sourire.

"Les héros n'ont pas besoin de connaître quelqu'un pour l'aider. C'est pour ça que ce sont des héros."

En rentrant chez lui ce soir-là, [PRENOM] avait moins d'argent dans les poches. Il n'achèterait pas le bouclier aujourd'hui.

Mais en passant devant le grand miroir du couloir, il s'arrêta. Et il lui sembla voir quelque chose dans ses propres yeux — plus grands, plus forts. Comme s'il y avait une lumière dedans qu'il n'avait jamais remarquée avant.

Papa posa sa main sur son épaule.

"Je t'ai vu, sur les marches de la mosquée", dit-il doucement. "Les super-héros n'ont pas besoin de cape. Ils ont juste besoin d'un grand cœur. Et toi, mon fils, tu en as un."

Ce soir-là, [PRENOM] s'endormit sans penser au bouclier bleu et argenté. Il rêva qu'il volait.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi [PRENOM] a-t-il donné seulement la moitié de son argent et pas tout ?",
      "Est-ce que c'était facile pour lui de renoncer au bouclier ? Pourquoi ?",
      "Toi, qu'est-ce que tu aurais fait à sa place ?",
    ],
    defi: "Cette semaine, fais une action de héros — même toute petite. Aide quelqu'un sans qu'on te le demande !",
  },

  // ─── ANIMAUX / GÉNÉROSITÉ / AÏD EL-FITR / 1 ENFANT ───
  "animaux-générosité-aid-el-fitr-1": {
    titre: "et le secret de la forêt de l'Aïd",
    texte: `Il était une fois un enfant prénommé [PRENOM] qui avait un don extraordinaire.

[PRENOM] pouvait entendre les animaux parler. Pas à tout le monde. Juste à lui.

Son ami préféré était Safran — un renard roux au pelage de feu, avec une queue touffue comme un nuage d'automne et des yeux dorés qui voyaient tout.

Ce matin-là, c'était l'Aïd. La maison sentait la fleur d'oranger et les gâteaux fraîchement sortis du four.

Après la prière, maman tendit à [PRENOM] une belle bourse brodée de fils dorés.

"C'est ton cadeau de l'Aïd. Tu peux t'acheter ce qui te fait plaisir."

[PRENOM] compta ses pièces : douze. Un vrai trésor.

Il alla dans le jardin montrer son trésor à Safran. Le renard était assis sous le figuier, l'air préoccupé.

"Aïd Moubarak, Safran !"

"Aïd Moubarak, [PRENOM]", répondit le renard. "Mais mon cœur n'est pas vraiment en fête ce matin."

"Pourquoi ?"

Safran soupira.

"La famille Lapin, au fond du jardin. Leur terrier a été inondé cette semaine. Ils ont tout perdu. Ils n'ont rien à manger ce matin."

[PRENOM] regarda sa bourse. Il avait prévu d'acheter un livre sur les animaux sauvages qu'il regardait depuis des semaines dans la vitrine.

Mais il pensa aux cinq petits lapins. Leurs ventres vides. Le jour de l'Aïd qui passait sans festin.

Et dans sa tête, la voix de grand-père s'éleva :

"Le Prophète ﷺ nous a appris, mon enfant, que jamais une aumône n'a appauvri son donneur. Ce qu'on donne avec sincérité, Allah le remplace par quelque chose de plus grand."

[PRENOM] regarda Safran.

"On va au marché", dit-il simplement.

Ils revinrent une heure plus tard, les bras chargés : des carottes fraîches, des pommes croquantes, du pain chaud, des petits gâteaux ronds, et un sac de foin doux.

Ils posèrent tout devant l'entrée du terrier.

Un silence. Puis un museau gris apparut. Puis deux petites oreilles. Puis des yeux ronds comme des boutons de nacre.

La maman lapin sortit prudemment. Quand elle vit le panier, elle s'arrêta net.

"C'est... pour nous ?" murmura-t-elle.

"Aïd Moubarak", dit [PRENOM] doucement. "Tout le monde mérite de fêter l'Aïd."

Alors les cinq petits lapins sortirent d'un coup, dans un joyeux désordre de pattes et d'oreilles, et se précipitèrent sur les carottes avec des petits cris de bonheur.

[PRENOM] rit aussi. Un vrai rire, qui venait du ventre.

Ce soir-là, sa bourse était presque vide. Mais en s'allongeant dans l'herbe pour regarder les étoiles, Safran vint s'asseoir à côté de lui.

"Tu sais ce que les animaux disent de toi dans tout le quartier ?"

"Non."

"Ils disent que tu es celui qui entend. Pas seulement les mots — les cœurs. Et ça, c'est le don le plus rare qui soit."

[PRENOM] sourit. Il n'avait plus ses douze pièces. Il n'avait pas son livre.

Mais il avait quelque chose que personne ne pouvait lui prendre : le souvenir des cinq petits lapins qui riaient dans l'herbe, et la certitude d'avoir été, ce jour-là, exactement la personne qu'il voulait être.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi [PRENOM] a-t-il décidé d'aider la famille Lapin même s'il avait un plan pour son argent ?",
      "Comment tu crois que la maman lapin s'est sentie quand elle a vu le panier ?",
      "Et toi, si tu avais été à la place de [PRENOM], qu'aurais-tu fait ?",
    ],
    defi: "Cette semaine, prends soin de quelqu'un ou quelque chose de plus petit que toi. Et raconte à maman ou papa comment tu t'es senti(e) !",
  },

  // ─── PRINCESSE / SACRIFICE (ou générosité) / AÏD EL-ADHA / 1 ENFANT — placeholder ───
  "princesse-sacrifice-aid-el-adha-1": {
    titre: "et le mouton aux yeux doux",
    texte: `[Coller ici le texte complet de l'histoire Princesse / Aïd el-Adha / 1 enfant]`,
    citation: "Ce n'est pas la viande ni le sang qui parviennent à Allah, c'est votre piété.",
    source: "Coran, Sourate Al-Hajj, verset 37",
    questions: [
      "Pourquoi Ibrahim faisait-il tellement confiance à Allah ?",
      "Qu'est-ce que ça veut dire renoncer à quelque chose qu'on aime ?",
      "Comment tu crois qu'Oum Khalid s'est sentie quand [PRENOM] lui a apporté le panier ?",
    ],
    defi: "Cette semaine, donne quelque chose qui te tient à cœur à quelqu'un qui en a besoin. Et dis-le à voix haute : je le donne pour Allah.",
  },
};

// Alias : même placeholder pour la clé issue du formulaire (Générosité + Aïd el-Adha)
STORIES["princesse-générosité-aid-el-adha-1"] = STORIES["princesse-sacrifice-aid-el-adha-1"];

/**
 * Variantes de clé (aïd/aid, accents).
 * @param {string} key
 */
function keyVariants(key) {
  const set = new Set([key]);
  set.add(key.replace(/aïd/g, "aid"));
  set.add(
    key
      .replace(/é/g, "e")
      .replace(/è/g, "e")
      .replace(/ê/g, "e")
      .replace(/ï/g, "i")
      .replace(/à/g, "a")
      .replace(/ô/g, "o")
      .replace(/ù/g, "u")
      .replace(/ç/g, "c")
  );
  return [...set];
}

/**
 * @param {string} univers
 * @param {string} valeur
 * @param {string} occasion
 * @param {1|2} nbEnfants
 * @param {string} [prenom1]
 * @param {string} [prenom2]
 * @returns {StoryEntry}
 */
export function getStory(univers, valeur, occasion, nbEnfants, prenom1 = "", prenom2 = "") {
  const n = nbEnfants === 2 ? 2 : 1;
  const primary = storyKey(univers, valeur, occasion, n);

  /** @type {StoryEntry | undefined} */
  let raw;

  for (const k of keyVariants(primary)) {
    if (STORIES[k]) {
      raw = STORIES[k];
      break;
    }
  }

  if (!raw && n === 2) {
    const fallback1 = storyKey(univers, valeur, occasion, 1);
    for (const k of keyVariants(fallback1)) {
      if (STORIES[k]) {
        raw = STORIES[k];
        break;
      }
    }
  }

  if (!raw) {
    const u = segment(univers);
    const partial = Object.keys(STORIES).find((key) => key.startsWith(`${u}-`));
    if (partial) raw = STORIES[partial];
  }

  if (!raw) {
    raw = DEFAULT_STORY;
  }

  return applyPrenomsToStory(raw, prenom1, prenom2);
}

export default STORIES;
