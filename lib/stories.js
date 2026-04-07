/**
 * Clés : combinaison `segment()` (accents conservés en minuscules) et `normalize()` (ASCII)
 * pour retrouver les entrées dans STORIES. Variantes aïd/aid via keyVariants.
 */

/** @typedef {{ titre: string; texte: string; citation: string; source: string; questions: string[]; defi: string }} StoryEntry */

/**
 * Normalise un segment pour une clé stable (minuscules, tirets, accents → ASCII).
 * @param {string} str
 */
export function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/'/g, "")
    .replace(/é|è|ê/g, "e")
    .replace(/à|â/g, "a")
    .replace(/î/g, "i")
    .replace(/ô/g, "o")
    .replace(/û/g, "u")
    .replace(/ï/g, "i")
    .replace(/ç/g, "c");
}

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
  const bRaw = String(prenom2 || "").trim();
  const bForDeux = bRaw || a;
  let out = String(str || "");
  out = out.replace(/\[PRENOM\]/g, a);
  out = out.replace(/\[PRENOM1\]/g, a);
  out = out.replace(/\[PRENOM_1\]/g, a);
  out = out.replace(/\[PRENOM2\]/g, bForDeux);
  out = out.replace(/\[PRENOM_2\]/g, bForDeux);
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

  // ─── PARTAGE / SANS OCCASION ───
  "princesse-partage-sans-occasion-1": {
    titre: "et le goûter qui suffisait pour deux",
    texte: `Dans un palais où les rideaux de soie bruissaient comme des ailes de papillon, vivait une petite princesse nommée [PRENOM].

Ce jour-là n'était ni un jour de fête ni un jour de voyage : c'était un mercredi ordinaire, avec une sortie scolaire au parc. Maman avait glissé dans le sac de [PRENOM] un goûter parfait : deux madeleines dorées, une pomme croquante, et une petite bouteille d'eau toute fraîche.

Sur le banc du parc, [PRENOM] déballa son napperon. C'est alors qu'elle remarqua une fille assise un peu à l'écart, les mains vides, qui regardait les autres manger sans oser demander.

[PRENOM] se souvint des mots de sa tante, après la prière du matin : "Quand tu partages, tu imites ceux qu'Allah aime : les généreux."

Elle se leva, s'approcha, et tendit une madeleine.

"On la coupe en deux ?" dit [PRENOM] avec un sourire. "Comme ça, on a chacune le goût du miel."

La fille hocha la tête, les yeux brillants. Elles parlèrent des nuages, des écureuils, et du vent dans les feuilles. Quand la maîtresse siffla la fin de la récréation, [PRENOM] n'avait plus qu'une demi-pomme dans sa poche — mais le ventre de son cœur était plein.

Ce soir, en racontant l'histoire à sa mère, [PRENOM] murmura : "Je crois que la madeleine était meilleure à deux."

Et dans la prière du soir, elle remercia Allah d'avoir mis sur son chemin ce banc, ce parc, et cette envie simple : faire de son goûter un cadeau.`,
    citation: "Les musulmans dans leur tendresse les uns pour les autres sont comme un seul corps.",
    source: "Le Prophète Muhammad ﷺ • Mouslim",
    questions: [
      "Pourquoi [PRENOM] a-t-elle proposé de partager plutôt que de tout garder ?",
      "Comment la petite fille a-t-elle pu se sentir après ce moment ?",
      "Qu'est-ce que tu pourrais partager cette semaine, même sans occasion spéciale ?",
    ],
    defi: "Sans attendre une fête, partage quelque chose de ton goûter ou de ton temps avec quelqu'un autour de toi.",
  },

  "princesse-partage-sans-occasion-2": {
    titre: "et les deux princesses du même panier",
    texte: `Il était une fois deux sœurs du même palais, [PRENOM] et [PRENOM2], qui collectionnaient les rubans et les histoires du soir.

Un après-midi sans rien d'exceptionnel, leur tante leur offrit un panier de cerises rouges, sucrées comme du miel. "C'est pour vous deux", dit-elle. "Mais attention : quand on partage, la baraka descend."

[PRENOM], l'aînée, versa les cerises dans une coupe en verre. Il y en avait onze — un nombre impair, comme pour embêter le monde.

[PRENOM2] tendit la main vers la plus grosse.

"Attends", dit [PRENOM]. "Si on se dispute la plus belle, on va manger vite et mal. Si on la coupe en deux, on goûte pareil."

Elles prirent une assiette, un couteau d'enfant, et partagèrent jusqu'à ce qu'il reste une cerise. Une seule.

[PRENOM2] rit : "Celle-là, c'est pour maman."

"Ou pour papa", proposa [PRENOM].

Elles coururent vers la cuisine et déposèrent la dernière cerise sur le plateau du thé. Papa sourit sans dire un mot, mais ses yeux brillaient comme des lanternes.

Ce soir-là, en rangeant la coupe vide, [PRENOM] dit : "On n'avait pas plus de cerises qu'avant — mais j'ai l'impression qu'il y en avait plus dans le panier."

[PRENOM2] acquiesça : "Parce qu'on les a mangées avec le cœur."

Et toutes deux se souvinrent que le Prophète ﷺ aimait la générosité même dans un sourire, même dans une cerise coupée en deux.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • Boukhari et Mouslim",
    questions: [
      "Comment [PRENOM] et [PRENOM2] ont-elles évité la dispute pour la plus grosse cerise ?",
      "Pourquoi avoir offert la dernière cerise aux parents a-t-il rendu le moment plus beau ?",
      "À deux, qu'est-ce que vous aimeriez partager cette semaine à la maison ou à l'école ?",
    ],
    defi: "Avec un frère, une sœur ou un ami, partagez équitablement un en-cas : le but est que tout le monde soit content, pas seulement le plus rapide.",
  },

  "licorne-partage-sans-occasion-1": {
    titre: "et la licorne en papier cadeau",
    texte: `[PRENOM] adorait dessiner. Son carnet était rempli de licornes : des crins bleus, des sabots d'or, des arcs-en-ciel qui dépassaient des pages.

À la sortie de l'école, un petit garçon regardait [PRENOM] colorier sur le banc. Il n'avait pas de carnet, pas de crayons neufs — seulement un bout de craie cassée.

[PRENOM] sentit quelque chose se tendre dans sa poitrine, comme une corde de harpe qu'on pince doucement.

Elle arracha une page propre — celle où une licorne portait une couronne de fleurs — et la tendit.

"Tu veux la colorier avec moi ? J'ai deux verts et un rose."

Le garçon ouvrit des yeux ronds comme des billes.

"Je peux ?"

"Bien sûr. La beauté, c'est mieux quand on la voit à deux."

Ils se partagèrent les crayons, puis les idées : des étoiles sur la robe, une lune derrière la corne, un petit chat endormi au pied de la licorne.

Quand les parents appelèrent, [PRENOM] referma son carnet. Il manquait une page — mais son cœur était plus léger.

Ce soir, elle expliqua : "Ma licorne est partie vivre ailleurs. Et c'est comme ça qu'elle est devenue magique."

Sa mère sourit : "Quand tu partages ce que tu aimes, tu ressembles à ceux qu'Allah appelle les bienfaisants."`,
    citation: "Allah est avec celui qui aide son frère.",
    source: "Hadith rapporté par Tabarani • Sens authentifié",
    questions: [
      "Pourquoi [PRENOM] a-t-elle choisi d'inviter l'autre enfant à colorier avec elle ?",
      "Qu'est-ce qui change quand on crée quelque chose à plusieurs ?",
      "Quel talent ou quelle chose aimerais-tu partager sans attendre une fête ?",
    ],
    defi: "Offre à quelqu'un une page de ton cahier de dessin, une idée, ou un moment pour créer ensemble.",
  },

  "licorne-partage-sans-occasion-2": {
    titre: "et l'arc-en-ciel à deux mains",
    texte: `[PRENOM] et [PRENOM2] avaient chacune une boîte de feutres neufs. Les couleurs étaient si vives qu'elles en faisaient tourner la tête — surtout le rose et le violet.

Le devoir du jour était simple : dessiner une licorne sur une grande feuille commune. Une seule licorne pour deux noms.

"Je veux la crinière rose", dit [PRENOM2].

"Et moi la corne dorée", répondit [PRENOM].

Elles commencèrent chacune d'un côté. Puis les traits se croisèrent, les couleurs se mélangèrent, et la licorne prit des taches improbables — un peu trop de bleu par ici, un peu trop de vert par là.

[PRENOM2] faillit pleurer. [PRENOM] respira.

"On efface pas", dit [PRENOM]. "On transforme. Les taches, c'est de la magie ratée qui devient de la magie vraie."

Elles ajoutèrent des étoiles autour des taches, des nuages, une pluie fine de paillettes. La licorne devint unique — pas comme sur Internet, mais comme leur journée : un peu chaotique, très sincère.

La maîtresse afficha le dessin dans le couloir. Sous la licorne, un mot : "Quand on partage la même feuille, on partage aussi la même fierté."

En rentrant, [PRENOM2] prit la main de sa sœur : "La prochaine fois, on commence ensemble dès le début."

"Oui", dit [PRENOM]. "Parce que l'arc-en-ciel, c'est plus joli quand il tient à deux mains."`,
    citation: "Les croyants, dans leur amour et leur compassion, sont comme un seul corps.",
    source: "Le Prophète Muhammad ﷺ • Boukhari et Mouslim",
    questions: [
      "Comment [PRENOM] et [PRENOM2] ont-elles transformé une difficulté (les taches) en quelque chose de beau ?",
      "Pourquoi travailler sur la même feuille peut aider à mieux partager ?",
      "À la maison, quelle activité pourriez-vous faire ensemble plutôt que chacune de son côté ?",
    ],
    defi: "Réalisez un dessin ou une recette à quatre mains : une seule feuille, une seule équipe.",
  },

  "super-héros-partage-sans-occasion-1": {
    titre: "et le siège laissé libre",
    texte: `[PRENOM] portait un t-shirt avec un éclair sur la poitrine. Ce n'était pas une vraie cape, mais dans sa tête, ça suffisait.

Dans le bus scolaire, les places partirent vite. [PRENOM] bondit sur un siège près de la fenêtre — le meilleur, celui où on voit les toits et les oiseaux.

À l'arrêt suivant, monta une dame avec un sac lourd et une canne qui tremblait un peu.

Les sièges étaient pleins. Personne ne bougea.

[PRENOM] sentit le éclair sur son t-shirt chauffer — pas de la fièvre, de la honte mêlée au courage.

Il se leva.

"Vous pouvez vous asseoir", dit-il. "Je suis un super-héros. Les héros, ils tiennent debout quand il faut."

La dame sourit, posa sa main sur l'épaule de [PRENOM] comme une bénédiction silencieuse.

Quand le bus reprit la route, [PRENOM] se tenait près de la barre, un peu fatigué, beaucoup fier.

Son ami chuchota : "T'as raté la vue de la fenêtre."

[PRENOM] haussa les épaules : "J'ai vu mieux : quelqu'un qui respire plus tranquille."

Le soir, son père lui rappela les paroles du Prophète ﷺ sur honorer les aînés. [PRENOM] ferma les yeux et pensa : parfois, la plus grande puissance, c'est de céder sa place.`,
    citation: "N'est pas parmi nous celui qui ne respecte pas nos petits et ne montre pas pitié à nos grands.",
    source: "Le Prophète Muhammad ﷺ • Tirmidhi • Hadith hassan",
    questions: [
      "Pourquoi est-ce un acte de \"héros\" que de laisser sa place ?",
      "Comment [PRENOM] a-t-il transformé un moment gênant (personne ne bouge) en action ?",
      "Où pourrais-tu \"céder ta place\" cette semaine : à table, dans un jeu, dans la file ?",
    ],
    defi: "Repère un moment où tu peux céder ta place ou porter un sac : un geste de héros du quotidien.",
  },

  "super-héros-partage-sans-occasion-2": {
    titre: "et la mission double ration",
    texte: `Les jumeaux du quartier — [PRENOM] et [PRENOM2] — avaient juré de protéger le terrain de foot derrière la mosquée. Pas avec des boucliers : avec des règles justes.

Ce jour-là, un seul ballon neuf était arrivé, offert par un voisin. Les équipes se formaient vite, les cris aussi.

[PRENOM] attrapa le ballon le premier.

"Moi je tire le premier penalty !"

[PRENOM2] plissa les yeux : "Moi aussi je veux !"

La dispute allait gonfler comme un ballon trop plein d'air.

Alors [PRENOM] posa le ballon au centre.

"Écoute", dit-il à [PRENOM2]. "Un héros, c'est pas celui qui marque le plus. C'est celui qui fait gagner l'équipe — même quand ce n'est pas lui le capitaine."

Ils convinrent d'un tour à tour : un penalty pour chaque équipe, choisi par l'autre. Les autres enfants applaudirent la règle avant même le premier tir.

Le match fut moins spectaculaire mais plus doux. À la fin, le ballon était passé par toutes les têtes — un peu de terre, beaucoup de rires.

En rentrant, [PRENOM2] dit : "On a gagné quoi ?"

[PRENOM] répondit : "On a gagné le droit de rejouer demain. Et ça, c'est mieux qu'un but."

Leur père hocha la tête : "Quand vous partagez le jeu, Allah met la baraka dans votre fraternité."`,
    citation: "Les musulmans pour les musulmans sont comme un édifice dont chaque partie renforce les autres.",
    source: "Le Prophète Muhammad ﷺ • Boukhari et Mouslim",
    questions: [
      "Comment [PRENOM] et [PRENOM2] ont-ils évité que le ballon neuf sépare les équipes ?",
      "Pourquoi un tour à tour peut être plus juste qu'une course au premier arrivé ?",
      "À quoi jouez-vous à deux où il faudrait inventer une règle équitable ?",
    ],
    defi: "Organise un petit jeu avec des règles partagées à l'avance : tout le monde sait quand c'est son tour.",
  },

  "animaux-partage-sans-occasion-1": {
    titre: "et le bol d'eau au bon endroit",
    texte: `[PRENOM] aimait observer les fourmis, écouter les oiseaux du matin, et donner un nom à chaque chat du quartier — même ceux qui ne venaient pas tous les jours.

Un après-midi chaud, sans musique ni fanfare, [PRENOM] remarqua un chien attaché près de la petite épicerie. Son museau était sec, sa langue pendante, et son maître discutait depuis longtemps à l'intérieur.

[PRENOM] courut à la fontaine publique, remplit sa gourde, versa de l'eau propre dans le couvercle de sa boîte à goûter devenu bol improvisé, et le posa près du trottoir.

Le chien but longuement, le regard un peu moins perdu.

Le commerçant passa la tête : "C'est bien, petit. Le Prophète ﷺ nous a parlé de la récompense pour un animal assoiffé."

[PRENOM] rougit : il ne savait pas encore tout du hadith — il avait seulement vu une soif.

Ce soir, il apprit que la compassion envers les animaux fait partie de la beauté de la foi : un geste simple, un jour quelconque, peut peser lourd sur la balance du bien.

En s'endormant, [PRENOM] pensa aux oiseaux de demain matin : il leur laisserait un peu de pain sur le rebord de la fenêtre — pas parce qu'un calendrier le disait, mais parce que son cœur l'avait décidé.`,
    citation: "Une prostituée fut pardonnée parce qu'elle donna à boire à un chien assoiffé.",
    source: "Le Prophète Muhammad ﷺ • Boukhari et Mouslim",
    questions: [
      "Pourquoi [PRENOM] n'avait-il pas besoin d'une fête pour agir ?",
      "Comment un petit geste pour un animal peut-il devenir grand aux yeux d'Allah ?",
      "Quel animal ou quelle plante pourrais-tu aider cette semaine avec de l'eau, de l'ombre ou de la nourriture ?",
    ],
    defi: "Prépare un bol d'eau fraîche pour un animal dehors, ou un peu de graines pour les oiseaux — un jour ordinaire suffit.",
  },

  "animaux-partage-sans-occasion-2": {
    titre: "et le nichoir à deux marteaux",
    texte: `Dans le jardin de grand-mère, [PRENOM] et [PRENOM2] avaient trouvé une planche un peu trop courte et des clous un peu trop longs — parfait pour bricoler, disait papi.

"On fabrique un nichoir", annonça [PRENOM]. "Pour les mésanges du cerisier."

[PRENOM2] voulait le marteau en premier. [PRENOM] aussi.

Papi posa une règle : "On partage le marteau : dix coups chacun, puis on échange. Et on partage la fierté : un seul nichoir, deux prénoms gravés au dos."

Ils scièrent, assemblèrent, se trompèrent de trou, rirent, recommencèrent. Quand le nichoir fut prêt, ils le fixèrent haut, à l'abri des chats.

Les oiseaux ne vinrent pas tout de suite — les oiseaux ont leur propre calendrier.

Mais le lendemain, un petit bec pointu passa la tête par l'entrée. [PRENOM2] sauta si fort que le banc trembla.

"On a partagé le travail", dit [PRENOM]. "Et maintenant on partage la joie."

Grand-mère apporta du thé : "Quand vous construisez pour les autres — même des petits à plumes — vous construisez aussi votre cœur."

Et le nichoir, sous le cerisier, devint une petite maison de partage, sans occasion autre que le printemps du ciel.`,
    citation: "Si quelqu'un plante un arbre dont les fruits profitent aux gens, c'est une aumône qui continue.",
    source: "Le Prophète Muhammad ﷺ • Mouslim",
    questions: [
      "Comment [PRENOM] et [PRENOM2] ont-ils partagé le travail sans se disputer le marteau ?",
      "Pourquoi attendre les oiseaux avec patience fait partie de l'histoire ?",
      "Quel petit projet pour la nature pourriez-vous faire ensemble cette semaine ?",
    ],
    defi: "Fabriquez ensemble une mangeoire ou un nichoir (ou dessinez le plan) : un seul projet, deux paires de mains.",
  },

  // ─── COURAGE / SANS OCCASION ───
  "princesse-courage-sans-occasion-1": {
    titre: "et le mot dit tout bas",
    texte: `La princesse [PRENOM] savait réciter des poèmes et nouer des rubans, mais il lui manquait une chose : parler fort quand quelque chose n'allait pas.

Un jour ordinaire à l'école, elle vit une fille se faire prendre son cartable et lancer au milieu de la cour. Les rires montèrent comme une vague froide.

Le cœur de [PRENOM] battit si fort qu'elle entendit le bruit dans ses oreilles. Elle pensa : "Si je ne dis rien, je suis d'accord."

Elle fit un pas. Puis deux.

"Rends le cartable", dit-elle d'une voix qui tremblait un peu — mais qui était vraie.

Le silence se posa une seconde. Un garçon ricana encore, puis ramassa le cartable, le jeta vers la fille sans regarder.

Après la récréation, la fille vint vers [PRENOM] :

"Merci. J'avais peur."

[PRENOM] répondit : "Moi aussi."

Le soir, sa mère lui expliqua : "Le courage n'est pas de ne pas avoir peur. C'est d'agir malgré la peur — comme le Prophète ﷺ nous l'enseigne quand il faut dire la vérité."

[PRENOM] inscrivit cette phrase dans son carnet secret, à côté d'un ruban rose : parfois, le plus beau bijou d'une princesse, c'est un mot juste dit au bon moment.`,
    citation: "Le croyant le plus parfait dans la foi est celui dont le comportement est le meilleur.",
    source: "Le Prophète Muhammad ﷺ • Tirmidhi",
    questions: [
      "Pourquoi est-ce difficile de parler quand tout le monde rit ?",
      "Comment [PRENOM] a-t-elle montré du courage sans crier ?",
      "Quelle petite vérité aimerais-tu dire avec douceur cette semaine ?",
    ],
    defi: "Si tu vois une injustice petite ou grande, dis un mot juste à un adulte de confiance — ou à la personne concernée, avec respect.",
  },

  "princesse-courage-sans-occasion-2": {
    titre: "et les escaliers du palais scolaire",
    texte: `Les escaliers du collège étaient hauts, larges, et souvent bruyants. [PRENOM] et [PRENOM2] les montaient ensemble depuis des années — jusqu'au jour où quelqu'un se moqua d'une élève à cause de son prénom.

Les mots étaient bêtes, mais tranchants comme du verre.

[PRENOM2] baissa les yeux. [PRENOM] serra les poings dans les manches.

"On ne monte pas", murmura [PRENOM]. "Pas tant qu'on n'a pas dit quelque chose."

Elles s'approchèrent. [PRENOM] prit la parole d'abord, la voix plus ferme qu'elle ne l'aurait crue :

"Arrêtez. Son prénom est beau, comme le vôtre."

[PRENOM2] ajouta : "Si vous continuez, on en parle à la vie scolaire. Ce n'est pas des blagues, c'est méchant."

Les moqueurs roulèrent des yeux, puis partirent sans s'excuser vraiment — mais le groupe se dispersa.

L'élève concernée souffla : "Merci. Je croyais que j'étais seule."

[PRENOM] répondit : "Tu ne l'es plus."

Ce soir, les deux sœurs parlèrent à leurs parents. Leur mère dit : "Le courage, à deux, c'est plus léger : comme un panier qu'on porte ensemble."

[PRENOM2] nota dans son agenda : "Demain, on vérifie si ça va mieux. Et si non, on remonte les escaliers encore."`,
    citation: "Quiconque parmi vous voit un mal qu'il le change de sa main, sinon de sa langue, sinon de son cœur.",
    source: "Le Prophète Muhammad ﷺ • Mouslim",
    questions: [
      "Pourquoi est-il plus facile d'agir quand on est deux, comme [PRENOM] et [PRENOM2] ?",
      "Quelle différence entre une \"blague\" et une parole blessante ?",
      "Comment pourriez-vous vérifier demain si la personne va mieux, sans la mettre mal à l'aise ?",
    ],
    defi: "Si vous voyez une moquerie, convenez ensemble d'une phrase simple pour arrêter ou prévenir un adulte.",
  },

  "licorne-courage-sans-occasion-1": {
    titre: "et la corne qui tremblait encore",
    texte: `[PRENOM] avait peur de se tromper. Quand la maîtresse demandait une réponse à voix haute, son cœur battait comme un tambour couvert d'un coussin.

Un jour sans particularité, elle savait la réponse. Elle le savait vraiment — le mot exact, au bout de la langue.

Mais la peur de se tromper était plus forte que la joie de savoir.

[PRENOM] ferma les yeux une seconde. Elle pensa à la licorne de son dessin : la corne droite, fière, même quand le vent secoue la crinière.

Elle leva la main.

La maîtresse l'appela. [PRENOM] se leva, articula le mot — et se trompa d'une lettre au milieu. Quelques rires étouffés éclatèrent.

Les joues de [PRENOM] brûlèrent.

Puis la maîtresse dit : "Merci d'avoir essayé. Qui d'autre osera corriger avec gentillesse ?"

Une autre main se leva. On corrigea ensemble, sans humiliation.

Après la classe, la maîtresse murmura : "Le courage, ce n'est pas la perfection. C'est la sincérité."

[PRENOM] sourit. Sa licorne intérieure avait tremblé — mais elle était restée debout.

Ce soir, elle ajouta sur son dessin une petite étoile près de la corne : pour se souvenir que se tromper en levant la main vaut mieux que d'avoir raison en silence.`,
    citation: "Allah n'aime pas celui qui se vante sans agir.",
    source: "Sens rapporté des enseignements prophétiques sur la sincérité et l'effort • À méditer avec un adulte",
    questions: [
      "Pourquoi [PRENOM] avait-elle peur même en connaissant la réponse ?",
      "Comment la maîtresse a-t-elle transformé l'erreur en apprentissage ?",
      "Qu'est-ce que tu aimerais oser dire ou faire à l'école, même si ta voix tremble ?",
    ],
    defi: "Lève la main au moins une fois cette semaine pour poser une question ou proposer une idée — même si tu n'es pas sûr à 100 %.",
  },

  "licorne-courage-sans-occasion-2": {
    titre: "et le spectacle sans rideau",
    texte: `L'école préparait une mini pièce de théâtre : trois phrases, un rire, un grand cœur. [PRENOM] et [PRENOM2] devaient jouer deux licornes qui s'égarent dans un nuage — puis se retrouvent grâce à l'amitié.

Le jour de la répétition générale, [PRENOM2] attrapa une angine. Sa voix devint un petit couinement.

"Je ne peux pas", chuchota-t-elle. "Si je parle, tout le monde va se moquer."

[PRENOM] lui serra la main.

"Alors je parle pour nous deux au début", dit [PRENOM]. "Et toi, tu fais juste un pas quand tu peux. Un pas, ce n'est pas tout le texte — c'est déjà du courage."

Elles montèrent sur scène. [PRENOM] dit les premières répliques un peu trop vite, le cœur battant. Puis [PRENOM2] souffla, prit son souffle, et prononça une seule phrase — claire, fragile, vraie.

La salle applaudit plus fort que pour les répliques parfaites.

Après, la maîtresse dit : "On n'a pas besoin d'un rideau pour être courageuses. Il suffit d'un pas."

En rentrant, [PRENOM2] murmura : "Demain, j'essaie deux phrases."

"Et moi je t'attends", répondit [PRENOM]. "Comme les licornes : même quand le nuage tremble."`,
    citation: "Allah n'attribue pas à une âme au-delà de ce qu'elle peut supporter.",
    source: "Coran • Sourate Al-Baqarah, verset 286",
    questions: [
      "Comment [PRENOM] a-t-elle soutenu [PRENOM2] sans la remplacer complètement ?",
      "Pourquoi une seule phrase dite avec courage peut suffire ?",
      "Quand as-tu eu besoin qu'on t'attende — ou qu'on parle pour toi au début ?",
    ],
    defi: "Entraîne-toi à dire une phrase difficile devant un miroir ou avec un proche : voix douce, regard levé.",
  },

  "super-héros-courage-sans-occasion-1": {
    titre: "et la peur traversée en douce",
    texte: `[PRENOM] n'aimait pas l'orage. Quand le ciel grondait, il se recroquevillait sous la couverture, même en étant "grand".

Un soir banal, la famille monta les valises dans un vieil escalier de service pour ranger des cartons. L'ampoule grillait parfois, l'ombre dansait sur les murs, et l'escalier grinçait comme un bateau.

Papa dit : "Je descends chercher une lampe."

[PRENOM] resta seul une minute — une minute qui dura comme une heure. Le vent cognait une fenêtre. Son imagination dessina des monstres dans les plis des draps pliés.

Alors il se souvint : le Prophète ﷺ, dans la peur, demandait protection à Allah avec des invocations simples.

[PRENOM] les murmura, le front contre le mur froid — pas pour devenir un robot sans peur, mais pour traverser la peur avec quelqu'un : Allah.

Quand papa revint, la lampe rendit aux cartons leur simple forme de cartons.

"J'avais peur", avoua [PRENOM].

"Le courage, c'est ça", répondit papa. "Dire la vérité et avancer quand même."

Ce soir-là, [PRENOM] comprit qu'un super-héros n'est pas sans peur : il marche avec.`,
    citation: "Les invocations du Prophète ﷺ en peur : refuge auprès d'Allah contre la lâcheté et la pauvreté.",
    source: "Rappel basé sur les du'as authentiques • À apprendre avec un enseignant",
    questions: [
      "Pourquoi [PRENOM] a-t-il eu peur même en étant aimé et en sécurité ?",
      "Comment demander aide à Allah peut aider quand on a peur ?",
      "Quelle peur \"petite\" aimerais-tu traverser avec une invocation et un adulte ?",
    ],
    defi: "Apprends une courte invocation de protection avec un parent (ou révise-la) et écris-la sur un papier près de ton lit.",
  },

  "super-héros-courage-sans-occasion-2": {
    titre: "et le grenier à deux lampes",
    texte: `Le grenier sentait la poussière et les souvenirs. [PRENOM] et [PRENOM2] devaient y monter pour retrouver un vieux tapis — mission simple, sauf que l'interrupteur était cassé.

Papi tendit deux lampes de poche : une chacun.

"Restez collés", dit-il. "Le courage, c'est l'équipe."

En haut des marches, un grincement fit sursauter [PRENOM2]. Elle recula d'un pas — et son pied manqua une latte.

[PRENOM] attrapa son bras.

"Je suis là", dit-il. "On respire. On avance. On ne se moque pas de la peur : on la nomme."

[PRENOM2] hocha la tête. Ils montèrent lentement, faisceaux croisés, comme deux projecteurs de sauvetage.

Quand ils trouvèrent le tapis roulé au fond, ce n'était même pas la plus belle découverte : c'était le rire soulagé de [PRENOM2], et le sourire fier de [PRENOM].

En descendant, papi dit : "Quand vous marchez ensemble, la peur se divise."

[PRENOM] ajouta : "Et la lumière aussi."

Ce soir, ils rangèrent les lampes en se promettant : la prochaine mission nocturne, ce serait avec la même règle — deux faisceaux, une équipe.`,
    citation: "La main d'Allah est avec le groupe.",
    source: "Le Prophète Muhammad ﷺ • Tirmidhi • Hadith hassan",
    questions: [
      "Comment les deux lampes symbolisent-elles l'entraide entre [PRENOM] et [PRENOM2] ?",
      "Pourquoi nommer la peur à voix haute peut aider ?",
      "Quelle \"mission\" à deux pourriez-vous faire pour affronter une petite peur ?",
    ],
    defi: "Affrontez ensemble un endroit un peu sombre ou un petit défi : deux personnes, deux respirations, un pas à la fois.",
  },

  "animaux-courage-sans-occasion-1": {
    titre: "et le chat sous la pluie",
    texte: `La pluie tombait sans cérémonie, comme elle sait le faire au printemps. [PRENOM] rentrait de l'école quand il entendit un miaulement fin sous la voiture voisine.

Un chaton trempé, frissonnant, collé contre la roue.

[PRENOM] eut peur : peur des griffes, peur du moteur qui pourrait démarrer, peur de ne pas savoir faire.

Mais il pensa : "Si je pars, qui viendra ?"

Il posa son cartable à l'abri, parla doucement, tendit son écharpe comme hamac improvisé. Le chaton griffa un peu — c'était normal — puis se laissa glisser dans le tissu chaud.

[PRENOM] frappa à la porte du voisin : "Il y a un chaton. On appelle qui ?"

Ensemble, ils téléphonèrent à une association. Quelqu'un vint avec une cage et des mots rassurants.

Ce soir, [PRENOM] n'avait pas sauvé le monde entier — seulement une petite vie tremblante. Et c'était énorme.

Sa mère lui dit : "Le Prophète ﷺ nous a appris la compassion aux animaux. Ton courage, aujourd'hui, c'était d'agir malgré ta peur."

[PRENOM] sourit : parfois, être fort, c'est être doux avec précaution.`,
    citation: "Une femme fut punie à cause d'un chat qu'elle avait emprisonnée jusqu'à ce qu'elle meure de faim.",
    source: "Le Prophète Muhammad ﷺ • Boukhari et Mouslim (épisode enseignant la compassion)",
    questions: [
      "Quelles peurs [PRENOM] devait-il dépasser pour aider le chaton ?",
      "Pourquoi demander de l'aide aux adultes était une bonne idée ?",
      "Quelle petite créature ou situation mérite qu'on s'arrête, même quand on a un peu peur ?",
    ],
    defi: "Apprends le numéro d'une association ou les gestes de base (ne pas mettre les doigts au hasard) avec un adulte — pour être prêt à aider sans te mettre en danger.",
  },

  "animaux-courage-sans-occasion-2": {
    titre: "et le nid tombé du tilleul",
    texte: `Sous le grand tilleul du jardin, [PRENOM] et [PRENOM2] trouvèrent un nid cassé, trois œufs froids, et un silence inquiétant.

Les parents étaient partis chercher du fil à papi pour arrimer une échelle. Les enfants restèrent seuls deux minutes — deux minutes énormes.

[PRENOM2] voulut toucher les œufs tout de suite.

"Stop", dit [PRENOM]. "On respire. On réfléchit. On protège sans briser."

Ils s'accroupirent, éloignèrent le chat du voisin d'un panier renversé, couvrirent les œufs d'un châle léger pour garder la chaleur sans écraser.

Quand papi revint avec une petite échelle et des gants, ils lui expliquèrent calmement ce qu'ils avaient fait — et ce qu'ils n'avaient pas osé faire, par prudence.

Ensemble, on replaça le nid, aussi haut que possible, près de la branche d'origine. Ce n'était pas parfait — mais c'était humain et doux.

Ce soir, [PRENOM2] dit : "J'avais peur, mais tu parlais."

[PRENOM] répondit : "J'avais peur aussi, mais tu écoutais."

Leur mère conclut : "Le courage à deux, c'est une tempête plus petite : comme un nid qu'on remet avec des mains qui tremblent un peu, mais qui aiment."`,
    citation: "Il n'y a de force et de puissance qu'en Allah.",
    source: "Formule de l'ḥawqala (rappel de confiance) • Rapportée notamment par Al-Boukhari et Mouslim",
    questions: [
      "Pourquoi [PRENOM] a-t-il demandé d'attendre avant de toucher aux œufs ?",
      "Comment chacun a-t-il contribué : la prudence, le calme, l'écoute ?",
      "Quand est-ce que demander un adulte est le geste le plus courageux ?",
    ],
    defi: "Si vous trouvez un animal blessé, rappelez-vous : protéger la scène, ne pas courir partout, prévenir un adulte — c'est déjà du courage.",
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
 * Candidats de clés : clé normalisée (ASCII) + clé segment (accents) × variantes.
 * @param {string} univers
 * @param {string} valeur
 * @param {string} occasion
 * @param {1|2} n
 */
function collectKeyCandidates(univers, valeur, occasion, n) {
  const bases = [
    `${normalize(univers)}-${normalize(valeur)}-${normalize(occasion)}-${n}`,
    storyKey(univers, valeur, occasion, n),
  ];
  const out = [];
  const seen = new Set();
  for (const b of bases) {
    for (const k of keyVariants(b)) {
      if (!seen.has(k)) {
        seen.add(k);
        out.push(k);
      }
    }
  }
  return out;
}

/**
 * @param {string} univers
 * @param {string} valeur
 * @param {string} occasion
 * @param {1|2} nbEnfants
 * @returns {StoryEntry | undefined}
 */
function lookupRawStoryEntry(univers, valeur, occasion, nbEnfants) {
  const n = nbEnfants === 2 ? 2 : 1;
  const attempts = n === 2 ? [2, 1] : [1];
  for (const nn of attempts) {
    for (const k of collectKeyCandidates(univers, valeur, occasion, nn)) {
      if (STORIES[k]) return STORIES[k];
    }
  }
  const u = segment(univers);
  const partial = Object.keys(STORIES).find((key) => key.startsWith(`${u}-`));
  if (partial) return STORIES[partial];
  return undefined;
}

/**
 * Liste les identifiants d'histoires présentes dans STORIES.
 * @returns {string[]}
 */
export function getAvailableStories() {
  return Object.keys(STORIES);
}

/**
 * @param {string} univers
 * @param {string} valeur
 * @param {string} occasion
 * @param {1|2} nbEnfants
 * @param {string} [prenom1]
 * @param {string} [prenom2]
 * @returns {StoryEntry | null}
 */
export function getStory(univers, valeur, occasion, nbEnfants, prenom1 = "", prenom2 = "") {
  const n = nbEnfants === 2 ? 2 : 1;
  const primaryKey = `${normalize(univers)}-${normalize(valeur)}-${normalize(occasion)}-${n}`;

  if (process.env.NODE_ENV === "development") {
    console.log("getStory key (normalized):", primaryKey);
  }

  const raw = lookupRawStoryEntry(univers, valeur, occasion, nbEnfants);

  if (process.env.NODE_ENV === "development") {
    console.log("Story found:", !!raw);
  }

  if (!raw) {
    console.error(`Histoire non trouvée pour la clé : ${primaryKey}`);
    return null;
  }

  return applyPrenomsToStory(raw, prenom1, prenom2);
}

/**
 * Comme getStory, mais retombe sur l'histoire par défaut si aucune entrée ne correspond.
 * @param {string} univers
 * @param {string} valeur
 * @param {string} occasion
 * @param {1|2} nbEnfants
 * @param {string} [prenom1]
 * @param {string} [prenom2]
 * @returns {StoryEntry}
 */
export function getStoryOrDefault(univers, valeur, occasion, nbEnfants, prenom1 = "", prenom2 = "") {
  const raw = lookupRawStoryEntry(univers, valeur, occasion, nbEnfants) || DEFAULT_STORY;
  return applyPrenomsToStory(raw, prenom1, prenom2);
}

export default STORIES;
