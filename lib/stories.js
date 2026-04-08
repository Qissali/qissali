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
    titre: "et le gâteau qui rétrécissait",
    texte: `Il était une fois une petite princesse 
prénommée [PRENOM].

[PRENOM] était généreuse pour beaucoup de choses. 
Elle prêtait ses crayons, elle offrait ses sourires, 
elle partageait ses secrets avec ses meilleures amies.

Mais il y avait une chose que [PRENOM] avait du mal 
à partager.

Son gâteau au chocolat.

Pas n'importe quel gâteau — celui de maman. Avec le 
glaçage brillant, les petites étoiles en sucre rose, 
et cette odeur qui envahissait toute la maison et 
donnait envie de fermer les yeux tellement c'était bon.

Chaque fois que maman le sortait du four, [PRENOM] 
avait la même pensée : j'espère qu'il n'y en a que 
pour moi.

Ce soir-là, maman avait fait le gâteau.

[PRENOM] était assise à table, les yeux brillants, 
la petite cuillère déjà dans la main.

Maman posa le gâteau au centre. Il était magnifique, 
rond, brun, brillant, avec huit petites étoiles roses 
disposées en cercle.

Je t'en coupe une grosse part ? dit maman.

Très grosse, dit [PRENOM] sans hésiter.

Mais à ce moment-là, on frappa à la porte.

C'était la petite Lena, la voisine du dessus, avec 
ses deux grandes nattes et son manteau rouge. Elle 
semblait avoir couru.

Bonsoir, dit-elle timidement. Maman m'a envoyée vous 
rendre votre plat. Elle dit merci pour la semaine 
dernière.

Elle tendit le plat à maman, puis ses yeux tombèrent 
sur le gâteau.

Ses yeux s'écarquillèrent. Juste une seconde. Puis 
elle détourna le regard très vite, comme si elle avait 
peur de paraître gourmande.

Mais [PRENOM] avait vu.

Ce regard, elle le connaissait. C'était exactement 
celui qu'elle avait quand elle passait devant la 
boulangerie et qu'elle n'avait pas d'argent dans 
la poche.

[PRENOM] regarda son gâteau. Ses huit étoiles roses.

Elle pensa à sa grosse part. Bien méritée. 
Très attendue.

Puis dans sa tête, quelque chose se passa. Une voix, 
pas la sienne, plus douce, plus sage. La voix de papa, 
qui lui avait dit un soir en lisant une histoire :

Le Prophète ﷺ a dit que le meilleur d'entre vous 
est celui qui nourrit les autres. Donner de la 
nourriture, c'est un acte que Allah aime 
particulièrement.

[PRENOM] regarda Lena. Regarda le gâteau. 
Regarda Lena encore.

Puis elle dit quelque chose qui la surprit elle-même.

Lena, tu veux rester manger du gâteau avec nous ?

Lena ouvrit la bouche. La referma. Puis sourit, 
un sourire tellement grand que ses nattes semblèrent 
se soulever toutes seules.

Vraiment ?

Vraiment, dit [PRENOM]. Maman fait le meilleur gâteau 
du monde. Ce serait dommage de ne pas le partager.

Maman les regarda toutes les deux et sourit sans 
rien dire. Elle alla chercher une deuxième assiette.

Ce soir-là, [PRENOM] mangea une part un peu moins 
grosse que prévu.

Mais quelque chose d'étrange s'était passé.

Le gâteau avait l'air encore meilleur qu'avant. 
Chaque bouchée semblait plus sucrée, plus légère. 
Comme si partager l'avait rendu différent, ou comme 
si c'était elle qui était différente.

À la fin, il ne restait plus qu'une étoile rose 
sur le plat.

Prends-la, dit [PRENOM] à Lena.

Non toi, dit Lena.

On la coupe en deux ?

Elles éclatèrent de rire en même temps.

Et maman, depuis la cuisine, les entendit rire, 
et ferma les yeux une seconde avec un petit sourire 
dans le coeur.`,
    citation: "Le meilleur d'entre vous est celui qui nourrit les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Abu Dawud",
    questions: [
      "Pourquoi [PRENOM] avait-elle du mal à partager son gâteau ?",
      "Qu'est-ce qui l'a fait changer d'avis ?",
      "Le gâteau lui a-t-il semblé meilleur ou moins bon après avoir partagé ? Pourquoi à ton avis ?",
    ],
    defi: "Cette semaine, partage quelque chose que tu aimes vraiment avec quelqu'un. Et observe comment tu te sens après.",
  },

  "princesse-partage-sans-occasion-2": {
    titre: "et le royaume du milieu",
    texte: `Il était une fois deux soeurs qui aimaient 
beaucoup de choses ensemble, les promenades sous la 
pluie, les histoires avant de dormir, les fous rires 
du dimanche matin.

Mais il y avait une chose sur laquelle [PRENOM1] 
et [PRENOM2] ne s'entendaient pas toujours.

Le partage.

Pas le partage avec les autres, ça elles savaient 
faire. Mais le partage entre elles.

[PRENOM1], l'ainée, aimait les grandes parts. 
Normal, disait-elle, je suis la grande.
[PRENOM2], la petite, aimait les parts égales. 
Normal, disait-elle, on est soeurs.

Et parfois, ces deux opinions s'échangeaient dans 
la maison comme deux petits nuages qui se pourchassent.

Ce jour-là, maman avait reçu un cadeau de tante Soraya.

Un bocal de miel. Un vrai, doré, épais, qui brillait 
comme de l'or liquide. Avec une étiquette dessinée 
à la main : Miel de fleurs de montagne, pour les 
petites princesses de la maison.

Vous pouvez le manger au goûter, dit maman. 
Chacune sa tartine.

[PRENOM1] s'empressa de couper le pain. Une grande 
tranche pour elle. Une petite pour [PRENOM2].

[PRENOM2] la regarda.

Ma tranche est plus petite.

Tu es plus petite, dit [PRENOM1].

Et alors ? Le miel ne sait pas qui est grande 
ou petite.

Maman arriva dans la cuisine et vit les deux soeurs 
face à face, les bras croisés, de chaque côté de 
la table. Elle s'assit entre elles.

Je vais vous raconter quelque chose, dit-elle.

Elles la regardèrent.

Le Prophète ﷺ a dit : Aucun de vous ne croit 
vraiment tant qu'il n'aime pas pour son frère 
ce qu'il aime pour lui-même.

Ça veut dire quoi ? demanda [PRENOM2].

Ça veut dire, dit maman doucement, que si tu veux 
une grande part pour toi, tu dois aussi vouloir 
une grande part pour ta soeur. Parce que vous vous 
aimez, non ?

Un silence s'installa dans la cuisine. Pas un silence 
de colère, un silence de celles qui réfléchissent 
vraiment.

[PRENOM1] regarda sa grande tranche. Puis la petite 
tranche de sa soeur.

Elle se leva, prit le couteau, et coupa sa tranche 
en deux.

Puis elle empila les deux morceaux et les coupa 
encore, cette fois en parts parfaitement égales.

Elle en poussa une vers [PRENOM2].

Parts égales, dit-elle simplement.

[PRENOM2] la regarda. Quelque chose dans ses yeux 
changea.

En fait, dit [PRENOM2], je préfère la petite part. 
Le pain ça remplit trop. C'est le miel qui est bon.

[PRENOM1] éclata de rire.

Alors prends la grande et donne-moi la petite.

Non non non, elles sont égales maintenant !

Elles rirent encore. Maman aussi, depuis le couloir, 
en faisant semblant de ne pas entendre.

Ce soir-là, les deux soeurs mangèrent leur tartine 
de miel ensemble, assises sur le rebord de la fenêtre, 
les pieds dans le vide, à regarder les nuages passer.

Et le miel avait exactement le même goût pour les deux.

Doux. Chaud. Parfait.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi [PRENOM1] a-t-elle changé d'avis ?",
      "Qu'est-ce que le hadith de maman leur a appris ?",
      "Vous arrive-t-il de vous disputer pour des parts ? Comment vous faites pour trouver un accord ?",
    ],
    defi: "Cette semaine, chaque fois que vous partagez quelque chose, dites à voix haute : ce que je veux pour moi, je le veux pour toi aussi. Et voyez ce que ça change.",
  },

  "licorne-partage-sans-occasion-1": {
    titre: "et la licorne des deux couleurs",
    texte: `Il était une fois une petite fille prénommée 
[PRENOM] qui croyait très fort à la magie.

Et la magie, un matin, frappa à sa fenêtre.

[PRENOM] ouvrit les yeux, regarda le jardin, et vit 
quelque chose qu'elle n'avait jamais vu de sa vie.

Une licorne.

Petite, pas plus grande qu'un cheval de bois. Rose 
d'un côté, dorée de l'autre. Avec une corne argentée 
qui scintillait dans la lumière du matin et des yeux 
violets doux comme du velours.

Elle broutait tranquillement les fleurs du jardin 
comme si c'était la chose la plus normale du monde.

[PRENOM] descendit les escaliers quatre à quatre, 
ouvrit la porte du jardin tout doucement pour ne pas 
l'effrayer, et s'approcha.

La licorne leva la tête et dit d'une voix qui 
ressemblait au tintement d'une petite cloche :

Bonjour [PRENOM].

Bonjour, dit [PRENOM] en essayant de ne pas avoir 
l'air trop stupéfaite. Tu me connais ?

Je connais tous les enfants qui croient vraiment 
à la magie, dit la licorne. Et toi, tu crois vraiment.

[PRENOM] s'assit dans l'herbe à côté d'elle.

Tu t'appelles comment ?

Nur, dit la licorne. Lumière, en arabe.

Nur resta dans le jardin toute la journée.

[PRENOM] ne voulait le dire à personne. C'était sa 
licorne, son secret, sa magie à elle. Elle renvoya 
sa petite cousine Inaya qui était venue jouer, 
inventa une excuse pour que maman ne sorte pas dans 
le jardin, et passa la journée seule avec Nur.

C'était la plus belle journée de sa vie.

Mais le soir, quand le soleil commença à descendre, 
Nur fit quelque chose d'étrange.

Elle pâlit.

Le rose de ses flancs devint blanc. Le doré s'éteignit. 
Même la corne argentée sembla moins brillante.

Qu'est-ce qui se passe ? dit [PRENOM], inquiète.

Nur la regarda de ses yeux violets.

La magie des licornes s'alimente d'une seule chose, 
dit-elle doucement.

Laquelle ?

Le partage.

[PRENOM] la regarda sans comprendre.

Quand tu gardes quelque chose de beau rien que pour 
toi, dit Nur, la magie s'éteint. Mais quand tu le 
partages, quand tu donnes à quelqu'un d'autre la joie 
que tu as reçue, elle brille encore plus fort.

[PRENOM] réfléchit. Elle pensa à Inaya qu'elle avait 
renvoyée.

Si je t'avais montrée à Inaya, dit-elle lentement.

Je serais deux fois plus lumineuse, dit Nur.

Un silence.

[PRENOM] pensa à une chose que papa lui avait dite, 
une phrase du Prophète ﷺ qu'il répétait souvent :

Le meilleur d'entre vous est celui qui est le meilleur 
envers les autres.

Elle se leva.

Attends-moi, dit-elle à Nur.

Elle courut à l'intérieur, décrocha le téléphone, 
appela Inaya.

Reviens. J'ai quelque chose à te montrer. 
Quelque chose de magique.

Quand Inaya arriva dans le jardin dix minutes plus 
tard, les yeux écarquillés, la bouche ouverte, Nur 
était là, plus rose, plus dorée, plus lumineuse 
que jamais.

Sa corne projetait de petits arcs-en-ciel sur les 
murs du jardin.

Inaya prit la main de [PRENOM] très fort.

C'est réel ? chuchota-t-elle.

Oui, dit [PRENOM]. Et elle est encore plus belle 
à deux.`,
    citation: "Le meilleur d'entre vous est celui qui est le meilleur envers les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi Nur a-t-elle pâli quand [PRENOM] gardait la licorne pour elle seule ?",
      "Qu'est-ce que ça veut dire la magie s'alimente du partage selon toi ?",
      "Comment tu crois qu'Inaya s'est sentie quand [PRENOM] l'a rappelée ?",
    ],
    defi: "Cette semaine, partage quelque chose de beau avec quelqu'un. Un moment, un jouet, une histoire. Et observe si la magie brille plus fort.",
  },

  "licorne-partage-sans-occasion-2": {
    titre: "et Nur la licorne des soeurs",
    texte: `Il était une fois deux soeurs qui partageaient 
une chambre, un jardin, et presque tous leurs secrets.

[PRENOM1] et [PRENOM2] étaient différentes sur 
beaucoup de points, l'une aimait les livres, l'autre 
les courses dans l'herbe, mais elles avaient une chose 
en commun absolue.

Elles croyaient toutes les deux à la magie.

Et un matin d'été, la magie leur rendit visite.

Elles l'aperçurent en même temps, depuis la fenêtre 
de leur chambre : une licorne dans le jardin. Petite, 
rose et dorée, avec une corne argentée et des yeux 
violets doux comme du velours.

Elles descendirent ensemble, main dans la main, 
et s'approchèrent.

La licorne leva la tête.

Bonjour [PRENOM1]. Bonjour [PRENOM2], dit-elle 
d'une voix de clochette.

Tu nous connais toutes les deux ? souffla [PRENOM2].

Je connais les soeurs qui partagent vraiment, dit 
la licorne. Pas juste les choses, mais leurs coeurs.

Je m'appelle Nur, ajouta-t-elle. Lumière.

Nur passa la journée avec elles.

Et là, quelque chose d'inattendu se produisit.

[PRENOM1] voulait montrer Nur à sa meilleure amie 
Rania.
[PRENOM2] voulait la garder juste pour elles deux 
encore un peu.

C'est notre licorne, dit [PRENOM2]. Si on la montre 
à tout le monde, elle ne sera plus spéciale.

Si on la garde pour nous, dit [PRENOM1], on est 
égoïstes.

Un silence s'installa. Même Nur sembla attendre.

Puis [PRENOM1] dit doucement :

Je me souviens de ce que maman nous a lu l'autre soir. 
Une parole du Prophète ﷺ.

Aucun de vous ne croit vraiment tant qu'il n'aime 
pas pour son frère ce qu'il aime pour lui-même, 
dit [PRENOM2] à voix basse. Elle s'en souvenait aussi.

On a aimé voir Nur, dit [PRENOM1]. Alors on devrait 
vouloir que Rania aime ça aussi.

[PRENOM2] resta silencieuse un moment. Puis elle 
hocha la tête.

D'accord. On appelle Rania.

Quand Rania arriva dans le jardin et vit Nur, elle 
s'arrêta net. Ses yeux devinrent immenses. Et Nur 
devint deux fois plus brillante. Sa corne projetait 
des arcs-en-ciel partout. Le rose de ses flancs 
s'intensifia jusqu'à devenir lumineux.

Elle est encore plus belle ! chuchota [PRENOM2], 
stupéfaite.

Je t'avais dit, murmura [PRENOM1] avec un sourire.

Nur se tourna vers les deux soeurs.

La magie des licornes s'alimente du partage, dit-elle 
doucement. Plus vous donnez, plus elle grandit. C'est 
la règle de toutes les choses vraiment belles.

Ce soir-là, les deux soeurs s'endormirent dans leur 
chambre avec la même image dans la tête : Nur, 
lumineuse, dans le jardin. Plus belle parce qu'elles 
l'avaient partagée.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi [PRENOM2] ne voulait-elle pas partager Nur au début ?",
      "Qu'est-ce qui l'a fait changer d'avis ?",
      "Nur est-elle devenue plus ou moins belle après que Rania soit arrivée ?",
    ],
    defi: "Cette semaine, choisissez ensemble quelque chose de beau à partager avec quelqu'un. Un moment, un jouet, une surprise. Et regardez si la magie grandit.",
  },

  "super-héros-partage-sans-occasion-1": {
    titre: "et le super-pouvoir qu'il ne savait pas qu'il avait",
    texte: `Il était une fois un petit garçon prénommé 
[PRENOM] qui cherchait son super-pouvoir.

Pas une cape, ça il en avait une, rouge avec des 
étoiles dorées, que maman lui avait cousue pour 
son anniversaire.

Pas la force, il était déjà assez fort pour ouvrir 
les bocaux difficiles de la cuisine.

Non. Ce que [PRENOM] cherchait, c'était son 
super-pouvoir à lui. Le truc unique, spécial, 
que personne d'autre n'avait.

Il avait essayé beaucoup de choses. Courir vite. 
Sauter haut. Retenir sa respiration. Parler aux 
oiseaux.

Rien de vraiment extraordinaire.

Un samedi matin, [PRENOM] était assis sur le banc 
du parc avec son sandwich au fromage et son jus 
d'orange.

Le meilleur sandwich du monde, pain frais de la 
boulangerie d'en bas, fromage qui fond, une touche 
de beurre exactement comme il l'aimait.

Il allait mordre dedans quand il remarqua le garçon.

Assis sur le banc d'en face. Environ son âge. Il 
regardait le sandwich de [PRENOM] avec des yeux 
qui essayaient de ne pas regarder mais qui regardaient 
quand même.

[PRENOM] mordit dans son sandwich.

Délicieux. Vraiment.

Il regarda le garçon à nouveau. Le garçon regarda 
ailleurs très vite.

[PRENOM] finit la moitié de son sandwich.

Puis il s'arrêta.

Dans sa tête, une voix s'éleva, la voix de grand-père, 
lente et douce, qui lui racontait des histoires du 
Prophète ﷺ après la prière du vendredi :

Le Prophète ﷺ a dit : celui qui mange à sa faim 
tandis que son voisin a faim n'est pas vraiment 
croyant.

[PRENOM] regarda le reste de son sandwich. L'autre 
moitié, parfaite, intacte.

Il se leva. Traversa l'allée. S'assit à côté du 
garçon.

Tu veux la moitié ? dit-il en tendant le sandwich.

Le garçon le regarda, surpris.

Pourquoi ?

Parce que j'ai assez mangé et que tu regardais 
mon sandwich.

Le garçon rougit un peu.

Je regardais pas.

Un peu quand même, dit [PRENOM] avec un sourire.

Un silence. Puis le garçon prit la moitié du sandwich.

Merci, dit-il.

Ils mangèrent en silence, côte à côte sur le banc, 
à regarder les pigeons se battre pour une miette 
de pain.

En rentrant chez lui, [PRENOM] réfléchissait.

Il avait faim, la moitié d'un sandwich c'est pas 
énorme. Mais quelque chose dans sa poitrine était 
plein. Plein d'une façon différente. Une chaleur 
tranquille, solide.

Il trouva grand-père dans le salon.

Papy, dit-il. Je crois que j'ai trouvé mon 
super-pouvoir.

Grand-père leva les yeux de son livre.

Lequel ?

Le partage, dit [PRENOM]. Ça marche vraiment comme 
un super-pouvoir. On donne quelque chose et on se 
sent plus fort après.

Grand-père sourit, un de ces sourires lents qui 
commencent dans les yeux.

Le Prophète ﷺ avait ce pouvoir, dit-il. Et tous 
ceux qui suivent son exemple aussi.

[PRENOM] rentra dans sa chambre, prit sa cape rouge 
étoilée, et la porta jusqu'au soir.

Parce qu'il savait maintenant pourquoi elle lui 
allait aussi bien.`,
    citation: "Celui qui mange à sa faim tandis que son voisin a faim n'est pas vraiment croyant.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Al-Hakim",
    questions: [
      "Pourquoi [PRENOM] a-t-il donné sa moitié de sandwich alors qu'il avait encore faim ?",
      "Comment tu expliques que partager l'ait rendu plein d'une autre façon ?",
      "Selon toi, pourquoi le partage est-il un super-pouvoir ?",
    ],
    defi: "Cette semaine, utilise ton super-pouvoir du partage une fois par jour. Ça peut être minuscule, un biscuit, un sourire, une place dans la file. Et compte combien de fois tu l'utilises.",
  },

  "super-héros-partage-sans-occasion-2": {
    titre: "et l'équipe la plus forte du quartier",
    texte: `Il était une fois deux frères qui voulaient 
être les meilleurs super-héros du quartier.

[PRENOM1], l'aîné, était le stratège, celui qui 
planifiait, réfléchissait, anticipait. Sa cape était 
bleue avec une étoile argentée.

[PRENOM2], le cadet, était le fonceur, celui qui 
agissait, courait, sautait sans réfléchir trop 
longtemps. Sa cape était rouge avec un éclair doré.

Ensemble, ils formaient une équipe imbattable.

Ce samedi, ils avaient décidé de faire une mission : 
distribuer les cookies que maman avait faits la veille 
aux voisins du quartier.

Un grand sac de cookies aux pépites de chocolat, 
encore légèrement tièdes, qui sentaient si bon que 
[PRENOM2] en avait déjà mangé trois en secret 
ce matin.

Ils partirent ensemble, le sac à dos sur les épaules 
de [PRENOM1].

Première maison : Madame Yasmina, qui vivait seule 
et qui sourit tellement en ouvrant la porte qu'ils 
eurent envie de lui en donner deux fois plus.

Deuxième maison : le petit Bilal, qui avait une jambe 
dans le plâtre et ne pouvait pas sortir jouer.

Troisième maison : la famille au bout de la rue, 
avec les quatre enfants qui se précipitèrent tous 
en même temps.

Mais au bout de la rue, il y avait un problème.

Plus qu'un cookie.

[PRENOM1] le sortit du sac. Un cookie parfait, rond, 
brillant de pépites.

Je l'ai porté tout le sac, dit [PRENOM1]. Donc il 
est pour moi.

J'en ai mangé zéro depuis le départ, dit [PRENOM2]. 
Donc il est pour moi.

Ils se regardèrent. Le cookie entre eux.

[PRENOM1] dit :

On n'a pas fini notre mission.

Comment ça ? dit [PRENOM2].

[PRENOM1] désigna quelque chose du menton.

De l'autre côté de la rue, un vieux monsieur qu'ils 
ne connaissaient pas était assis sur un banc. Tout 
seul. Il regardait passer les gens avec des yeux 
calmes et un peu fatigués.

[PRENOM2] le regarda. Puis regarda le cookie.

Puis il pensa à la phrase que papa leur lisait 
parfois, le soir, après la prière :

Le Prophète ﷺ a dit que le meilleur d'entre vous 
est celui qui nourrit les autres.

On lui donne, dit [PRENOM2] simplement.

[PRENOM1] le regarda.

T'es sûr ? C'était le dernier.

C'est pour ça que c'est le plus important, 
dit [PRENOM2].

Ils traversèrent la rue ensemble. [PRENOM1] tendit 
le cookie au vieux monsieur.

Bonsoir monsieur. On vous offre ça. C'est notre 
maman qui les a faits.

Le vieux monsieur les regarda longuement. Puis il 
prit le cookie avec ses deux mains, comme s'il 
recevait quelque chose de précieux.

Que Allah vous bénisse, mes enfants, dit-il d'une 
voix douce.

En rentrant, les deux frères avaient les mains vides 
et l'estomac qui gargouillait un peu.

Mais ils marchaient différemment. Plus droits. 
Plus légers.

On est vraiment une bonne équipe, dit [PRENOM2].

La meilleure, dit [PRENOM1]. Parce qu'on partage.`,
    citation: "Le meilleur d'entre vous est celui qui nourrit les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Abu Dawud",
    questions: [
      "Qui a eu l'idée de donner le dernier cookie au vieux monsieur ?",
      "Pourquoi [PRENOM2] dit-il c'est le dernier donc c'est le plus important ?",
      "Comment les deux frères se sentaient-ils en rentrant ?",
    ],
    defi: "Cette semaine, inventez ensemble une mission de partage. Préparez quelque chose, donnez-le à quelqu'un qui en a besoin. Et faites-le en équipe, comme de vrais super-héros.",
  },

  "animaux-partage-sans-occasion-1": {
    titre: "et le jardin qui nourrissait tout le monde",
    texte: `Il était une fois un enfant prénommé [PRENOM] 
qui avait un jardin.

Pas un grand jardin, juste un carré de terre derrière 
la maison, avec trois rangées de fraisiers, un rosier 
récalcitrant, et un vieux pommier qui donnait des 
pommes exactement deux mois par an.

Mais c'était son jardin. Il l'avait planté, arrosé, 
désherbé, surveillé depuis le printemps.

Et maintenant les fraises étaient mûres.

Des dizaines de fraises rouges, brillantes, sucrées. 
[PRENOM] en avait goûté une ce matin et elle avait 
failli s'asseoir par terre tellement c'était bon.

Ces fraises sont à moi, décida-t-il. Je les ai fait 
pousser. Elles sont pour moi.

Le lendemain matin, en arrivant dans le jardin, 
[PRENOM] trouva quelqu'un qu'il n'attendait pas.

Un hérisson.

Petit, brun, avec des yeux noirs brillants comme 
deux perles, il était assis au pied du fraisier 
et regardait [PRENOM] avec une expression qui 
ressemblait à de la politesse.

Bonjour [PRENOM], dit le hérisson.

[PRENOM] cligna des yeux.

Tu parles ?

Quand les enfants méritent d'être entendus, on 
leur répond, dit le hérisson simplement. Je m'appelle 
Hakim.

Hakim, dit [PRENOM]. Comme le sage en arabe.

Exactement, dit Hakim. Et j'ai quelque chose 
à te dire.

Quoi ?

Ton jardin est magnifique, dit Hakim. Mais il 
pourrait faire quelque chose d'encore plus grand.

Nourrir tout le monde.

[PRENOM] fronça les sourcils.

Tout le monde c'est beaucoup. Il n'y en aura 
plus pour moi.

Vraiment ? dit Hakim. Essayons de compter.

Il leva une petite patte.

La famille de lapins sous la haie, ils ont faim 
ce matin. La maman oiseau dans le rosier, elle a 
trois oisillons à nourrir. La vieille tortue au 
fond du jardin, elle ne peut plus aller chercher 
à manger très loin.

[PRENOM] regarda autour de lui. Il n'avait jamais 
vraiment regardé son jardin comme ça.

Et moi ? dit-il.

Toi tu as une maison, un réfrigérateur, une maman 
qui cuisine, dit Hakim doucement. Eux, ils ont 
seulement ce que le jardin donne.

Un silence.

[PRENOM] pensa à quelque chose que grand-mère lui 
disait souvent, une parole du Prophète ﷺ qu'elle 
connaissait par coeur :

Quiconque plante un arbre ou sème des graines, 
et qu'un oiseau, un humain ou un animal en mange, 
cela lui est compté comme une aumône.

Il regarda ses fraisiers. Ses belles fraises rouges.

Ça veut dire que si les animaux mangent mes fraises, 
dit-il lentement.

Tu reçois une récompense d'Allah pour chaque bouchée, 
dit Hakim. Ton jardin devient une sadaqa. Une aumône 
qui travaille pour toi.

[PRENOM] s'assit dans l'herbe un moment. Il 
réfléchissait vraiment.

Puis il se leva, alla dans la maison, et revint 
avec un grand bol.

Il cueillit des fraises, une poignée pour lui qu'il 
mit dans sa poche. Le reste dans le bol. Il le posa 
au centre du jardin.

C'est pour tout le monde, dit-il.

Les lapins sortirent de sous la haie. Les oisillons 
piaillèrent. La tortue avança très lentement mais 
sûrement.

Et Hakim, le hérisson sage, hocha la tête avec 
dignité.

Ton jardin vient de devenir le plus grand du 
quartier, dit-il. Pas en taille. En coeur.

[PRENOM] mangea sa poignée de fraises dans l'herbe, 
les yeux sur son jardin plein de vie.

Elles avaient exactement le même goût que d'habitude.

Mais il lui sembla qu'elles étaient encore meilleures.`,
    citation: "Quiconque plante un arbre, et qu'un oiseau, un humain ou un animal en mange, cela lui est compté comme une aumône.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi Hakim dit-il que le jardin de [PRENOM] est le plus grand du quartier en coeur ?",
      "Qu'est-ce qu'une sadaqa selon toi ?",
      "Comment [PRENOM] se sentait-il après avoir partagé ses fraises ?",
    ],
    defi: "Cette semaine, donne quelque chose à quelqu'un ou quelque chose qui en a besoin, de la nourriture, du temps, de l'attention. Et pense que c'est une sadaqa que Allah compte pour toi.",
  },

  "animaux-partage-sans-occasion-2": {
    titre: "et le grand festin de la forêt",
    texte: `Il était une fois deux soeurs qui avaient 
toutes les deux le même don extraordinaire.

[PRENOM1] et [PRENOM2] pouvaient entendre les animaux 
parler.

Ça ne marchait que quand elles étaient ensemble, 
comme si leur amour de soeurs ouvrait une porte 
que ni l'une ni l'autre ne pouvait ouvrir seule.

Un samedi matin, leur amie Yasmine la renarde frappa 
à la fenêtre de leur chambre avec sa patte souple.

Venez vite, dit-elle. Il se passe quelque chose 
dans la forêt.

Elles suivirent Yasmine à travers le jardin, derrière 
la haie, jusqu'à la lisière de la forêt voisine.

Et là, elles virent : une grande clairière. Des 
dizaines d'animaux rassemblés en cercle. Des lapins, 
des oiseaux, des écureuils, une vieille chouette 
aux yeux immenses.

Au centre : un grand chêne. Et sous le chêne : 
des glands, des baies, des champignons, une vraie 
accumulation de nourriture.

Mais personne ne mangeait.

Pourquoi ils attendent ? murmura [PRENOM2].

Parce qu'ils ne savent pas comment partager, dit 
Yasmine. Chacun a apporté quelque chose, mais 
personne n'ose prendre de ce que l'autre a apporté. 
Ils ont peur de mal faire.

[PRENOM1] regarda la scène. Tous ces animaux, 
affamés, assis devant de la nourriture, paralysés.

C'est triste, dit-elle.

C'est surtout inutile, dit Yasmine.

[PRENOM2] tira la manche de sa soeur.

On fait quoi ?

[PRENOM1] réfléchit. Elle pensa à une parole du 
Coran que maman leur lisait.

Entraidez-vous dans la piété et la droiture.

On les aide à organiser le partage, dit [PRENOM1].

Elles s'avancèrent dans la clairière. Les animaux 
les regardèrent.

[PRENOM1] prit la parole :

Chacun a apporté quelque chose. Alors on met tout 
ensemble et on partage également. Personne ne repart 
avec moins que ce qu'il a apporté, et tout le monde 
repart avec de la variété.

[PRENOM2] commença à organiser, les glands d'un côté, 
les baies de l'autre, les champignons au centre. 
Elle faisait des petits tas égaux avec une précision 
qui impressionna même la vieille chouette.

Puis les deux soeurs distribuèrent.

Le festin commença.

Ce fut le repas le plus animé que la forêt avait 
connu depuis longtemps. Les lapins goûtèrent les 
baies pour la première fois. Les écureuils 
découvrirent les champignons. Les oiseaux partagèrent 
leurs graines avec tout le monde.

Et dans le brouhaha du festin, Yasmine s'approcha 
des deux soeurs.

Vous savez ce que vous avez fait aujourd'hui ?

On a aidé à partager, dit [PRENOM2].

Vous avez transformé de la peur en fête, dit Yasmine. 
C'est le plus grand pouvoir qui existe.

En rentrant chez elles ce soir-là, [PRENOM1] et 
[PRENOM2] marchaient dans l'herbe du soir, la main 
dans la main.

Tu crois qu'on pourrait faire ça chez les humains 
aussi ? dit [PRENOM2].

On le fait déjà, dit [PRENOM1]. Chaque fois 
qu'on partage.`,
    citation: "Entraidez-vous dans la piété et la droiture.",
    source: "Coran, Sourate Al-Maïda, verset 2",
    questions: [
      "Pourquoi les animaux n'osaient-ils pas manger même s'ils avaient faim ?",
      "Qu'est-ce que les deux soeurs ont fait pour débloquer la situation ?",
      "Yasmine dit qu'elles ont transformé de la peur en fête, qu'est-ce que ça veut dire selon vous ?",
    ],
    defi: "Cette semaine, soyez les organisatrices d'un partage, à la maison, à l'école, avec des amis. Proposez que tout le monde mette quelque chose en commun et voyez ce qui se passe.",
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

  // ─── RESPECT DES PARENTS / SANS OCCASION ───
  "princesse-respect-des-parents-sans-occasion-1": {
    titre: "et la couronne qui pesait lourd",
    texte: `Il était une fois une petite princesse 
prénommée [PRENOM].

[PRENOM] aimait sa maman plus que tout. Mais il y 
avait des jours où elle n'avait pas envie d'obéir.

Des jours où ranger sa chambre lui semblait la chose 
la plus injuste du monde. Des jours où éteindre la 
tablette quand maman disait c'est l'heure était une 
épreuve insurmontable. Des jours où elle répondait 
avec une voix un peu trop forte.

Ce matin-là était un de ces jours.

Maman avait demandé à [PRENOM] de mettre la table. 
[PRENOM] était au milieu d'un dessin important, 
une licorne avec sept couleurs différentes, 
presque terminée.

Pas maintenant, avait-elle dit sans lever les yeux.

Maman n'avait rien répondu. Mais quelque chose dans 
son silence avait un poids.

[PRENOM] finit sa licorne. Puis elle alla mettre la 
table, en retard, sans un mot.

Pendant le repas, maman était douce comme toujours. 
Elle ne dit rien de la licorne, rien du retard, 
rien du pas maintenant.

Et c'est ça qui était le plus difficile à porter.

L'après-midi, [PRENOM] alla voir grand-père 
dans son fauteuil.

Grand-père avait des mains grandes et douces et 
une façon de raconter les choses qui rendait 
tout plus clair.

Papy, est-ce que c'est grave de ne pas obéir 
tout de suite ?

Grand-père la regarda par-dessus ses lunettes.

Tu parles de ce matin ?

[PRENOM] hocha la tête.

Grand-père posa son livre.

Laisse-moi te raconter quelque chose. Dans le Coran, 
Allah parle des parents juste après avoir parlé 
de Lui-même. Juste après. Comme si c'était la chose 
la plus proche de Lui.

Et Il dit quelque chose de très précis. Il dit de 
ne même pas dire uff à ses parents. Pas de soupir. 
Pas d'impatience. Pas de pas maintenant.

Ton Seigneur a décrété que vous n'adoriez que Lui, 
et que vous traitiez vos parents avec bonté.

[PRENOM] resta silencieuse.

Pourquoi c'est si important ? demanda-t-elle.

Parce que ta maman, dit grand-père doucement, a passé 
des années à te mettre en premier. Avant elle. 
Avant tout. Quand tu avais faim la nuit, elle se 
levait. Quand tu avais peur, elle venait. Quand tu 
étais malade, elle ne dormait pas.

Il fit une pause.

Pas maintenant, c'est peu de choses comparé 
à tout ça.

[PRENOM] sentit quelque chose se serrer dans 
sa poitrine. Pas de la honte, quelque chose de 
plus doux. De la compréhension.

Elle se leva, alla dans la cuisine où maman 
préparait le goûter, et la serra dans ses bras 
par derrière, très fort, sans rien dire.

Maman posa ses mains sur les siennes.

Tout va bien ? dit-elle doucement.

Oui, dit [PRENOM]. Je voulais juste.

Maman sourit. Elle n'avait pas besoin d'en 
savoir plus.`,
    citation: "Ton Seigneur a décrété que vous traitiez vos parents avec bonté.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Pourquoi le silence de maman était-il plus difficile à porter qu'une punition ?",
      "Grand-père dit qu'Allah parle des parents juste après avoir parlé de Lui-même. Qu'est-ce que ça montre ?",
      "Comment [PRENOM] a-t-elle choisi de réparer les choses ?",
    ],
    defi: "Cette semaine, quand maman ou papa te demande quelque chose, lève-toi et fais-le sans attendre. Et observe comment ils se sentent.",
  },

  "princesse-respect-des-parents-sans-occasion-2": {
    titre: "et le jour où maman était fatiguée",
    texte: `Il était une fois deux soeurs prénommées 
[PRENOM1] et [PRENOM2].

Ce soir-là, maman rentra du travail avec des yeux 
fatigués et des épaules qui portaient quelque 
chose d'invisible.

[PRENOM1] le remarqua immédiatement. [PRENOM2] 
était trop occupée avec ses jouets pour regarder.

[PRENOM1] tira la manche de sa soeur.

Tu as vu maman ?

Quoi ? dit [PRENOM2] sans lever les yeux.

Elle est fatiguée. Vraiment fatiguée.

[PRENOM2] leva enfin les yeux. Elle regarda la 
cuisine. Maman se déplaçait lentement.

On peut faire quelque chose ? dit [PRENOM2].

Papa nous a lu quelque chose l'autre jour, dit 
[PRENOM1]. Un verset sur les parents. Il a dit 
qu'Allah nous demande de les traiter avec tellement 
de douceur qu'on ne doit même pas soupirer 
devant eux.

Même pas soupirer ?

Même pas. Alors imagine ce qu'on peut faire 
quand ils sont fatigués.

Les deux soeurs se regardèrent. Puis se levèrent.

[PRENOM1] alla dans la cuisine.

Maman, assieds-toi. On s'occupe du dîner.

Maman se retourna, surprise.

Vous savez pas cuisiner.

On peut réchauffer la soupe d'hier, dit [PRENOM2]. 
Et faire les tartines. Et mettre la table.

Et toi tu t'assieds, dit [PRENOM1] avec une voix 
qui n'admettait pas de discussion.

Maman les regarda toutes les deux. Puis elle s'assit.

Ce n'était pas parfait. [PRENOM2] renversa un peu 
de soupe, [PRENOM1] oublia les cuillères. Mais la 
table était mise, la soupe chaude, les tartines prêtes.

Quand papa arriva et vit la scène, maman assise, 
les filles aux fourneaux, il s'arrêta dans 
l'embrasure de la porte.

Qu'est-ce qui se passe ici ?

On s'occupe de maman, dit [PRENOM2] simplement.

Papa les regarda longuement. Puis il dit, 
d'une voix douce :

Le Prophète ﷺ a dit que le paradis est sous les 
pieds des mères. Ce soir, vous avez compris pourquoi.

Maman ne dit rien. Mais ses yeux, fatigués tout 
à l'heure, brillaient maintenant d'une autre façon.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Comment [PRENOM1] a-t-elle remarqué que maman était fatiguée ?",
      "Qu'est-ce que le paradis est sous les pieds des mères veut dire selon vous ?",
      "Papa dit qu'elles ont compris pourquoi. Vous comprenez ce qu'il veut dire ?",
    ],
    defi: "Cette semaine, faites ensemble quelque chose pour maman ou papa sans qu'ils vous le demandent. Rangez, préparez, aidez. Et observez leur visage.",
  },

  "licorne-respect-des-parents-sans-occasion-1": {
    titre: "et la licorne qui avait oublié",
    texte: `Il était une fois une petite fille prénommée 
[PRENOM] dont la licorne s'appelait Nour.

Nour était magnifique. Mais ce matin-là, 
quelque chose n'allait pas.

Nour était terne. Ses couleurs avaient pâli. 
Sa corne ne brillait plus.

[PRENOM] s'approcha, inquiète.

Nour, qu'est-ce qui t'arrive ?

La licorne leva des yeux tristes.

J'ai fait quelque chose que je regrette.

Quoi ?

Hier, ma maman m'a demandé de rentrer plus tôt. 
J'avais encore envie de courir dans les prairies. 
Alors j'ai dit non.

[PRENOM] la regarda.

Et alors ?

Et ma maman est rentrée seule, sans moi. Elle avait 
l'air triste. Et moi j'ai continué à courir, mais 
le plaisir avait disparu. Je pensais à elle 
tout le temps.

Et tes couleurs ont pâli depuis ?

Les licornes perdent leurs couleurs quand leur coeur 
n'est pas en paix, dit Nour. Et mon coeur n'est 
pas en paix depuis hier.

[PRENOM] s'assit dans l'herbe à côté d'elle.

Il faut que tu lui demandes pardon.

J'ai honte.

La honte c'est bien, dit [PRENOM] doucement. Ça veut 
dire que tu sais que tu as mal agi. Mais ça ne suffit 
pas. Il faut aller vers elle.

Elle prit le museau de Nour dans ses mains.

Tu sais ce qu'on nous apprend sur les parents ? 
Qu'Allah a mis leur satisfaction juste après la Sienne. 
Que quand ils sont contents de toi, Allah est content. 
Et quand ils sont blessés par toi, quelque chose 
se brise.

La satisfaction d'Allah est dans la satisfaction 
des parents, et Sa colère est dans leur colère.

Nour resta silencieuse un long moment.

Puis elle se leva. Et pour la première fois depuis 
la veille, elle trottina vers le bois où vivait 
sa maman.

[PRENOM] la regarda partir.

Et au moment où Nour disparut entre les arbres, 
quelque chose d'extraordinaire se produisit.

Une petite touche de rose revint sur ses flancs. 
Un éclair d'or sur sa corne.

Les couleurs revenaient. Pas toutes. Mais elles 
revenaient.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Pourquoi les couleurs de Nour avaient-elles pâli ?",
      "[PRENOM] dit que la honte c'est bien. Tu comprends pourquoi ?",
      "Pourquoi les couleurs ont-elles commencé à revenir avant même que Nour parle à sa maman ?",
    ],
    defi: "Cette semaine, fais quelque chose de gentil pour tes parents chaque jour. Un sourire, un câlin, une aide spontanée. Et observe si ton coeur est plus léger.",
  },

  "licorne-respect-des-parents-sans-occasion-2": {
    titre: "et la licorne de la gratitude",
    texte: `Il était une fois deux soeurs qui partageaient 
une licorne magique nommée Shukr, ce qui veut dire 
gratitude en arabe.

Shukr avait un pouvoir particulier : elle brillait 
plus fort chaque fois que les deux soeurs faisaient 
quelque chose de bon. Et elle pâlissait quand elles 
oubliaient ce qui comptait vraiment.

Ce matin-là, [PRENOM1] et [PRENOM2] s'étaient 
disputées avec maman.

Pas pour quelque chose de grave. Pour l'heure du 
coucher. Maman avait dit dans dix minutes et elles 
avaient protesté, argumenté, négocié avec des voix 
trop hautes et des soupirs trop forts.

Maman avait fini par dire, doucement mais fermement : 
C'est comme ça.

Et elles étaient allées se coucher en boudant.

Le lendemain matin, Shukr était grise.

[PRENOM1] la regarda, alarmée.

Qu'est-ce qui t'arrive ?

Votre coeur n'était pas en paix cette nuit, dit Shukr. 
Et quand votre coeur n'est pas en paix avec vos 
parents, je perds mes couleurs.

[PRENOM2] baissa la tête.

C'était juste l'heure du coucher.

Ce n'est jamais juste quelque chose, dit Shukr 
doucement. Votre maman a passé la journée à 
travailler, à s'occuper de vous, à penser à vous. 
Et le soir, quand elle demande quelque chose de 
simple, vous lui opposez de la résistance.

Les deux soeurs restèrent silencieuses.

Elle mérite mieux que ça, dit Shukr. Et vous 
le savez.

[PRENOM1] pensa au hadith que papa leur lisait.

Le paradis est sous les pieds des mères.

Elle prit la main de sa soeur.

On va lui dire pardon ?

[PRENOM2] hocha la tête.

Elles trouvèrent maman dans la cuisine. Elle ne 
semblait pas en colère. Mais elle avait ces yeux 
un peu lointains des gens qui ont été blessés 
sans le montrer.

Maman, dit [PRENOM1]. On est désolées pour 
hier soir.

On aurait dû obéir tout de suite, dit [PRENOM2].

Maman les regarda toutes les deux. Puis elle 
s'accroupit à leur hauteur.

Je sais que vous ne l'avez pas fait exprès. 
Mais merci de me le dire.

Elle les serra toutes les deux dans ses bras 
en même temps.

Quand elles retournèrent dans le jardin, 
Shukr était rose et dorée comme jamais.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Pourquoi Shukr s'appelle-t-elle Gratitude ?",
      "Shukr dit que ce n'est jamais juste quelque chose. Qu'est-ce qu'elle veut dire ?",
      "Comment vous sentez-vous quand vous faites la paix avec vos parents ?",
    ],
    defi: "Cette semaine, dites à votre maman ou papa une chose que vous appréciez en eux. Une seule. Mais vraiment.",
  },

  "super-héros-respect-des-parents-sans-occasion-1": {
    titre: "et le plus grand héros qu'il connaissait",
    texte: `Il était une fois un petit garçon prénommé 
[PRENOM] qui cherchait des super-héros partout.

Un jour, il posa une question à papy :

Quel est le plus grand héros que tu aies jamais connu ?

Papy réfléchit longuement.

Ton père, dit-il finalement.

[PRENOM] le regarda, surpris.

Papa ? Mais papa n'a pas de cape. Papa n'a pas 
de super-pouvoirs.

Non, dit papy. Mais il fait quelque chose que peu 
de super-héros font.

Quoi ?

Il se lève chaque matin pour toi. Même quand il 
est fatigué. Même quand il a mal quelque part. 
Même quand sa journée a été difficile. Il rentre, 
il te demande comment tu vas, il t'écoute, il est là.

[PRENOM] réfléchit.

Mais les vrais super-héros sauvent des gens.

Ton père te sauve chaque jour, dit papy. Il te sauve 
de la faim, du froid, de la peur, de la solitude. 
Sans cape. Sans applaudissements. Juste parce 
qu'il t'aime.

[PRENOM] garda le silence un long moment.

Je lui dis jamais merci, dit-il finalement.

Je sais, dit papy doucement. Presque personne ne 
le dit. Parce qu'on pense que c'est normal. 
Que c'est dû.

Il posa sa main sur l'épaule de [PRENOM].

Allah a mis tellement d'importance au respect des 
parents qu'Il en parle dans le Coran juste après 
avoir parlé de Lui-même. Juste après.

Ton Seigneur a décrété que vous n'adoriez que Lui, 
et que vous traitiez vos parents avec bonté.

[PRENOM] rentra chez lui ce soir-là avec quelque 
chose dans la tête qu'il ne pouvait pas ignorer.

Il trouva papa dans le salon, les yeux mi-clos 
après sa journée.

[PRENOM] s'assit à côté de lui.

Papa.

Hm ? dit papa sans ouvrir les yeux.

Merci pour tout ce que tu fais.

Un silence.

Papa ouvrit les yeux. Il regarda son fils.

D'où ça vient ça ? dit-il doucement.

De papy, dit [PRENOM]. Il m'a dit que t'étais le 
plus grand héros qu'il connaissait.

Papa ne dit rien pendant un moment. Mais quelque 
chose dans son visage changea, quelque chose de 
léger, de surpris, de touché.

Papy exagère, dit-il finalement.

Non, dit [PRENOM]. Je crois pas.`,
    citation: "Ton Seigneur a décrété que vous traitiez vos parents avec bonté.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Papy dit que papa est un super-héros sans cape. Tu comprends ce qu'il veut dire ?",
      "Comment papa a-t-il réagi quand [PRENOM] lui a dit merci ? Pourquoi à ton avis ?",
      "Tu penses que tes parents font des choses héroïques chaque jour sans que tu le remarques ?",
    ],
    defi: "Cette semaine, repère trois choses que tes parents font pour toi chaque jour sans que tu leur demandes. Et dis-leur merci pour l'une d'elles.",
  },

  "super-héros-respect-des-parents-sans-occasion-2": {
    titre: "et l'opération parents heureux",
    texte: `Il était une fois deux frères qui avaient 
des capes, des missions secrètes, et un code 
d'honneur.

[PRENOM1] et [PRENOM2] prenaient leur rôle de 
super-héros très au sérieux.

Mais un soir, oncle Bilal leur posa une question 
qui les fit réfléchir.

Vos plus grandes missions, vous les avez faites 
pour qui ?

Pour les autres, dit [PRENOM1].

Pour ceux qui ont besoin, dit [PRENOM2].

Et vos parents ? dit oncle Bilal.

Les deux frères se regardèrent.

Nos parents vont bien, dit [PRENOM1].

Sont-ils heureux ?

Un silence.

[PRENOM2] réfléchit. Maman travaillait beaucoup. 
Papa rentrait tard. Ils souriaient toujours. Mais 
est-ce que c'était le sourire de quelqu'un de 
vraiment heureux ?

Je sais pas, admit-il.

Le Prophète ﷺ a dit quelque chose d'important, 
dit oncle Bilal. Il a dit que la satisfaction 
d'Allah est dans la satisfaction des parents.

La satisfaction d'Allah est dans la satisfaction 
des parents, et Sa colère est dans leur colère.

Donc si nos parents sont heureux, Allah est content 
de nous ? dit [PRENOM1].

C'est une façon de le voir, dit oncle Bilal. Mais 
surtout, vos parents font tout pour vous. Votre 
mission la plus importante est peut-être là.

Les deux frères se regardèrent.

Opération Parents Heureux, dit [PRENOM2] 
à voix basse.

Opération Parents Heureux, confirma [PRENOM1].

Le lendemain, sans qu'on leur demande rien, ils 
rangèrent leurs chambres, mirent la table, 
débarrassèrent après le dîner, et avant de dormir, 
allèrent embrasser maman et papa en leur disant 
bonne nuit.

Papa les regarda, ces deux garçons avec leurs 
capes et leurs yeux sérieux.

Qu'est-ce qui se passe ? dit-il, amusé.

Rien, dit [PRENOM1]. Mission en cours.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Pourquoi oncle Bilal leur demande si leurs parents sont heureux ?",
      "Vous comprenez le lien entre la satisfaction des parents et celle d'Allah ?",
      "Qu'est-ce que l'Opération Parents Heureux selon vous ?",
    ],
    defi: "Cette semaine, lancez votre propre Opération Parents Heureux. Choisissez 3 choses à faire pour eux sans qu'ils vous le demandent. Et notez leurs sourires.",
  },

  "animaux-respect-des-parents-sans-occasion-1": {
    titre: "et ce que Safran avait appris de sa maman",
    texte: `Il était une fois un enfant prénommé [PRENOM] 
qui pouvait entendre les animaux parler.

Son ami le renard Safran était le plus sage de tous. 
Mais ce matin-là, Safran avait l'air soucieux.

Safran, qu'est-ce qui se passe ?

Je pense à ma maman, dit le renard.

[PRENOM] s'assit dans l'herbe à côté de lui.

Elle vieillit, dit Safran simplement. Elle court 
moins vite. Elle se fatigue plus vite. Et moi, 
dans ma jeunesse, je ne lui ai pas toujours 
rendu la vie facile.

Qu'est-ce que tu faisais ?

Je rentrais tard sans prévenir. Je ne l'écoutais 
pas toujours. Je pensais que mes aventures étaient 
plus importantes que sa tranquillité.

Safran secoua sa queue touffue.

Maintenant je comprends ce que ça lui coûtait. 
Chaque fois que je rentrais tard, elle ne dormait 
pas. Chaque fois que je ne l'écoutais pas, elle 
continuait quand même à m'aimer.

[PRENOM] l'écouta sans rien dire.

Tu sais ce que j'aurais aimé comprendre plus tôt ? 
dit Safran.

Quoi ?

Le Prophète ﷺ a dit que le paradis est sous les 
pieds des mères. J'aurais aimé marcher plus 
doucement sous ses pattes à elle.

[PRENOM] resta silencieux un long moment.

Il pensa à sa propre maman. À toutes les fois où 
il avait traîné les pieds quand elle demandait 
quelque chose.

Safran, dit-il, comment je fais pour ne pas avoir 
ces regrets plus tard ?

C'est simple, dit Safran. Tu lui montres maintenant. 
Pas demain. Maintenant. Parce que maintenant, 
elle est là.

[PRENOM] rentra chez lui.

Sa maman était dans le jardin, à arroser les fleurs. 
Elle ne le vit pas arriver.

[PRENOM] prit doucement l'arrosoir des mains.

Je le fais, dit-il.

Sa maman le regarda, surprise.

Pourquoi ?

Comme ça, dit [PRENOM].

Et il arrosa les fleurs jusqu'au bout, soigneusement, 
sans se précipiter.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Pourquoi Safran regrette-t-il sa jeunesse ?",
      "Il dit marcher plus doucement sous ses pattes. Qu'est-ce que ça veut dire vraiment ?",
      "Safran dit maintenant, pas demain. Pourquoi c'est important ?",
    ],
    defi: "Cette semaine, remarque trois choses que ta maman ou ton papa fait pour toi. Et pour une de ces choses, propose de le faire toi-même à leur place.",
  },

  "animaux-respect-des-parents-sans-occasion-2": {
    titre: "et la leçon des oiseaux",
    texte: `Il était une fois deux soeurs qui pouvaient 
entendre les animaux parler, mais seulement ensemble.

Ce matin-là, elles entendirent quelque chose 
qui les arrêta.

Deux petits oiseaux dans le rosier se disputaient.

C'est ma branche, disait le premier.
C'est moi qui l'ai trouvée, disait le deuxième.

La maman oiseau regardait depuis une branche 
plus haute, les yeux tristes.

[PRENOM1] et [PRENOM2] échangèrent un regard. 
Elles connaissaient ce regard : celui d'une maman 
qui voit ses enfants se chamailler et qui attend 
qu'ils trouvent eux-mêmes la solution.

Yasmine la renarde s'approcha.

Vous voyez sa maman ? dit-elle doucement.

Elle a l'air triste, dit [PRENOM2].

Elle a passé tout l'hiver à garder ces oeufs au 
chaud. Tout le printemps à leur apporter à manger. 
Et maintenant qu'ils grandissent, ils se disputent 
devant elle.

C'est triste, dit [PRENOM1].

C'est commun, dit Yasmine. Les petits oublient 
souvent ce que leurs parents ont fait pour eux. 
Pas parce qu'ils sont méchants. Mais parce qu'ils 
sont petits et que le monde leur semble centré 
sur eux.

Les deux soeurs regardèrent la maman oiseau.

Comment on fait pour ne pas être comme eux ? 
dit [PRENOM2].

Il y a une parole que j'ai entendue une fois, 
dit Yasmine.

Ton Seigneur a décrété que vous ne traitiez pas 
vos parents avec impatience. Et dites-leur des 
paroles nobles.

Des paroles nobles, répéta [PRENOM1]. Ça veut 
dire quoi ?

Des mots qui honorent. Des mots qui reconnaissent. 
Des mots qui disent : je te vois, je sais ce que 
tu fais pour moi.

[PRENOM2] regarda sa soeur.

On dit jamais vraiment ça à maman.

Non, admit [PRENOM1].

Elles rentrèrent à la maison. Maman était dans la 
cuisine. Elles s'assirent toutes les deux à la 
table, sans rien demander, sans allumer la 
télévision, sans sortir leurs jouets.

Juste là. Avec elle.

Maman les regarda, étonnée.

Vous voulez quelque chose ?

Non, dit [PRENOM1]. On voulait juste être avec toi.

Maman posa ce qu'elle tenait. Et elle s'assit 
avec elles.

Ce fut un des moments les plus simples de la 
journée. Et l'un des plus beaux.`,
    citation: "Ton Seigneur a décrété que vous traitiez vos parents avec bonté et que vous leur disiez des paroles nobles.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Qu'est-ce que des paroles nobles selon vous ?",
      "Pourquoi la maman oiseau était-elle triste ?",
      "Qu'ont fait [PRENOM1] et [PRENOM2] à la fin et pourquoi c'était suffisant ?",
    ],
    defi: "Cette semaine, passez un moment avec maman ou papa juste pour être ensemble, sans rien demander.",
  },

  // ─── COURAGE / ANNIVERSAIRE ───
  "princesse-courage-anniversaire-1": {
    titre: "et le cadeau qu'elle avait peur d'offrir",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Courage / Anniversaire / 1 enfant]`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Pourquoi [PRENOM] avait-elle peur d'offrir son carnet ?",
      "Maman dit le courage c'est le même quelle que soit la taille du dragon. Tu comprends ?",
      "Comment tu crois que [PRENOM] s'est sentie quand Lila l'a serrée dans ses bras ?",
    ],
    defi: "Cette semaine, fais un geste sincère pour quelqu'un même si tu as un peu peur. Et dis-toi : Allah est avec moi.",
  },

  "princesse-courage-anniversaire-2": {
    titre: "et le spectacle de l'anniversaire",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Courage / Anniversaire / 2 soeurs]`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "[PRENOM2] dit t'es mon Aaron. Pourquoi c'est important d'avoir quelqu'un à côté de soi ?",
      "Le spectacle n'était pas parfait. Est-ce que ça avait de l'importance ?",
      "Comment vous croyez qu'elles se sentaient après ?",
    ],
    defi: "Cette semaine, faites ensemble quelque chose qui vous fait un peu peur. Tenez-vous la main si besoin.",
  },

  "licorne-courage-anniversaire-1": {
    titre: "et le voeu qu'elle n'osait pas faire",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Courage / Anniversaire / 1 enfant]`,
    citation: "Demande à Allah la force et ne te laisse pas aller à la faiblesse.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Pourquoi [PRENOM] avait-elle peur de faire son vrai voeu ?",
      "Nour dit que les voeux courageux sont les seuls qui changent vraiment quelque chose. Tu es d'accord ?",
      "Qu'est-ce qui a aidé [PRENOM] à ne pas abandonner ?",
    ],
    defi: "Cette semaine, écris ton voeu courageux sur un papier. Et fais un petit pas vers lui chaque jour.",
  },

  "licorne-courage-anniversaire-2": {
    titre: "et les deux voeux qui brillaient",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Courage / Anniversaire / 2 soeurs]`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Les licornes disent que les voeux courageux brillent différemment. Qu'est-ce que ça veut dire ?",
      "Comment les deux soeurs se sont-elles aidées mutuellement ?",
      "Pourquoi être deux rend le courage plus facile ?",
    ],
    defi: "Cette semaine, chacune dit à l'autre sa peur. Et vous faites un plan ensemble pour l'affronter.",
  },

  "super-héros-courage-anniversaire-1": {
    titre: "et le discours d'anniversaire",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Courage / Anniversaire / 1 enfant]`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Papa dit que les meilleurs super-héros savent parler. Tu es d'accord ?",
      "[PRENOM] n'a dit que quelques mots simples. Pourquoi c'était quand même courageux ?",
      "Papa dit courageux c'est mieux que bien. Tu comprends pourquoi ?",
    ],
    defi: "Cette semaine, dis quelque chose de courageux à voix haute. Un merci sincère, un je suis désolé, un tu comptes pour moi.",
  },

  "super-héros-courage-anniversaire-2": {
    titre: "et le défi d'anniversaire",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Courage / Anniversaire / 2 enfants]`,
    citation: "Le meilleur d'entre vous est celui qui est le meilleur envers les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi aller inviter Karim était-il courageux ?",
      "Youssef dit que c'était le meilleur défi courageux. Vous êtes d'accord ?",
      "Comment vous croyez que Karim s'est senti ce soir-là ?",
    ],
    defi: "Cette semaine, osez approcher quelqu'un que vous connaissez à peine et lui parler.",
  },

  "animaux-courage-anniversaire-1": {
    titre: "et le cadeau de Safran",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Courage / Anniversaire / 1 enfant]`,
    citation: "Demande à Allah la force et ne te laisse pas aller à la faiblesse.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Safran dit que la plume ne rend pas courageux, elle rappelle qu'on l'est déjà. Tu comprends ?",
      "Qu'est-ce qui a vraiment aidé [PRENOM] à s'inscrire au club ?",
      "Pourquoi demander à Allah avant de faire quelque chose de difficile peut aider ?",
    ],
    defi: "Cette semaine, trouve ta plume de courage et fais un pas vers ce que tu veux vraiment.",
  },

  "animaux-courage-anniversaire-2": {
    titre: "et le concert des animaux",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Courage / Anniversaire / 2 soeurs]`,
    citation: "Demande à Allah la force et ne te laisse pas aller à la faiblesse.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Hikma dit que le courage c'est oser sa voix même tremblante. Tu comprends ?",
      "Pourquoi les animaux ont-ils voulu que les soeurs chantent aussi ?",
      "Comment vous croyez que les deux soeurs se sont senties après ?",
    ],
    defi: "Cette semaine, chantez ensemble même doucement. Votre voix vient d'Allah. Elle mérite d'être entendue.",
  },

  // ─── PATIENCE / ANNIVERSAIRE ───
  "princesse-patience-anniversaire-1": {
    titre: "et le cadeau qui n'arrivait pas",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Patience / Anniversaire / 1 enfant]`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi le cadeau de grand-mère était-il plus beau parce qu'il avait pris du temps ?",
      "[PRENOM] dit qu'elles ont eu la patience toutes les deux. Tu comprends comment ?",
      "Tu penses que les choses faites avec patience sont toujours meilleures ?",
    ],
    defi: "Cette semaine, fabrique quelque chose à la main pour quelqu'un que tu aimes. Prends le temps de le faire vraiment bien.",
  },

  "princesse-patience-anniversaire-2": {
    titre: "et la surprise qui prenait du temps",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Patience / Anniversaire / 2 soeurs]`,
    citation: "Avec la difficulté vient la facilité.",
    source: "Coran, Sourate Al-Inshirah, verset 5 et 6",
    questions: [
      "Pourquoi [PRENOM1] a-t-elle refusé d'acheter un gâteau même quand c'était difficile ?",
      "Pourquoi maman a-t-elle pleuré des larmes heureuses ?",
      "Vous comprenez pourquoi les choses difficiles ont plus de valeur ?",
    ],
    defi: "Cette semaine, préparez ensemble quelque chose à la main pour maman ou papa.",
  },

  "licorne-patience-anniversaire-1": {
    titre: "et l'oeuf de licorne",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Patience / Anniversaire / 1 enfant]`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Grand-mère dit arrête d'attendre et vis bien maintenant. Tu comprends ?",
      "Qu'est-ce qui a changé dans l'attitude de [PRENOM] ?",
      "La patience illumine le présent, pas l'avenir. Qu'est-ce que ça veut dire ?",
    ],
    defi: "Cette semaine, chaque matin, fais une chose bien, pas pour obtenir quelque chose, juste parce que c'est bien.",
  },

  "licorne-patience-anniversaire-2": {
    titre: "et les deux graines de licorne",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Patience / Anniversaire / 2 soeurs]`,
    citation: "Avec la difficulté vient la facilité.",
    source: "Coran, Sourate Al-Inshirah, verset 5 et 6",
    questions: [
      "Pourquoi trop aider peut parfois faire du mal ?",
      "[PRENOM1] dit que la patience s'apprend. Tu es d'accord ?",
      "Comment [PRENOM1] a-t-elle réagi face à l'erreur de sa soeur ?",
    ],
    defi: "Cette semaine, plantez ensemble une vraie graine. Arrosez-la une fois par jour, pas plus.",
  },

  "super-héros-patience-anniversaire-1": {
    titre: "et l'entraînement qui ne finissait pas",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Patience / Anniversaire / 1 enfant]`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi oncle Hassan passait-il autant de temps sur les bases ?",
      "[PRENOM] dit la patience n'est pas l'ennemi de la vitesse. Tu comprends ?",
      "Tu as déjà voulu sauter une étape et regretté après ?",
    ],
    defi: "Cette semaine, fais une chose lentement et correctement, plutôt que vite et approximativement.",
  },

  "super-héros-patience-anniversaire-2": {
    titre: "et le tournoi qui commençait dans six mois",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Patience / Anniversaire / 2 enfants]`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Papy dit que le but n'est pas de gagner le premier tournoi. Qu'est-ce qu'il veut dire ?",
      "Comment [PRENOM1] a-t-il aidé son frère à continuer ?",
      "Les deux frères n'ont pas gagné. Pourquoi finir était quand même important ?",
    ],
    defi: "Cette semaine, choisissez un objectif à long terme ensemble. Écrivez-le. Et commencez aujourd'hui.",
  },

  "animaux-patience-anniversaire-1": {
    titre: "et le cadeau que Hakim avait mis du temps à trouver",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Patience / Anniversaire / 1 enfant]`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Pourquoi la pierre de Hakim valait-elle plus qu'un gros cadeau acheté vite ?",
      "[PRENOM] dit que la patience est une façon d'aimer les gens. Tu es d'accord ?",
      "Comment tu te sens quand quelqu'un prend vraiment le temps pour toi ?",
    ],
    defi: "Cette semaine, prends le temps de faire quelque chose de bien pour quelqu'un. Sans te dépêcher.",
  },

  "animaux-patience-anniversaire-2": {
    titre: "et le nid que les oiseaux construisaient",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Patience / Anniversaire / 2 soeurs]`,
    citation: "Avec la difficulté vient la facilité.",
    source: "Coran, Sourate Al-Inshirah, verset 5 et 6",
    questions: [
      "La mésange dit autant qu'il faut. Qu'est-ce que ça veut dire de ne pas mettre de limite ?",
      "[PRENOM2] fait le lien avec l'école. Tu comprends le lien avec le nid ?",
      "Pourquoi le nid durera-t-il longtemps ?",
    ],
    defi: "Cette semaine, construisez quelque chose ensemble qui dure. Prenez le temps qu'il faut.",
  },

  // ─── PARTAGE / ANNIVERSAIRE ───
  "princesse-partage-anniversaire-1": {
    titre: "et les cadeaux qu'on partage deux fois",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Partage / Anniversaire / 1 enfant]`,
    citation: "Le meilleur d'entre vous est celui qui est le meilleur envers les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi [PRENOM] a-t-elle pensé à Amira le soir de son anniversaire ?",
      "Amira partage à son tour les bonbons avec [PRENOM]. Pourquoi c'est beau ?",
      "[PRENOM] dit que partager était le plus beau cadeau qu'elle s'était offert. Tu comprends ?",
    ],
    defi: "Cette semaine, partage quelque chose de spécial avec un ami.",
  },

  "princesse-partage-anniversaire-2": {
    titre: "et le gâteau pour tout le quartier",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Partage / Anniversaire / 2 soeurs]`,
    citation: "Le meilleur d'entre vous est celui qui nourrit les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Abu Dawud",
    questions: [
      "Les deux soeurs auraient pu garder le gâteau. Pourquoi ne l'ont-elles pas fait ?",
      "Pourquoi [PRENOM1] dit que c'était le meilleur anniversaire ?",
      "Vous aimeriez faire quelque chose comme ça pour votre prochain anniversaire ?",
    ],
    defi: "Cette semaine, partagez quelque chose avec une famille ou un enfant que vous connaissez peu.",
  },

  "licorne-partage-anniversaire-1": {
    titre: "et la licorne qui multipliait les cadeaux",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Partage / Anniversaire / 1 enfant]`,
    citation: "Le meilleur d'entre vous est celui qui est le meilleur envers les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Nour dit que certaines choses se multiplient quand on les partage. Tu es d'accord ?",
      "[PRENOM] a donné trois histoires à Lina sans perdre son livre. Comment c'est possible ?",
      "Tu as déjà eu ce sentiment qu'en donnant tu t'es sentie plus riche ?",
    ],
    defi: "Cette semaine, partage une connaissance avec quelqu'un. Apprends-lui quelque chose que tu sais.",
  },

  "licorne-partage-anniversaire-2": {
    titre: "et les deux licornes qui voulaient la même chose",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Partage / Anniversaire / 2 soeurs]`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Comment les licornes ont-elles eu les deux choses en échangeant ?",
      "Vous comprenez la magie du partage vrai dont parle Nur ?",
      "Les deux soeurs ont créé quelque chose que ni l'une ni l'autre n'aurait pu faire seule. Ça vous arrive ?",
    ],
    defi: "Cette semaine, faites quelque chose ensemble où chacune apporte ce qu'elle sait faire.",
  },

  "super-héros-partage-anniversaire-1": {
    titre: "et le super-cadeau qu'il a inventé",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Partage / Anniversaire / 1 enfant]`,
    citation: "Le meilleur d'entre vous est celui qui nourrit les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Abu Dawud",
    questions: [
      "[PRENOM] offre son temps à son ami le jour de son propre anniversaire. Tu trouves ça bizarre ou beau ?",
      "Rayan dit que [PRENOM] aussi a reçu un cadeau. Lequel ?",
      "Quelles choses peut-on partager qui ne sont pas des objets ?",
    ],
    defi: "Cette semaine, offre deux heures de ton temps à quelqu'un qui en a besoin.",
  },

  "super-héros-partage-anniversaire-2": {
    titre: "et l'anniversaire inversé",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Partage / Anniversaire / 2 enfants]`,
    citation: "Le meilleur d'entre vous est celui qui nourrit les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Abu Dawud",
    questions: [
      "La maîtresse dit que c'est la première fois en vingt ans. Qu'est-ce que ça montre ?",
      "[PRENOM2] dit c'est le meilleur anniversaire alors qu'ils n'ont presque rien reçu. Pourquoi ?",
      "Est-ce que l'idée d'un anniversaire inversé vous plairait ?",
    ],
    defi: "Pour votre prochain anniversaire, planifiez un anniversaire inversé : offrez quelque chose à ceux qui vous entourent.",
  },

  "animaux-partage-anniversaire-1": {
    titre: "et le festin d'anniversaire de la forêt",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Partage / Anniversaire / 1 enfant]`,
    citation: "Le meilleur d'entre vous est celui qui nourrit les autres.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Abu Dawud",
    questions: [
      "Safran dit qu'un anniversaire seul c'est un anniversaire à moitié. Tu es d'accord ?",
      "[PRENOM] n'a pas partagé de la nourriture mais sa présence et sa joie. Comment on partage ça ?",
      "Un anniversaire c'est un jour pour recevoir ou pour célébrer ensemble ?",
    ],
    defi: "Cette semaine, organise un petit moment avec des amis ou la famille où chacun apporte quelque chose.",
  },

  "animaux-partage-anniversaire-2": {
    titre: "et le cadeau que les animaux ne pouvaient pas garder",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Partage / Anniversaire / 2 soeurs]`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Hakim dit que les histoires se multiplient en se partageant. Tu comprends comment ?",
      "Qu'est-ce qui a le plus de valeur selon vous, un cadeau qu'on achète ou une histoire vraie ?",
      "Les soeurs décident de collecter des histoires à offrir. Qu'est-ce que ça veut dire ?",
    ],
    defi: "Cette semaine, racontez une vraie histoire à l'autre, quelque chose qui vous est arrivé et que vous n'avez jamais dit.",
  },

  // ─── GÉNÉROSITÉ / SANS OCCASION ───
  "princesse-générosité-sans-occasion-1": {
    titre: "et la princesse qui donnait sans raison",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Générosité / Sans occasion / 1 enfant]`,
    citation: "Allah est Généreux et Il aime la générosité.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "La vieille dame dit que les gens aident souvent quand il y a une raison. Tu penses que c'est vrai ?",
      "[PRENOM] a aidé sans raison. Qu'est-ce que ça lui a apporté ?",
      "La vraie générosité crée l'occasion. Tu comprends ce que ça veut dire ?",
    ],
    defi: "Cette semaine, trouve quelqu'un à aider un jour ordinaire, pas parce que c'est l'Aïd, juste parce que tu peux.",
  },

  "princesse-générosité-sans-occasion-2": {
    titre: "et les mardis généreux",
    texte: `[Colle le texte complet de l'histoire 
Princesse / Générosité / Sans occasion / 2 soeurs]`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Pourquoi [PRENOM1] n'a-t-elle pas forcé sa soeur à participer ?",
      "[PRENOM2] dit qu'elle avait oublié que c'était facile. Comment on oublie quelque chose d'aussi simple ?",
      "Comment les Mardis Généreux ont-ils fini par changer toute la semaine ?",
    ],
    defi: "Cette semaine, inventez votre propre rituel de générosité. Un jour par semaine, un geste ensemble.",
  },

  "licorne-générosité-sans-occasion-1": {
    titre: "et les étoiles que Nour semait",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Générosité / Sans occasion / 1 enfant]`,
    citation: "Allah est Généreux et Il aime la générosité.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Nour dit que les bonnes actions ne s'effacent pas. Tu le crois ?",
      "[PRENOM] ne cherche pas les étoiles pour les avoir. C'est quoi la différence ?",
      "Si tu avais des étoiles dans le ciel pour tes gestes généreux, combien tu en aurais ?",
    ],
    defi: "Cette semaine, chaque soir avant de dormir, pense à un geste généreux que tu as fait. Et imagine ton étoile dans le ciel.",
  },

  "licorne-générosité-sans-occasion-2": {
    titre: "et le concours de générosité",
    texte: `[Colle le texte complet de l'histoire 
Licorne / Générosité / Sans occasion / 2 soeurs]`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Sabr dit que la raison n'est pas toujours importante. Tu es d'accord ?",
      "Pourquoi [PRENOM2] a-t-elle décidé de continuer sans le concours ?",
      "Douze étoiles en une semaine, c'est beaucoup ou peu selon vous ?",
    ],
    defi: "Cette semaine, lancez votre concours de générosité. À la fin, ce qui compte c'est combien d'étoiles vous avez mises ensemble.",
  },

  "super-héros-générosité-sans-occasion-1": {
    titre: "et les cent petits gestes",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Générosité / Sans occasion / 1 enfant]`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Oncle Tariq dit qu'Allah regarde le coeur pas le montant. Tu comprends ce que ça veut dire ?",
      "[PRENOM] commence par quelque chose de très petit. Pourquoi c'est quand même important ?",
      "Tu penses que cent petits gestes font vraiment quelque chose de grand ?",
    ],
    defi: "Cette semaine, commence ton compteur de gestes généreux. Chaque soir, note ce que tu as fait.",
  },

  "super-héros-générosité-sans-occasion-2": {
    titre: "et l'équipe de générosité",
    texte: `[Colle le texte complet de l'histoire 
Super-héros / Générosité / Sans occasion / 2 enfants]`,
    citation: "Allah est Généreux et Il aime la générosité.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Papy dit que la générosité en équipe multiplie les effets. Comment ?",
      "Pourquoi les autres enfants ont-ils commencé à faire des choses similaires sans qu'on leur demande ?",
      "[PRENOM1] dit que la générosité se propage toute seule. Tu crois que c'est vrai ?",
    ],
    defi: "Cette semaine, formez votre équipe de générosité. Donnez-lui un nom et faites une action par jour.",
  },

  "animaux-générosité-sans-occasion-1": {
    titre: "et ce que Safran avait compris sur la générosité",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Générosité / Sans occasion / 1 enfant]`,
    citation: "Allah est Généreux et Il aime la générosité.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Safran dit que la vraie générosité ne calcule pas ce qu'elle garde. Tu comprends ?",
      "Pourquoi [PRENOM] plante un gland à la fin ? Qu'est-ce que ça veut dire ?",
      "Tu penses que tu es naturellement généreux dans quelles situations ?",
    ],
    defi: "Cette semaine, fais quelque chose dont les effets dureront longtemps. Plante une graine, écris une lettre, apprends quelque chose.",
  },

  "animaux-générosité-sans-occasion-2": {
    titre: "et la chaîne de générosité du jardin",
    texte: `[Colle le texte complet de l'histoire 
Animaux / Générosité / Sans occasion / 2 soeurs]`,
    citation: "Quiconque plante un arbre, et qu'un oiseau, un humain ou un animal en mange, cela lui est compté comme une aumône.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Personne n'a organisé la chaîne du jardin. Comment elle a commencé alors ?",
      "[PRENOM1] donne du temps, [PRENOM2] donne de la joie. On peut donner des choses qu'on ne voit pas ?",
      "Vous voulez ajouter un maillon à une chaîne de générosité cette semaine ?",
    ],
    defi: "Cette semaine, faites un geste généreux et demandez à la personne de le transmettre à son tour.",
  },

  // ─── PRINCESSE / GENEROSITE (ASCII KEY) / SAISONS ───
  "princesse-generosite-aid-el-fitr-2": {
    titre: "et les pièces d'or du matin",
    texte: `Il était une fois deux soeurs inséparables,
[PRENOM1] et [PRENOM2].

Ce matin de l'Aïd, papa leur avait remis à chacune
une bourse en velours, dix pièces d'or pour [PRENOM1],
dix pour [PRENOM2].

En descendant dans la cour de l'immeuble, elles
croisèrent la petite Aya, assise seule sur une marche,
sans habits neufs, sans sachet de gâteaux, sans sourire.

[PRENOM1] prit la main de sa soeur.

Tu vois ce que je vois ?

Oui, dit [PRENOM2].

Un silence. Leurs deux bourses dans leurs mains.

Et dans la tête de [PRENOM1], la voix de grand-mère :

Le Prophète ﷺ a dit que jamais une aumône n'a
appauvri son donneur. Jamais.

Les deux soeurs s'approchèrent d'Aya. Chacune prit
cinq pièces dans sa bourse et les déposa dans les
mains d'Aya.

Aïd Moubarak, dirent-elles ensemble.

Aya les regarda, les yeux brillants.

Pourquoi vous faites ça ?

Parce que l'Aïd c'est pour tout le monde,
dit [PRENOM2].

Ce soir-là, les deux soeurs avaient la moitié de leurs
pièces. Mais quelque chose dans leurs coeurs débordait.

C'est bizarre, dit [PRENOM2]. On a donné et on se
sent plus riches.

C'est ce que grand-mère appelle la vraie richesse,
dit [PRENOM1].`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi les deux soeurs ont-elles décidé ensemble de donner ?",
      "Qu'est-ce que la vraie richesse selon grand-mère ?",
      "Comment vous sentez-vous quand vous faites quelque chose de généreux ?",
    ],
    defi: "Cette semaine, faites ensemble un geste généreux pour quelqu'un que vous ne connaissez pas bien.",
  },

  "princesse-generosite-aid-el-adha-1": {
    titre: "et la part qu'elle avait choisie",
    texte: `Il était une fois une petite princesse
prénommée [PRENOM].

L'Aïd el-Adha était arrivé. Le mouton avait été
sacrifié. Maman avait cuisiné de beaux plats.

Tu sais comment on partage ? dit papa.

Un tiers pour nous, un tiers pour la famille,
un tiers pour les pauvres, récita [PRENOM].

Exactement. Et toi, tu veux porter la part
des pauvres ?

[PRENOM] hocha la tête.

Elle prit le grand sac et frappa à sept portes.
À chaque porte, elle dit simplement :

Aïd Moubarak. C'est avec notre coeur.

À la septième porte, une vieille dame lui prit
les mains dans les siennes.

Tu sais ce que tu fais là, petite ?

Je partage, dit [PRENOM].

Non, dit la vieille dame doucement. Tu suis
Ibrahim. Tu donnes ce qu'Allah t'a donné.

La charité n'a jamais appauvri personne.

[PRENOM] rentra les mains vides et le coeur plein.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "La vieille dame dit tu suis Ibrahim. Qu'est-ce qu'elle veut dire ?",
      "Pourquoi [PRENOM] avait les mains vides mais le coeur plein ?",
      "Tu as déjà porté quelque chose pour quelqu'un dans le besoin ?",
    ],
    defi: "Cette semaine, porte quelque chose à quelqu'un dans le besoin, même tout petit.",
  },

  "princesse-generosite-aid-el-adha-2": {
    titre: "et les sept portes de l'Aïd",
    texte: `Il était une fois deux soeurs que tout le monde
appelait les jumelles du coeur, parce qu'elles
pensaient toujours pareil.

L'Aïd el-Adha. Le mouton. Les trois parts.

Maman leur confia le grand plateau pour la part
des pauvres.

Vous y allez ensemble ?

Toujours, dirent-elles.

Porte après porte. Sourire après sourire.

À la cinquième porte, un petit garçon ouvrit.
Il avait l'âge de [PRENOM2].

C'est de la viande ?

Oui, dit [PRENOM1]. Pour toi et ta famille.

Le garçon disparut à l'intérieur. On entendit une
voix de femme : Qu'Allah les récompense.

[PRENOM2] tira la manche de sa soeur.

Tu as entendu ?

Oui.

Ça vaut toutes les pièces du monde, dit [PRENOM2].

La charité n'a jamais appauvri personne.

Elles finirent les sept portes main dans la main.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Qu'est-ce qui a touché [PRENOM2] à la cinquième porte ?",
      "Pourquoi ça vaut toutes les pièces du monde ?",
      "Comment vous sentez-vous quand quelqu'un vous remercie sincèrement ?",
    ],
    defi: "Cette semaine, faites quelque chose de généreux ensemble et observez la réaction des gens.",
  },

  "princesse-generosite-ramadan-1": {
    titre: "et les iftar qu'elle partageait",
    texte: `Il était une fois une petite princesse prénommée
[PRENOM] dont la famille faisait quelque chose de
spécial chaque Ramadan.

Chaque soir, avant de rompre le jeûne, maman
envoyait [PRENOM] porter une assiette au voisin
qui vivait seul.

Pourquoi lui ? demanda [PRENOM] une fois.

Parce qu'il jeûne seul, dit maman. Et l'iftar
seul, c'est triste.

[PRENOM] porta l'assiette. Le voisin ouvrit la porte.
Quand il vit la nourriture, quelque chose passa sur
son visage, quelque chose de si sincère que [PRENOM]
s'en souvint longtemps.

Le soir, elle dit à maman :

Je comprends maintenant.

Quoi ?

Pourquoi le Prophète ﷺ était encore plus généreux
pendant le Ramadan.

La charité n'a jamais appauvri personne.

Parce que chaque geste compte vraiment,
dit maman.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi l'iftar seul est-il triste ?",
      "Qu'a-t-on envie de faire en voyant quelqu'un seul ?",
      "La générosité est-elle plus forte pendant le Ramadan selon toi ?",
    ],
    defi: "Cette semaine, pense à quelqu'un qui pourrait se sentir seul et fais un geste pour lui.",
  },

  "princesse-generosite-ramadan-2": {
    titre: "et la table de l'iftar pour tous",
    texte: `Il était une fois deux soeurs qui aimaient le
Ramadan plus que toutes les autres périodes de l'année.

Cette année, elles avaient eu une idée.

On invite des voisins pour l'iftar, dit [PRENOM1].

Lesquels ?

Ceux qui sont seuls.

Elles dressèrent la liste avec maman.
Trois familles. Six personnes.

Ce soir-là, la table était pleine et bruyante.
Des rires que la maison n'avait pas entendus
depuis longtemps.

[PRENOM2] regarda la scène et dit à sa soeur :

Le Prophète ﷺ était plus généreux en Ramadan
qu'à n'importe quel autre moment.

Je comprends maintenant pourquoi, dit [PRENOM1].
Regarder ça, ça ne peut pas rester dans le coeur.

La charité n'a jamais appauvri personne.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi la générosité est-elle encore plus forte pendant le Ramadan ?",
      "[PRENOM1] dit ça ne peut pas rester dans le coeur. Qu'est-ce qu'elle veut dire ?",
      "Vous avez déjà invité quelqu'un de seul à partager un repas ?",
    ],
    defi: "Cette semaine, invitez quelqu'un à partager un repas avec votre famille.",
  },

  "princesse-generosite-anniversaire-1": {
    titre: "et l'anniversaire qu'elle n'oubliera jamais",
    texte: `Il était une fois une petite princesse prénommée
[PRENOM] dont c'était l'anniversaire.

Les cadeaux étaient beaux. Le gâteau était parfait.

Mais en soirée, [PRENOM] fit quelque chose d'inattendu.

Elle prit son jouet préféré reçu ce jour-là, la poupée
aux habits brodés qu'elle voulait depuis des mois,
et alla frapper à la porte de sa voisine Lina,
qui avait quatre ans et des yeux immenses.

Joyeux non-anniversaire, dit [PRENOM] en lui
tendant la poupée.

Lina regarda la poupée. Regarda [PRENOM]. Et serra
la poupée contre elle sans rien dire.

Maman trouva [PRENOM] dans le couloir en rentrant.

Tu lui as donné ta poupée neuve ?

Oui.

Pourquoi ?

[PRENOM] réfléchit.

Parce que le Prophète ﷺ a dit que jamais une aumône
n'a appauvri. Et je voulais vérifier.

Et ?

C'est vrai, dit [PRENOM] simplement.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi [PRENOM] dit qu'elle voulait vérifier le hadith ?",
      "Qu'a-t-elle découvert en donnant sa poupée ?",
      "Tu as déjà donné quelque chose que tu aimais vraiment ?",
    ],
    defi: "Pour ton prochain anniversaire, donne quelque chose à quelqu'un qui n'a rien demandé.",
  },

  "princesse-generosite-anniversaire-2": {
    titre: "et le plus beau cadeau qu'elles aient offert",
    texte: `Il était une fois deux soeurs dont c'était
l'anniversaire le même jour.

Après la fête, [PRENOM1] proposa quelque chose.

Il reste du gâteau. Des ballons. Des décorations.
Et si on refaisait une petite fête pour les enfants
du quartier ?

[PRENOM2] la regarda.

Pour qu'ils fêtent notre anniversaire ?

Non, dit [PRENOM1]. Pour qu'ils fêtent le leur,
même si leur anniversaire c'est pas aujourd'hui.

Une heure plus tard, six enfants du quartier
découvraient une fête qui n'était pas pour eux
mais qui leur était offerte quand même.

Le plus petit, trois ans, cheveux bouclés,
souffla sur les bougies restantes les yeux
fermés très fort.

[PRENOM2] murmura à sa soeur :

C'est le plus beau cadeau qu'on ait jamais fait.

Et on l'a fait le jour de notre anniversaire,
dit [PRENOM1].

La charité n'a jamais appauvri personne.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi offrir sa fête aux autres peut être le plus beau cadeau qu'on se fait ?",
      "Comment les enfants du quartier ont-ils réagi ?",
      "Vous aimeriez faire quelque chose comme ça pour votre prochain anniversaire ?",
    ],
    defi: "Pour votre prochain anniversaire, prévoyez de partager quelque chose avec des enfants autour de vous.",
  },

  "princesse-partage-aid-el-fitr-1": {
    titre: "et la boîte de gâteaux",
    texte: `Il était une fois une petite princesse
prénommée [PRENOM].

Pour l'Aïd, grand-mère avait préparé une grande boîte
de gâteaux, cornes de gazelle, baklava, makrout,
que [PRENOM] avait mission de distribuer dans
le quartier.

À la première maison, [PRENOM] en garda quelques-uns
pour elle avant de frapper.

À la deuxième, encore quelques-uns.

À la troisième, la boîte était bien entamée.

Devant la quatrième maison, [PRENOM] s'arrêta et
regarda ce qu'il restait.

Peu.

Elle pensa à toutes les maisons qu'il restait.
À toutes les personnes qui attendaient.

Et elle pensa à une chose que maman lui disait souvent.

Aucun de vous ne croit vraiment tant qu'il n'aime pas
pour son frère ce qu'il aime pour lui-même.

[PRENOM] referma la boîte. Et distribua ce qui restait
sans en reprendre un seul.

À la dernière maison, il n'y avait plus qu'un gâteau.
Elle le donna quand même.

En rentrant, grand-mère lui demanda si la distribution
s'était bien passée.

Oui, dit [PRENOM]. Mais j'aurais dû commencer comme
je l'ai fini.

Grand-mère sourit sans demander ce qu'elle voulait dire.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Que veut dire [PRENOM] quand elle dit j'aurais dû commencer comme j'ai fini ?",
      "Qu'a-t-elle appris en chemin ?",
      "Donner quelque chose entièrement, c'est difficile ou facile pour toi ?",
    ],
    defi: "Cette semaine, donne quelque chose entièrement sans en garder pour toi d'abord.",
  },

  "princesse-partage-aid-el-fitr-2": {
    titre: "et les robes qu'elles ont échangées",
    texte: `Il était une fois deux soeurs prénommées
[PRENOM1] et [PRENOM2].

Pour l'Aïd, maman leur avait acheté une robe à chacune.
[PRENOM1] avait une robe bleue brodée d'étoiles.
[PRENOM2] avait une robe rose à volants.

Le matin de l'Aïd, [PRENOM2] regarda la robe de sa
soeur avec des yeux brillants.

Elle est plus belle que la mienne.

La tienne aussi est belle, dit [PRENOM1].

Oui mais la tienne...

[PRENOM1] la regarda un moment. Puis elle décrocha
sa robe et la tendit à sa soeur.

Mets-la.

Mais c'est ta robe.

Et après tu me prêtes la tienne. On échange
pour aujourd'hui.

[PRENOM2] la regarda, surprise.

Pourquoi ?

Parce que ce que j'aime pour moi, je dois l'aimer
pour toi. C'est ce que le Prophète ﷺ a dit.

Aucun de vous ne croit vraiment tant qu'il n'aime pas
pour son frère ce qu'il aime pour lui-même.

Elles portèrent la robe de l'autre toute la journée.
Et toutes les deux trouvèrent que l'autre était
la plus belle.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi [PRENOM1] a-t-elle proposé d'échanger ?",
      "Comment [PRENOM2] s'est-elle sentie ?",
      "Tu as déjà donné à ta soeur quelque chose que tu aimais vraiment ?",
    ],
    defi: "Cette semaine, donne à ta soeur quelque chose que tu aimes vraiment, juste pour lui faire plaisir.",
  },

  "princesse-partage-aid-el-adha-1": {
    titre: "et les trois parts qu'elle a comprises",
    texte: `Il était une fois une petite princesse
prénommée [PRENOM].

L'Aïd el-Adha. Papa lui expliqua les trois parts.

Un tiers pour nous. Un tiers pour la famille et les
voisins. Un tiers pour ceux qui n'ont rien.

Pourquoi trois ? demanda [PRENOM].

Parce qu'Ibrahim a tout donné. Et nous, on apprend
à donner une partie.

[PRENOM] réfléchit.

Mais si on donne deux tiers, on garde seulement
un tiers pour nous.

Oui.

C'est juste ?

Papa sourit.

Ibrahim ne s'est pas posé la question de ce qui était
juste pour lui. Il a fait confiance.

Aucun de vous ne croit vraiment tant qu'il n'aime pas
pour son frère ce qu'il aime pour lui-même.

[PRENOM] porta elle-même la part des pauvres.
Toute seule. Porte après porte.

En rentrant, elle dit à papa :

Je comprends les trois parts maintenant.

Qu'est-ce que tu as compris ?

Que la part qu'on donne, c'est celle qu'on garde
vraiment.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Que veut dire [PRENOM] par la part qu'on donne c'est celle qu'on garde vraiment ?",
      "Tu comprends les trois parts de l'Aïd el-Adha ?",
      "Tu as déjà porté quelque chose pour quelqu'un ?",
    ],
    defi: "Cette semaine, partage quelque chose que tu aurais gardé pour toi d'habitude.",
  },

  "princesse-partage-aid-el-adha-2": {
    titre: "et la mission Ibrahim",
    texte: `Il était une fois deux soeurs qui s'étaient
donné une mission pour l'Aïd el-Adha.

Elles l'appelaient la Mission Ibrahim.

Distribuer la part des pauvres. Toutes les deux.
Sans aide.

Elles partirent avec le grand panier. Dix familles
sur la liste.

Famille 1, une maman seule avec trois enfants.
Elle pleura en ouvrant la porte.

Famille 2, un vieil homme qui ne pouvait plus sortir.
Il dit qu'Allah vous garde si bas que c'était presque
un murmure.

Famille 3, des enfants qui coururent annoncer à leur
mère qu'on leur apportait de la viande.

À la dixième famille, [PRENOM1] et [PRENOM2] avaient
les bras vides et les yeux brillants.

Ibrahim a tout donné, dit [PRENOM2].

Et nous on a donné un panier, dit [PRENOM1].

C'est pas pareil.

Non. Mais c'est notre Ibrahim à nous.

Aucun de vous ne croit vraiment tant qu'il n'aime pas
pour son frère ce qu'il aime pour lui-même.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "[PRENOM1] dit c'est notre Ibrahim à nous. Qu'est-ce qu'elle veut dire ?",
      "Comment vous êtes-vous senties après les dix familles ?",
      "Qu'est-ce que vous aimeriez donner si vous pouviez ?",
    ],
    defi: "Cette semaine, faites ensemble votre propre Mission Ibrahim pour quelqu'un dans le besoin.",
  },

  "princesse-partage-ramadan-1": {
    titre: "et le Ramadan qu'elle a partagé",
    texte: `Il était une fois une petite princesse
prénommée [PRENOM].

Pendant le Ramadan, maman cuisinait toujours en double,
une portion pour la famille, une pour les voisins.

Un soir, [PRENOM] demanda :

On fait ça depuis toujours ?

Depuis que ta grand-mère m'a appris, dit maman.

Et sa maman lui avait appris ?

Et la maman de sa maman.

[PRENOM] imagina une longue chaîne de femmes qui
cuisinaient en double depuis des générations.

Je ferai pareil quand je serai grande, dit-elle.

Pourquoi attendre ? dit maman.

Elle prit la main de [PRENOM] et elles allèrent
ensemble porter l'iftar chez la voisine.

Aucun de vous ne croit vraiment tant qu'il n'aime pas
pour son frère ce qu'il aime pour lui-même.

En rentrant, [PRENOM] dit :

Je commence ce soir alors.

Tu as déjà commencé, dit maman.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi maman dit tu as déjà commencé ?",
      "La générosité peut-elle se transmettre de génération en génération ?",
      "Que peux-tu transmettre à ton tour ?",
    ],
    defi: "Cette semaine, partage un repas ou un goûter avec quelqu'un en dehors de ta famille.",
  },

  "princesse-partage-ramadan-2": {
    titre: "et la table d'iftar de tout le couloir",
    texte: `Il était une fois deux soeurs qui eurent
l'idée la plus ambitieuse de leur vie.

Pendant le Ramadan, organiser un iftar pour tout le
couloir de l'immeuble.

C'est trop grand pour nous, dit [PRENOM2].

On commence petit, dit [PRENOM1]. Juste trois familles.

Elles cuisinèrent avec maman. Elles dressèrent une
grande table dans le couloir. Elles frappèrent
à trois portes.

Ce soir-là, le couloir de l'immeuble, qui ne s'était
jamais vu, cassa le jeûne ensemble.

[PRENOM2] regarda autour d'elle, les familles qui
riaient, qui partageaient, qui se découvraient.

On a fait ça, dit-elle doucement.

On a juste ouvert la porte, dit [PRENOM1].
Les gens ont fait le reste.

Aucun de vous ne croit vraiment tant qu'il n'aime pas
pour son frère ce qu'il aime pour lui-même.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "[PRENOM1] dit on a juste ouvert la porte. Qu'est-ce qu'elle veut dire ?",
      "Comment créer une occasion de partage sans qu'on vous le demande ?",
      "Vous avez déjà rassemblé des gens qui ne se connaissaient pas ?",
    ],
    defi: "Cette semaine, créez une occasion de partage entre des gens qui ne se connaissent pas bien.",
  },

  "princesse-courage-aid-el-fitr-1": {
    titre: "et le Aïd Moubarak qu'elle n'osait pas dire",
    texte: `Il était une fois une petite princesse
prénommée [PRENOM].

[PRENOM] était timide. Surtout avec les gens
qu'elle ne connaissait pas.

Ce matin de l'Aïd, maman l'emmena rendre visite aux
voisins du dessus, ceux qu'elle n'avait jamais
vraiment salués.

Devant la porte, le ventre de [PRENOM] se serra.

Je veux pas sonner, dit-elle.

Pourquoi ?

Je les connais pas.

Maman s'accroupit.

Tu te souviens de ce qu'on a lu sur Moussa ?
Il avait peur de parler. Et Allah lui a dit :
n'aie pas peur, Je suis avec toi.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] respira. Et sonna.

La porte s'ouvrit. Une dame sourit.

Aïd Moubarak ! dit [PRENOM] d'une voix claire.

Aïd Moubarak, petite princesse !

En redescendant, [PRENOM] dit à maman :

C'était pas si difficile.

C'est toujours moins difficile après qu'avant,
dit maman.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Qu'est-ce qui a aidé [PRENOM] à sonner ?",
      "C'est rarement aussi dur qu'on le croit. Tu es d'accord ?",
      "Tu as déjà parlé à quelqu'un que tu ne connaissais pas ?",
    ],
    defi: "Cette semaine, dis bonjour ou Aïd Moubarak à quelqu'un que tu ne connais pas bien.",
  },

  "princesse-courage-aid-el-fitr-2": {
    titre: "et la danse de l'Aïd",
    texte: `Pour l'Aïd, la famille avait organisé une
petite fête. Oncle Karim demanda aux enfants de
présenter quelque chose.

[PRENOM1] et [PRENOM2] avaient préparé une danse.
Mais devant toute la famille assemblée, elles se figèrent.

Je peux pas, dit [PRENOM2].

Moi non plus, dit [PRENOM1].

Elles se regardèrent. Main dans la main.

Et [PRENOM1] dit tout bas :

N'aie pas peur. Allah est avec nous.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

Elles firent trois pas. Puis trois de plus.
Maladroitement. Mais jusqu'au bout.

La famille applaudit.

Vous avez eu peur ? dit oncle Karim.

Oui, dit [PRENOM2]. Mais on est allées quand même.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Elles avaient peur mais elles sont allées quand même. C'est quoi le courage selon vous ?",
      "Qu'est-ce qui vous a aidées à avancer ?",
      "Vous avez déjà fait quelque chose ensemble même si vous aviez peur ?",
    ],
    defi: "Cette semaine, faites ensemble quelque chose qui vous fait peur mais qui est beau.",
  },

  "princesse-courage-aid-el-adha-1": {
    titre: "et la question courageuse",
    texte: `L'Aïd el-Adha. [PRENOM] voulait comprendre
le sacrifice d'Ibrahim mais n'osait pas demander,
la question lui semblait trop grande.

Pendant tout le repas, elle garda sa question
pour elle.

Puis, au moment du dessert, elle prit une grande
inspiration.

Papa, est-ce qu'Ibrahim avait vraiment confiance,
ou il avait aussi peur ?

La table se tut. Papa la regarda.

C'est la meilleure question de la journée,
dit-il doucement.

Il lui expliqua. Ibrahim avait confiance ET peur.
Et il avait quand même dit oui.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] comprit quelque chose ce soir-là : les
grandes questions méritent d'être posées, même
quand on a peur de les poser.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Pourquoi poser une grande question peut être courageux ?",
      "Ibrahim avait confiance ET peur. Tu comprends comment les deux peuvent coexister ?",
      "Tu gardes des questions depuis longtemps ?",
    ],
    defi: "Cette semaine, pose une question que tu gardes depuis longtemps.",
  },

  "princesse-courage-aid-el-adha-2": {
    titre: "et le mouton qu'elles ont accompagné",
    texte: `L'Aïd el-Adha. Le mouton dans la cour.
[PRENOM1] voulait l'accompagner jusqu'au bout.
[PRENOM2] avait peur.

Viens avec moi, dit [PRENOM1].

Je peux pas.

Ibrahim ﷺ a dit oui quand c'était le plus difficile.
Nous on dit juste oui à être là.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM2] prit la main de sa soeur. Elles restèrent
ensemble, silencieuses, jusqu'à la fin.

En montant, [PRENOM2] dit :

Je suis contente d'être restée.

Moi aussi, dit [PRENOM1]. Ensemble c'est pas pareil.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Pourquoi [PRENOM2] était-elle contente d'être restée malgré la peur ?",
      "Ensemble c'est pas pareil. Qu'est-ce que [PRENOM1] veut dire ?",
      "Vous restez ensemble dans les moments difficiles ?",
    ],
    defi: "Cette semaine, restez présentes ensemble dans un moment difficile.",
  },

  "princesse-courage-ramadan-1": {
    titre: "et son premier jeûne",
    texte: `[PRENOM] avait huit ans et voulait jeûner
pour la première fois.

Tu es sûre ? dit maman. C'est long jusqu'au soir.

Je veux essayer.

À midi, elle avait faim. Vraiment faim.

À 15h, elle vint trouver maman.

C'est dur.

Je sais, dit maman. Le Prophète ﷺ disait que la
patience est une lumière. Et le jeûne apprend la
patience mieux que tout.

Et si j'arrête ?

Tu peux. Mais essaie encore une heure.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] tint. Jusqu'à l'appel du Maghreb.

Quand elle but la première gorgée d'eau, elle ferma
les yeux.

C'est le meilleur truc que j'aie jamais bu, dit-elle.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Pourquoi [PRENOM] voulait-elle jeûner pour la première fois ?",
      "Qu'est-ce qui l'a aidée à tenir jusqu'au bout ?",
      "Tu as déjà tenu quelque chose de difficile plus longtemps que tu ne pensais pouvoir ?",
    ],
    defi: "Cette semaine, tiens quelque chose de difficile plus longtemps que tu ne penses pouvoir.",
  },

  "princesse-courage-ramadan-2": {
    titre: "et le Coran qu'elles ont récité",
    texte: `Pendant le Ramadan, la mosquée organisait une
soirée où les enfants pouvaient réciter des sourates.

[PRENOM1] et [PRENOM2] connaissaient plusieurs sourates
par coeur. Mais réciter devant tout le monde...

Je peux pas, dit [PRENOM2].

Moussa non plus pensait qu'il pouvait pas, dit [PRENOM1].
Et il est allé quand même.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

Elles montèrent toutes les deux. Main dans la main.
Et récitèrent Al-Fatiha ensemble, d'une voix claire.

La mosquée fut silencieuse.

Puis quelqu'un dit : MashaAllah.

Et tout le monde répéta.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Pourquoi réciter devant tout le monde était courageux ?",
      "MashaAllah de tout le monde. Comment vous vous êtes senties ?",
      "Vous connaissez des sourates que vous pourriez réciter ?",
    ],
    defi: "Cette semaine, récitez ensemble une sourate que vous connaissez.",
  },

  "princesse-respect-des-parents-aid-el-fitr-1": {
    titre: "et le matin qu'elle n'oubliera pas",
    texte: `Le matin de l'Aïd el-Fitr, [PRENOM] se leva
avant tout le monde.

Elle voulait surprendre maman.

Elle mit la table. Prépara le thé. Sortit les gâteaux.

Quand maman descendit et vit la table prête,
elle s'arrêta.

Tu as fait ça toute seule ?

Oui, dit [PRENOM].

Maman la serra dans ses bras sans rien dire
pendant longtemps.

Le paradis est sous les pieds des mères.

Ce soir-là, [PRENOM] dit à grand-père :

J'ai compris quelque chose ce matin.

Quoi ?

Que rendre maman heureuse, ça me rend heureuse aussi.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Pourquoi [PRENOM] a-t-elle compris ce matin-là que rendre maman heureuse la rendait heureuse ?",
      "Qu'est-ce que ça veut dire le paradis sous les pieds des mères ?",
      "Tu fais des choses pour maman avant qu'elle te le demande ?",
    ],
    defi: "Ce matin, lève-toi et fais quelque chose pour maman avant qu'elle te le demande.",
  },

  "princesse-respect-des-parents-aid-el-fitr-2": {
    titre: "et la journée sans disputes",
    texte: `Le matin de l'Aïd, [PRENOM1] dit à sa soeur :

On fait un pacte. Aujourd'hui, on ne se dispute pas.
Et on aide maman et papa sans qu'ils demandent.

Pourquoi aujourd'hui ?

Parce que c'est l'Aïd. Et parce qu'Allah aime qu'on
soit en paix avec nos parents les jours de fête.

La satisfaction d'Allah est dans la satisfaction
des parents.

La journée passa. Quelques tensions, bien sûr.
Mais elles tinrent leur pacte.

Le soir, maman dit :

Vous avez été magnifiques aujourd'hui.

Les deux soeurs échangèrent un sourire.

On recommence demain ? dit [PRENOM2].

Et après-demain aussi, dit [PRENOM1].`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Pourquoi faire un pacte ensemble aide à tenir ?",
      "C'est difficile de ne jamais se disputer ?",
      "Vous avez essayé de passer une journée entière sans disputes ?",
    ],
    defi: "Cette semaine, faites un pacte ensemble de ne pas vous disputer devant vos parents.",
  },

  "princesse-respect-des-parents-aid-el-adha-1": {
    titre: "et la prière qu'elle fit pour eux",
    texte: `L'Aïd el-Adha. Après la grande prière,
l'imam dit quelque chose qui toucha [PRENOM] :

Faites une doua pour vos parents. Invoquez Allah
pour eux comme Ibrahim invoquait Allah pour
sa famille.

[PRENOM] ferma les yeux très fort.

Elle pensa à maman. À papa. À tout ce qu'ils faisaient.

Et elle pria, de toutes ses forces, comme elle n'avait
jamais prié pour elle-même.

Ton Seigneur a décrété que vous traitiez vos parents
avec bonté.

En sortant de la mosquée, elle trouva papa et se
serra contre lui sans rien dire.

Qu'est-ce qui se passe ? dit-il doucement.

J'ai prié pour toi, dit-elle.

Papa ne dit rien. Mais ses bras se resserrèrent.`,
    citation: "Ton Seigneur a décrété que vous traitiez vos parents avec bonté.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Pourquoi prier pour ses parents est un signe de respect ?",
      "Comment papa a-t-il réagi quand [PRENOM] s'est serrée contre lui ?",
      "Tu as déjà prié pour tes parents ?",
    ],
    defi: "Cette semaine, fais une prière sincère pour tes parents.",
  },

  "princesse-respect-des-parents-aid-el-adha-2": {
    titre: "et la lettre qu'elles ont écrite",
    texte: `Pour l'Aïd el-Adha, les deux soeurs décidèrent
d'offrir quelque chose d'invisible à leurs parents.

Une lettre.

[PRENOM1] écrivit à maman. Trois pages sur tout ce
qu'elle appréciait, sa façon de chanter en cuisinant,
ses mains douces, sa patience infinie.

[PRENOM2] écrivit à papa. Deux pages sur sa force,
ses histoires, son rire du dimanche.

Ils lurent les lettres en silence.

Ton Seigneur a décrété que vous leur disiez des
paroles nobles.

Maman plia sa lettre soigneusement et dit :

Je vais la garder toute ma vie.`,
    citation: "Ton Seigneur a décrété que vous leur disiez des paroles nobles.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Maman dit je vais la garder toute ma vie. Pourquoi une lettre peut avoir autant de valeur ?",
      "Qu'est-ce que des paroles nobles selon vous ?",
      "Vous avez déjà écrit quelque chose à vos parents ?",
    ],
    defi: "Cette semaine, écris une lettre à un de tes parents. Dis-lui ce que tu n'arrives pas à dire à voix haute.",
  },

  "princesse-respect-des-parents-ramadan-1": {
    titre: "et le Ramadan qu'elle aida",
    texte: `Pendant le Ramadan, maman se levait chaque
nuit pour le s'hour, le repas avant l'aube.

Un soir, [PRENOM] dit :

Maman, je me lève avec toi demain.

Tu n'as pas besoin.

Je sais. Mais je veux.

Le lendemain à 4h du matin, le réveil sonna.
[PRENOM] se leva, les yeux lourds, les pieds froids.

Maman était dans la cuisine. Elle la vit arriver.

Qu'est-ce que tu fais là ?

Je t'aide.

Le paradis est sous les pieds des mères.

Elles préparèrent le s'hour ensemble dans le silence
de la nuit. C'était étrange et beau.

En se recouchant, [PRENOM] pensa qu'elle avait peut-être
vu maman comme elle était vraiment, pas juste maman,
mais une femme qui se levait à 4h du matin pour
sa famille depuis des années.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Pourquoi se lever à 4h du matin a changé la façon dont [PRENOM] voit sa maman ?",
      "Qu'a-t-elle compris que maman faisait depuis des années ?",
      "Tu sais à quelle heure tes parents se lèvent ?",
    ],
    defi: "Cette semaine, lève-toi tôt une fois et aide maman ou papa avec quelque chose qu'ils font habituellement seuls.",
  },

  "princesse-respect-des-parents-ramadan-2": {
    titre: "et les trente nuits",
    texte: `Les deux soeurs décidèrent que pendant tout
le Ramadan, trente nuits, elles feraient quelque chose
de gentil pour leurs parents chaque soir avant
de dormir.

Parfois petit. Un verre d'eau posé sur la table de nuit.
Les chaussures rangées sans qu'on leur demande.

Parfois plus grand. La vaisselle faite.
Le linge plié.

Le dernier soir, [PRENOM2] dit :

On compte combien on a fait ?

Non, dit [PRENOM1]. On fait pas ça pour compter.

La satisfaction d'Allah est dans la satisfaction
des parents.

Pour quoi alors ?

Pour que ça devienne naturel, dit [PRENOM1].
Comme respirer.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "[PRENOM1] dit on fait pas ça pour compter. Pour quoi alors ?",
      "Comment quelque chose devient naturel comme respirer ?",
      "Vous avez un rituel avec vos parents ?",
    ],
    defi: "Pendant une semaine, faites quelque chose pour vos parents chaque soir. Sans compter.",
  },

  "princesse-respect-des-parents-anniversaire-1": {
    titre: "et l'anniversaire de maman",
    texte: `[PRENOM] voulait faire quelque chose de grand
pour l'anniversaire de maman.

Pas un cadeau acheté. Quelque chose de vrai.

Elle passa deux semaines à recueillir des témoignages,
papa, grand-mère, les tantes, sur ce qu'ils aimaient
chez maman.

Elle les mit dans un beau carnet.

Le soir de l'anniversaire, elle offrit le carnet.

Maman l'ouvrit. Elle lut lentement, page après page.

Ton Seigneur a décrété que vous leur disiez des
paroles nobles.

Quand elle releva les yeux, ils brillaient.

Comment tu as eu l'idée ?

Je voulais que tu saches ce qu'on pense vraiment,
dit [PRENOM]. Pas juste ce soir. Tout le temps.`,
    citation: "Ton Seigneur a décrété que vous leur disiez des paroles nobles.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Pourquoi [PRENOM] a-t-elle recueilli des témoignages sur maman ?",
      "Comment tu crois que maman s'est sentie en lisant le carnet ?",
      "Qu'est-ce que tu apprécies chez ta maman ?",
    ],
    defi: "Cette semaine, recueille des mots gentils sur maman ou papa et offre-les lui.",
  },

  "princesse-respect-des-parents-anniversaire-2": {
    titre: "et la journée sans écrans",
    texte: `Pour l'anniversaire de papa, les deux soeurs
décidèrent d'offrir quelque chose qu'on ne peut pas
acheter.

Toute la journée avec lui. Sans téléphone, sans
tablette, sans télévision.

Papa les regarda, sceptique.

Toute la journée ?

Toute la journée.

Ils jouèrent aux cartes. Ils se promenèrent.
Ils cuisinèrent ensemble. Ils rirent.

Le soir, papa dit :

C'est le plus beau cadeau que vous m'ayez jamais fait.

La satisfaction d'Allah est dans la satisfaction
des parents.

[PRENOM2] dit à sa soeur en se couchant :

On devrait faire ça plus souvent. Pas juste pour
les anniversaires.

Tous les dimanches ? dit [PRENOM1].

Tous les dimanches.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Papa dit c'est le plus beau cadeau. Pourquoi le temps vaut plus qu'un objet ?",
      "Est-ce difficile de passer une journée sans écrans ?",
      "Qu'est-ce que vous aimez faire avec vos parents sans écrans ?",
    ],
    defi: "Cette semaine, offrez une journée sans écrans à vos parents.",
  },

  "princesse-patience-aid-el-fitr-1": {
    titre: "et les gâteaux qui refroidissaient",
    texte: `Le matin de l'Aïd, maman sortit les gâteaux
du four. Ils embaumaient toute la maison.

On peut en manger ? dit [PRENOM].

Ils doivent refroidir d'abord.

[PRENOM] regarda les gâteaux. Brillants, parfaits.

Elle attendit. Cinq minutes. Dix.

Maintenant ?

Encore un peu.

[PRENOM] alla s'asseoir sur le canapé, les bras croisés.

Grand-père passa.

Tu bouges des lèvres, dit-il en souriant.

Je récite, dit [PRENOM]. Pour passer le temps.

Tu sais ce que le Prophète ﷺ a dit sur la patience ?

Personne ne reçoit un don meilleur et plus vaste
que la patience.

Même pour les gâteaux ? dit [PRENOM].

Surtout pour les gâteaux, dit grand-père.

Quand enfin elle put en manger, ce fut le meilleur
gâteau de toute sa vie.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Grand-père dit la patience vaut même pour les gâteaux. Tu comprends pourquoi ?",
      "Pourquoi les gâteaux étaient-ils meilleurs après l'attente ?",
      "Attendre quelque chose le rend-il toujours plus beau ?",
    ],
    defi: "Cette semaine, attends quelque chose qui te semble long, sans te plaindre.",
  },

  "princesse-patience-aid-el-fitr-2": {
    titre: "et la queue pour les cadeaux",
    texte: `Le matin de l'Aïd, les cousins et cousines
étaient tous rassemblés chez grand-mère. Les cadeaux
attendaient sous la grande table.

Grand-mère distribuait un par un, du plus jeune
au plus vieux.

[PRENOM2] était presque la dernière. Elle regardait
les autres déballer.

C'est long, dit-elle.

Regarde leurs visages, dit [PRENOM1]. C'est beau non ?

[PRENOM2] regarda. Le petit Youssef qui arrachait le
papier. La petite Inès qui serrait sa poupée.

Oui, admit-elle.

Alors attendre que ce soit à ton tour, c'est aussi
un cadeau, dit [PRENOM1].

Personne ne reçoit un don meilleur et plus vaste
que la patience.

Quand vint le tour de [PRENOM2], elle déballa son
cadeau lentement, savourant chaque instant.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "[PRENOM1] dit qu'attendre c'est aussi un cadeau. Tu comprends ce qu'elle veut dire ?",
      "Comment [PRENOM2] a-t-elle transformé son attente en quelque chose de beau ?",
      "Tu déballe tes cadeaux vite ou lentement ?",
    ],
    defi: "Cette semaine, savourez quelque chose lentement au lieu de vous dépêcher.",
  },

  "princesse-patience-aid-el-adha-1": {
    titre: "et les trois jours avant l'Aïd",
    texte: `[PRENOM] comptait les jours.
Trois jours avant l'Aïd el-Adha.

Deux jours.

Un jour.

Le matin de l'Aïd, elle se réveilla tôt, prête.

Mais papa était encore en train de prier. Maman
préparait. Grand-mère s'habillait lentement.

[PRENOM] attendit dans le couloir, en habits de fête.

Maman la vit et sourit.

Tu sais pourquoi on attendrait même des années pour
Allah sans se plaindre ?

Pourquoi ?

Parce qu'Ibrahim a attendu toute sa vie avant de
recevoir son fils Ismaïl. Et il n'a jamais
perdu espoir.

Avec la difficulté vient la facilité.

[PRENOM] pensa à Ibrahim. Puis elle alla aider maman
à préparer.

Attendre ne voulait pas dire ne rien faire.`,
    citation: "Avec la difficulté vient la facilité.",
    source: "Coran, Sourate Al-Inshirah, verset 5 et 6",
    questions: [
      "Attendre ne veut pas dire ne rien faire. Qu'est-ce que [PRENOM] a compris ?",
      "Comment Ibrahim a-t-il attendu sans perdre espoir ?",
      "Que fais-tu pendant que tu attends quelque chose ?",
    ],
    defi: "Cette semaine, quand tu attends quelque chose, fais quelque chose d'utile pendant ce temps.",
  },

  "princesse-patience-aid-el-adha-2": {
    titre: "et la demande qu'elles ont attendu d'exaucer",
    texte: `Les deux soeurs voulaient un chiot depuis un an.

L'Aïd el-Adha. Papa dit :

Vous avez attendu patiemment. Sans vous plaindre.
Vous avez continué à bien vous comporter.
Alors venez.

Il les emmena chez l'éleveur.

Un petit chiot roux les regarda.

[PRENOM2] prit la main de sa soeur.

On a attendu un an.

Et maintenant il est là, dit [PRENOM1].

Personne ne reçoit un don meilleur et plus vaste
que la patience.

La patience c'est pas juste attendre, dit [PRENOM2]
en serrant le chiot. C'est croire que ça va venir.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "La patience c'est croire que ça va venir. Tu es d'accord avec [PRENOM2] ?",
      "Qu'est-ce qui a rendu le chiot encore plus précieux après l'attente ?",
      "Vous attendez quelque chose en ce moment ?",
    ],
    defi: "Cette semaine, attendez quelque chose ensemble sans vous décourager.",
  },

  "princesse-patience-ramadan-1": {
    titre: "et les longues journées du Ramadan",
    texte: `Le Ramadan. Les journées longues.
[PRENOM] ne jeûnait pas encore mais elle voyait
maman jeûner.

Tu as pas faim ? demanda-t-elle un soir.

Bien sûr que si.

Alors comment tu fais ?

Maman s'assit avec elle.

Je pense à autre chose. Je lis, je cuisine, je prie.
Et je sais que le soir, l'iftar arrivera.

C'est tout ?

Et je me souviens que Allah voit et récompense chaque
heure de patience.

La patience est une lumière.

[PRENOM] regarda maman différemment.

Tu es courageuse, dit-elle.

Non, dit maman. Je suis patiente. C'est différent.
Et c'est mieux.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Maman dit que la patience c'est mieux que le courage. Tu comprends pourquoi ?",
      "Comment maman fait-elle pour tenir toute la journée ?",
      "Tu admires quelqu'un pour sa patience ?",
    ],
    defi: "Cette semaine, fais quelque chose de difficile en pensant à la récompense à la fin.",
  },

  "princesse-patience-ramadan-2": {
    titre: "et le livre du Ramadan",
    texte: `[PRENOM1] et [PRENOM2] avaient décidé de
lire un livre ensemble pendant le Ramadan.
Un long livre, deux cents pages.

On lit combien de pages par jour ? dit [PRENOM2].

Dix, dit [PRENOM1]. Comme ça on finit avant la fin
du Ramadan.

Le premier jour, dix pages.
Le dixième jour, elles avaient pris du retard.
Quinze pages en retard.
Le quinzième, vingt pages en retard.

On va jamais finir, dit [PRENOM2].

Avec la difficulté vient la facilité, dit [PRENOM1].
On rattrape doucement.

Avec la difficulté vient la facilité.

Elles rattrapèrent. Lentement. Cinq pages
supplémentaires par jour.

Le dernier soir du Ramadan, elles lurent la
dernière page ensemble.

On l'a fait, dit [PRENOM2].

On l'a fait, dit [PRENOM1].`,
    citation: "Avec la difficulté vient la facilité.",
    source: "Coran, Sourate Al-Inshirah, verset 5 et 6",
    questions: [
      "Comment les deux soeurs ont-elles rattrapé leur retard ?",
      "Qu'est-ce qu'elles ont appris sur elles-mêmes ?",
      "Avez-vous déjà fini quelque chose ensemble que vous pensiez impossible ?",
    ],
    defi: "Cette semaine, commencez ensemble quelque chose qui prend du temps et tenez jusqu'au bout.",
  },

  "princesse-patience-sans-occasion-1": {
    titre: "et le tableau qu'elle recommençait",
    texte: `[PRENOM] voulait peindre un tableau parfait
pour offrir à maman.

Première tentative, raté. Les couleurs avaient coulé.
Deuxième, raté. Les proportions étaient mauvaises.
Troisième, raté.

Elle faillit tout jeter.

Mais elle pensa à quelque chose que grand-mère
lui avait dit.

La patience est une lumière.

Quatrième tentative. Elle ralentit. Elle prit le temps.

Quand maman vit le tableau, elle dit :

Comment tu savais que c'était mes couleurs préférées ?

Je t'ai observée, dit [PRENOM]. J'avais le temps de
regarder parce que j'ai recommencé quatre fois.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Pourquoi la quatrième tentative était-elle meilleure que la première ?",
      "[PRENOM] dit qu'elle avait le temps de regarder parce qu'elle avait recommencé. Tu comprends ?",
      "Tu abandonnes vite ou tu recommences ?",
    ],
    defi: "Cette semaine, recommence quelque chose que tu avais abandonné.",
  },

  "princesse-patience-sans-occasion-2": {
    titre: "et le puzzle de mille pièces",
    texte: `Les deux soeurs avaient trouvé dans le grenier
un vieux puzzle de mille pièces.

On le fait ? dit [PRENOM2].

Ça va prendre des jours.

Et alors ?

Elles commencèrent. Chaque soir, quelques pièces.
Parfois une seule quand elles ne trouvaient pas.

Deux semaines plus tard, il manquait cent pièces.

Une semaine de plus. Dix pièces.

Et un soir, la dernière pièce.

Personne ne reçoit un don meilleur que la patience.

On a mis combien de temps ? dit [PRENOM2].

Vingt-deux jours.

Et maintenant il est là.

Elles gardèrent le puzzle assemblé sur la table
pendant toute une semaine, à le regarder passer.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Vingt-deux jours pour un puzzle. Est-ce que ça valait l'attente ?",
      "Pourquoi elles ont gardé le puzzle assemblé une semaine entière ?",
      "Vous avez un projet long que vous pourriez commencer ensemble ?",
    ],
    defi: "Cette semaine, commencez un projet long ensemble et travaillez-y un peu chaque jour.",
  },

  "licorne-generosite-aid-el-fitr-1": {
    titre: "et Nour qui changeait de couleur",
    texte: `Le matin de l'Aïd, [PRENOM] remarqua quelque
chose d'étrange.

Sa licorne Nour, habituellement rose et dorée,
était ce matin d'une teinte terne.

Qu'est-ce qui t'arrive ?

Je ressens ce que tu ressens, dit Nour. Et tu penses
à garder tout pour toi.

[PRENOM] regarda sa bourse d'Aïd.

C'est vrai.

La générosité me redonne mes couleurs, dit Nour.
Et toi, elle te redonnera ta joie.

[PRENOM] prit la moitié de ses pièces et alla les
donner à la petite fille qui habitait en bas.

En remontant, Nour était rose éclatant.

La charité n'a jamais appauvri personne.

Et [PRENOM] comprit que ses couleurs à elle aussi
avaient changé.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi Nour était-elle terne ce matin-là ?",
      "Comment [PRENOM] a-t-elle regagné ses couleurs ?",
      "Tu as déjà remarqué que donner te rendait plus heureux ?",
    ],
    defi: "Cette semaine, fais un geste généreux et observe comment tu te sens après.",
  },

  "licorne-generosite-aid-el-adha-1": {
    titre: "et la licorne qui expliqua Ibrahim",
    texte: `L'Aïd el-Adha. [PRENOM] regardait le mouton
dans la cour, perplexe.

Sa licorne Nour vint s'asseoir à côté d'elle.

Tu veux comprendre ?

Oui.

Ibrahim aimait Allah plus que tout. Alors quand Allah
lui a demandé quelque chose de difficile, il a dit oui.
Et Allah a remplacé le sacrifice par un bélier.

Pourquoi nous on continue ?

Pour se souvenir. Et pour partager, un tiers pour ceux
qui n'ont rien.

La charité n'a jamais appauvri personne.

[PRENOM] porta la part des pauvres ce soir-là.
En pensant à Ibrahim. En pensant à Nour. En pensant
à ce que donner vraiment voulait dire.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi continue-t-on le sacrifice d'Ibrahim aujourd'hui ?",
      "Donner en pensant à pourquoi, est-ce différent de donner sans réfléchir ?",
      "Tu penses à quelque chose quand tu fais un geste généreux ?",
    ],
    defi: "Cette semaine, donne quelque chose en pensant à pourquoi tu le fais, pas juste à ce que tu donnes.",
  },

  "licorne-generosite-aid-el-adha-2": {
    titre: "et les deux licornes qui portèrent",
    texte: `L'Aïd el-Adha. Les deux soeurs avaient chacune
leur licorne, Nour et Sabr.

Les deux licornes proposèrent quelque chose d'inhabituel.

On vous aide à porter la part des pauvres,
dirent-elles.

Vous êtes des licornes, dit [PRENOM2]. Vous pouvez
pas porter des paniers.

Non, dit Nour. Mais on peut vous donner de l'énergie
quand vous êtes fatiguées.

Les deux soeurs partirent avec leurs paniers.
Dix familles. Beaucoup de marche.

À la huitième famille, elles étaient épuisées.

La charité n'a jamais appauvri personne.

Et quelque chose dans leurs poitrines se ralluma,
comme si les licornes avaient tenu leur promesse.

Elles finirent les deux dernières familles.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Pourquoi les licornes ont-elles voulu porter avec les soeurs ?",
      "Comment s'entraider dans un geste généreux le rend-il plus fort ?",
      "Vous avez déjà fait quelque chose de généreux ensemble ?",
    ],
    defi: "Cette semaine, aidez-vous mutuellement dans un geste généreux.",
  },

  "licorne-generosite-ramadan-1": {
    titre: "et les étoiles du Ramadan",
    texte: `Pendant le Ramadan, Nour la licorne dit à
[PRENOM] quelque chose de mystérieux.

Chaque iftar qu'on partage cette nuit brille plus
fort dans le ciel que les autres nuits.

Pourquoi ?

Parce que le Ramadan multiplie tout. Le bien donné
en Ramadan est comme une graine plantée dans
la meilleure terre.

La charité n'a jamais appauvri personne.

[PRENOM] porta l'iftar chez la voisine ce soir-là.
En levant les yeux en chemin, elle chercha son étoile.

Elle ne la vit pas. Mais elle sut qu'elle était là.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Nour dit que le Ramadan multiplie tout. Tu comprends ce qu'elle veut dire ?",
      "[PRENOM] ne voit pas son étoile mais sait qu'elle est là. C'est quoi cette confiance ?",
      "Tu fais des gestes généreux pendant le Ramadan ?",
    ],
    defi: "Pendant le Ramadan, fais un geste généreux chaque soir. Même minuscule.",
  },

  "licorne-generosite-ramadan-2": {
    titre: "et le Ramadan le plus généreux",
    texte: `Les deux soeurs se donnèrent un défi pour
le Ramadan.

Chaque soir, avant l'iftar, un geste généreux.

Nour et Sabr les aidaient à trouver des idées
quand elles n'en avaient plus.

Le quinzième soir, [PRENOM2] dit :

On a plus d'idées.

Il y a toujours quelque chose à donner, dit Sabr.
Un sourire. Une aide. Une prière pour quelqu'un.

La charité n'a jamais appauvri personne.

Les trente soirs passèrent. Trente gestes.
Petits et grands.

On a fait quelque chose de grand ce Ramadan,
dit [PRENOM1].

Plein de petites choses, dit [PRENOM2].

C'est pareil, dit Nour.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Sabr dit qu'il y a toujours quelque chose à donner. Tu es d'accord ?",
      "Comment les soeurs ont-elles trouvé des idées quand elles n'en avaient plus ?",
      "Trente gestes en un mois, c'est beaucoup ou peu selon vous ?",
    ],
    defi: "Cette semaine, faites un geste généreux chaque jour pendant sept jours.",
  },

  "licorne-generosite-anniversaire-1": {
    titre: "et le cadeau de lumière",
    texte: `Pour son anniversaire, [PRENOM] reçut quelque
chose d'étrange de sa licorne Nour.

Je t'offre une heure de lumière, dit Nour.

C'est quoi une heure de lumière ?

Tu choisis quelqu'un et tu lui consacres une heure
entière. Toute ton attention. Toute ta gentillesse.
Une heure de toi.

[PRENOM] choisit sa petite cousine de quatre ans.

Elle passa une heure à jouer avec elle, à l'écouter,
à rire de ses histoires.

À la fin, la petite cousine lui dit :

T'es ma personne préférée.

La charité n'a jamais appauvri personne.

Nour brillait dans la nuit.

Tu vois ? dit-elle. La générosité de temps est la
plus précieuse.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Nour dit que la générosité de temps est la plus précieuse. Tu es d'accord ?",
      "Comment [PRENOM] a-t-elle passé une heure de lumière ?",
      "Tu pourrais offrir une heure de toi à quelqu'un ?",
    ],
    defi: "Cette semaine, offre une heure de ton temps à quelqu'un qui en a besoin.",
  },

  "licorne-generosite-anniversaire-2": {
    titre: "et les licornes qui offraient",
    texte: `Pour leur anniversaire, Nour et Sabr eurent
une idée.

On voudrait vous offrir nos pouvoirs pour une journée,
dirent-elles.

Vos pouvoirs ?

La magie de faire briller les autres. Vous pouvez
l'utiliser aujourd'hui.

Les deux soeurs passèrent leur anniversaire à faire
des gestes pour les autres. Petits sourires.
Petites attentions. Petits cadeaux fabriqués à la
main pour les enfants du quartier.

Le soir, Nour et Sabr brillaient comme jamais.

La charité n'a jamais appauvri personne.

On a utilisé vos pouvoirs, dirent les soeurs.

Non, dit Nour. Vous avez utilisé les vôtres.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Nour dit vous avez utilisé les vôtres. Qu'est-ce qu'elle veut dire ?",
      "Comment les deux soeurs ont-elles utilisé leur anniversaire pour les autres ?",
      "Vous voulez faire pareil pour votre prochain anniversaire ?",
    ],
    defi: "Pour votre prochain anniversaire, faites quelque chose pour les autres.",
  },

  "licorne-partage-aid-el-fitr-1": {
    titre: "et les crins que Nour a partagés",
    texte: `Il était une fois une petite fille
prénommée [PRENOM] qui croyait très fort à la magie.

Sa licorne Nour avait un pouvoir particulier.
Chaque fois que [PRENOM] gardait quelque chose
de beau rien que pour elle, les crins arc-en-ciel
de Nour perdaient une couleur.

Ce matin de l'Aïd, [PRENOM] descendit dans le jardin
avec sa bourse toute neuve remplie de pièces.

Nour était là, sous le grand figuier.
Mais quelque chose n'allait pas.
Ses crins avaient perdu le rouge et l'orange.
Il ne restait plus que le jaune, le vert et le bleu.

Qu'est-ce qui t'arrive ? dit [PRENOM].

Je ressens ce que tu ressens, dit Nour doucement.
Et tu penses à garder tout pour toi.

[PRENOM] regarda sa bourse.

C'est vrai, admit-elle. C'est mon argent de l'Aïd.
Je l'ai attendu toute l'année.

Je sais, dit Nour. Mais tu sais aussi que la magie
qui ne circule pas s'éteint. Comme une flamme
sans oxygène.

[PRENOM] réfléchit.

Elle pensa à la petite fille du bas de la rue,
celle qui regardait toujours par la fenêtre
pendant les fêtes.

Elle pensa à une chose que maman lui avait dite.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

[PRENOM] prit la moitié de ses pièces.
Et alla frapper à la porte du bas de la rue.

Quand elle revint, Nour avait retrouvé toutes
ses couleurs. Plus vives qu'avant. Plus lumineuses.

Tu vois ? dit Nour. La magie qui circule
grandit au lieu de s'éteindre.

[PRENOM] regarda ses propres mains.
Et elle eut l'impression qu'elles brillaient
un peu, elles aussi.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi les crins de Nour perdaient-ils leurs couleurs ?",
      "Nour dit que la magie qui ne circule pas s'éteint. Tu comprends ce qu'elle veut dire ?",
      "Tu as déjà partagé quelque chose sans calculer ce qu'il te restait ?",
    ],
    defi: "Cette semaine, partage quelque chose sans calculer ce qu'il te reste. Et observe si quelque chose en toi brille un peu plus.",
  },

  "licorne-partage-aid-el-fitr-2": {
    titre: "et les licornes qui échangèrent leur magie",
    texte: `Il était une fois deux soeurs qui avaient
chacune une licorne magique.

[PRENOM1] avait Nour, rose et dorée, avec des crins
arc-en-ciel et une corne qui scintillait comme
une étoile.

[PRENOM2] avait Sabr, bleue et argentée, avec
une corne qui produisait une lumière douce
et apaisante, parfaite pour s'endormir.

Ce matin de l'Aïd, les deux licornes firent
quelque chose que les deux soeurs n'avaient
jamais vu.

Elles échangèrent leurs cornes.

Nour donna sa corne scintillante à Sabr.
Sabr donna sa corne apaisante à Nour.

Pourquoi vous faites ça ? dit [PRENOM1], surprise.

Parce que ce qu'on possède prend plus de valeur
quand on choisit de le partager, dit Nour.

Mais vous avez perdu quelque chose d'unique,
dit [PRENOM2].

Non, dit Sabr. Regardez mieux.

Les deux soeurs regardèrent.

Nour avait maintenant une corne scintillante ET
une lumière apaisante.
Sabr aussi avait les deux.

Comment c'est possible ? dit [PRENOM1].

Parce que partager quelque chose de vrai
le multiplie, dit Nour. C'est la loi des choses
qui ont de la valeur.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

[PRENOM1] et [PRENOM2] se regardèrent.

[PRENOM1] avait reçu ce matin une belle boîte
de crayons de couleur.
[PRENOM2] avait reçu un carnet aux pages dorées.

Elles n'eurent pas besoin de se parler
pour comprendre.

Elles passèrent la journée de l'Aïd à dessiner
ensemble, les crayons de [PRENOM1] sur le carnet
de [PRENOM2].

Et le résultat était plus beau que ce que
ni l'une ni l'autre n'aurait pu créer seule.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Comment les licornes avaient-elles les deux pouvoirs après l'échange ?",
      "Qu'est-ce que ça vous dit sur le partage ?",
      "Vous avez déjà créé quelque chose ensemble que ni l'une ni l'autre n'aurait pu faire seule ?",
    ],
    defi: "Cette semaine, faites quelque chose ensemble où chacune apporte ce qu'elle a. Et observez ce que ça donne.",
  },

  "licorne-partage-aid-el-adha-1": {
    titre: "et la licorne qui portait",
    texte: `Il était une fois une petite fille prénommée
[PRENOM] dont la licorne s'appelait Nour.

L'Aïd el-Adha. Le grand jour du sacrifice
et du partage.

Maman donna à [PRENOM] le sac de la part
des pauvres. Lourd. Plein de viande soigneusement
emballée pour sept familles du quartier.

[PRENOM] le souleva. Puis le reposa.

C'est trop lourd pour moi toute seule.

Nour, invisible pour les autres mais présente
pour [PRENOM], dit doucement :

Rien n'est trop lourd quand on le porte
pour les bonnes raisons.

[PRENOM] regarda le sac.

Et les bonnes raisons c'est quoi ?

C'est Ibrahim, dit Nour. C'est le souvenir
de ce qu'il a donné. Et c'est les familles
qui attendent derrière ces sept portes.

[PRENOM] prit le sac.
C'était lourd. Vraiment lourd.
Mais elle avança.

Première porte. Deuxième. Troisième.
À chaque porte, le sac s'allégeait un peu.
Et quelque chose dans la poitrine de [PRENOM]
devenait plus léger aussi.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

À la septième porte, le sac était vide.
Et [PRENOM] avait l'impression de peser
la moitié de son poids habituel.

Elle rentra à la maison en sautant presque.

Maman la vit arriver.

Tu as l'air contente.

C'est bizarre, dit [PRENOM]. J'ai tout donné
et je me sens plus légère.

Maman sourit.

C'est toujours comme ça avec le vrai partage,
dit-elle. On donne du poids et on se sent
légère comme une plume.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Nour dit que rien n'est trop lourd quand on le porte pour les bonnes raisons. Tu es d'accord ?",
      "Pourquoi [PRENOM] se sentait-elle plus légère après avoir tout donné ?",
      "Tu as déjà porté quelque chose de difficile pour quelqu'un ?",
    ],
    defi: "Cette semaine, fais quelque chose de difficile pour quelqu'un d'autre. Et observe comment tu te sens après.",
  },

  "licorne-partage-aid-el-adha-2": {
    titre: "et la corne partagée",
    texte: `Il était une fois deux soeurs prénommées
[PRENOM1] et [PRENOM2] qui avaient chacune
une licorne.

La licorne de [PRENOM1] s'appelait Nour.
La licorne de [PRENOM2] s'appelait Sabr.

L'Aïd el-Adha. Les deux soeurs devaient porter
ensemble la part des pauvres.

Un grand panier. Dix familles sur la liste.

Nour et Sabr marchèrent avec elles,
invisibles pour les autres.

À la troisième famille, [PRENOM1] dit à sa soeur :

Tu te souviens de ce que maman a dit sur Ibrahim ?

Qu'il a tout donné quand Allah lui a demandé,
dit [PRENOM2].

Et il n'a pas calculé combien ça lui coûtait.
Il n'a pas regardé ce qui lui resterait.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

[PRENOM2] regarda le panier.
Puis les maisons qui restaient sur la liste.

On a encore sept familles.

Je sais, dit [PRENOM1]. On y va ensemble ?

Ensemble, dit [PRENOM2].

Elles tinrent le panier à deux.
Une anse chacune.
Et le poids à deux était presque léger.

À la dixième famille, une vieille dame
ouvrit la porte. Elle regarda les deux soeurs.
Puis le panier. Puis les deux soeurs encore.

Et elle dit quelque chose que [PRENOM1] et
[PRENOM2] n'oublièrent jamais.

Qu'Allah vous accorde ce que vous nous
donnez aujourd'hui.

Nour et Sabr brillèrent dans l'ombre
du couloir.

Et les deux soeurs rentrèrent à la maison
les mains vides et le coeur plein à déborder.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi tenir le panier à deux anse chacune changeait quelque chose ?",
      "La vieille dame dit Qu'Allah vous accorde ce que vous nous donnez. Qu'est-ce qu'elle veut dire ?",
      "Vous portez des choses difficiles ensemble parfois ?",
    ],
    defi: "Cette semaine, portez ensemble quelque chose que vous feriez habituellement seules. Et observez si c'est plus léger.",
  },

  "licorne-partage-ramadan-1": {
    titre: "et les nuits du Ramadan",
    texte: `Pendant le Ramadan, [PRENOM] avait une habitude.

Chaque soir, avant l'iftar, elle allait trouver
sa licorne Nour dans le jardin.

Et Nour lui posait toujours la même question.

Qu'est-ce que tu as partagé aujourd'hui ?

Au début, [PRENOM] répondait facilement.

J'ai donné mon goûter. J'ai aidé maman.
J'ai laissé ma place.

Mais au fil des jours, les réponses devinrent
plus difficiles à trouver.

Le vingtième soir du Ramadan, [PRENOM] resta
silencieuse un long moment.

Je sais pas, dit-elle finalement. Aujourd'hui
j'ai rien partagé de spécial.

Nour la regarda doucement.

Tu as souri à quelqu'un ?

Oui.

Tu as écouté quelqu'un qui avait besoin
de parler ?

Oui. La vieille dame du bas.

Alors tu as partagé quelque chose de précieux,
dit Nour. Ton attention. Ton temps. Ton sourire.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Ce que j'aime pour moi, dit [PRENOM] lentement,
c'est qu'on m'écoute vraiment.

Et tu l'as donné aujourd'hui, dit Nour.

[PRENOM] regarda ses mains.

On peut partager des choses qu'on ne voit pas ?

Les meilleures choses se partagent comme ça,
dit Nour. Sans peser. Sans mesurer.
Et elles grandissent chaque fois qu'on les donne.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Nour dit qu'on peut partager des choses qu'on ne voit pas. Lesquelles selon toi ?",
      "Pourquoi écouter quelqu'un est une forme de partage ?",
      "Tu partages ton attention et ton temps avec les gens autour de toi ?",
    ],
    defi: "Cette semaine, partage quelque chose qu'on ne voit pas. Ton écoute, ton sourire, ton temps. Et compte combien de fois tu le fais.",
  },

  "licorne-partage-ramadan-2": {
    titre: "et les iftar du couloir",
    texte: `Pendant le Ramadan, Nour et Sabr suggérèrent
quelque chose aux deux soeurs.

Invitez une famille différente chaque semaine
pour l'iftar, dit Nour.

On a pas de place, dit [PRENOM2].

Faites de la place, dit Sabr. Le coeur s'agrandit
quand on l'utilise.

Les deux soeurs regardèrent leur appartement.
Petit. Pas vraiment conçu pour recevoir.

On peut mettre une table dans le couloir ?
dit [PRENOM1].

[PRENOM2] la regarda.

Pourquoi pas.

Elles parlèrent à maman. Maman dit oui.
Elles parlèrent aux voisins. Les voisins dirent oui.

La première semaine : la famille du deuxième étage.
La deuxième semaine : le vieux monsieur du premier.
La troisième semaine : la famille qui venait
d'emménager et ne connaissait encore personne.
La quatrième semaine : tout le monde ensemble.

Ce soir-là, le couloir de l'immeuble était plein
de rires, d'odeurs, de voix mélangées.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

[PRENOM1] dit à sa soeur :

La maison est pareille. Mais elle est différente.

Différente comment ? dit [PRENOM2].

Elle a été habitée par plus de gens.
Et ça se sent.

Nour et Sabr brillaient dans le couloir sombre,
invisibles pour tous sauf pour les deux soeurs.

Et ce Ramadan fut le plus beau de leur vie.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Sabr dit que le coeur s'agrandit quand on l'utilise. Tu comprends ce qu'elle veut dire ?",
      "[PRENOM1] dit que la maison est différente parce qu'habitée par plus de gens. Tu comprends ?",
      "Vous avez déjà invité quelqu'un à partager un repas chez vous ?",
    ],
    defi: "Cette semaine, invitez quelqu'un à partager un repas chez vous. Quelqu'un que vous ne connaissez pas encore bien.",
  },

  "licorne-courage-aid-el-fitr-1": {
    titre: "et la voix qu'elle a trouvée",
    texte: `Il était une fois une petite fille prénommée
[PRENOM] dont la licorne s'appelait Nour.

Ce matin de l'Aïd, toute la famille était réunie
chez grand-mère. Les oncles, les tantes, les cousins.
Une grande tablée bruyante et joyeuse.

Grand-père prit la parole.

Chaque enfant va nous dire une chose pour laquelle
il est reconnaissant cette année.

Les cousins parlèrent un par un. Certains facilement.
D'autres en rougissant un peu.

Puis vint le tour de [PRENOM].

Son coeur battait fort. Toute la table la regardait.
Même les oncles qu'elle ne voyait qu'une fois par an.

Nour était invisible pour tous.
Mais [PRENOM] sentit sa chaleur juste à côté d'elle.
Comme une main posée doucement sur l'épaule.

N'aie pas peur. Je suis avec toi.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] prit une grande inspiration.

Et elle dit quelque chose qui la surprit elle-même.

Je suis reconnaissante pour ma famille.
Et pour Nour. Même si vous la voyez pas.

La table rit doucement. Pas un rire moqueur.
Un rire doux, surpris, touché.

Qui est Nour ? dit grand-père.

Quelqu'un qui m'aide à avoir du courage,
dit [PRENOM].

Grand-père la regarda longtemps.

Tout le monde a un Nour, dit-il finalement.
Certains l'appellent foi. D'autres confiance.
D'autres amour. Mais tout le monde a quelque chose
qui souffle n'aie pas peur au moment où on en a
le plus besoin.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Qu'est-ce qui a aidé [PRENOM] à parler devant tout le monde ?",
      "Grand-père dit que tout le monde a un Nour. Tu es d'accord ? Quel est le tien ?",
      "Tu as déjà dit quelque chose de courageux devant des gens que tu aimes ?",
    ],
    defi: "Cette semaine, dis quelque chose de vrai devant des gens que tu aimes. Même si ta voix tremble un peu.",
  },

  "licorne-courage-aid-el-fitr-2": {
    titre: "et le spectacle de l'Aïd",
    texte: `Pour l'Aïd, la famille avait organisé une
petite fête. Tout le monde devait présenter
quelque chose.

Nour et Sabr soufflèrent à [PRENOM1] et [PRENOM2] :

Chantez quelque chose.

On sait pas chanter, dit [PRENOM2].

Tout le monde sait chanter, dit Nour.
Certains ont juste plus peur d'essayer.

Les deux soeurs se regardèrent.

La grand-salle. La famille installée.
Les regards qui attendaient.

[PRENOM1] prit la main de [PRENOM2].

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

Moussa avait peur lui aussi, dit [PRENOM1]
à voix basse. Et il est allé quand même.

[PRENOM2] serra la main de sa soeur.

Ensemble alors.

Elles chantèrent une chanson de l'Aïd
que grand-mère leur avait apprise. Pas parfaitement.
[PRENOM2] dérapa sur une note.
[PRENOM1] oublia les paroles d'un couplet
et les inventa.

Mais elles allèrent jusqu'au bout.
Main dans la main.
Voix mêlées.

La famille applaudit. Vraiment.
Pas juste pour être gentille.

Grand-mère avait les yeux brillants.

En s'asseyant, [PRENOM2] dit à sa soeur :

J'avais tellement peur.

Moi aussi, dit [PRENOM1].

Et on l'a fait quand même.

C'est ça le courage, dit [PRENOM1].
Pas l'absence de peur. Juste le fait d'aller
quand même.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Nour dit que tout le monde sait chanter mais que certains ont plus peur. Tu es d'accord ?",
      "[PRENOM1] dit que le courage c'est pas l'absence de peur mais aller quand même. Tu comprends ?",
      "Vous avez déjà fait quelque chose ensemble même si vous aviez peur toutes les deux ?",
    ],
    defi: "Cette semaine, faites ensemble quelque chose qui vous fait peur. Tenez-vous la main si besoin. Et allez jusqu'au bout.",
  },

  "licorne-courage-aid-el-adha-1": {
    titre: "et la question d'Ibrahim",
    texte: `[PRENOM] et sa licorne Nour avaient l'habitude
de parler le soir, dans le jardin, quand tout
le monde dormait.

Ce soir de l'Aïd el-Adha, [PRENOM] posa
une question qui lui pesait depuis longtemps.

Nour, est-ce qu'Ibrahim avait peur quand
Allah lui a demandé ça ?

Nour resta silencieuse un moment.

Qu'est-ce que tu crois, toi ?

Je sais pas. Dans les histoires il a l'air
tellement fort.

Être fort ne veut pas dire ne pas avoir peur,
dit Nour doucement. Ça veut dire agir malgré
la peur. Ibrahim était humain. Il aimait
son fils. Bien sûr qu'il avait peur.

Et il a quand même dit oui ?

Il avait quelque chose de plus grand que
la peur, dit Nour.

Quoi ?

La certitude qu'Allah était avec lui.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] regarda le ciel étoilé.

Moi j'ai peur de beaucoup de choses, dit-elle.
De parler devant la classe. De rater.
De décevoir maman.

Je sais, dit Nour.

Et si j'avais la même certitude qu'Ibrahim ?

Tu l'as déjà, dit Nour. Tu l'oublies juste
parfois.

[PRENOM] resta silencieuse un long moment.

Demain, dit-elle finalement, je vais lever
la main en classe. Même si j'ai peur
de me tromper.

Je serai là, dit Nour.

Je sais, dit [PRENOM].`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Nour dit qu'être fort ne veut pas dire ne pas avoir peur. Tu es d'accord ?",
      "Ibrahim avait la certitude qu'Allah était avec lui. Comment ça aidait selon toi ?",
      "Tu as quelque chose qui te donne du courage quand tu as peur ?",
    ],
    defi: "Cette semaine, avant quelque chose qui te fait peur, dis tout bas : n'aie pas peur, Allah est avec moi. Et avance.",
  },

  "licorne-courage-aid-el-adha-2": {
    titre: "et l'histoire d'Ibrahim qu'elles ont racontée",
    texte: `Pour l'Aïd el-Adha, la famille organisa
une soirée d'histoires.

Chacun racontait quelque chose.

[PRENOM1] et [PRENOM2] décidèrent de raconter
l'histoire d'Ibrahim ensemble. Pour les petits
cousins qui ne la connaissaient pas encore.

Nour et Sabr les encouragèrent.

Vous connaissez cette histoire mieux que
vous ne le pensez, dit Nour.

C'est devant tout le monde, dit [PRENOM2].

Ibrahim a parlé devant le Pharaon, dit Sabr.
Vous pouvez parler devant six cousins.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

Les deux soeurs se levèrent.

Elles racontèrent en alternant.
[PRENOM1] commençait une phrase.
[PRENOM2] la finissait ou la continuait.
Quand l'une hésitait, l'autre prenait le relais.

Les petits cousins les écoutaient, la bouche ouverte.

Le plus petit, quatre ans et des joues rondes,
demanda à la fin :

Ibrahim il avait peur ?

Oui, dit [PRENOM1]. Très peur.

Et il a fait quand même ?

Oui, dit [PRENOM2]. Parce qu'il savait
qu'Allah était avec lui.

Le petit garçon réfléchit sérieusement.

Alors moi aussi je peux avoir peur
et faire quand même ?

Exactement, dirent les deux soeurs ensemble.

[PRENOM1] regarda sa soeur après.

On a fait quelque chose d'important ce soir.

On a juste raconté une histoire, dit [PRENOM2].

Non, dit [PRENOM1]. On a donné du courage
à quelqu'un.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Pourquoi raconter une histoire devant les autres peut être courageux ?",
      "Le petit cousin a compris quelque chose d'important. Qu'est-ce que c'est ?",
      "Vous avez déjà donné du courage à quelqu'un sans le savoir ?",
    ],
    defi: "Cette semaine, racontez une histoire courageuse à quelqu'un de plus petit que vous. Et observez dans leurs yeux si ça allume quelque chose.",
  },

  "licorne-courage-ramadan-1": {
    titre: "et la nuit du destin",
    texte: `La nuit du 27 Ramadan. [PRENOM] voulait
veiller pour prier.

Elle avait entendu que c'était la nuit de Laylat
al-Qadr. La nuit qui vaut mille mois.

Maman dit :

Tu peux essayer. Mais si tu t'endors, c'est
pas grave. Allah connaît ton intention.

[PRENOM] s'installa sur son tapis de prière
à 22h. Nour était à côté d'elle, lumineuse
dans la nuit.

Minuit arriva. Ses paupières devinrent lourdes.

Je vais m'endormir, dit-elle à Nour.

Peut-être, dit Nour doucement.

Ça compte quand même ?

Allah voit le coeur, pas seulement les yeux
ouverts, dit Nour. Un coeur qui essaie, même
endormi, est un coeur qui cherche.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] pria encore. Puis encore.

À 1h du matin, elle se leva pour faire ses ablutions
et prier à nouveau.

À 2h, ses yeux se fermèrent malgré elle.
Elle s'endormit doucement, la joue sur
le bord du tapis de prière.

Le lendemain matin, elle se réveilla dans son lit.
Maman l'avait portée sans la réveiller.

Elle avait l'impression étrange d'avoir dormi
dans quelque chose de lumineux.

Tu as tenu jusqu'à 2h, dit maman.

Je sais pas si c'était assez.

Il n'y a pas d'assez quand le coeur est sincère,
dit maman. Il y a juste ce qu'on donne.

Et toi tu as donné ta nuit.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Nour dit qu'Allah voit le coeur pas seulement les yeux ouverts. Tu comprends ce qu'elle veut dire ?",
      "Pourquoi veiller la nuit du Ramadan demande du courage ?",
      "Tu as déjà essayé de faire quelque chose de difficile même sans être sûr d'y arriver ?",
    ],
    defi: "Cette semaine, essaie de faire quelque chose de difficile le soir même si tu es fatigué. Et dis-toi : mon intention compte.",
  },

  "licorne-courage-ramadan-2": {
    titre: "et le premier jeûne ensemble",
    texte: `C'était la première fois que [PRENOM1] et
[PRENOM2] jeûnaient ensemble pour le Ramadan.

[PRENOM1] avait déjà jeûné l'année d'avant.
[PRENOM2] essayait pour la première fois.

Nour et Sabr les accompagnèrent toute la journée.

À 10h du matin, [PRENOM2] dit :

J'ai faim.

Je sais, dit [PRENOM1].

À midi :

J'ai très faim.

Je sais.

À 15h :

Je peux plus. Je vais manger quelque chose.

[PRENOM1] prit la main de sa soeur.

Encore trois heures.

C'est trop long.

Moussa est resté dans le désert quarante jours,
dit [PRENOM1]. Nous on fait trois heures.

C'est pas pareil.

Non. Mais la patience c'est pareil. Quelque chose
de difficile qu'on fait quand même.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

Sabr murmura à [PRENOM2] :

Je suis avec toi. Chaque minute.

[PRENOM2] ferma les yeux.

D'accord. Trois heures.

Elles jouèrent. Elles lurent. Elles parlèrent.
Elles évitèrent la cuisine.

L'appel du Maghreb arriva.

[PRENOM2] but la première gorgée d'eau les yeux
fermés. Puis elle ouvrit les yeux et regarda
sa soeur.

On l'a fait.

On l'a fait, dit [PRENOM1].

Sabr brillait comme une petite étoile bleue
dans le coin de la pièce.

C'était le plus beau moment du Ramadan.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Comment [PRENOM1] a-t-elle aidé sa soeur à tenir jusqu'au bout ?",
      "Pourquoi on l'a fait ensemble était plus beau que je l'ai fait seule ?",
      "Vous avez déjà tenu quelque chose de difficile ensemble ?",
    ],
    defi: "Cette semaine, tenez ensemble quelque chose de difficile. Choisissez-le ensemble. Et allez jusqu'au bout ensemble.",
  },

  "licorne-patience-aid-el-fitr-1": {
    titre: "et Nour qui attendait",
    texte: `Ce matin de l'Aïd, [PRENOM] se réveilla
très tôt.

Tellement tôt que le soleil n'était pas encore levé.

Elle sauta de son lit, enfila ses habits de fête,
et voulut descendre au salon.

Mais le salon était sombre. La maison dormait.
Il restait deux heures avant le petit-déjeuner,
la prière, les cadeaux.

[PRENOM] alla dans le jardin.

Nour était là, comme toujours, sous le figuier.
Mais elle faisait quelque chose d'inhabituel.

Elle était immobile. Parfaitement immobile.
Les yeux mi-clos. La respiration lente.

Tu fais quoi ? dit [PRENOM].

J'attends, dit Nour.

Tu attends quoi ?

Ce matin. Cette journée. Toi.

Mais tu pourrais courir dans les prés,
dit [PRENOM]. Tu pourrais faire des choses.

Oui, dit Nour. Mais j'ai choisi d'attendre.
Avec joie. En savourant le fait que quelque chose
de beau s'en vient.

Personne ne reçoit un don meilleur et plus
vaste que la patience.

[PRENOM] s'assit dans l'herbe à côté de Nour.

Elles attendirent ensemble.
Le ciel qui passait du noir au bleu foncé.
Puis au bleu pâle. Puis au rose.

Et quand la lumière du matin arriva vraiment,
[PRENOM] comprit quelque chose.

Elle avait passé deux heures à attendre.
Et ces deux heures avaient été parmi les plus
belles de l'Aïd.

Parce qu'elle les avait vraiment vécues.
Au lieu de les traverser en courant.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Nour dit qu'elle attend avec joie. C'est différent d'attendre avec impatience ?",
      "Pourquoi les deux heures d'attente ont-elles été parmi les plus belles du matin ?",
      "Tu attends avec joie ou avec impatience d'habitude ?",
    ],
    defi: "Cette semaine, attends quelque chose avec joie plutôt qu'avec impatience. Observe ce que tu remarques pendant l'attente.",
  },

  "licorne-patience-aid-el-fitr-2": {
    titre: "et les robes qui n'arrivaient pas",
    texte: `Deux semaines avant l'Aïd, maman avait
commandé des robes chez la couturière.

Une pour [PRENOM1]. Brodée de fils dorés.
Une pour [PRENOM2]. Avec des étoiles cousues
à la main.

La couturière avait promis pour la semaine d'après.

Mais la semaine d'après, les robes n'étaient
pas prêtes.

Encore quelques jours, dit la couturière.

[PRENOM2] était déçue. Vraiment déçue.

Elle allait pas les finir à temps.

Si, dit [PRENOM1]. Elle a dit quelques jours.

Quelques jours c'est trop long.

Nour souffla à [PRENOM1] quelque chose.

[PRENOM1] dit à sa soeur :

La couturière brode chaque étoile à la main.
Une par une. Avec une aiguille et du fil.
Ça prend du temps parce que c'est fait
avec soin.

[PRENOM2] réfléchit.

Si elle bâclait, elles seraient prêtes mais
moins belles ?

Exactement, dit [PRENOM1].

Personne ne reçoit un don meilleur et plus
vaste que la patience.

La veille de l'Aïd, les robes arrivèrent.

[PRENOM2] tint la sienne dans ses mains.
Les étoiles cousues une par une brillaient
dans la lumière.

Elle compte combien d'étoiles ?
dit-elle à voix basse.

Dix-sept, dit la couturière avec un sourire.

[PRENOM2] regarda les dix-sept étoiles brodées
à la main juste pour elle.

L'attente valait les dix-sept étoiles.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi les robes étaient-elles plus belles parce qu'elles avaient pris du temps ?",
      "Dix-sept étoiles brodées à la main. Est-ce que ça change quelque chose de le savoir ?",
      "Tu attends quelque chose en ce moment ? Comment tu vis cette attente ?",
    ],
    defi: "Cette semaine, fais quelque chose lentement et avec soin. Même si ça prend plus de temps. Et observe si le résultat est différent.",
  },

  "licorne-patience-aid-el-adha-1": {
    titre: "et la patience d'Ibrahim",
    texte: `L'Aïd el-Adha. [PRENOM] et Nour parlaient
dans le jardin après la grande prière.

Ibrahim a attendu des décennies avant d'avoir
Ismaïl, dit Nour. Des décennies d'espoir
sans résultat visible.

[PRENOM] réfléchit.

Et il n'a jamais perdu espoir ?

Il priait, dit Nour. Et il continuait à vivre,
à croire, à agir bien. L'attente n'était pas
passive. Elle était active.

Comment on attend activement ?

On continue à faire ce qu'on peut faire pendant
qu'on attend ce qu'on ne peut pas forcer.

[PRENOM] pensa à quelque chose.

Moi j'attends que maman dise oui pour avoir
un chat. Depuis six mois.

Et pendant ces six mois ?

J'ai appris à m'occuper des chats du quartier.
J'ai lu des livres sur les chats.
J'ai montré à maman que je pouvais
être responsable.

Nour la regarda avec ses yeux violets doux.

Tu attends activement, dit-elle simplement.

Personne ne reçoit un don meilleur et plus
vaste que la patience.

C'est comme Ibrahim alors ? dit [PRENOM].

À ta façon, dit Nour. Il attendait un fils
en continuant à vivre avec foi.
Toi tu attends un chat en devenant
quelqu'un qui le mérite.

[PRENOM] s'assit dans l'herbe.

Je crois que j'ai compris quelque chose.

Quoi ?

Que pendant qu'on attend, on ne perd pas
du temps. On devient quelqu'un.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Nour dit que l'attente d'Ibrahim était active pas passive. C'est quoi la différence ?",
      "[PRENOM] dit que pendant qu'on attend on devient quelqu'un. Tu comprends ce qu'elle veut dire ?",
      "Tu attends quelque chose en ce moment ? Qu'est-ce que tu fais pendant cette attente ?",
    ],
    defi: "Cette semaine, pendant que tu attends quelque chose, fais une chose qui te rapproche de le mériter. Une seule. Mais fais-la.",
  },

  "licorne-patience-aid-el-adha-2": {
    titre: "et les licornes qui attendaient ensemble",
    texte: `L'Aïd el-Adha. Nour et Sabr avaient quelque
chose à dire aux deux soeurs.

Ibrahim et Ismaïl ont attendu ensemble,
dit Nour. Ibrahim attendait la volonté d'Allah.
Ismaïl attendait de comprendre.

Et ils se sont soutenus dans l'attente,
dit Sabr.

Les deux soeurs écoutaient.

Vous attendez des choses différentes,
dit Nour. [PRENOM1] attend de grandir
pour faire ce qu'elle veut faire.
[PRENOM2] attend que quelque chose de difficile
se termine.

Comment vous savez ça ? dit [PRENOM2].

On vous connaît, dit Sabr simplement.

Personne ne reçoit un don meilleur que
la patience.

Mais vous pouvez attendre ensemble,
dit Nour. Pas les mêmes choses.
Mais ensemble.

Les deux soeurs se regardèrent.

C'est quoi attendre ensemble ? dit [PRENOM1].

C'est savoir que l'autre attend aussi,
dit Nour. Et que l'attente de l'une allège
celle de l'autre.

Ce soir-là, les deux soeurs parlèrent.

[PRENOM1] parla de ce qu'elle attendait.
[PRENOM2] parla de ce qu'elle traversait.

Et quelque chose d'étrange se produisit.

L'attente semblait moins longue.
Et ce qui était difficile semblait moins lourd.

Juste parce qu'elles s'étaient dit.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Nour dit que l'attente de l'une allège celle de l'autre. Tu comprends comment ?",
      "Qu'est-ce qui a changé pour les deux soeurs après qu'elles se soient parlé ?",
      "Vous parlez de ce que vous attendez ou traversez chacune ?",
    ],
    defi: "Cette semaine, parlez-vous de ce que vous attendez chacune. Et attendez ensemble. Même si ce n'est pas la même chose.",
  },

  "licorne-patience-ramadan-1": {
    titre: "et les longues journées de Ramadan avec Nour",
    texte: `Le Ramadan. Les longues journées.

[PRENOM] ne jeûnait pas encore mais elle passait
les après-midis avec Nour dans le jardin.

Un jour, elle dit :

Nour, comment maman fait pour tenir toute la journée
sans manger et sans se plaindre ?

Nour réfléchit.

Tu sais ce que le Ramadan apprend vraiment ?

Non.

Que le corps peut attendre. Et que pendant
qu'il attend, l'âme peut faire des choses
qu'elle ne fait pas le reste du temps.

Quelles choses ?

Prier plus. Réfléchir plus. Être plus attentive
aux autres. Donner plus.

La patience est une lumière.

[PRENOM] regarda le jardin. Le soleil de l'après-midi
qui faisait briller les feuilles.

Donc le jeûne c'est pas juste ne pas manger ?

Non, dit Nour. Le jeûne c'est libérer du temps
et de l'énergie pour autre chose.

[PRENOM] réfléchit à ça longtemps.

Et toi Nour, tu jeûnes ?

Nour eut un petit sourire.

Les licornes ont leur façon de jeûner. Certains
jours je reste très tranquille. Et je regarde
le monde avec plus d'attention.

[PRENOM] s'assit dans l'herbe.

Je crois que je veux essayer l'année prochaine.

Pourquoi pas cette année ? dit Nour.

Je suis trop petite.

Pour les grandes journées, peut-être.
Mais tu pourrais essayer une petite heure.
Juste pour voir.

[PRENOM] regarda le soleil.

Juste une heure ?

Juste une heure. Et tu verras ce que ça fait.

Ce soir-là, [PRENOM] ne mangea pas son goûter
habituel. Elle attendit une heure.
La plus longue heure de sa vie.

Et quand elle but enfin son jus d'orange,
elle ferma les yeux.

Et elle comprit quelque chose que maman
essayait de lui dire depuis des années.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Nour dit que le jeûne libère du temps et de l'énergie pour autre chose. Tu comprends ?",
      "Pourquoi [PRENOM] a-t-elle compris quelque chose en buvant son jus d'orange ?",
      "Tu as déjà essayé de te priver de quelque chose pour découvrir ce que ça fait ?",
    ],
    defi: "Cette semaine, prive-toi d'une chose que tu aimes pendant une heure. Et observe ce que tu remarques pendant cette heure.",
  },

  "licorne-patience-ramadan-2": {
    titre: "et les licornes qui attendaient l'iftar",
    texte: `Le Ramadan. [PRENOM1] et [PRENOM2] jeûnaient.

Nour et Sabr décidèrent de faire quelque chose
que les deux soeurs ne s'attendaient pas.

Elles jeûnèrent aussi. À leur façon.
Elles ne mangèrent pas les fleurs du jardin
de la journée. Elles restèrent immobiles
et tranquilles pendant les heures creuses.

Vous jeûnez pour nous ? dit [PRENOM1].

On est avec vous, dit Nour simplement.
Dans l'effort et dans l'attente.

À 15h, [PRENOM2] dit :

Je peux plus.

[PRENOM1] regarda Sabr.

Sabr était là. Tranquille. Immobile.
Attendant sans se plaindre.

La patience est une lumière.

[PRENOM2] regarda Sabr aussi.

Elle attend sans rien dire, dit [PRENOM2].

Oui, dit [PRENOM1]. Comme nous.

Elles tinrent. Encore deux heures.

À l'appel du Maghreb, les quatre, deux soeurs
et deux licornes, attendaient ensemble dans
le jardin.

L'appel résonna.

[PRENOM2] prit une datte. La tint dans ses doigts
une seconde avant de la manger.

Elle savait exactement pourquoi c'était
la meilleure datte de sa vie.

Parce qu'elle avait attendu de toutes ses forces
pour y arriver.

Et Sabr brillait comme une petite étoile
bleue dans le soir.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Pourquoi Nour et Sabr ont-elles décidé de jeûner aussi ?",
      "Regarder Sabr attendre tranquillement a aidé [PRENOM2]. Comment ?",
      "La meilleure datte de sa vie. Pourquoi était-elle la meilleure ?",
    ],
    defi: "Cette semaine, faites ensemble quelque chose de difficile. Et soutenez-vous dans l'attente. Sans vous plaindre devant l'autre.",
  },

  "licorne-respect-des-parents-aid-el-fitr-1": {
    titre: "et la doua de l'Aïd",
    texte: `Le matin de l'Aïd, avant de sortir,
papa rassembla la famille dans le salon.

On fait une doua ensemble, dit-il.

Il pria pour chaque membre de la famille.
Pour les enfants. Pour les parents.
Pour ceux qui étaient loin.

Puis il dit :

Est-ce que quelqu'un veut ajouter une doua ?

[PRENOM] leva la main.

Tout le monde la regarda.

Son coeur battait vite. Mais Nour, invisible,
était juste à côté d'elle.

La satisfaction d'Allah est dans la satisfaction
des parents.

[PRENOM] ferma les yeux.

Et elle pria pour maman et papa.
Des mots simples. Des mots d'enfant.
Mais sincères, sortis du plus profond
de son coeur.

Qu'Allah les garde. Qu'Il les rende heureux.
Qu'Il leur donne la santé et la paix.

Quand elle ouvrit les yeux, maman avait
les yeux brillants.

Papa dit seulement : Ameen. D'une voix douce.

Nour brillait dans le coin de la pièce,
invisible pour tous sauf pour [PRENOM].

Et [PRENOM] comprit quelque chose.

Prier pour ses parents, c'était peut-être
le plus beau cadeau qu'on pouvait leur faire.
Parce que ça ne s'achetait pas.
Ça ne se commandait pas.
Ça venait juste du coeur.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Pourquoi prier pour ses parents est peut-être le plus beau cadeau selon [PRENOM] ?",
      "Comment maman et papa ont-ils réagi ?",
      "Tu as déjà prié pour tes parents ?",
    ],
    defi: "Cette semaine, fais une prière sincère pour tes parents. Juste toi et Allah. Et dis-leur après que tu l'as fait.",
  },

  "licorne-respect-des-parents-aid-el-fitr-2": {
    titre: "et la journée pour maman",
    texte: `Le matin de l'Aïd, Nour et Sabr proposèrent
quelque chose aux deux soeurs.

Offrez cette journée à votre maman,
dit Nour. Toute la journée.

Comment ça ? dit [PRENOM2].

Pas de refus. Pas de négociation.
Pas de mais. Oui à tout ce qu'elle demande.

Toute la journée ? dit [PRENOM1].

Toute la journée, dit Sabr.

Les deux soeurs se regardèrent.

C'est beaucoup, dit [PRENOM2].

Votre maman s'est levée à 5h pour préparer
l'Aïd, dit Nour. Elle a cuisiné hier.
Elle a repassé vos habits.
Elle pense à vous avant de penser à elle.
Depuis votre naissance.

Le paradis est sous les pieds des mères.

Un long silence.

D'accord, dit [PRENOM1]. Une journée.

Une journée, dit [PRENOM2].

Ce ne fut pas facile. Maman demanda de ranger.
Elles rangèrent sans soupirer.
Maman demanda de venir à table tout de suite.
Elles vinrent tout de suite.
Maman demanda d'être sages chez tante Samia.
Elles furent sages.

Le soir, maman les embrassa très fort.

Qu'est-ce que vous avez aujourd'hui ?

Rien, dit [PRENOM1].

On a juste décidé, dit [PRENOM2].

Nour et Sabr brillèrent dans la nuit de l'Aïd.

Et maman sourit avec ses yeux.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "C'était difficile de dire oui toute la journée. Qu'est-ce qui vous a aidé à tenir ?",
      "Nour dit que maman pense à vous avant de penser à elle depuis votre naissance. Tu réalises ça ?",
      "Vous avez déjà décidé ensemble de faire quelque chose pour maman ?",
    ],
    defi: "Cette semaine, choisissez un jour et dites oui à tout ce que vos parents demandent. Sans soupirer. Et observez leur visage à la fin.",
  },

  "licorne-respect-des-parents-aid-el-adha-1": {
    titre: "et Ibrahim et son fils",
    texte: `L'Aïd el-Adha. [PRENOM] et Nour parlaient
de l'histoire d'Ibrahim.

Sais-tu ce qu'Ismaïl a dit à son père ? dit Nour.

Non.

Quand Ibrahim lui a dit ce qu'Allah lui demandait,
Ismaïl a répondu : Père, fais ce qu'on t'a
commandé. Tu me trouveras parmi les patients.

[PRENOM] resta silencieuse.

Il a obéi sans se plaindre ?

Il a fait plus que ça, dit Nour.
Il a réconforté son père. Il a dit
tu me trouveras parmi les patients.
Pas seulement j'obéis. Mais ne t'inquiète pas
pour moi. Je serai là pour toi.

La satisfaction d'Allah est dans la satisfaction
des parents.

[PRENOM] pensa à ses propres parents.
À toutes les fois où elle avait obéi
en traînant les pieds.
En soupirant.
En faisant comprendre que ça lui coûtait.

Et si j'obéissais comme Ismaïl ?
dit-elle à voix basse.

C'est-à-dire ?

Sans leur faire sentir que c'est difficile.
En les réconfortant plutôt qu'en les épuisant.

Nour la regarda avec ses yeux violets.

Ça demande encore plus de courage
qu'obéir simplement.

Je sais, dit [PRENOM]. Mais je veux essayer.

Ce soir-là, maman demanda à [PRENOM]
de mettre la table.

[PRENOM] se leva immédiatement.
Et elle dit en passant à côté de maman :

T'inquiète pas, je m'en occupe.

Maman s'arrêta.
Et sourit d'une façon que [PRENOM]
n'avait pas souvent vue.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Ismaïl a dit plus qu'obéis. Il a réconforté son père. C'est quoi la différence ?",
      "Obéir en réconfortant plutôt qu'en épuisant. Tu comprends ce que [PRENOM] veut faire ?",
      "Tu obéis à tes parents plutôt facilement ou avec résistance ?",
    ],
    defi: "Cette semaine, quand tes parents te demandent quelque chose, lève-toi et fais-le sans soupirer. Et dis quelque chose de gentil en le faisant.",
  },

  "licorne-respect-des-parents-aid-el-adha-2": {
    titre: "et la part qu'elles ont portée pour papa",
    texte: `L'Aïd el-Adha. Papa avait un mal de dos
depuis trois jours.

Il voulait quand même porter la part des pauvres.

Les deux soeurs se regardèrent.

On y va à ta place, dit [PRENOM1].

Papa les regarda.

C'est loin. Et c'est lourd.

On sait, dit [PRENOM2].

Et alors ?

Papa les regarda encore. Ses deux filles
en habits de fête, décidées.

D'accord.

Nour et Sabr marchèrent avec elles,
invisibles.

Le panier était lourd. Dix familles.
Beaucoup de marche dans les escaliers.

À la cinquième famille, [PRENOM2] dit :

Mes bras font mal.

Je sais, dit [PRENOM1].

On continue ?

On continue.

Le paradis est sous les pieds des mères.

Et sous les pieds des pères aussi,
dit Sabr doucement.

Ils rentrent tard. Ils portent des choses
lourdes. Pas des paniers. Des responsabilités.
Depuis des années. Sans se plaindre.

[PRENOM2] regarda le panier.
Puis repensa à papa qui portait des choses
lourdes sans se plaindre depuis des années.

Et elle souleva le panier.

On y va, dit-elle.

À la dixième famille, les deux soeurs
rentrèrent les mains vides.

Papa était assis dans le salon.

Ça s'est bien passé ? dit-il.

Oui, dirent-elles.

Merci, dit papa simplement.

Ces deux mots valaient tout.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Sabr dit que papa porte des choses lourdes depuis des années sans se plaindre. Tu réalises ça ?",
      "Pourquoi les deux mots merci de papa valaient tout ?",
      "Vous avez déjà fait quelque chose de difficile pour un de vos parents ?",
    ],
    defi: "Cette semaine, faites quelque chose de difficile pour un de vos parents. Quelque chose qu'ils font d'habitude. Et faites-le bien.",
  },

  "licorne-respect-des-parents-ramadan-1": {
    titre: "et les nuits de Ramadan avec papa",
    texte: `Pendant le Ramadan, papa priait longuement
la nuit. [PRENOM] le savait parce qu'elle entendait
parfois le murmure de ses prières à travers
la porte de sa chambre.

Une nuit, elle se leva sans savoir pourquoi.

Elle longea le couloir. La porte du salon était
entrouverte. Une lumière douce.

Papa était là, agenouillé, en prière.
Sa voix était basse. Ses mots étaient lents.

[PRENOM] resta dans l'embrasure de la porte.
Elle ne voulait pas déranger. Elle regardait juste.

Nour était là, invisible.

Tu vois ? dit Nour doucement.

Oui.

Il prie depuis des années. Chaque nuit de Ramadan.
Tu dormais. Tu ne savais pas.

[PRENOM] regarda son père.

Il prie pour quoi ?

Pour vous, dit Nour simplement.
Tout ce que tu vois là, c'est pour vous.

Le paradis est sous les pieds des mères.

Et les pères aussi prient dans le noir
pour leurs enfants, dit Nour.

[PRENOM] resta immobile un long moment.

Puis elle retourna dans sa chambre doucement.

Le lendemain matin, elle trouva papa
à la cuisine pour le s'hour.

Elle s'assit à côté de lui sans rien dire.

Il la regarda, surpris.

T'es réveillée ?

Oui, dit-elle. Je voulais être avec toi.

Papa ne dit rien. Mais il lui prépara
une assiette.

Et ils mangèrent le s'hour ensemble
dans le silence du matin.

C'était le plus beau matin du Ramadan.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Qu'a découvert [PRENOM] en regardant son père prier dans le noir ?",
      "Nour dit il prie pour vous. Ça change quelque chose de le savoir ?",
      "Tu sais ce que tes parents font pour toi quand tu dors ?",
    ],
    defi: "Cette semaine, lève-toi une fois avant tes parents. Et sois là quand ils arrivent. Juste pour être avec eux. Sans raison particulière.",
  },

  "licorne-respect-des-parents-ramadan-2": {
    titre: "et le s'hour qu'elles préparèrent",
    texte: `Pendant le Ramadan, Nour et Sabr eurent
une idée pour les deux soeurs.

Levez-vous demain matin et préparez le s'hour
pour vos parents, dit Nour.

On sait pas cuisiner, dit [PRENOM2].

Vous n'avez pas besoin de cuisiner,
dit Sabr. Du pain, du fromage, des dattes.
C'est la nourriture du Prophète ﷺ
pour le s'hour.

Les deux soeurs se levèrent à 4h du matin.
Les yeux collés. Les pieds froids.

Elles préparèrent la table dans le silence
de la nuit.

Du pain. Du fromage. Des dattes. Du miel.
Deux verres d'eau.

La satisfaction d'Allah est dans la satisfaction
des parents.

Quand maman descendit à 4h30 et vit la table
préparée, elle s'arrêta net.

Elle regarda ses deux filles debout
dans la cuisine à 4h du matin.

Elle ne dit rien pendant un long moment.

Puis elle dit :

Comment vous avez su que c'était ce dont
j'avais besoin ?

[PRENOM1] et [PRENOM2] se regardèrent.

On savait pas, dit [PRENOM1].
On voulait juste être là.

Maman s'assit et mangea le s'hour
avec ses deux filles dans le silence
de la nuit du Ramadan.

Ce fut le plus beau s'hour de sa vie.
Elle le leur dit des années plus tard.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Maman dit comment vous avez su. Mais les deux soeurs ne savaient pas. Comment expliquer ça ?",
      "On voulait juste être là. Pourquoi c'était suffisant ?",
      "Vous avez déjà surpris vos parents avec quelque chose qu'ils n'attendaient pas ?",
    ],
    defi: "Cette semaine, levez-vous tôt une fois et préparez quelque chose pour vos parents avant qu'ils se lèvent. N'importe quoi de simple. Juste pour qu'ils voient que vous pensiez à eux.",
  },

  "licorne-respect-des-parents-anniversaire-1": {
    titre: "et le cadeau invisible",
    texte: `Pour l'anniversaire de maman, [PRENOM]
demanda à Nour :

Qu'est-ce qu'on peut offrir à quelqu'un
qui a tout ce dont il a besoin ?

Nour réfléchit longuement.

Ce que personne ne peut acheter,
dit-elle finalement.

C'est quoi ?

De la présence vraie. De l'attention.
Des mots qui viennent du coeur.

[PRENOM] réfléchit.

Mais ça se donne comment ?

Tu décides d'être vraiment là.
Pas à moitié là en pensant à autre chose.
Vraiment là. Les yeux sur elle.
L'attention sur elle. Le coeur sur elle.

Ton Seigneur a décrété que vous leur
disiez des paroles nobles.

[PRENOM] passa la journée entière
d'anniversaire de maman sans téléphone.
Sans se distraire. Sans penser à autre chose.

Elle écouta maman parler de sa journée.
Elle regarda maman rire avec les tantes.
Elle s'assit à côté de maman pendant
le gâteau et lui tint la main.

Maman le remarqua.

À la fin de la soirée, elle dit à [PRENOM] :

C'est le plus beau anniversaire depuis longtemps.

[PRENOM] était surprise.

J'ai pas acheté de cadeau.

Je sais, dit maman. Tu m'as offert quelque chose
de plus rare.

Quoi ?

Toi. Vraiment toi. Toute la journée.

Nour brillait doucement dans le couloir.

Et [PRENOM] comprit que les cadeaux les plus
précieux ne tenaient pas dans une boîte.`,
    citation: "Ton Seigneur a décrété que vous leur disiez des paroles nobles.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Nour dit que la présence vraie ne peut pas s'acheter. Tu es d'accord ?",
      "Comment [PRENOM] a-t-elle offert sa présence vraie toute la journée ?",
      "Tu offres ta présence vraie à tes parents ou tu es souvent à moitié là ?",
    ],
    defi: "Cette semaine, offre à un de tes parents une heure de présence vraie. Sans téléphone. Sans distraction. Juste toi, avec eux.",
  },

  "licorne-respect-des-parents-anniversaire-2": {
    titre: "et les voeux que les licornes ont exaucés",
    texte: `Pour l'anniversaire de papa, Nour et Sabr
firent une proposition aux deux soeurs.

On va exaucer un voeu chacune pour vous.
Mais pas pour vous. Pour votre père.

Les deux soeurs se regardèrent.

Comment vous savez ce qu'il veut ?
dit [PRENOM1].

Demandez-lui, dit Nour simplement.

Les deux soeurs allèrent trouver papa.

Papa, dit [PRENOM2], si tu pouvais avoir
une chose cette année, ce serait quoi ?

Papa posa son livre. Les regarda.
Réfléchit vraiment.

Que vous soyez heureuses, dit-il finalement.
Que vous grandissiez bien.
Que vous soyez en bonne santé.

C'est trois choses, dit [PRENOM1].

Papa sourit.

Je sais. Mais ce sont les seules qui comptent.

La satisfaction d'Allah est dans la satisfaction
des parents.

Les deux soeurs rentrèrent dans leur chambre.

[PRENOM1] dit à [PRENOM2] :

C'est pas un voeu qu'une licorne peut exaucer.

Non, dit [PRENOM2]. C'est un voeu
qu'on peut exaucer nous.

Comment ?

En étant vraiment heureuses. En grandissant bien.
En lui montrant qu'on va bien.

[PRENOM1] réfléchit.

Alors le plus beau cadeau c'est de lui montrer
qu'il a bien fait son travail ?

[PRENOM2] hocha la tête.

Nour et Sabr brillèrent dans la chambre.

Et les deux soeurs allèrent retrouver papa
pour lui dire simplement :

On t'aime papa. Et on est heureuses.

Ce furent les plus beaux mots de son anniversaire.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Papa veut que vous soyez heureuses. Pourquoi c'est son seul voeu ?",
      "Comment les deux soeurs peuvent-elles exaucer ce voeu elles-mêmes ?",
      "Vous savez ce que vos parents souhaitent vraiment pour vous ?",
    ],
    defi: "Cette semaine, demandez à vos parents ce qu'ils souhaitent pour vous. Écoutez vraiment. Et faites un pas vers ce souhait.",
  },

  "super-heros-partage-aid-el-fitr-1": {
    titre: "et la moitié du sandwich",
    texte: `Le matin de l'Aïd, [PRENOM] avait un grand
sandwich au fromage pour le chemin de la mosquée.

Maman le lui avait préparé parce que la prière
était longue et qu'il avait faim facilement.

Dans la rue, en marchant avec papa,
[PRENOM] vit quelque chose.

Un enfant. Assis sur les marches d'un immeuble.
Pas d'habits neufs. Pas de sachet de gâteaux.
Il regardait les gens passer avec des yeux calmes.

[PRENOM] regarda son sandwich.

Il n'hésita que deux secondes.

Il s'arrêta.

Tiens, dit-il. La moitié.

L'enfant le regarda.

C'est l'Aïd, dit [PRENOM]. Et l'Aïd c'est pour
tout le monde.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

L'enfant prit la moitié.

Merci, dit-il simplement.

[PRENOM] repartit avec papa.

Papa avait vu. Il ne dit rien pendant un moment.

Puis il dit :

Tu sais ce que le Prophète ﷺ disait ?
Que tous les musulmans sont frères.
Pas des frères de sang. Des frères de coeur.

Je sais, dit [PRENOM].

Et les frères, ça partage son sandwich ?

[PRENOM] réfléchit.

Même la moitié du dernier.

Papa hocha la tête.

Ils marchèrent en silence jusqu'à la mosquée.

Et [PRENOM] se sentit plus léger
que son sandwich ne l'était encore quelques
minutes avant.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Pourquoi [PRENOM] a-t-il dit c'est l'Aïd et l'Aïd c'est pour tout le monde ?",
      "Papa parle des frères de coeur. Tu comprends ce que ça veut dire ?",
      "Tu partages ta nourriture avec quelqu'un qui n'en a pas ?",
    ],
    defi: "Cette semaine, partage ta nourriture avec quelqu'un qui n'en a pas. Et dis-lui Aïd Moubarak ou juste bonjour.",
  },

  "super-heros-partage-aid-el-fitr-2": {
    titre: "et les deux moitiés",
    texte: `L'Aïd. [PRENOM1] et [PRENOM2] avaient chacun
reçu une belle enveloppe d'argent de papy.

En sortant de la mosquée après la grande prière,
ils virent deux enfants assis sur les marches.
Pas d'habits neufs. Pas de joie de l'Aïd sur
leurs visages.

[PRENOM1] regarda son frère.

On partage ?

[PRENOM2] regarda les deux enfants.
Puis son enveloppe.

Combien ?

La moitié chacun.

[PRENOM2] calcula rapidement dans sa tête.

D'accord.

Ils s'approchèrent. Chacun tendit la moitié
de son enveloppe à un des enfants.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

En remontant vers la famille, [PRENOM2] dit :

T'aurais pu m'en parler avant.

J'ai pensé que t'allais dire non, dit [PRENOM1].

J'aurais dit oui.

[PRENOM1] regarda son frère.

Vraiment ?

Vraiment. Mais j'aurais aimé décider avec toi.
Pas juste suivre.

[PRENOM1] réfléchit.

T'as raison. La prochaine fois on décide ensemble.

[PRENOM2] hocha la tête.

Et là, c'était bien quand même.

Oui, dit [PRENOM1]. C'était bien.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "[PRENOM2] dit j'aurais aimé décider avec toi. Pourquoi c'est important ?",
      "Décider ensemble d'un geste généreux le rend-il différent ?",
      "Vous décidez ensemble avant d'agir ou vous agissez puis vous expliquez ?",
    ],
    defi: "Cette semaine, décidez ensemble d'un geste généreux avant de le faire. Et faites-le vraiment ensemble.",
  },

  "super-heros-partage-aid-el-adha-1": {
    titre: "et les trois parts du héros",
    texte: `L'Aïd el-Adha. Papa expliqua les trois parts
à [PRENOM].

Un tiers pour nous. Un tiers pour la famille
et les voisins. Un tiers pour ceux qui n'ont rien.

[PRENOM] écouta.

Et le Prophète ﷺ faisait ça aussi ?

Le Prophète ﷺ donnait plus que ça, dit papa.
Il donnait presque tout. Il gardait le minimum
pour sa famille.

[PRENOM] regarda le grand sac de viande
préparé pour les pauvres.

Je peux le porter moi ?

Papa le regarda.

C'est lourd.

Je sais.

Et c'est loin.

Je sais.

Papa lui tendit le sac.

[PRENOM] le porta. Porte après porte.

À la quatrième porte, un enfant ouvrit.
Il avait l'âge de [PRENOM].

[PRENOM] lui tendit sa part et dit :

Aïd Moubarak, frère.

L'enfant le regarda.

Je suis pas ton frère.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Tous les musulmans sont frères, dit [PRENOM].
C'est ce que le Prophète ﷺ a dit.

L'enfant le regarda encore. Puis prit la viande.

L'air entre eux changea quelque chose.

[PRENOM] ne sut pas exactement quoi.
Mais quelque chose avait changé.

Peut-être que l'enfant avait un frère
de plus ce soir.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "L'enfant dit je suis pas ton frère. [PRENOM] répond quand même. Pourquoi ?",
      "Peut-être que l'enfant avait un frère de plus ce soir. Tu comprends ce que ça veut dire ?",
      "Tu te sens frère ou soeur de tous les musulmans ?",
    ],
    defi: "Cette semaine, fais quelque chose pour quelqu'un en le considérant comme un frère ou une soeur. Même sans le connaître.",
  },

  "super-heros-partage-aid-el-adha-2": {
    titre: "et la mission parfaite",
    texte: `L'Aïd el-Adha. Mission : distribuer la part
des pauvres dans le quartier.

[PRENOM1] organisa. [PRENOM2] portait.

C'était leur organisation naturelle.

[PRENOM1] tenait la liste. Vérifiait les adresses.
Frappait aux portes. Disait les mots justes.

[PRENOM2] portait le grand sac. Sans se plaindre.
Montait les escaliers. Redescendait. Recommençait.

Dix familles. Quarante-cinq minutes.

En rentrant, maman les attendait.

Tout s'est bien passé ?

Mission accomplie, dirent-ils ensemble.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Papa dit :

Le Prophète ﷺ a dit qu'Allah aide ceux
qui s'entraident. Vous avez été une équipe
parfaite.

[PRENOM1] regarda son frère.

C'est lui qui a porté. Moi j'ai juste organisé.

C'est lui qui a organisé. Moi j'ai juste porté.

Papa sourit.

Et ensemble vous avez fait ce que ni l'un
ni l'autre n'aurait fait aussi bien seul.

Les deux frères se regardèrent avec ce regard
qu'ils avaient quand quelque chose les rendait
fiers l'un de l'autre.

C'est ça une équipe, dit [PRENOM2].

C'est ça, dit [PRENOM1].`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Comment les deux frères se complétaient-ils ?",
      "Papa dit qu'ensemble ils ont fait mieux que seuls. Tu trouves ça vrai dans ta vie ?",
      "Tu as un domaine où tu es fort et quelqu'un qui est fort dans un autre domaine ?",
    ],
    defi: "Cette semaine, organisez une mission ensemble. L'un planifie, l'autre exécute. Puis inversez. Et observez ce que vous pouvez faire ensemble.",
  },

  "super-heros-partage-ramadan-1": {
    titre: "et l'iftar qu'il a partagé",
    texte: `Pendant le Ramadan, [PRENOM] jeûnait
pour la première fois jusqu'au bout.

Toute la journée. Pas de nourriture.
Pas d'eau. Du lever du soleil au coucher.

À 17h, il ne pensait plus qu'à l'iftar.
Ce qu'il allait manger. Dans quel ordre.
La soupe d'abord. Les dattes. Puis le plat.

L'appel du Maghreb approchait.

Maman dit :

On envoie une assiette au voisin qui jeûne seul ?

[PRENOM] regarda son assiette. La sienne.
Celle qu'il attendait depuis des heures.

Un long silence.

Oui, dit-il.

Il porta l'assiette lui-même.
Sonna chez le voisin.

Le voisin ouvrit. Vieux. Fatigué.
Les yeux qui disaient qu'il avait passé
une longue journée seul.

[PRENOM] lui tendit l'assiette.

De la part de ma famille. Aïd Moubarak.

Le voisin le regarda.

Tu as jeûné aujourd'hui ?

Oui.

Et tu me donnes ta part ?

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Ce que j'aime pour moi, je dois l'aimer
pour vous, dit [PRENOM].

Le voisin le regarda longuement.

Puis il dit :

Que Allah te donne le paradis, mon fils.

[PRENOM] rentra. Maman avait préparé
une autre assiette.

Il mangea la plus belle iftar de sa vie.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Partager ce qu'on attend depuis des heures. C'est difficile ?  Comment [PRENOM] a-t-il fait ?",
      "Pourquoi la deuxième assiette était-elle la plus belle iftar de sa vie ?",
      "Tu as déjà partagé quelque chose que tu attendais avec impatience ?",
    ],
    defi: "Cette semaine, partage quelque chose que tu attends avec impatience. Avant de le recevoir toi-même.",
  },

  "super-heros-partage-ramadan-2": {
    titre: "et le Ramadan des partages",
    texte: `Les deux frères se donnèrent un défi
pour le Ramadan.

Partager quelque chose chaque jour.
N'importe quoi.

Ça peut être petit ? dit [PRENOM2].

Ça peut être minuscule, dit [PRENOM1].
L'important c'est de le faire.

Jour 1 : [PRENOM1] donna la moitié de son
dessert à un camarade qui n'avait rien.

Jour 2 : [PRENOM2] aida un voisin à porter
ses courses.

Jour 3 : [PRENOM1] écouta sa soeur raconter
sa journée sans l'interrompre une seule fois.

Jour 4 : [PRENOM2] dit merci vraiment à la dame
de la cantine.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Le trente-et-unième soir, ils comparèrent.

Certains partages avaient changé des journées.
D'autres n'avaient rien changé en apparence.

On a changé nous, dit [PRENOM2].

Comment ?

Je remarque plus les gens. Je les vois mieux.
Leurs besoins. Leurs visages.

[PRENOM1] hocha la tête.

Moi aussi. Comme si partager tous les jours
m'avait ouvert les yeux sur ce qui se passe
autour de moi.

Peut-être que c'est ça la vraie magie
du Ramadan, dit [PRENOM2].

Pas juste ne pas manger.

Mais apprendre à voir.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "[PRENOM2] dit qu'il voit mieux les gens après un mois de partages. Comment c'est possible ?",
      "Partager tous les jours pendant un mois. Ça change quelque chose selon vous ?",
      "Vous avez essayé de partager quelque chose chaque jour ?",
    ],
    defi: "Cette semaine, partagez quelque chose chaque jour pendant sept jours. Un par jour. Et le dimanche, regardez ce qui a changé en vous.",
  },

  "super-heros-courage-aid-el-fitr-1": {
    titre: "et le Aïd Moubarak difficile",
    texte: `[PRENOM] était timide. Vraiment timide.

Pas avec les gens qu'il connaissait.
Avec les autres.

Ce matin de l'Aïd, la rue était pleine
de voisins qu'il ne voyait que rarement.

Maman dit :

Tu vas aller souhaiter l'Aïd aux voisins
du dessus ?

Le ventre de [PRENOM] se serra.

Ils me connaissent pas.

Tu les connais pas non plus.
C'est l'occasion de changer ça.

[PRENOM] resta planté devant la porte
de l'immeuble.

Son coeur battait trop vite.

Il pensa à ce que papy lui avait dit un jour.

Le vrai fort est celui qui se maîtrise
lui-même quand la peur le saisit.

[PRENOM] prit une grande inspiration.

Il monta les escaliers. Frappa à la porte.

La porte s'ouvrit. Un homme souriant.

Aïd Moubarak ! dit [PRENOM] d'une voix claire.

Aïd Moubarak, jeune homme ! dit l'homme.
Tu es le fils du voisin du dessous ?

Oui.

Ta maman fait du très bon pain.
Elle nous en a donné l'année dernière.
Tu la remercieras pour nous.

[PRENOM] redescendit les escaliers.

Ça avait pris deux minutes.
Il avait stressé pendant vingt.

C'est rarement aussi dur qu'on le croit,
pensa-t-il.

Et il alla sonner à la porte suivante.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi [PRENOM] avait-il peur de dire Aïd Moubarak à un voisin ?",
      "Il a stressé vingt minutes pour deux minutes. Tu connais ce sentiment ?",
      "Le vrai fort se maîtrise quand la peur le saisit. Tu comprends ce que ça veut dire ?",
    ],
    defi: "Cette semaine, dis bonjour ou Aïd Moubarak à quelqu'un que tu ne connais pas. Et observe que c'est moins difficile que tu ne le pensais.",
  },

  "super-heros-courage-aid-el-fitr-2": {
    titre: "et la défense du plus petit",
    texte: `L'Aïd. Dans la cour de l'immeuble où toute
la famille était réunie, des grands embêtaient
un petit garçon.

Pas méchamment. Mais assez pour que le petit
garçon ne sache plus où se mettre.

[PRENOM1] vit la scène.

Il toucha le bras de son frère.

[PRENOM2] regarda.

Ils sont plus grands que nous, dit [PRENOM2].

Je sais, dit [PRENOM1].

Et alors ?

[PRENOM1] ne répondit pas. Il traversa la cour.

[PRENOM2] resta une seconde. Puis le suivit.

Les deux frères s'approchèrent des grands.

[PRENOM1] dit d'une voix calme mais ferme :

Laissez-le tranquille.

Les grands les regardèrent. Surpris plus
qu'autre chose.

Qui vous a demandé quelque chose ?

Personne, dit [PRENOM1]. Mais lui il a rien
demandé non plus.

Le vrai fort est celui qui se maîtrise
lui-même quand la colère le saisit.

Un silence.

Les grands partirent. Pas vraiment vaincus.
Juste... surpris.

Le petit garçon regarda [PRENOM1] et [PRENOM2].

Vous avez pas eu peur ?

Si, dit [PRENOM2].

Et vous êtes venus quand même.

C'est ça le courage, dit [PRENOM1].
Pas l'absence de peur. Le fait d'aller quand même.

Le petit garçon hocha la tête très sérieusement.

Comme si c'était la chose la plus importante
qu'on lui ait jamais dite.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi [PRENOM2] a-t-il suivi son frère même après avoir hésité ?",
      "Les grands sont partis surpris. Pourquoi le calme était plus fort que la colère ?",
      "Tu as déjà défendu quelqu'un même si tu avais peur ?",
    ],
    defi: "Cette semaine, si tu vois quelqu'un mal à l'aise, approche-toi. Pas pour faire la guerre. Juste pour être là.",
  },

  "super-heros-courage-aid-el-adha-1": {
    titre: "et le courage d'Ibrahim dans son coeur",
    texte: `L'Aïd el-Adha. [PRENOM] pensait à Ibrahim.

À sa confiance. À son courage.

Papa lui avait dit ce matin :

Ibrahim a dit oui à la chose la plus difficile
qu'on puisse demander. Et il l'a fait sans
trembler parce qu'il savait qu'Allah était
avec lui.

[PRENOM] y pensait depuis.

Il avait quelque chose qu'il voulait faire
depuis longtemps. Rejoindre l'équipe de football
du quartier. Mais il avait peur.

Peur d'être pas assez bon.
Peur d'arriver le dernier.
Peur d'être celui qu'on choisit en dernier.

Il pensa à Ibrahim.

Ibrahim avait peur lui aussi, avait dit papa.
Mais il avait quelque chose de plus grand
que la peur.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] sortit dans le jardin.

Et il fit quelque chose qu'il n'avait jamais fait.

Il parla à Allah. Vraiment. Pas juste réciter.
Parler. Avec ses propres mots.

Ya Allah. J'ai peur. Mais je vais quand même
aller me présenter à l'entraîneur. Aide-moi.

Il rentra dans la maison.

Papa, dit-il, je veux m'inscrire au club
de football.

Papa le regarda.

Depuis le temps. Je pensais que tu n'oserais
jamais.

Je n'osais pas, dit [PRENOM]. Mais aujourd'hui
c'est l'Aïd el-Adha.

Et alors ?

Et alors Ibrahim a dit oui quand c'était
le plus difficile. Moi je dis juste oui
à l'entraîneur.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Pourquoi le jour de l'Aïd el-Adha a-t-il aidé [PRENOM] à avoir du courage ?",
      "Il a parlé à Allah avec ses propres mots. Pourquoi c'est différent de réciter ?",
      "Tu as quelque chose que tu veux faire mais que tu n'oses pas ?",
    ],
    defi: "Cette semaine, fais quelque chose que tu reportes depuis longtemps par peur. Et avant de le faire, parle à Allah avec tes propres mots.",
  },

  "super-heros-courage-aid-el-adha-2": {
    titre: "et les deux frères d'Ibrahim",
    texte: `L'Aïd el-Adha. Oncle Moussa leur parla
d'Ibrahim et d'Ismaïl.

Ibrahim n'était pas seul, dit-il. Ismaïl
était avec lui. Et Ismaïl a dit :
tu me trouveras parmi les patients.

Comme si Ismaïl donnait du courage à son père,
dit [PRENOM1].

Exactement, dit oncle Moussa.

[PRENOM1] regarda son frère [PRENOM2].

On fait pareil ?

Pareil comment ?

On se donne du courage mutuellement.
Pas juste quand c'est l'Aïd.
Tout le temps.

N'aie pas peur. Je suis avec vous,
j'entends et je vois.

[PRENOM2] réfléchit.

T'as une peur toi ?

Oui. Parler devant la classe.

[PRENOM1] était surpris.
Son frère qui parlait facilement avec tout le monde
avait peur de parler devant la classe ?

Et toi ? dit [PRENOM2].

Moi j'ai peur de rater.
De commencer quelque chose et d'abandonner
avant la fin.

Silence entre les deux frères.

Puis [PRENOM2] dit :

Si t'as peur d'abandonner, je serai là
pour te dire continue.

Et si t'as peur de parler devant la classe,
dit [PRENOM1], je serai dans la salle
et je regarderai que toi.

Poignée de main.

Pacte de frères.

Oncle Moussa les vit de loin et sourit.
Il ne savait pas ce qu'ils s'étaient dit.
Mais il vit quelque chose changer
entre eux.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Ismaïl donnait du courage à son père. Comment on donne du courage à quelqu'un ?",
      "Les deux frères ont découvert leurs peurs mutuelles. Ça change quelque chose ?",
      "Tu as un pacte avec quelqu'un pour vous donner du courage mutuellement ?",
    ],
    defi: "Cette semaine, dites-vous mutuellement une peur que vous n'avez jamais dite. Et faites un pacte pour vous soutenir.",
  },

  "super-heros-courage-ramadan-1": {
    titre: "et la récitation devant la mosquée",
    texte: `Pendant le Ramadan, l'imam de la mosquée
du quartier invita les enfants à réciter
une sourate devant les fidèles après la prière
du soir.

[PRENOM] leva la main.

Et regretta immédiatement.

Cent personnes au moins dans la mosquée.
Toutes ces têtes qui allaient se retourner.

Mais sa main était levée.

Et l'imam avait souri.

Le lendemain soir, [PRENOM] se prépara.
Il connaissait Al-Ikhlas par coeur.
Trois versets. Très courts.

Mais devant cent personnes.

Il prit position devant le mihrab.

Toutes les têtes se retournèrent.

Le vrai fort est celui qui se maîtrise
lui-même quand la colère le saisit.

[PRENOM] prit une grande inspiration.

Il récita. D'une voix qui tremblait juste
un peu au premier verset.
Puis se stabilisa.
Puis sortit claire et ferme.

Bismillahirrahmanirrahim.
Qul huwa Allahu ahad.

Il alla jusqu'au bout.

En se rasseyant, un vieil homme posa
la main sur son épaule.

Belle voix, fils.

[PRENOM] avait encore les mains légèrement
tremblantes.

Mais quelque chose dans sa poitrine
était calme et fier.

Il savait maintenant quelque chose
qu'il ne savait pas avant.

Que sa voix méritait d'être entendue.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi [PRENOM] a-t-il regretté d'avoir levé la main mais y est allé quand même ?",
      "Sa voix tremblait puis s'est stabilisée. Ça veut dire quoi selon toi ?",
      "Ta voix mérite d'être entendue. Tu le crois ?",
    ],
    defi: "Cette semaine, récite une sourate ou lis quelque chose à voix haute devant quelqu'un. Même une seule personne. Et observe que ta voix mérite d'être entendue.",
  },

  "super-heros-courage-ramadan-2": {
    titre: "et la vérité difficile",
    texte: `Pendant le Ramadan, [PRENOM2] fit quelque chose
par accident.

Il renversa le vase préféré de maman.
Celui qu'elle avait depuis son mariage.

Il se brisa en trois morceaux nets.

[PRENOM2] resta à regarder les morceaux.

Son premier réflexe fut de les cacher.
Sous l'évier. Dans la poubelle.
Dire qu'il ne savait pas.

Mais [PRENOM1] était là.

Il avait tout vu.

Tu lui dis, dit [PRENOM1] simplement.

[PRENOM2] le regarda.

Elle va être tellement déçue.

Je sais.

Le Ramadan c'est le mois pour devenir
meilleur, dit [PRENOM1]. Le Prophète ﷺ a dit
de dire la vérité même quand elle est amère.

Le vrai fort est celui qui se maîtrise
lui-même quand la peur le saisit.

La peur de la réaction de maman.
La peur de la déception.
La peur de la punition.

[PRENOM2] ramassa les trois morceaux
et alla trouver maman dans le salon.

Maman. J'ai cassé ton vase par accident.
Je suis vraiment désolé.

Maman le regarda. Regarda les morceaux.
Regarda [PRENOM2] encore.

Tu n'aurais pas pu le cacher ?

J'aurais pu, dit [PRENOM2]. Mais j'ai pas voulu.

Maman resta silencieuse un moment.

Je suis déçue pour le vase.
Mais fière de toi pour les mots que tu viens
de prononcer.

[PRENOM1] entendit depuis le couloir.
Et il sut que son frère venait de faire
quelque chose de vraiment courageux.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi cacher la vérité aurait été plus facile mais moins courageux ?",
      "Maman dit je suis fière de toi pour les mots. Pourquoi les mots comptaient plus que le vase ?",
      "Tu as déjà dit une vérité difficile plutôt que de la cacher ?",
    ],
    defi: "Cette semaine, si tu fais quelque chose de mal par accident, dis-le immédiatement. Sans attendre. Et observe comment tu te sens après.",
  },

  "super-heros-patience-aid-el-fitr-1": {
    titre: "et la prière qui durait",
    texte: `L'Aïd. La grande prière du matin.

[PRENOM] était debout depuis 45 minutes.
Les pieds qui fatiguaient.
L'imam qui récitait longuement.

Il avait envie de s'asseoir.
Juste une seconde.
Personne ne verrait.

Mais papy était à côté de lui.
Immobile. Concentré. Comme si le temps
n'existait pas.

[PRENOM] le regarda.

Papy avait 70 ans. Ses genoux lui faisaient
souvent mal. Mais il était là, debout,
aussi droit qu'un arbre.

Le vrai fort est celui qui se maîtrise
lui-même quand la colère le saisit.

[PRENOM] redressa son dos.

Il écouta les mots de l'imam.

Quelque chose d'étrange se produisit.

En écoutant vraiment au lieu de penser
à ses pieds, le temps sembla changer.

Pas plus court. Mais différent.

Comme si chaque mot avait un poids.
Comme si rester debout voulait dire quelque chose.

La prière se termina.

L'imam dit Assalamu alaikum à droite.
Puis à gauche.

Terminé.

Papy tourna la tête vers [PRENOM].

Bien tenu.

[PRENOM] regarda ses pieds. Ils faisaient
encore un peu mal.

Mais il était content d'avoir tenu.

Plus content que s'il s'était assis.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Pourquoi regarder papy a aidé [PRENOM] à tenir ?",
      "En écoutant vraiment le temps a semblé différent. Comment c'est possible ?",
      "Tu arrives à rester concentré pendant des moments longs ?",
    ],
    defi: "Cette semaine, tiens quelque chose de long sans t'arrêter à mi-chemin. La prière, une lecture, un exercice. Jusqu'au bout.",
  },

  "super-heros-patience-aid-el-fitr-2": {
    titre: "et la queue",
    texte: `L'Aïd. La famille allait dans un grand parc
pour la journée.

La queue pour entrer était immense.

[PRENOM2] tournait en rond. Se retournait.
Regardait sa montre. Soupirait fort.

[PRENOM1] le laissa faire pendant cinq minutes.

Puis il dit :

Raconte-moi quelque chose.

Quoi ?

N'importe quoi. Une histoire. Un rêve.
Ce que tu veux.

[PRENOM2] le regarda.

Pourquoi ?

Pour passer le temps sans s'énerver.

[PRENOM2] réfléchit.

Puis commença à raconter. Un rêve bizarre
qu'il avait eu la semaine d'avant.
Avec un dragon qui parlait en arabe
et une forêt de bonbons.

[PRENOM1] écoutait. Posait des questions.
Inventait des détails.

La queue avançait. Lentement.

Ils continuèrent leur histoire.

Le vrai fort est celui qui se maîtrise
lui-même quand la colère le saisit.

Quand ils arrivèrent à l'entrée du parc,
[PRENOM2] s'arrêta.

Attends. On est déjà là ?

Oui, dit [PRENOM1].

Ça a pas été long.

Non, dit [PRENOM1]. Mais la queue était
la même pour tout le monde.

C'est nous qui avons changé, dit [PRENOM2].

[PRENOM1] hocha la tête.

C'est souvent ça la patience.
Pas changer ce qu'on attend.
Changer comment on attend.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "[PRENOM1] dit que la patience c'est changer comment on attend pas ce qu'on attend. Tu comprends ?",
      "Raconter une histoire a aidé à patienter. Vous avez d'autres idées pour patienter ensemble ?",
      "Tu t'énerves dans les queues ou tu trouves des façons de passer le temps ?",
    ],
    defi: "Cette semaine, quand tu dois attendre quelque chose, invente une façon positive de passer ce temps. Et essaie-la.",
  },

  "super-heros-patience-aid-el-adha-1": {
    titre: "et la patience d'Ibrahim",
    texte: `L'Aïd el-Adha. [PRENOM] pensait à Ibrahim.

Papa lui avait dit ce matin qu'Ibrahim avait
attendu des décennies avant d'avoir son fils.
Des décennies d'espoir sans résultat visible.
Sans jamais perdre foi.

[PRENOM] pensa à quelque chose.

Il attendait quelque chose depuis trois mois.
Un vélo. Pas un gros. Juste un vrai vélo
à sa taille parce que le sien était devenu
trop petit.

Trois mois c'est long.

Papa vit son air pensif.

À quoi tu penses ?

Ibrahim a attendu des décennies, dit [PRENOM].
Et moi j'arrive pas à attendre trois mois
pour un vélo.

Papa sourit doucement.

Le fait de le voir comme ça, c'est déjà
quelque chose.

Personne ne reçoit un don meilleur et plus
vaste que la patience.

[PRENOM] réfléchit.

Ibrahim faisait quoi pendant qu'il attendait ?

Il priait. Il vivait. Il était juste.
Il ne laissait pas l'attente le paralyser.
Il attendait activement.

Activement comment ?

En continuant à être quelqu'un de bien
pendant l'attente.

[PRENOM] pensa à ça.

Je pourrais m'entraîner à vélo chez le voisin
pendant que j'attends le mien.

Papa hocha la tête.

Et quand ton vélo arrivera, tu sauras déjà
mieux le conduire.

Ibrahim a attendu. Et il est devenu
quelqu'un pendant l'attente.

Moi aussi, dit [PRENOM].`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Papa dit qu'Ibrahim attendait activement. C'est quoi la différence avec attendre passivement ?",
      "[PRENOM] décide de s'entraîner pendant qu'il attend. Pourquoi c'est une bonne idée ?",
      "Tu attends quelque chose en ce moment ? Qu'est-ce que tu pourrais faire pendant cette attente ?",
    ],
    defi: "Cette semaine, pendant que tu attends quelque chose, fais une chose qui te rapproche de ce que tu attends. Une seule. Mais fais-la vraiment.",
  },

  "super-heros-patience-aid-el-adha-2": {
    titre: "et les frères qui attendaient",
    texte: `L'Aïd el-Adha. Les deux frères voulaient
que la fête commence.

Mais les préparatifs prenaient du temps.
Maman cuisinait. Papa s'occupait du mouton.
Grand-mère prenait son temps pour s'habiller.

[PRENOM2] tournait en rond dans le salon.

C'est long.

Je sais, dit [PRENOM1].

Très long.

Je sais.

[PRENOM2] s'arrêta.

T'es pas impatient toi ?

Si, dit [PRENOM1]. Mais j'essaie de me maîtriser.

Comment tu fais ?

Je pense à Ibrahim et Ismaïl. Ils ont attendu
ensemble. L'un faisait confiance. L'autre aussi.

C'est pas pareil.

Non. Mais la patience c'est pareil dans
toutes les situations. Quelque chose de difficile
qu'on fait quand même.

Personne ne reçoit un don meilleur et plus
vaste que la patience.

[PRENOM2] souffla longuement.

On joue aux cartes ?

Ça m'a pas traversé l'esprit, dit [PRENOM1].
Mais c'est une bonne idée.

Ils jouèrent aux cartes pendant trente minutes.

La fête commença.

Et elle était d'autant plus belle qu'ils
l'avaient attendue.

[PRENOM2] dit en mangeant :

C'était quoi notre jeu de cartes ?

De la patience, dit [PRENOM1].

[PRENOM2] rit.

Pas mal comme super-pouvoir.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "[PRENOM1] dit que la patience c'est pareil dans toutes les situations. Tu es d'accord ?",
      "Jouer aux cartes pendant l'attente. Pourquoi c'est une forme de patience ?",
      "Vous inventez des activités pour patienter ensemble ?",
    ],
    defi: "Cette semaine, quand vous devez attendre quelque chose ensemble, inventez une activité pour passer le temps. Et attendez de bonne humeur.",
  },

  "super-heros-patience-ramadan-1": {
    titre: "et le premier jeûne difficile",
    texte: `Le premier jour du Ramadan où [PRENOM]
jeûnait vraiment.

Pas une demi-journée comme l'année d'avant.
Une vraie journée complète.

10h. Faim normale.
12h. Faim vraie.
14h. Faim difficile.

À 15h, [PRENOM] alla trouver papy.

Je crois que je peux plus.

Papy leva les yeux de son livre.

Qu'est-ce qui te fait mal ?

Tout. Le ventre. La tête. J'ai pas d'énergie.

Papy ferma son livre.

Tout ça c'est le corps qui parle.
Mais le corps n'est pas le seul à avoir
un avis.

Qui d'autre a un avis ?

L'âme. Et l'âme dit : tu peux encore.

Papy se leva.

Le vrai fort est celui qui se maîtrise
lui-même quand la colère le saisit.

Et quand la faim te saisit aussi.

[PRENOM] regarda papy.

Comment tu fais toi depuis des années ?

Je pense à ce pour quoi je jeûne.
Pas à ce que je ne mange pas.
À ce que j'essaie de nourrir à la place.

À nourrir quoi ?

La patience. La gratitude. Le lien avec Allah.

[PRENOM] retourna dans sa chambre.

Il pria. Un peu.

L'appel du Maghreb arriva.

Il cassa le jeûne avec une datte.

La meilleure datte de sa vie.
Pas parce qu'elle était particulière.
Parce qu'il l'avait méritée.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Papy dit de penser à ce qu'on nourrit pas à ce qu'on ne mange pas. Tu comprends ?",
      "La meilleure datte de sa vie parce qu'il l'avait méritée. Tu as déjà eu ce sentiment ?",
      "Tu as déjà tenu quelque chose de difficile jusqu'au bout ?",
    ],
    defi: "Cette semaine, prive-toi d'une chose que tu aimes pendant une journée. Et pendant ce temps, pense à ce que tu nourris à la place.",
  },

  "super-heros-patience-ramadan-2": {
    titre: "et les deux guerriers du Ramadan",
    texte: `Les deux frères jeûnaient ensemble
pour la première fois.

C'était la journée la plus longue de leur vie.

À midi, ils trouvèrent un film à regarder
pour ne pas penser à la nourriture.

À 14h, le film était fini.

À 15h, [PRENOM2] dit :

Je peux plus.

[PRENOM1] le regarda.

Encore deux heures.

C'est trop.

[PRENOM1] réfléchit.

On fait un marché.

Quel marché ?

On tient chacun pour l'autre.
Si t'as envie d'arrêter, tu penses à moi.
Et moi pareil.

Ça change quoi ?

Si t'arrêtes, j'arrête aussi. Et si j'arrête,
toi tu t'arrêtes aussi. Alors on arrête ensemble
ou on finit ensemble.

[PRENOM2] regarda son frère.

T'as envie d'arrêter toi ?

Oui, dit [PRENOM1] honnêtement.

Le vrai fort est celui qui se maîtrise
lui-même quand la colère le saisit.

Et quand la faim le saisit, dit [PRENOM2].

Ils tinrent.

L'appel du Maghreb résonna.

[PRENOM2] prit une gorgée d'eau. Ferma
les yeux. La rouvrit.

On l'a fait.

On l'a fait ensemble, dit [PRENOM1].

C'est ça la différence.

Ils mangèrent leur iftar en silence.
Un silence de guerriers qui ont gagné
quelque chose.

Pas contre les autres.
Contre eux-mêmes.`,
    citation: "Le vrai fort est celui qui se maîtrise lui-même quand la colère le saisit.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
    questions: [
      "Le marché de [PRENOM1]. Comment tenir pour l'autre aide à tenir pour soi-même ?",
      "Un silence de guerriers qui ont gagné contre eux-mêmes. Tu comprends ce que ça veut dire ?",
      "Tu as tenu quelque chose de difficile ensemble avec quelqu'un ?",
    ],
    defi: "Cette semaine, faites un marché. Vous tenez quelque chose de difficile chacun pour l'autre. Et vous allez jusqu'au bout ensemble.",
  },

  "super-heros-respect-des-parents-aid-el-fitr-1": {
    titre: "et le héros du matin",
    texte: `Le matin de l'Aïd, [PRENOM] se leva avant
tout le monde.

Pas parce que maman lui avait demandé.
Parce qu'il avait décidé.

Il prépara le café de papa. Sorti les gâteaux.
Posa tout sur la table avec les assiettes.

Puis il alla se rasseoir dans sa chambre
et attendit.

Il entendit papa descendre. S'arrêter.
Le silence de quelqu'un qui découvre quelque chose
d'inattendu.

Puis papa qui montait.

Qui a préparé la table ? dit-il depuis le couloir.

C'est moi, dit [PRENOM].

Papa entra dans sa chambre.

Il le regarda longtemps.

La satisfaction d'Allah est dans la satisfaction
des parents.

Pourquoi ? dit papa.

[PRENOM] haussa les épaules.

T'es le premier debout d'habitude. Tu prépares
pour tout le monde. Ce matin j'ai voulu être
le premier pour toi.

Papa s'assit sur le bord du lit.

Il ne dit rien pendant un moment.

Puis il dit, d'une voix douce :

Tu sais ce que tu viens de faire ?

Préparer le café.

Non. Tu m'as montré que tu me voyais vraiment.
Que tu savais ce que je faisais.
Et que ça comptait pour toi.

[PRENOM] ne savait pas que c'était si important.

Mais maintenant il le savait.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Papa dit tu m'as montré que tu me voyais vraiment. Qu'est-ce qu'il veut dire ?",
      "Voir vraiment ses parents. Ça veut dire quoi selon toi ?",
      "Tu fais des gestes pour tes parents sans qu'ils te le demandent ?",
    ],
    defi: "Demain matin, lève-toi avant tes parents et prépare quelque chose pour eux. N'importe quoi de simple. Et observe leur réaction.",
  },

  "super-heros-respect-des-parents-aid-el-fitr-2": {
    titre: "et l'Aïd de maman",
    texte: `L'Aïd. Maman avait tout organisé.

Les tenues. Les gâteaux. Les visites.
Les appels aux grands-parents.
Les enfants prêts à temps.

Le soir, elle était épuisée.
Pas d'une mauvaise façon. De cette façon
qui dit on a bien vécu cette journée.

Mais épuisée quand même.

[PRENOM1] le vit. Il toucha le bras de son frère.

Regarde maman.

[PRENOM2] regarda. Vit.

On fait quoi ?

La vaisselle, dit [PRENOM1].

C'est pas nous d'habitude.

Ce soir si.

Ils se levèrent sans que maman leur demande.
Ils firent la vaisselle. Ensemble. En silence.

Le paradis est sous les pieds des mères.

Maman passa. Les vit.

Elle ne dit rien.

Elle alla s'asseoir dans le salon.
Elle ferma les yeux.

Juste cinq minutes. Elle pouvait souffler
cinq minutes.

Les deux frères entendirent le silence
de quelqu'un qui peut enfin souffler.

En remontant les escaliers plus tard,
[PRENOM2] dit à voix basse :

On a fait quelque chose d'important ce soir.

On a juste fait la vaisselle.

Non. On lui a offert cinq minutes où elle
n'avait pas à penser à nous.

[PRENOM1] réfléchit à ça.

C'est peut-être le plus beau cadeau de l'Aïd.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "[PRENOM2] dit qu'ils lui ont offert cinq minutes sans penser à eux. Tu comprends ce cadeau ?",
      "Maman n'a rien dit mais a soufflé. Pourquoi c'était mieux que des mots de remerciement ?",
      "Tu fais des choses pour maman sans attendre qu'elle vous demande ?",
    ],
    defi: "Cette semaine, faites quelque chose que maman fait toujours. Sans qu'elle vous le demande. Et observez si elle peut souffler.",
  },

  "super-heros-respect-des-parents-aid-el-adha-1": {
    titre: "et Ibrahim et son père",
    texte: `L'Aïd el-Adha. [PRENOM] entendit quelque chose
qu'il ne connaissait pas.

L'imam parla d'Ibrahim et son propre père.

Ibrahim respectait son père. Même quand son père
ne croyait pas. Même quand son père ne comprenait
pas Ibrahim. Même quand ils n'étaient pas d'accord.

Ibrahim lui parlait avec douceur.
Lui expliquait avec patience.
Priait pour lui.

[PRENOM] écouta.

Il pensa à son propre père.

Il y avait des choses sur lesquelles ils n'étaient
pas d'accord. Papa trouvait que [PRENOM] jouait
trop aux jeux vidéo. [PRENOM] trouvait que papa
n'y connaissait rien.

C'était petits désaccords. Pas graves.

Mais [PRENOM] ne parlait pas toujours avec douceur
dans ces moments.

Ton Seigneur a décrété que vous traitiez
vos parents avec bonté.

La bonté même dans le désaccord.

Ce soir-là, [PRENOM] dit à papa :

Papa, je sais qu'on est pas d'accord sur les jeux.
Mais je voulais te dire que t'as raison
que je joue trop parfois.

Papa le regarda, surpris.

Et je vais essayer de faire un meilleur équilibre.

Papa ne répondit pas tout de suite.

Puis il dit :

Et moi je vais essayer de mieux comprendre
pourquoi tu aimes ça.

Ce n'était pas la fin du désaccord.
Mais c'était un autre début.`,
    citation: "Ton Seigneur a décrété que vous traitiez vos parents avec bonté.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Ibrahim respectait son père même sans être d'accord. C'est possible selon toi ?",
      "[PRENOM] a reconnu quelque chose à papa. Pourquoi c'était courageux ?",
      "Tu arrives à parler avec douceur à tes parents même quand vous n'êtes pas d'accord ?",
    ],
    defi: "Cette semaine, s'il y a quelque chose sur lequel tu n'es pas d'accord avec tes parents, parle-leur avec douceur. Et écoute vraiment ce qu'ils disent.",
  },

  "super-heros-respect-des-parents-aid-el-adha-2": {
    titre: "et la prière pour les parents",
    texte: `L'Aïd el-Adha. Après la grande prière,
oncle Moussa dit aux deux frères :

Ibrahim priait pour toute sa famille.
Pour son père. Pour ses descendants.
Pour ceux qu'il aimait.

Est-ce que vous priez pour vos parents ?

Les deux frères se regardèrent.

Pas vraiment, admit [PRENOM1].

On prie pour nous, dit [PRENOM2].
Pour les contrôles, pour la santé,
pour les choses qu'on veut.

Oncle Moussa hocha la tête.

C'est normal. Mais essayez quelque chose
ce soir.

Ce soir-là, avant de dormir, les deux frères
firent quelque chose qu'ils n'avaient jamais
fait ensemble.

Ils prièrent pour maman et papa.

À voix haute. L'un commençait une phrase,
l'autre continuait.

La satisfaction d'Allah est dans la satisfaction
des parents.

Ya Allah, garde maman et papa en bonne santé.
Ya Allah, facilite leur vie.
Ya Allah, fais-leur voir le bien de leurs enfants.
Ya Allah, récompense-les pour tout ce qu'ils font
pour nous depuis qu'on est nés.

Ils s'endormirent peu après.

Le lendemain, [PRENOM2] dit :

C'était étrange de prier pour eux.

Pourquoi ?

J'avais l'habitude de prier pour moi.
Prier pour eux, ça change le regard.
Tout à coup je les voyais différemment.

Comme des gens à qui il arrive des choses.
Pas juste maman et papa.

Exactement, dit [PRENOM1].`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "[PRENOM2] dit que prier pour ses parents change le regard. Comment ?",
      "Les voir comme des gens à qui il arrive des choses. Ça change quoi ?",
      "Tu pries pour tes parents ?",
    ],
    defi: "Cette semaine, priez pour vos parents avant de dormir. À voix haute si vous pouvez. Et observez si ça change quelque chose dans la façon dont vous les voyez.",
  },

  "super-heros-respect-des-parents-ramadan-1": {
    titre: "et le Ramadan de papa",
    texte: `Pendant le Ramadan, [PRENOM] remarqua
quelque chose qu'il n'avait jamais remarqué.

Papa se levait chaque nuit pour le s'hour.
Il jeûnait toute la journée. Il allait travailler.
Il rentrait et priait le soir.

Et il recommençait le lendemain.

Trente jours.

[PRENOM] demanda un soir :

Papa, t'es jamais fatigué ?

Papa sourit.

Si. Très fatigué parfois.

Et alors tu continues quand même ?

Le Ramadan n'est pas fait pour être reposant.
Il est fait pour être important.

[PRENOM] réfléchit à ça.

Ce soir-là, sans que personne lui demande,
il prépara le plateau de l'iftar pour papa.

La soupe. Les dattes. Le jus.
Il posa le plateau sur la table.

La satisfaction d'Allah est dans la satisfaction
des parents.

Papa rentra du travail. Vit le plateau.
Le regarda. Regarda [PRENOM].

Merci, fils.

Deux mots.

[PRENOM] les garda dans sa poitrine longtemps.

Pas parce qu'il avait besoin d'être remercié.
Mais parce que ces deux mots lui dirent
quelque chose d'important.

Que papa le voyait.

Et que papa était content.

Et que si la satisfaction d'Allah était
dans la satisfaction des parents,
alors quelque chose de grand venait
de se passer dans ce couloir.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Papa dit que le Ramadan est fait pour être important pas reposant. Tu comprends ?",
      "Pourquoi les deux mots merci fils valaient tellement pour [PRENOM] ?",
      "Tu vois tes parents vraiment ou tu les trouves là et tu n'y penses pas ?",
    ],
    defi: "Cette semaine, fais quelque chose pour alléger le Ramadan de tes parents. Prépare leur plateau. Range sans qu'ils demandent. Et fais-le en silence.",
  },

  "super-heros-respect-des-parents-ramadan-2": {
    titre: "et les trente gestes",
    texte: `Les deux frères décidèrent quelque chose
au début du Ramadan.

Un geste pour maman chaque jour.
Trente jours. Trente gestes.

Petits ou grands. N'importe lesquels.
Mais chaque jour.

Jour 1 : ranger la cuisine sans qu'elle demande.
Jour 2 : lui préparer une tasse de thé.
Jour 3 : écouter sa journée sans regarder
le téléphone.
Jour 4 : dire je t'aime maman en partant à l'école.

Au dixième jour, [PRENOM2] dit :

Elle a remarqué quelque chose ?

Je sais pas, dit [PRENOM1].

On lui demande ?

Non. On continue.

Le paradis est sous les pieds des mères.

Ils continuèrent.

Le vingtième jour, maman les appela dans la cuisine.

Je sais ce que vous faites depuis vingt jours.

Les deux frères la regardèrent.

Comment ?

Les mères voient tout, dit-elle simplement.

Elle les serra contre elle un long moment.

Puis elle dit :

Vous savez ce que vous m'avez offert
ce Ramadan ?

Quoi ?

Que je me sente vue. Vraiment vue.
Pas juste utile. Mais vue.

Ce fut le plus beau mot du Ramadan.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Maman dit qu'elle se sent vue pas juste utile. C'est quoi la différence ?",
      "Les mères voient tout. Tu crois que c'est vrai ?",
      "Vous avez un rituel de gentillesse pour vos parents ?",
    ],
    defi: "Pendant une semaine, faites un geste pour maman chaque jour. Sans compter. Sans attendre de remerciements. Juste parce qu'elle mérite d'être vue.",
  },

  "super-heros-respect-des-parents-anniversaire-1": {
    titre: "et le super-cadeau",
    texte: `Pour l'anniversaire de maman, [PRENOM]
cherchait quelque chose de spécial.

Pas un objet. Quelque chose de vrai.

Il demanda à papy.

Le meilleur cadeau pour une maman, dit papy,
c'est de lui montrer que ses efforts ont compté.
Que ce qu'elle a fait n'a pas disparu.
Que ça a fait quelque chose en toi.

[PRENOM] réfléchit longtemps.

Puis il fit quelque chose qu'il n'avait
jamais fait.

Il écrivit une liste.

Tout ce que maman lui avait appris.
Tout ce qu'il savait faire et qui venait d'elle.

Faire des nœuds de chaussures. Lire à voix haute.
Dire merci vraiment. Penser aux autres.
Aimer les animaux. Prier avec le cœur.
Se relever après une chute.

Il compta. Seize choses.

Seize choses qu'il ne savait pas faire
avant d'avoir cette maman.

Ton Seigneur a décrété que vous leur
disiez des paroles nobles.

Le soir de l'anniversaire, devant toute
la famille réunie, [PRENOM] lut sa liste.

À voix haute. Sans rougir.

Seize choses que tu m'as apprises, maman.

Maman ne dit rien pendant un long moment.

Puis elle le serra si fort qu'il faillit
ne plus pouvoir respirer.

C'est le plus beau cadeau de ma vie,
dit-elle.

[PRENOM] savait pourquoi.

Parce que ça lui disait que son travail
n'avait pas disparu dans le vide.

Qu'il était là, bien vivant, dans son fils.`,
    citation: "Ton Seigneur a décrété que vous leur disiez des paroles nobles.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Papy dit que le meilleur cadeau c'est montrer que les efforts ont compté. Tu comprends pourquoi ?",
      "Lire la liste devant toute la famille. Pourquoi c'était courageux et beau en même temps ?",
      "Tu saurais faire ta propre liste de ce que tes parents t'ont appris ?",
    ],
    defi: "Cette semaine, écris ta propre liste. Tout ce que tes parents t'ont appris. Et lis-leur au moins une chose de cette liste.",
  },

  "super-heros-respect-des-parents-anniversaire-2": {
    titre: "et la journée de papa",
    texte: `Pour l'anniversaire de papa, les deux frères
prirent en charge la journée entière.

Matin. Petit-déjeuner préparé.
Café, jus, pain frais, fromage.
Serviette pliée. Table mise.

Papa descendit et trouva la table.

Il les regarda.

C'est vous ?

Oui, dirent-ils ensemble.

Midi. Ils s'occupèrent du déjeuner avec maman.
Épluchèrent. Mirent la table. Débarrassèrent.

La satisfaction d'Allah est dans la satisfaction
des parents.

Après-midi. Papa voulut regarder un match.
Ils s'installèrent à côté de lui.
Sans téléphones.
Juste là.

Soir. Ils firent la vaisselle.
Rangèrent la cuisine.
Dirent bonne nuit.

Papa les appela avant de dormir.

Il les regarda tous les deux dans l'embrasure
de la porte.

C'est la première fois de ma vie qu'on
s'occupe autant de moi.

Première fois ? dit [PRENOM1].

Oui. Les pères ont l'habitude de s'occuper.
Pas d'être pris en charge.

Papa dit ça simplement. Sans se plaindre.
Juste un constat.

[PRENOM2] regarda son frère.

On aurait dû commencer avant.

On commence maintenant, dit [PRENOM1].

Et ça compte pareil.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Papa dit que les pères ont l'habitude de s'occuper pas d'être pris en charge. Tu réalises ça ?",
      "On commence maintenant et ça compte pareil. Tu es d'accord ?",
      "Tu penses à prendre soin de ton père comme il prend soin de toi ?",
    ],
    defi: "Pour le prochain anniversaire de vos parents, prenez en charge une journée entière. Matin, midi, soir. Et faites-le vraiment.",
  },

  "animaux-generosite-aid-el-fitr-2": {
    titre: "et le festin de Safran",
    texte: `Le matin de l'Aïd, [PRENOM1] et [PRENOM2]
descendirent dans le jardin avec leurs sachets
de gâteaux d'Aïd.

Safran le renard les attendait sous le figuier.
Avec lui, les lapins de la haie, Hakim le hérisson,
et les oiseaux du rosier.

Ils avaient l'air d'une réunion qui attendait
quelque chose.

On vous attendait, dit Safran.

Pourquoi ? dit [PRENOM1].

Parce que c'est l'Aïd. Et l'Aïd c'est pour
tout le monde. Y compris nous.

Les deux soeurs regardèrent leurs sachets.
Puis les animaux.
Puis leurs sachets encore.

La charité n'a jamais appauvri personne.

Et sans se consulter, elles posèrent leurs sachets
au centre du jardin.

Prenez ce que vous voulez.

Ce qui suivit fut le plus joyeux festin
que le jardin ait jamais connu.

Les lapins se précipitèrent sur les gâteaux
aux amandes. Hakim choisit soigneusement
une corne de gazelle. Les oiseaux picorèrent
les miettes avec des petits cris de joie.

Safran prit une seule chose. Un petit gâteau rond.
Il le tint dans ses pattes et dit :

Vous savez ce que le Prophète ﷺ a dit sur
ceux qui nourrissent les animaux ?

Non, dirent les deux soeurs.

Qu'ils seront récompensés pour chaque gorgée
et chaque bouchée qu'un animal avale.

[PRENOM2] regarda le jardin.

Donc chaque miette qu'ils mangent en ce moment...

C'est une récompense pour vous, dit Safran.

[PRENOM1] et [PRENOM2] se regardèrent.

On vient de faire une sadaqa sans le savoir.

La meilleure sorte, dit Safran.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Vous saviez qu'on est récompensé pour la bonté envers les animaux ?",
      "Une sadaqa sans le savoir. Pourquoi la meilleure sorte ?",
      "Tu penses aux animaux autour de toi quand tu as de la nourriture ?",
    ],
    defi: "Cette semaine, pense aux animaux autour de toi. Nourris un oiseau, donne à boire à un chat. Et souviens-toi que chaque gorgée compte pour toi.",
  },

  "animaux-generosite-aid-el-adha-1": {
    titre: "et ce que Hakim comprenait",
    texte: `L'Aïd el-Adha. [PRENOM] portait le grand sac
de la part des pauvres.

Hakim le hérisson marchait à côté de lui
dans l'herbe, invisible pour les autres.

Tu sais ce que tu fais ? dit Hakim.

Je distribue la viande, dit [PRENOM].

Plus que ça, dit Hakim.

Plus ?

Tu rends à la circulation ce qu'on t'a prêté.

[PRENOM] ralentit.

Prêté ?

Tout ce que tu as, la nourriture, la maison,
la famille, dit Hakim, ça t'a été confié.
Pas donné pour toujours. Confié.
Et une confiance, ça s'honore en la faisant circuler.

La charité n'a jamais appauvri personne.

[PRENOM] pensa à ça en frappant à la première porte.

Puis à la deuxième.

À la cinquième, il s'arrêta devant la porte.
Il posa sa main sur le sac avant de sonner.

Il dit tout bas, juste pour lui :

Ya Allah, ce n'est pas ma viande que je donne.
C'est Ta confiance que je rends.

La porte s'ouvrit.

Une maman avec trois enfants dans les jambes.

Elle vit le sac.

Ses yeux changèrent quelque chose.

[PRENOM] lui tendit le sac et dit :

Aïd Moubarak. C'est avec notre coeur.

Et il sut que c'était vrai.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Hakim dit que tout ce qu'on a nous a été confié pas donné pour toujours. Ça change quelque chose ?",
      "[PRENOM] dit que c'est la confiance d'Allah qu'il rend. Tu comprends cette idée ?",
      "Tu penses à tes affaires comme des choses qui t'appartiennent ou qui te sont confiées ?",
    ],
    defi: "Cette semaine, avant de faire quelque chose de généreux, dis tout bas : ya Allah je Te rends ce que Tu m'as confié. Et observe si ça change quelque chose.",
  },

  "animaux-generosite-aid-el-adha-2": {
    titre: "et la chaîne des animaux",
    texte: `L'Aïd el-Adha. Dans le jardin, Yasmine la
renarde dit quelque chose d'inhabituel aux deux soeurs.

Aujourd'hui, les animaux de la forêt font
quelque chose de spécial.

Quoi ? dirent [PRENOM1] et [PRENOM2].

Chacun donne quelque chose à un autre.
Hakim partage ses champignons avec les lapins.
Les lapins laissent du foin pour la vieille tortue.
Les oiseaux guident ceux qui cherchent à manger.

Comme nous avec la part des pauvres,
dit [PRENOM1].

Exactement, dit Yasmine. Ibrahim a appris
quelque chose aux humains ce jour-là.
Et ce quelque chose a traversé jusqu'aux animaux.

La charité n'a jamais appauvri personne.

Comment les animaux ont appris ça ?
dit [PRENOM2].

En observant, dit Yasmine. En voyant ce que
la générosité fait aux visages. En remarquant
que ceux qui donnent sont plus légers
que ceux qui gardent.

Les deux soeurs portèrent leur part des pauvres
ce soir-là.

Et à chaque porte, elles regardèrent les visages.

Elles virent exactement ce que Yasmine
leur avait dit.

Quelque chose qui changeait.
Dans les yeux des gens qui recevaient.
Et dans leurs propres coeurs quand elles donnaient.

C'est la même chose, dit [PRENOM2]
en rentrant.

Quoi ?

Ce que les animaux ont compris et ce qu'on vient
de comprendre.

Que donner change les deux.
Celui qui reçoit et celui qui donne.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Yasmine dit que ceux qui donnent sont plus légers que ceux qui gardent. Tu es d'accord ?",
      "Donner change les deux : celui qui reçoit et celui qui donne. Tu l'as ressenti ?",
      "Vous avez observé les visages des gens que vous aidiez ?",
    ],
    defi: "Cette semaine, observe vraiment le visage de quelqu'un à qui tu fais quelque chose de bien. Et observe aussi ce qui se passe en toi.",
  },

  "animaux-generosite-ramadan-1": {
    titre: "et les nuits du Ramadan avec Safran",
    texte: `Pendant le Ramadan, [PRENOM] demanda
un soir à Safran :

Le Prophète ﷺ était encore plus généreux
en Ramadan qu'à n'importe quel autre moment.
Pourquoi ?

Safran réfléchit sérieusement.

Parce que le Ramadan ouvre les yeux.

Comment ?

Quand tu jeûnes, tu sais ce que c'est
d'avoir faim. Vraiment avoir faim.
Et cette faim-là, elle ne te quitte plus
quand tu vois quelqu'un qui n'a pas à manger.

[PRENOM] pensa à sa journée de jeûne.
À 14h, quand la faim était vraiment là.
Pas juste une envie de grignoter.
Une faim vraie.

Je comprends, dit-il.

La charité n'a jamais appauvri personne.

Comment on fait pour être généreux
comme le Prophète ﷺ ?

Safran le regarda.

Tu commences par regarder autour de toi.
Vraiment regarder. Pas juste voir.

[PRENOM] commença à regarder différemment.

La voisine du dessus qui montait ses courses seule.
Le vieux monsieur qui avait du mal à ouvrir
la porte de l'immeuble.
L'enfant à l'école qui mangeait toujours seul.

Il avait toujours vu ces gens.
Mais maintenant il les voyait.

Et voir vraiment, dit Safran, c'est le premier pas
vers faire quelque chose.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Safran dit que jeûner t'aide à voir vraiment ceux qui ont faim. Tu comprends ce lien ?",
      "Voir et vraiment voir. C'est quoi la différence ?",
      "Tu regardes vraiment les gens autour de toi ou tu les vois sans les voir ?",
    ],
    defi: "Cette semaine, regarde vraiment autour de toi. Cherche quelqu'un qui a besoin de quelque chose. Et fais ce quelque chose.",
  },

  "animaux-generosite-ramadan-2": {
    titre: "et le Ramadan de la forêt",
    texte: `Pendant le Ramadan, Yasmine dit aux deux soeurs :

Dans la forêt, les animaux ont leur propre Ramadan.
Ils donnent plus ce mois-ci que n'importe
quel autre.

Pourquoi ? dit [PRENOM1].

Parce qu'ils sentent que c'est le moment.
Comme les humains sentent que le bien fait
en Ramadan vaut plus.

Les deux soeurs décidèrent de faire pareil.

Un geste généreux chaque soir du Ramadan.
Avant l'iftar. Même petit.

Trente jours. Trente gestes.

Certains furent grands. Aider maman à préparer
l'iftar pour les voisins. Porter les courses
de la dame du bas.

Certains furent petits. Sourire vraiment
à quelqu'un. Dire merci en regardant dans les yeux.

La charité n'a jamais appauvri personne.

À la fin du Ramadan, Yasmine dit :

Vous avez changé.

Comment ? dit [PRENOM2].

Avant le Ramadan, vous faisiez des gestes
généreux parfois. Maintenant vous les cherchez.
Vous regardez autour de vous pour trouver
l'occasion de donner.

C'est ça la vraie générosité, dit [PRENOM1].

Quoi ?

Pas donner quand on y pense.
Chercher à donner.

Yasmine hocha la tête.

Ibrahim cherchait à donner.
Le Prophète ﷺ cherchait à donner.
Et maintenant vous aussi.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Yasmine dit que vous cherchez maintenant à donner au lieu d'attendre d'y penser. C'est quoi la différence ?",
      "La vraie générosité c'est chercher à donner. Tu es d'accord ?",
      "Vous cherchez des occasions d'être généreuses ou vous attendez qu'elles arrivent ?",
    ],
    defi: "Cette semaine, ne donnez pas juste quand l'occasion se présente. Cherchez l'occasion de donner. Chaque jour. Une seule. Mais cherchez-la.",
  },

  "animaux-generosite-anniversaire-1": {
    titre: "et le cadeau de Hakim",
    texte: `Pour l'anniversaire de [PRENOM], Hakim
le hérisson arriva dans le jardin avec quelque chose.

Pas un objet. Pas de la nourriture.
Il tenait quelque chose dans ses pattes
d'une façon très sérieuse.

Joyeux anniversaire, dit Hakim.

Qu'est-ce que tu m'offres ? dit [PRENOM].
Je vois rien.

Ce que j'offre, dit Hakim, ne se voit pas.
Je t'offre ce que je sais.

[PRENOM] ne comprit pas.

Je connais chaque recoin de ce jardin,
dit Hakim. Chaque plante. Chaque odeur.
Chaque endroit où le soleil touche le sol
exactement au bon moment.
Chaque coin secret.

Et je t'offre tout ça. Cette connaissance.
Ces chemins que je connais et que tu ne connais pas.

Il tendit ses petites pattes.

Viens. Je vais te montrer.

Ils passèrent l'après-midi ensemble.
Hakim montra à [PRENOM] des endroits du jardin
qu'il n'avait jamais vus.
Un coin de mousse douce derrière le figuier.
Un chemin de lumière entre deux haies.
Un nid d'oiseaux caché dans le rosier.

La charité n'a jamais appauvri personne.

En rentrant, [PRENOM] dit :

Tu m'as rien donné de matériel.

Non.

Mais c'est le plus beau cadeau d'anniversaire
que j'aie jamais reçu.

Parce que tu peux pas le perdre, dit Hakim.
Ce que tu sais maintenant, tu le sais pour toujours.

C'est ça la vraie générosité ?

C'est une de ses formes, dit Hakim.
Offrir ce qu'on sait.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Hakim offre ce qu'il sait. On peut offrir des connaissances ?",
      "Ce que tu sais tu le sais pour toujours. Pourquoi c'est précieux comme cadeau ?",
      "Tu as une connaissance ou une compétence que tu pourrais offrir à quelqu'un ?",
    ],
    defi: "Cette semaine, offre quelque chose que tu sais à quelqu'un. Apprends-lui quelque chose. Montre-lui quelque chose. Partage une connaissance.",
  },

  "animaux-generosite-anniversaire-2": {
    titre: "et la fête des animaux",
    texte: `Pour l'anniversaire de [PRENOM1] et [PRENOM2],
Yasmine avait organisé quelque chose dans le jardin.

Mais pas pour elles.

Avec elles.

On voudrait organiser une fête, dit Yasmine.
Pas pour vous fêter. Avec vous. Pour ceux
qui ne fêtent jamais rien.

Les deux soeurs se regardèrent.

Les animaux du jardin qui étaient seuls
ou oubliés, dit Yasmine. La vieille tortue
Hikma qui n'a pas de famille. Les oiseaux
migrateurs qui passent sans s'arrêter.
Le vieux chien du voisin qui ne sort plus.

On peut faire quelque chose pour eux
le jour de notre anniversaire ?
dit [PRENOM2].

C'est exactement ce que je propose,
dit Yasmine.

La charité n'a jamais appauvri personne.

Elles passèrent leur matin d'anniversaire
à préparer quelque chose pour chaque animal seul
du quartier. Des miettes pour les oiseaux.
De l'eau fraîche pour le vieux chien.
Un chemin dégagé pour Hikma.

Le soir, Yasmine dit :

Vous avez fêté votre anniversaire en rendant
d'autres êtres heureux. C'est la plus belle
façon de fêter quelque chose.

[PRENOM1] pensa à ça.

C'était pas notre anniversaire finalement.

Si, dit Yasmine. Mais vous avez fait
de votre joie un cadeau pour les autres.

Et c'est la plus grande générosité.`,
    citation: "La charité n'a jamais appauvri personne.",
    source: "Le Prophète Muhammad ﷺ • At-Tirmidhi",
    questions: [
      "Yasmine dit de faire de sa joie un cadeau pour les autres. Tu comprends cette idée ?",
      "Passer son anniversaire à penser aux autres. C'est bizarre ou beau selon toi ?",
      "Pour votre prochain anniversaire, vous pourriez organiser quelque chose pour d'autres ?",
    ],
    defi: "Pour votre prochain anniversaire, faites quelque chose pour d'autres en plus de fêter. Même tout petit. Et voyez comment ça change le jour.",
  },

  "animaux-partage-aid-el-fitr-1": {
    titre: "et le festin de l'Aïd",
    texte: `Le matin de l'Aïd, [PRENOM] descendit
dans le jardin avec son sachet de gâteaux.

Safran était là.

Aïd Moubarak, Safran.

Aïd Moubarak, [PRENOM]. Tu partages ?

[PRENOM] regarda son sachet.

Avec toi ?

Avec le jardin, dit Safran. Aujourd'hui
c'est pour tout le monde.

[PRENOM] posa le sachet au milieu du jardin.

Les lapins arrivèrent. Les oiseaux.
Hakim sortit de sous les feuilles.

Le festin fut joyeux et bruyant.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Safran dit :

Tu sais ce que le Prophète ﷺ a dit sur
ceux qui partagent leur nourriture ?

Non.

Que le meilleur d'entre vous est celui
qui nourrit les autres.

[PRENOM] regarda le jardin vide de gâteaux
et plein d'animaux qui mangeaient joyeusement.

C'est l'Aïd le plus vrai que j'aie eu,
dit-il.

Pourquoi ?

Parce que j'ai rien gardé et je me sens
plus riche qu'avant.

C'est toujours comme ça avec le partage vrai,
dit Safran. On donne et on reçoit quelque chose
qu'on ne donnait pas.

Quoi ?

La joie d'avoir donné.
Et ça, personne peut te le prendre.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "C'est l'Aïd le plus vrai parce qu'il n'a rien gardé. Tu comprends ce paradoxe ?",
      "La joie d'avoir donné que personne peut prendre. Tu as déjà ressenti ça ?",
      "Tu partages ta nourriture avec les animaux autour de toi ?",
    ],
    defi: "Cette semaine, donne quelque chose entièrement sans en garder. Et observe si tu reçois quelque chose que tu n'attendais pas.",
  },

  "animaux-partage-aid-el-fitr-2": {
    titre: "et le grand partage du jardin",
    texte: `Le matin de l'Aïd, Yasmine rassembla
les animaux du jardin.

C'est l'Aïd pour les humains, dit-elle.
On fait notre propre partage.

Chaque animal apporta ce qu'il pouvait.

Les lapins : des carottes fraîches.
Les oiseaux : des baies rouges.
Hakim : des champignons trouvés sous les feuilles.
Hikma : rien. Mais elle fit le long chemin
depuis le fond du jardin.

[PRENOM1] et [PRENOM2], qui entendaient les animaux,
regardèrent la scène depuis la fenêtre.

Ils font leur propre Aïd, dit [PRENOM1].

On participe ? dit [PRENOM2].

Elles allèrent chercher leurs sachets de gâteaux
et les ajoutèrent au grand festin.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Le jardin fut ce matin-là plus joyeux
que la maison.

En rentrant, [PRENOM1] dit :

Le partage c'est contagieux.

Comment ?

Quand on voit quelqu'un partager,
on a envie de partager aussi.

[PRENOM2] réfléchit.

Donc si on commence, les autres commencent ?

Souvent oui.

[PRENOM1] hocha la tête.

Alors peut-être que le plus important
c'est de commencer.

Et de ne pas attendre que quelqu'un commence
à ta place.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Le partage est contagieux. Tu as déjà vu ça dans ta vie ?",
      "Commencer sans attendre que quelqu'un commence à ta place. C'est difficile ?",
      "Vous avez déjà lancé quelque chose de bien et vu les autres rejoindre ?",
    ],
    defi: "Cette semaine, soyez la première à commencer quelque chose de généreux. Sans attendre. Et observez si d'autres rejoignent.",
  },

  "animaux-partage-aid-el-adha-1": {
    titre: "et ce que Safran apprit sur Ibrahim",
    texte: `L'Aïd el-Adha. [PRENOM] portait le grand sac.

Safran marchait à côté de lui dans l'herbe.

Safran, dit [PRENOM], est-ce que les animaux
connaissent Ibrahim ?

Safran réfléchit.

Nous connaissons ce que la générosité fait
aux visages. Et Ibrahim en est un exemple.

Les animaux ne lisent pas le Coran.

Non. Mais on voit les gens généreux.
Et on voit la différence entre eux
et ceux qui gardent tout.

Quelle différence ? dit [PRENOM].

Ils sont plus légers, dit Safran simplement.
Ceux qui donnent sont plus légers
que ceux qui gardent.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

[PRENOM] pensa à Ibrahim.

Ibrahim a donné la chose la plus précieuse.
Et Allah l'a remplacée. Et Ibrahim est devenu
quelqu'un que le monde entier connaît encore
des milliers d'ans après.

C'est ça être léger ?

Oui, dit Safran. Pas posséder moins.
Être libéré du poids de trop garder.

[PRENOM] porta son sac jusqu'à la dernière porte.

Et en rentrant les mains vides,
il comprit ce que Safran voulait dire.

Il était plus léger.

Pas son sac.
Lui.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Safran dit que ceux qui donnent sont plus légers que ceux qui gardent. Tu le crois ?",
      "Être libéré du poids de trop garder. C'est quoi ce poids selon toi ?",
      "Tu as déjà ressenti cette légèreté après avoir donné quelque chose ?",
    ],
    defi: "Cette semaine, donne quelque chose que tu aurais gardé. Et observe si tu te sens plus léger après.",
  },

  "animaux-partage-aid-el-adha-2": {
    titre: "et les trois parts de la forêt",
    texte: `L'Aïd el-Adha. Yasmine expliqua quelque chose
aux deux soeurs.

Dans la forêt, les animaux qui ont beaucoup
de nourriture ne la gardent pas toute.

Pourquoi ? dit [PRENOM1].

Parce qu'ils ont appris que si tout le monde
donne un peu, tout le monde mange.
Mais si chacun garde tout, certains meurent
de faim et les autres meurent d'anxiété
à garder ce qu'ils ont.

[PRENOM2] réfléchit.

Ils ont inventé les trois parts eux aussi ?

Pas inventé, dit Yasmine. Redécouvert.
C'est une loi naturelle. Ibrahim en a rappelé
la sagesse aux humains.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

Les deux soeurs portèrent leur part des pauvres
ce soir-là.

Et en frappant à chaque porte, [PRENOM2] pensa
à la forêt. Aux animaux. À la loi naturelle.

On fait partie d'un cycle plus grand
que nous, dit-elle en rentrant.

Comment ça ?

Ce qu'on donne ce soir, quelqu'un le rendra
à quelqu'un d'autre un jour.
Pas à nous. Mais ça circulera.

[PRENOM1] hocha la tête.

Comme la forêt.

Comme la forêt.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Yasmine dit que garder tout crée de l'anxiété. Tu comprends pourquoi ?",
      "[PRENOM2] dit qu'on fait partie d'un cycle plus grand. Qu'est-ce qu'elle veut dire ?",
      "Tu as l'impression de faire partie d'un cycle quand tu partages quelque chose ?",
    ],
    defi: "Cette semaine, partage quelque chose en pensant au cycle : ce que tu donnes continuera à circuler même si tu ne le vois pas.",
  },

  "animaux-partage-ramadan-1": {
    titre: "et le Ramadan de Safran",
    texte: `Pendant le Ramadan, [PRENOM] trouva Safran
dans le jardin qui faisait quelque chose d'inhabituel.

Il mangeait moins que d'habitude. Et ce qu'il
n'avait pas mangé, il le laissait près du terrier
des lapins.

Tu jeûnes ? dit [PRENOM].

À ma façon, dit Safran.

Pourquoi ?

Parce que quand je mange moins, j'ai plus
à partager. Et partager pendant le Ramadan
est une façon d'être avec ceux qui jeûnent.

[PRENOM] regarda Safran.

Tu fais ça pour être avec moi ?

Pour être avec tous ceux qui donnent
ce mois-ci, dit Safran. Le Ramadan c'est
un mois de générosité. Et la générosité
ça s'apprend en regardant les autres la pratiquer.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

[PRENOM] pensa à ce que Safran avait dit.

Si je mange moins ce Ramadan, j'aurais plus
à donner aussi.

Tu n'as pas besoin de manger moins, dit Safran.
Tu as d'autres choses à donner.

Comme quoi ?

Ton temps. Ton écoute. Ton aide.
La générosité ne passe pas que par la nourriture.

[PRENOM] pensa à la voisine seule.
À l'enfant à l'école qui avait du mal en maths.
À maman qui préparait l'iftar seule chaque soir.

Il avait plus à donner qu'il ne pensait.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Safran dit que la générosité ça s'apprend en regardant les autres. Tu es d'accord ?",
      "On peut donner du temps et de l'écoute pas juste des choses. Tu le réalises ?",
      "Qu'est-ce que tu pourrais donner en ce moment sans que ça te coûte de l'argent ?",
    ],
    defi: "Cette semaine, identifie ce que tu as à donner qui n'est pas de l'argent. Et donne-le. Chaque jour pendant sept jours.",
  },

  "animaux-partage-ramadan-2": {
    titre: "et les nuits de partage",
    texte: `Pendant le Ramadan, les deux soeurs décidèrent
quelque chose avec Yasmine.

Chaque soir, avant l'iftar, elles feraient
quelque chose pour le jardin.

Des miettes pour les oiseaux.
De l'eau fraîche pour les lapins.
Un chemin dégagé pour Hikma.

Yasmine les regarda faire le premier soir.

Vous savez ce que vous faites ?

On partage avant l'iftar, dit [PRENOM1].

Vous faites ce qu'Ibrahim faisait, dit Yasmine.

Ibrahim donnait avant d'avoir reçu.
Il ne donnait pas ce qui lui restait.
Il donnait avant de savoir ce qu'il aurait.

Aucun de vous ne croit vraiment tant qu'il n'aime
pas pour son frère ce qu'il aime pour lui-même.

[PRENOM2] réfléchit.

On donne avant de manger.
Donc avant d'avoir reçu notre repas.

C'est ça, dit Yasmine.

Est-ce que ça change quelque chose de donner avant ?

Essayez et vous verrez, dit Yasmine.

Elles essayèrent.

Et elles virent.

Chaque iftar ce mois-là fut différent.
Pas le goût. Pas les plats.

Quelque chose dans leur façon de s'asseoir
à table. Quelque chose de plus léger.
Quelque chose de plus vrai.

Parce qu'elles avaient donné avant de recevoir.
Et ce petit geste changeait tout.`,
    citation: "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Yasmine dit qu'Ibrahim donnait avant d'avoir reçu. C'est quoi la différence avec donner ce qui reste ?",
      "L'iftar changeait chaque soir à cause du geste avant. Comment une petite chose peut changer une grande chose ?",
      "Tu donnes parfois avant de recevoir ou tu attends d'avoir assez pour toi d'abord ?",
    ],
    defi: "Cette semaine, avant chaque repas, faites quelque chose pour quelqu'un d'autre. Avant. Pas après. Et observez si le repas a un goût différent.",
  },

  "animaux-courage-aid-el-fitr-1": {
    titre: "et Safran qui n'avait pas peur",
    texte: `Le matin de l'Aïd, [PRENOM] devait traverser
le grand marché tout seul pour rejoindre
grand-mère de l'autre côté.

C'était la première fois qu'il y allait seul.

Il avait un peu peur.

Safran marchait à côté de lui, invisible.

J'ai peur, dit [PRENOM] à voix basse.

Je sais, dit Safran.

Et toi tu as jamais peur ?

Toujours, dit Safran simplement.

Toujours ?

Chaque matin quand je sors du terrier.
Les chiens. Les voitures. Les inconnus.

Et tu sors quand même ?

Bien sûr. Sinon je mourrai de faim et d'ennui
dans mon terrier.

[PRENOM] regarda le marché devant lui.

La différence entre quelqu'un de courageux
et quelqu'un qui a peur c'est pas l'absence
de peur. C'est l'avancée malgré elle.

N'aie pas peur. Je suis avec vous, j'entends
et je vois.

[PRENOM] avança.

Le marché était bruyant. Plein de monde.
Beaucoup d'inconnus.

Mais il traversa.

En arrivant chez grand-mère, elle lui ouvrit
la porte.

Tu es venu seul ?

Oui.

Et comment c'était ?

[PRENOM] pensa à Safran.

J'avais peur. Mais j'ai avancé quand même.

Grand-mère sourit.

C'est ça être courageux.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Safran dit qu'il a toujours peur mais avance quand même. Tu trouves ça courageux ?",
      "La différence entre courageux et peureux c'est l'avancée malgré la peur. Tu es d'accord ?",
      "Tu as déjà avancé vers quelque chose qui te faisait peur ?",
    ],
    defi: "Cette semaine, avance vers quelque chose qui te fait un peu peur. Même tout petit. Et dis-toi : j'ai peur et j'avance quand même.",
  },

  "animaux-courage-aid-el-fitr-2": {
    titre: "et la chanson des oiseaux",
    texte: `Le matin de l'Aïd, les oiseaux du jardin
chantaient.

[PRENOM1] et [PRENOM2] les écoutèrent depuis
la fenêtre de leur chambre.

Est-ce qu'ils ont peur de chanter ? dit [PRENOM2].

[PRENOM1] réfléchit.

Ils chantent parce que c'est leur nature.
Pas parce qu'ils n'ont pas peur.
Peut-être qu'ils ont peur aussi.
Mais c'est leur nature de chanter quand même.

Et si notre nature c'est de chanter aussi ?
dit [PRENOM2].

Pour l'Aïd, la famille était réunie
chez grand-mère. Toutes les tantes,
les oncles, les cousins.

Grand-mère demanda si quelqu'un voulait
présenter quelque chose.

[PRENOM1] et [PRENOM2] se regardèrent.

N'aie pas peur. Je suis avec vous,
j'entends et je vois.

Elles se levèrent.

Elles chantèrent une chanson de l'Aïd
que grand-mère leur avait apprise.
Pas parfaitement. Mais complètement.
Jusqu'à la dernière note.

La famille applaudit.

Le plus petit cousin, trois ans, demanda :

Encore !

Et elles chantèrent encore.

En s'asseyant, [PRENOM2] dit à sa soeur :

On avait peur.

Oui.

Et on a chanté quand même.

Comme les oiseaux, dit [PRENOM1].

Comme les oiseaux.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Les oiseaux chantent parce que c'est leur nature même avec peur. C'est quoi ta nature à toi ?",
      "Chanter jusqu'à la dernière note malgré la peur. Pourquoi finir est important ?",
      "Vous exprimez-vous facilement devant des gens que vous aimez ?",
    ],
    defi: "Cette semaine, exprimez-vous devant des gens que vous aimez. Chantez, récitez, racontez. Et allez jusqu'au bout comme les oiseaux.",
  },

  "animaux-courage-aid-el-adha-1": {
    titre: "et Hakim qui expliqua",
    texte: `L'Aïd el-Adha. [PRENOM] demanda à Hakim :

Ibrahim avait peur ?

Hakim réfléchit sérieusement.

Je n'étais pas là, dit-il. Mais je crois que oui.
Ibrahim était humain. Il aimait son fils.

Et il a fait quand même.

Parce qu'il avait quelque chose de plus grand
que sa peur.

Quoi ?

Sa confiance dans le fait qu'Allah était avec lui.

[PRENOM] pensa à sa propre peur.

Moi j'ai peur de commencer des choses nouvelles.
Peur d'échouer. Peur d'être nul.

Hakim le regarda avec ses yeux noirs et ronds.

Est-ce qu'Allah est avec toi ?

Oui.

Et alors ?

[PRENOM] ne répondit pas tout de suite.

Est-ce que croire qu'Allah est avec moi
change quelque chose à la peur ?

Elle ne disparaît pas, dit Hakim.
Mais elle ne commande plus.

N'aie pas peur. Je suis avec vous,
j'entends et je vois.

[PRENOM] ferma les yeux une seconde.

Il pensa à quelque chose qu'il voulait faire
depuis longtemps et qu'il avait repoussé.

Le lendemain matin, il y alla.

Pas sans peur.

Mais sans laisser la peur décider.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Hakim dit que la confiance ne fait pas disparaître la peur mais elle ne commande plus. Tu comprends ?",
      "[PRENOM] y est allé sans peur ou malgré la peur ? C'est quoi la différence ?",
      "Tu as quelque chose que tu veux faire mais que tu repousses par peur ?",
    ],
    defi: "Cette semaine, fais quelque chose que tu repousses depuis longtemps. Pas sans peur. Malgré elle. Et dis-toi : Allah est avec moi.",
  },

  "animaux-courage-aid-el-adha-2": {
    titre: "et le mouton et le courage",
    texte: `L'Aïd el-Adha. Le mouton dans la cour.

[PRENOM1] voulait rester jusqu'au bout.
[PRENOM2] avait peur.

Je peux pas, dit [PRENOM2].

Tu peux pas ou tu veux pas ? dit Yasmine
qui était là, invisible pour les autres.

[PRENOM2] réfléchit.

Les deux.

Yasmine dit doucement :

Tu sais pourquoi le mouton était calme ?

Non.

Parce que les animaux font confiance
à ce qui arrive. Ils n'y résistent pas.
Ils ne combattent pas ce qu'ils ne peuvent
pas changer.

[PRENOM2] regarda le mouton.

Lui il avait peur ?

Je ne sais pas, dit Yasmine. Mais sa façon
de se tenir disait quelque chose de calme.

N'aie pas peur. Je suis avec vous,
j'entends et je vois.

[PRENOM2] prit la main de sa soeur.

On reste ensemble ?

Ensemble, dit [PRENOM1].

Elles restèrent. En silence. En se tenant la main.

Ce ne fut pas facile.

Mais en montant, [PRENOM2] dit quelque chose
qu'elle n'attendait pas.

Je suis contente d'avoir eu peur et d'être
restée quand même.

Pourquoi ?

Parce que j'ai appris quelque chose
sur moi-même.

Quoi ?

Que je peux rester même quand j'ai peur.
Que la peur ne me commande pas forcément.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Yasmine demande tu peux pas ou tu veux pas. C'est quoi la différence selon toi ?",
      "[PRENOM2] dit qu'elle a appris quelque chose sur elle-même. Quoi exactement ?",
      "Tu as déjà découvert que tu pouvais faire quelque chose que tu croyais ne pas pouvoir ?",
    ],
    defi: "Cette semaine, reste dans quelque chose de difficile. Pas jusqu'au bout forcément. Mais plus longtemps que tu ne l'aurais fait avant. Et observe ce que tu apprends sur toi.",
  },

  "animaux-courage-ramadan-1": {
    titre: "et le lion qui jeûnait",
    texte: `Pendant le Ramadan, Safran raconta
quelque chose à [PRENOM].

Dans la grande forêt, le lion a sa propre façon
de pratiquer la patience et la maîtrise de soi.

Comment ? dit [PRENOM].

Il est le plus fort. Il pourrait chasser à n'importe
quel moment. Manger à volonté. Prendre ce qu'il veut.

Mais il ne le fait pas.

Pourquoi ?

Il attend le bon moment. Il se maîtrise.
Il a appris que sa force ne vient pas de ce
qu'il mange ou de ce qu'il prend.
Elle vient de quelque chose de plus profond.

[PRENOM] pensa à son jeûne.

Le vrai fort est celui qui se maîtrise
lui-même quand la colère le saisit.

Et quand la faim le saisit aussi.

Et quand la peur le saisit, dit Safran.

Ma force vient d'où alors ? dit [PRENOM].

D'où tu veux qu'elle vienne, dit Safran.

Ce n'était pas une vraie réponse.

Mais c'était la meilleure.

[PRENOM] pensa à Allah. À la confiance.
À la certitude que quelque chose de plus grand
que lui était là.

C'est de là que vient ma force, dit-il finalement.

Comme le lion, dit Safran. Et comme Ibrahim.

Et comme le Prophète ﷺ qui jeûnait
avec ses compagnons.

Et comme tous ceux qui choisissent la maîtrise
plutôt que la facilité.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Safran dit que la force du lion vient de quelque chose de plus profond que la nourriture. Quoi ?",
      "D'où tu veux qu'elle vienne dit Safran. Qu'est-ce que tu répondrais ?",
      "Tu te sens fort quand tu te maîtrises ?",
    ],
    defi: "Cette semaine, rappelle-toi d'où vient ta vraie force. Et dans un moment difficile, laisse cette force te guider plutôt que tes habitudes.",
  },

  "animaux-courage-ramadan-2": {
    titre: "et la nuit courageuse",
    texte: `La nuit du 27 Ramadan. [PRENOM1] et [PRENOM2]
voulaient veiller.

Yasmine était là avec elles dans le jardin.
Elle veillait aussi, à sa façon.

Minuit arriva.

[PRENOM2] dit :

Je vais m'endormir.

Reste encore un peu, dit [PRENOM1].

C'est dur.

Je sais.

Yasmine dit doucement :

Les grandes nuits méritent qu'on reste éveillées.
Pas parce que c'est obligatoire.
Mais parce que certaines choses valent
le sacrifice du sommeil.

N'aie pas peur. Je suis avec vous,
j'entends et je vois.

[PRENOM2] regarda le ciel.

À quoi ça sert de rester éveillée ?

À être là, dit Yasmine. Vraiment là.
Dans la nuit qui vaut mille mois.
Même à moitié endormie. Même avec les yeux
qui se ferment. Être là et choisir d'être là.

[PRENOM2] resta.

Jusqu'à 2h du matin.

Puis elle s'endormit doucement dans le jardin,
la tête sur l'épaule de sa soeur.

Le lendemain matin, elle dit :

J'ai pas tenu toute la nuit.

Non, dit [PRENOM1]. Mais tu as tenu
plus longtemps que tu ne pensais pouvoir.

C'est du courage ça ?

Oui, dit Yasmine. Tenir plus longtemps
que ce qu'on pensait. C'est toujours du courage.`,
    citation: "N'aie pas peur. Je suis avec vous, j'entends et je vois.",
    source: "Coran, Sourate Ta-Ha, verset 46",
    questions: [
      "Yasmine dit que certaines choses valent le sacrifice du sommeil. Tu es d'accord ?",
      "Tenir plus longtemps que ce qu'on pensait. C'est quoi ce courage spécifique ?",
      "Tu as déjà tenu quelque chose plus longtemps que tu ne le pensais ?",
    ],
    defi: "Cette semaine, tiens quelque chose plus longtemps que ce que tu prévoyais. Une prière, une lecture, un effort. Juste un peu plus. Et observe que tu peux.",
  },

  "animaux-patience-aid-el-fitr-1": {
    titre: "et la tortue de l'Aïd",
    texte: `Le matin de l'Aïd, [PRENOM] était pressé.

Pressé de s'habiller. Pressé d'aller à la mosquée.
Pressé de rentrer pour les gâteaux et les cadeaux.

En passant dans le jardin, il vit Hikma.

La vieille tortue avançait lentement.
Très lentement.
Sur le chemin du coin de la haie au figuier.

[PRENOM] s'arrêta.

Hikma, tu vas pas à la fête ?

J'y vais, dit Hikma tranquillement.

Mais t'es lente.

Je suis patiente. C'est différent.

[PRENOM] la regarda avancer.

Un pas. Un autre. Sans s'affoler. Sans regarder
si elle allait assez vite. Sans comparer
sa progression à celle des autres.

Personne ne reçoit un don meilleur et plus
vaste que la patience.

[PRENOM] regarda sa montre.

Il avait encore dix minutes.

Il s'assit dans l'herbe à côté du chemin de Hikma.

Et il attendit qu'elle arrive au figuier
avec elle.

C'était lent. Très lent.

Mais en regardant Hikma avancer,
quelque chose dans sa poitrine se calma.

Hikma arriva au figuier.

Elle leva les yeux vers [PRENOM].

Tu t'es levé tôt pour courir partout
et tu finis assis dans l'herbe à regarder
une tortue marcher.

Oui.

Et comment c'est ?

Mieux, dit [PRENOM] honnêtement.
Beaucoup mieux.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "Hikma dit qu'elle est patiente pas lente. C'est quoi la différence ?",
      "Regarder Hikma marcher a calmé quelque chose dans [PRENOM]. Comment c'est possible ?",
      "Tu t'arrêtes parfois pour ralentir quand tu vas trop vite ?",
    ],
    defi: "Cette semaine, arrête-toi une fois par jour et marche lentement pendant deux minutes. Sans courir nulle part. Et observe ce que ça fait.",
  },

  "animaux-patience-aid-el-fitr-2": {
    titre: "et les escargots de l'Aïd",
    texte: `Le matin de l'Aïd, [PRENOM1] et [PRENOM2]
allaient à la mosquée avec maman.

Sur le trottoir, une file d'escargots traversait.

Des escargots. Exactement maintenant.
Sur leur chemin.

[PRENOM2] allait les enjamber.

[PRENOM1] dit :

Attends.

Pourquoi ?

On peut les contourner.

Ça va nous mettre en retard.

D'une minute peut-être.

[PRENOM2] s'arrêta.

Ils regardèrent les escargots traverser.
Lentement. Sans se presser. Sans savoir
qu'ils étaient sur le chemin de quelqu'un
d'autre.

Personne ne reçoit un don meilleur et plus
vaste que la patience.

Ils sont sur le chemin eux aussi, dit [PRENOM1].

Maman qui les avait rejointes dit :

La patience envers les petites créatures,
c'est aussi une forme de respect.

Les trois contournèrent les escargots.

En arrivant à la mosquée avec une minute
de retard, [PRENOM2] dit à sa soeur :

On a perdu une minute pour des escargots.

Et gagné quelque chose, dit [PRENOM1].

Quoi ?

La conscience que tout le monde est sur
son propre chemin. Et que parfois ces chemins
se croisent.

Et que quand ils se croisent, la patience
c'est de faire de la place.`,
    citation: "Personne ne reçoit un don meilleur et plus vaste que la patience.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
    questions: [
      "[PRENOM1] dit que tout le monde est sur son propre chemin. Tu comprends ce qu'elle veut dire ?",
      "Faire de la place pour les escargots. C'est une forme de patience selon toi ?",
      "Tu respectes le rythme de ceux qui vont moins vite que toi ?",
    ],
    defi: "Cette semaine, fais de la place pour quelqu'un qui va à un rythme différent du tien. Sans t'énerver. Et observe si ça change quelque chose pour toi.",
  },

  "animaux-patience-aid-el-adha-1": {
    titre: "et ce que Hikma comprenait de l'Aïd",
    texte: `L'Aïd el-Adha. [PRENOM] alla trouver
Hikma sous le figuier.

Tu sais quelque chose sur Ibrahim ? dit-il.

Hikma réfléchit longuement. Très longuement.

Je sais ce que les animaux ont appris
de lui, dit-elle finalement.

Quoi ?

Qu'on peut avoir confiance même quand on
ne comprend pas.

[PRENOM] s'assit dans l'herbe.

Hikma, est-ce que t'attends quelque chose ?

Toujours, dit Hikma.

Quoi ?

Le printemps. La pluie. La chaleur.
Les bonnes choses qui viendront
si je reste là où je dois être.

Tu as jamais peur qu'elles viennent pas ?

Si, dit Hikma. Mais j'ai quelque chose
qui aide.

Quoi ?

La mémoire des printemps passés.
De chaque pluie qui est venue.
De chaque chaleur qui a réchauffé le sol.

La patience est une lumière.

Et cette mémoire me dit que le prochain
printemps viendra aussi.

[PRENOM] pensa à Ibrahim.

Ibrahim avait la mémoire de la façon dont
Allah avait toujours répondu à ses prières.

Et cette mémoire lui donnait la confiance
pour continuer.

On attend mieux quand on se souvient,
dit [PRENOM].

Exactement, dit Hikma. L'attente active
c'est aussi ça. Se souvenir que ça a toujours
fini par arriver.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Hikma dit que la mémoire des printemps passés aide à attendre. Tu comprends ce mécanisme ?",
      "Se souvenir que ça a toujours fini par arriver. Ça aide à patienter ?",
      "Tu as une mémoire d'une bonne chose qui est venue après une longue attente ?",
    ],
    defi: "Cette semaine, pense à une bonne chose qui est venue après une longue attente dans ta vie. Et rappelle-toi de ça quand tu dois patienter.",
  },

  "animaux-patience-aid-el-adha-2": {
    titre: "et les tortues et les licornes",
    texte: `L'Aïd el-Adha. Hikma dit quelque chose
aux deux soeurs.

Ibrahim a attendu des décennies avec foi.
Ismaïl a attendu avec confiance.
Et ensemble ils ont fait quelque chose
de plus grand qu'eux.

[PRENOM1] réfléchit.

Ils ont choisi d'attendre.

Oui, dit Hikma. Pas subi l'attente.
Choisi. Il y a une différence.

La patience est une lumière.

[PRENOM2] dit :

Choisir d'attendre ça veut dire quoi ?

Ça veut dire décider que ce qu'on attend
vaut le temps que ça prend.
Et agir en conséquence.

[PRENOM1] pensa à quelque chose.

On attend des fois la même chose
et on s'énerve au lieu de choisir.

Et si on choisissait d'attendre ? dit [PRENOM2].

Qu'est-ce que ça changerait ?

Tout. L'énergie qu'on dépense à s'énerver,
on pourrait la dépenser à autre chose.

Hikma hocha la tête lentement.

C'est ça la patience active.
Pas subir l'attente.
Choisir ce qu'on fait avec le temps de l'attente.

Les deux soeurs se regardèrent.

On choisit quoi là ?

On peut continuer à s'énervier que les préparatifs
de l'Aïd prennent du temps, dit [PRENOM1].

Ou on peut s'asseoir avec Hikma et apprendre
quelque chose, dit [PRENOM2].

Elles s'assirent.

Et ce fut le plus beau début d'Aïd.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Choisir d'attendre plutôt que subir l'attente. C'est quoi la différence concrètement ?",
      "L'énergie dépensée à s'énerver pourrait servir à autre chose. À quoi ?",
      "Vous avez choisi comment attendre quelque chose récemment ?",
    ],
    defi: "Cette semaine, quand vous devez attendre quelque chose, décidez ensemble ce que vous allez faire de ce temps. Ne subissez pas l'attente. Choisissez-la.",
  },

  "animaux-patience-ramadan-1": {
    titre: "et la lenteur de Hikma pendant le Ramadan",
    texte: `Pendant le Ramadan, [PRENOM] remarqua
que Hikma semblait encore plus lente
que d'habitude.

Tu vas bien ? dit-il.

Très bien, dit Hikma. Je ralentis exprès.

Pourquoi ?

Parce que le Ramadan invite à ralentir.
À regarder. À sentir les choses au lieu
de les traverser.

[PRENOM] s'assit à côté d'elle dans l'herbe.

Il était en retard pour quelque chose.
Il aurait dû partir cinq minutes avant.

Mais il resta.

La patience est une lumière.

Il regarda ce que regardait Hikma.

Une fleur qui s'ouvrait. Lentement.
Pétale par pétale. Sans qu'il l'ait remarquée
avant.

Un chemin d'fourmis dans l'herbe.
Chacune portant quelque chose. Chacune sachant
exactement où aller.

La lumière du soir qui changeait les couleurs
du jardin.

Je voyais jamais tout ça, dit-il.

Tu allais trop vite, dit Hikma.

[PRENOM] resta encore cinq minutes.

Puis dix.

Il arriva en retard à ce qu'il avait prévu.

Mais il arriva avec quelque chose de nouveau
dans les yeux.

Une façon de voir le monde qu'il n'avait
pas le matin.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Hikma dit que le Ramadan invite à ralentir et voir les choses au lieu de les traverser. C'est quoi la différence ?",
      "[PRENOM] arrive en retard mais avec quelque chose de nouveau. C'était le bon choix ?",
      "Tu vas parfois trop vite pour voir ce qui se passe autour de toi ?",
    ],
    defi: "Cette semaine, une fois par jour, arrête-toi pendant cinq minutes et regarde vraiment autour de toi. Sans téléphone. Et note une chose que tu n'avais jamais remarquée.",
  },

  "animaux-patience-ramadan-2": {
    titre: "et le Ramadan patient",
    texte: `Pendant le Ramadan, Hikma dit aux deux soeurs :

Ce mois vous apprend quelque chose que
personne ne peut enseigner autrement.

Quoi ? dit [PRENOM1].

Que le corps peut attendre.
Et que pendant qu'il attend, l'âme peut
faire des choses qu'elle ne fait pas
le reste de l'année.

Quelles choses ? dit [PRENOM2].

Ce que vous voudrez qu'elle fasse, dit Hikma.
Le Ramadan n'impose pas ce que l'âme doit faire.
Il crée juste l'espace pour qu'elle le fasse.

La patience est une lumière.

[PRENOM1] réfléchit.

Moi je veux que mon âme apprenne
à être plus douce avec les gens.

[PRENOM2] pensa.

Moi je veux qu'elle apprenne à prier
avec le coeur vraiment là.

Hikma les regarda.

Alors ce Ramadan est pour ça.
Pour [PRENOM1] la douceur.
Pour [PRENOM2] la présence dans la prière.

À la fin du Ramadan, les deux soeurs
se demandèrent si elles avaient réussi.

Un peu, dit [PRENOM1].

Un peu, dit [PRENOM2].

C'est suffisant ? dit [PRENOM1].

Hikma dit :

Un peu en trente jours.
Imaginez en trente ans.

Et les deux soeurs comprirent que la patience
n'était pas juste attendre.
C'était avancer doucement vers ce qu'on veut être.
Un peu à la fois.`,
    citation: "La patience est une lumière.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par Muslim",
    questions: [
      "Hikma dit que le Ramadan crée l'espace mais n'impose pas ce que l'âme doit faire. Tu comprends ?",
      "Si tu avais à choisir quelque chose que ton âme apprend ce Ramadan, ce serait quoi ?",
      "Un peu en trente jours imaginez en trente ans. Qu'est-ce que ça veut dire ?",
    ],
    defi: "Cette semaine, décidez quelque chose que vous voulez que votre âme apprenne. Et faites une petite chose dans ce sens chaque jour. Un peu à la fois.",
  },

  "animaux-respect-des-parents-aid-el-fitr-1": {
    titre: "et ce que Safran vit",
    texte: `Le matin de l'Aïd, Safran trouva [PRENOM]
dans le jardin, encore en pyjama.

Il était 6h du matin.

Et maman était déjà dans la cuisine depuis une heure.

Safran dit :

Tu sais ce que fait ta maman depuis 5h du matin ?

[PRENOM] haussa les épaules.

Elle prépare.

Pour qui ?

Pour nous.

Safran le regarda.

Pour toi. Pour ton père. Pour que quand vous
vous réveillerez, tout soit beau, tout soit prêt,
tout soit parfait.

[PRENOM] regarda la cuisine par la fenêtre.
La lumière allumée. La silhouette de maman
qui s'activait.

Depuis 5h du matin.

Le paradis est sous les pieds des mères.

Depuis combien d'années elle fait ça ?

Depuis ta naissance, dit Safran.
Chaque matin. Chaque Aïd. Chaque matin d'école.
Chaque matin ordinaire.

[PRENOM] resta silencieux.

Puis il rentra dans la maison.

Il alla dans la cuisine.

Maman se retourna, surprise.

T'es réveillé si tôt ?

Oui. Je voulais être là avec toi.

Maman le regarda.

Il s'assit sur le tabouret de la cuisine.
Et resta là pendant qu'elle préparait.

Il ne fit pas grand-chose.
Juste être là.

Et maman dit, sans le regarder,
comme si elle se parlait à elle-même :

C'est le plus beau matin de l'Aïd.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Safran dit que maman fait ça depuis ta naissance. Tu l'avais réalisé ?",
      "[PRENOM] ne fait pas grand-chose. Juste être là. Pourquoi c'était suffisant pour maman ?",
      "Tu sais ce que tes parents font pour toi avant que tu te réveilles ?",
    ],
    defi: "Demain matin, lève-toi avant tes parents. Et quand ils arrivent, dis-leur bonjour en souriant. Rien de plus. Juste être là.",
  },

  "animaux-respect-des-parents-aid-el-fitr-2": {
    titre: "et la journée pour maman",
    texte: `Le matin de l'Aïd, Yasmine dit aux deux soeurs :

Les oiseaux femelles se lèvent avant le soleil.
Chaque matin. Pour préparer le nid.
Pour trouver à manger. Pour surveiller les petits.

Comme maman, dit [PRENOM1].

Exactement comme votre maman.

Et les oisillons ? dit [PRENOM2].

Les oisillons grandissent. Certains l'oublient.
D'autres se souviennent.

Et les meilleurs, dit Yasmine, restent
à côté de leur maman un peu plus longtemps
que nécessaire.

Le paradis est sous les pieds des mères.

Les deux soeurs regardèrent la cuisine.
Maman s'activait.

Depuis combien d'années ? dit [PRENOM1].

Depuis votre naissance, dit Yasmine.

Ce matin-là, les deux soeurs firent quelque chose
de simple.

Elles entrèrent dans la cuisine et dirent :

On aide.

Maman les regarda.

Vous n'avez pas besoin.

On sait, dit [PRENOM1].
On veut.

Elles aidèrent. En silence. En suivant les gestes
de maman. En apprenant.

À la fin du petit-déjeuner, maman dit :

Vous savez ce que vous venez d'apprendre ?

À cuisiner ? dit [PRENOM2].

Non. À être là pour quelqu'un
qui est toujours là pour vous.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Yasmine dit que les meilleurs oisillons restent à côté de leur maman un peu plus longtemps. Tu comprends ce message ?",
      "Maman dit qu'elles ont appris à être là pour quelqu'un qui est toujours là pour elles. C'est quoi cette leçon ?",
      "Vous aidez maman parce qu'elle vous le demande ou parce que vous choisissez de le faire ?",
    ],
    defi: "Cette semaine, entrez dans la cuisine et dites on aide sans qu'on vous le demande. Et suivez les gestes de maman. Apprenez.",
  },

  "animaux-respect-des-parents-aid-el-adha-1": {
    titre: "et Ibrahim qui respectait",
    texte: `L'Aïd el-Adha. Hakim dit à [PRENOM] :

Tu sais qu'Ibrahim respectait son père
même quand ils n'étaient pas d'accord ?

Oui.

Vraiment ? dit Hakim. Ou tu sais les mots
mais pas ce que ça veut dire ?

[PRENOM] s'arrêta.

Dis-moi.

Ibrahim aimait son père. Son père ne croyait pas
comme Ibrahim croyait. Ils n'étaient pas d'accord
sur l'essentiel.

Et Ibrahim a quand même parlé avec douceur.
Il a quand même prié pour lui.
Il a quand même cherché à comprendre
pourquoi son père voyait les choses différemment.

Ton Seigneur a décrété que vous traitiez
vos parents avec bonté.

[PRENOM] pensa à ses propres désaccords
avec ses parents.

Ceux qui semblaient petits mais qui faisaient
monter la voix. Qui faisaient soupirer.
Qui faisaient croiser les bras.

C'est difficile d'être doux quand on est
en désaccord, dit-il.

Oui, dit Hakim. C'est pour ça que c'est
le test du respect vrai.

N'importe qui peut être respectueux
avec quelqu'un qui pense comme lui.

Le vrai respect c'est être doux avec quelqu'un
qui pense différemment.

Et tu aimes quand même.`,
    citation: "Ton Seigneur a décrété que vous traitiez vos parents avec bonté.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Hakim dit que le vrai respect c'est être doux avec quelqu'un qui pense différemment. Tu es d'accord ?",
      "Comment Ibrahim a-t-il montré son respect malgré le désaccord ?",
      "Tu arrives à parler avec douceur à tes parents quand vous n'êtes pas d'accord ?",
    ],
    defi: "Cette semaine, s'il y a un désaccord avec tes parents, parle avec douceur. Même si tu n'es pas d'accord. Et écoute vraiment leur point de vue.",
  },

  "animaux-respect-des-parents-aid-el-adha-2": {
    titre: "et la prière des deux soeurs",
    texte: `L'Aïd el-Adha. Yasmine dit aux deux soeurs :

Ibrahim priait pour sa famille.
Pour ceux qui étaient là et pour ceux
qui viendraient après.

Et vous ? dit-elle. Vous priez pour
vos parents ?

[PRENOM1] et [PRENOM2] se regardèrent.

Pas vraiment, admit [PRENOM1].

On prie pour les contrôles, dit [PRENOM2].
Pour les choses qu'on veut.

La satisfaction d'Allah est dans la satisfaction
des parents.

Ce soir-là, avant de dormir, les deux soeurs
décidèrent d'essayer.

Elles prièrent pour maman et papa.
Ensemble. À voix haute.

Ya Allah, garde maman et papa.
Ya Allah, rends-les heureux.
Ya Allah, récompense-les pour nous.

En finissant, [PRENOM2] dit :

C'était étrange.

Pourquoi ?

Je pensais à eux vraiment. Pas juste en passant.
À ce qu'ils traversent. À ce qui leur fait peur.
À ce qui les fatigue.

Je les voyais comme des gens, dit [PRENOM1].

Pas juste comme nos parents.

Comme des gens qui ont leurs propres luttes,
dit [PRENOM2].

Yasmine dit depuis la fenêtre :

Bienvenue dans le vrai respect.
Voir ses parents comme des êtres humains
entiers. Pas juste comme des parents.

C'est différent, dit [PRENOM1].

Tout change quand on voit vraiment.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Voir ses parents comme des gens pas juste comme des parents. C'est quoi cette différence ?",
      "Prier pour eux a aidé les deux soeurs à les voir différemment. Comment ?",
      "Tu vois tes parents comme des gens avec leurs propres luttes ?",
    ],
    defi: "Cette semaine, priez pour vos parents. Et pendant que vous priez, pensez vraiment à eux. À ce qui les fatigue. À ce qui les rend heureux. À ce qu'ils traversent.",
  },

  "animaux-respect-des-parents-ramadan-1": {
    titre: "et le s'hour de Safran",
    texte: `Pendant le Ramadan, Safran dit à [PRENOM] :

Ta maman se lève à 4h du matin pendant un mois.
Pour préparer le s'hour. Chaque nuit. Sans exception.

Je sais, dit [PRENOM].

Tu sais ou tu l'as réalisé ?

[PRENOM] réfléchit.

Je sais les mots. Mais je l'ai pas vraiment réalisé.

Safran hocha la tête.

Il y a une différence entre savoir quelque chose
et le réaliser vraiment dans sa chair.

Le paradis est sous les pieds des mères.

Comment je réalise vraiment ? dit [PRENOM].

Tu te lèves à 4h avec elle. Une seule fois.
Et tu l'aides.

[PRENOM] pensa à son lit chaud. À son sommeil.

4h c'est tôt.

Je sais, dit Safran.

Un long silence.

Le lendemain matin, [PRENOM] se leva à 4h.

Il descendit.

Maman était dans la cuisine. Elle l'entendit arriver.
Se retourna. Le regarda.

Qu'est-ce que tu fais debout ?

Je voulais être là. Je voulais voir ce que tu fais.

Maman ne dit rien pendant un moment.

Puis elle lui mit un tablier.

Viens, je vais t'apprendre.

Ce fut la nuit la plus longue et la plus
précieuse de [PRENOM].

Et il réalisa quelque chose que les mots
ne lui avaient jamais dit.`,
    citation: "Le paradis est sous les pieds des mères.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par An-Nasa'i",
    questions: [
      "Safran dit qu'il y a une différence entre savoir et réaliser vraiment. Tu comprends cette différence ?",
      "Qu'a réalisé [PRENOM] cette nuit-là que les mots ne lui avaient jamais dit ?",
      "Tu as déjà fait quelque chose qui t'a aidé à réaliser quelque chose que tu savais déjà ?",
    ],
    defi: "Cette semaine, fais une chose qui va te permettre de réaliser vraiment ce que tes parents font pour toi. Une seule chose. Mais fais-la.",
  },

  "animaux-respect-des-parents-ramadan-2": {
    titre: "et ce que Yasmine enseigna",
    texte: `Pendant le Ramadan, Yasmine dit quelque chose
de simple aux deux soeurs.

Dans la forêt, les oisillons qui ont grandi
font quelque chose de particulier pendant
les saisons difficiles.

Ils restent près de leurs parents plus longtemps.
Ils les aident à trouver à manger.
Ils renforcent le nid ensemble.

Le Ramadan c'est une saison difficile
pour vos parents. Ils jeûnent. Ils travaillent.
Ils prient la nuit.

Et vous, qu'est-ce que vous faites ?

La satisfaction d'Allah est dans la satisfaction
des parents.

Les deux soeurs se regardèrent.

On mange leur s'hour qu'ils préparent,
dit [PRENOM1].

Et on se rendort pendant qu'ils restent debout,
dit [PRENOM2].

Yasmine ne dit rien.

Ce soir-là, sans se concerter, chacune fit
quelque chose pour maman.

[PRENOM1] rangea la cuisine après l'iftar.

[PRENOM2] prépara la table du s'hour avant
d'aller dormir.

Le lendemain matin, maman dit :

Qui a préparé la table ?

[PRENOM2] leva la main.

Et qui a rangé la cuisine hier soir ?

[PRENOM1] leva la main.

Maman les regarda.

Vous grandissez bien, dit-elle.

C'était tout. Mais ça dit tout.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Yasmine dit que les oisillons restent plus longtemps pendant les saisons difficiles. Tu comprends le message ?",
      "Vous grandissez bien dit maman. C'est quoi vraiment grandir bien selon vous ?",
      "Vous aidez vos parents plus pendant les moments difficiles ?",
    ],
    defi: "Pendant une semaine, faites chacune quelque chose pour maman chaque jour du Ramadan. Sans qu'elle demande. Et observez si elle dit vous grandissez bien.",
  },

  "animaux-respect-des-parents-anniversaire-1": {
    titre: "et le cadeau de Safran pour maman",
    texte: `Pour l'anniversaire de maman, [PRENOM]
demanda à Safran :

Quel cadeau on peut offrir à quelqu'un
qui donne tout depuis des années ?

Safran réfléchit sérieusement.

Dans la forêt, quand une mère animale a bien
élevé ses petits, les petits lui construisent
quelque chose.

Quoi ?

Un endroit de repos. Un coin sûr. Un abri
où elle peut se reposer sans surveillance.
Un geste qui dit : maintenant c'est nous
qui veillons sur toi.

[PRENOM] ne pouvait pas construire un abri.

Mais il pouvait construire quelque chose
avec des mots.

Ton Seigneur a décrété que vous leur
disiez des paroles nobles.

Il passa une semaine à observer maman.
Vraiment observer.
Ce qu'elle faisait sans qu'on lui demande.
Ce qu'elle remarquait sans le dire.
Ce qu'elle portait seule.

Puis il écrivit tout ça dans une lettre.

Longue. Précise. Sincère.

Le soir de l'anniversaire, il lui lut.

Maman ne dit rien pendant qu'il lisait.

À la fin, elle dit seulement :

Tu m'as vue.

Ces trois mots valaient tous les cadeaux.

Parce que c'est tout ce qu'on veut vraiment.
Être vu vraiment par ceux qu'on aime.`,
    citation: "Ton Seigneur a décrété que vous leur disiez des paroles nobles.",
    source: "Coran, Sourate Al-Isra, verset 23",
    questions: [
      "Maman dit tu m'as vue. C'est quoi voir quelqu'un vraiment ?",
      "Safran dit les petits construisent un endroit de repos. [PRENOM] a construit quoi avec des mots ?",
      "Tu vois vraiment tes parents ou tu les vois sans les voir ?",
    ],
    defi: "Cette semaine, observe vraiment un de tes parents. Note cinq choses qu'il fait sans qu'on lui demande. Et dis-lui une de ces choses.",
  },

  "animaux-respect-des-parents-anniversaire-2": {
    titre: "et ce que les hirondelles font",
    texte: `Pour l'anniversaire de papa, Yasmine dit
aux deux soeurs :

Vous savez ce que font les hirondelles
quand leurs parents vieillissent ?

Non.

Elles ne partent plus loin. Elles restent
dans le territoire familier.
Elles apportent de la nourriture.
Elles sont là.

La satisfaction d'Allah est dans la satisfaction
des parents.

Les deux soeurs passèrent toute la journée
d'anniversaire de papa avec lui.

Sans leurs téléphones. Sans leurs amies.
Sans leurs activités habituelles.

Juste là.

Papa ne comprit pas au début.

Vous avez rien de prévu aujourd'hui ?

Non, dit [PRENOM1]. On est là avec toi.

Pourquoi ?

[PRENOM2] réfléchit à comment dire.

Parce que les hirondelles restent,
dit-elle finalement.

Papa la regarda.

Les hirondelles ?

C'est Yasmine qui nous a dit, dit [PRENOM1].

Papa ne savait pas qui était Yasmine.
Mais il comprit le message.

Ils passèrent la journée ensemble.
À parler. À jouer. À ne rien faire de particulier.

Le soir, papa dit :

C'est le meilleur anniversaire depuis longtemps.

Pas à cause de ce qu'ils avaient fait.
Mais à cause de ce qu'ils n'avaient pas fait.

Ils n'étaient pas partis ailleurs.

Ils étaient restés.`,
    citation: "La satisfaction d'Allah est dans la satisfaction des parents.",
    source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
    questions: [
      "Les hirondelles restent dans le territoire familial. C'est quoi ce message pour les enfants ?",
      "Le meilleur anniversaire pas à cause de ce qu'ils ont fait mais de ce qu'ils n'ont pas fait. Tu comprends ?",
      "Vous passez du temps avec vos parents sans rien faire de particulier ?",
    ],
    defi: "Pour le prochain anniversaire de vos parents, restez. Toute la journée. Sans téléphone. Sans ailleurs. Juste là. Et observez si c'est le meilleur anniversaire.",
  },
};

STORIES["princesse-courage-dys"] = {
  titre: "et les lettres qui dansaient",
  texte: `Il était une fois une petite princesse
prénommée [PRENOM] qui voyait les lettres danser.

Pas comme dans un spectacle. Pas comme quelque
chose de beau. Les lettres bougeaient, se
retournaient, changeaient de place quand elle
essayait de les lire. Le b devenait d.
Le p devenait q. Les mots se mélangeaient
comme si quelqu'un les avait mis dans un sac
et secoué très fort.

À l'école, les autres lisaient. [PRENOM] regardait
la page et attendait que les lettres se posent.

Parfois elles se posaient. Le plus souvent non.

La maîtresse était gentille. Mais il y avait
ce moment, chaque matin, quand elle demandait
à quelqu'un de lire à voix haute, et que [PRENOM]
baissait les yeux vers son cahier et priait
tout bas.

Ya Allah, pas moi.

Un soir, elle dit à maman :

Je suis cassée.

Maman posa ce qu'elle tenait.

Qui t'a dit ça ?

Personne. Mais tout le monde lit sauf moi.
Donc je suis cassée.

Maman s'assit à côté d'elle.

Tu sais comment le Prophète ﷺ a reçu
la révélation ?

Oui. L'ange Jibrîl est venu.

Et qu'est-ce que Jibrîl lui a dit en premier ?

Iqra. Lis.

Et le Prophète ﷺ, est-ce qu'il savait lire ?

[PRENOM] réfléchit.

Non. Il était illettré.

Le plus grand des prophètes. Celui à qui Allah
a révélé le Coran. Ne savait pas lire.

Silence.

Et alors il était cassé ? dit maman doucement.

[PRENOM] regarda ses mains.

Non. Mais c'est pas pareil. Le Prophète ﷺ
c'était une sagesse d'Allah. Moi j'ai juste
un problème.

Ou, dit maman, Allah t'a créée avec un cerveau
qui fonctionne autrement. Pas moins bien.
Autrement.

Elle prit les mains de [PRENOM] dans les siennes.

Tu sais ce que tu fais mieux que n'importe
qui dans ta classe ?

Quoi ?

Tu retiens les histoires qu'on te raconte.
Mot pour mot. Depuis que tu as trois ans.
Tu dessines des choses que tu imagines
dans ta tête d'une façon que personne d'autre
dans ta classe ne peut faire. Et tu sens quand
quelqu'un est triste avant qu'il le dise.

[PRENOM] ne répondit pas.

Ces choses-là aussi viennent d'Allah, dit maman.
Il t'a donné des dons que les autres n'ont pas.
Et Il t'a donné un défi que les autres n'ont pas.
Ce n'est pas une cassure. C'est ton chemin à toi.

Allah ne charge aucune âme au-delà de
sa capacité.

[PRENOM] pensa à cette phrase.

Au-delà de sa capacité.

Ça voulait dire qu'Allah savait exactement
ce que [PRENOM] pouvait porter. Qu'Il ne lui
avait pas donné quelque chose de trop lourd.

Que les lettres qui dansaient n'étaient pas
une erreur.

Juste une autre façon d'être au monde.

Le lendemain matin, quand la maîtresse demanda
qui voulait lire, [PRENOM] ne baissa pas les yeux.

Elle leva la main.

Elle lut lentement. Avec ses doigts qui suivaient
les mots. Avec des pauses quand les lettres
dansaient trop.

Elle lut jusqu'au bout.

Et la maîtresse dit : Bravo [PRENOM].

Ce n'étaient que deux mots. Mais ils avaient
le goût de quelque chose de grand.`,
  citation: "Allah ne charge aucune âme au-delà de sa capacité.",
  source: "Coran, Sourate Al-Baqara, verset 286",
  questions: [
    "Pourquoi [PRENOM] pensait-elle qu'elle était cassée ? Est-ce que tu comprends ce sentiment ?",
    "Maman dit qu'Allah lui a donné des dons ET un défi. Quels sont les dons de [PRENOM] ?",
    "Le Prophète ﷺ ne savait pas lire. Est-ce que ça change quelque chose dans ta façon de voir ta difficulté ?",
  ],
  defi: "Cette semaine, quand quelque chose est difficile à cause de ta façon de lire ou d'apprendre, dis-toi : mon cerveau fonctionne autrement. Pas moins bien. Et cherche la façon qui marche pour toi.",
};

STORIES["super-heros-patience-dys"] = {
  titre: "et les chiffres qui ne voulaient pas rester",
  texte: `Il était une fois un petit garçon prénommé
[PRENOM] dont le super-pouvoir était de ne jamais
oublier un visage.

Il reconnaissait tout le monde. Dans le quartier,
à l'école, à la mosquée. Il savait les noms,
les histoires, les petites habitudes.
Il voyait les gens vraiment.

Mais les chiffres, eux, refusaient de rentrer
dans sa tête.

Pas juste les calculs compliqués. Les additions
simples. Les tables de multiplication.
Même les heures sur l'horloge lui demandaient
un effort immense.

À l'école, pendant les cours de maths, [PRENOM]
se sentait comme quelqu'un qui essaie de tenir
de l'eau dans ses mains. Les chiffres glissaient.

Un soir, papy lui demanda de compter la monnaie
pour payer le boulanger.

[PRENOM] essaya. Les pièces se mélangeaient
dans sa tête.

Il rendit les pièces à papy.

Je sais pas. Je suis nul en chiffres.

Papy les paya lui-même. Puis il s'assit avec
[PRENOM] sur le banc dehors.

Tu sais ce que le Prophète ﷺ a dit sur
la difficulté ?

Que Allah ne charge pas une âme au-delà
de sa capacité ?

Oui. Mais il a dit autre chose aussi.

Papy prit son temps.

Il a dit que la récompense est à la mesure
de l'épreuve. Que plus quelque chose est difficile
pour toi, plus l'effort que tu y mets a de valeur.

[PRENOM] regarda ses mains.

Donc parce que les maths c'est hyper dur pour moi,
le fait que j'essaie quand même...

Vaut dix fois plus que le même effort fait par
quelqu'un pour qui c'est facile.

La récompense est à la mesure de l'épreuve.

[PRENOM] pensa à ça.

Mais je réussis pas quand même.

Pas encore, dit papy. Et peut-être que tu n'auras
jamais les mêmes résultats que ceux pour qui
c'est facile. Mais Allah ne juge pas les résultats.
Il juge l'effort et l'intention.

Tu crois qu'Il voit quand j'essaie ?

Il voit tout, dit papy. Chaque fois que tu te forces
à compter alors que les chiffres glissent.
Chaque fois que tu recommences. Il voit.

[PRENOM] rentra chez lui.

Le lendemain soir, il ouvrit son cahier de maths.

Les chiffres glissèrent encore. Il recommença.

Il n'y arriva pas parfaitement.

Mais il y arriva un peu mieux qu'avant.

Et quelque part, il sut qu'Allah avait vu.`,
  citation: "La récompense est à la mesure de l'épreuve.",
  source: "Le Prophète Muhammad ﷺ • Rapporté par At-Tirmidhi",
  questions: [
    "Papy dit que l'effort de [PRENOM] vaut dix fois plus. Tu comprends pourquoi ?",
    "Allah voit l'effort pas le résultat. Est-ce que ça change ta façon de voir tes difficultés ?",
    "Qu'est-ce que toi tu fais facilement que d'autres trouvent difficile ?",
  ],
  defi: "Cette semaine, quand quelque chose ne rentre pas dans ta tête aussi vite que tu veux, dis-toi : mon effort vaut plus parce que c'est plus difficile pour moi. Et continue.",
};

STORIES["animaux-generosite-dys"] = {
  titre: "et les mains qui prenaient du temps",
  texte: `Il était une fois un enfant prénommé [PRENOM]
dont les mains et le corps ne faisaient pas
toujours ce que la tête voulait.

Pas par mauvaise volonté. La tête demandait.
Le corps prenait plus de temps à répondre.

[PRENOM] renversait les verres plus souvent
que les autres. Son écriture prenait plus de place
et de temps. Les boutons de veste étaient une
épreuve. Les lacets, une autre.

Et il y avait des jours où les autres enfants
riaient. Pas méchamment toujours. Juste parce
qu'ils ne comprenaient pas.

Un matin au jardin, Safran le renard dit
à [PRENOM] :

Tu sais ce qui m'a pris le plus de temps
à apprendre dans ma vie ?

Non.

Chasser. Les autres renards apprenaient vite.
Moi j'avais du mal à coordonner mes pattes.
Je ratais ma proie. Encore et encore.

[PRENOM] le regarda.

Et tu as appris finalement ?

Oui. Différemment des autres. Plus lentement.
Avec mes propres stratégies.

Comment tu as pas abandonné ?

Safran réfléchit.

Parce que j'ai compris quelque chose.
Que mes pattes n'étaient pas mes ennemies.
Qu'elles avaient juste besoin de plus de temps
et d'une façon à elles.

Allah est doux et Il aime la douceur
en toutes choses.

Le Prophète ﷺ a dit qu'Allah aime la douceur,
dit [PRENOM] doucement. Est-ce que ça veut dire
qu'on doit être doux avec ses propres mains ?

Avec son corps entier, dit Safran.
Avec soi-même.

[PRENOM] regarda ses mains.

Ces mains qui prenaient plus de temps.
Ces mains qui renversaient.
Ces mains qui essayaient.

Il pensa à tout ce que ces mains faisaient
malgré tout.

Elles dessinaient. Des dessins que personne d'autre
ne pouvait dessiner pareil.

Elles pétrissaient la pâte avec grand-mère
le dimanche.

Elles tenaient les mains des plus petits
pour les rassurer.

Ces mains-là étaient les siennes. Créées par Allah.
Exactement comme elles étaient.

Safran, dit-il. Tu crois qu'Allah a fait exprès ?

Je ne sais pas, dit Safran. Mais je sais qu'Il ne
fait rien par erreur.

[PRENOM] sourit.

Ce n'était pas une réponse parfaite.

Mais c'était la bonne.`,
  citation: "Allah est doux et Il aime la douceur en toutes choses.",
  source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
  questions: [
    "Safran dit que ses pattes avaient juste besoin de plus de temps et d'une façon à elles. Tu reconnais ça ?",
    "Allah aime la douceur. Est-ce que tu es doux avec toi-même quand quelque chose est difficile ?",
    "Qu'est-ce que tes mains ou ton corps font bien, même si certaines choses sont difficiles ?",
  ],
  defi: "Cette semaine, sois doux avec toi-même quand quelque chose prend plus de temps. Dis-toi : j'ai ma façon à moi. Et c'est suffisant.",
};

STORIES["super-heros-courage-tdah"] = {
  titre: "et le cerveau qui courait trop vite",
  texte: `Il était une fois un petit garçon prénommé
[PRENOM] dont le cerveau courait toujours plus
vite que le reste du monde.

Pas un peu plus vite. Beaucoup plus vite.

Pendant que la maîtresse expliquait une chose,
le cerveau de [PRENOM] avait déjà pensé
à dix autres. Pendant l'histoire du soir,
il pensait à ce qu'il ferait demain. Pendant
le repas, ses jambes bougeaient sous la table
même quand il essayait de les arrêter.

Tu ne peux pas rester en place, disaient
les adultes.

Tu ne te concentres pas, disait la maîtresse.

Tu écoutes quand on te parle ? disait papa.

[PRENOM] entendait tout ça. Et il essayait.
Vraiment. De toutes ses forces. Mais c'était
comme essayer de tenir un torrent entre
ses mains.

Un soir, papy lui parla d'une chose que
[PRENOM] ne connaissait pas.

Tu sais, dit papy, le Prophète ﷺ avait parmi
ses compagnons des gens très différents.
Certains étaient calmes et posés. D'autres
étaient fougueux, rapides, toujours en mouvement.

Lesquels ?

Khalid ibn al-Walid. Le général le plus brillant
de l'islam. Il ne pouvait pas rester assis.
Il avait besoin d'agir, de bouger, de faire.
Son énergie était immense. Difficile à contenir.

[PRENOM] écouta.

Et il était bien ?

Il était exceptionnel. Parce qu'il a trouvé
où mettre son énergie. Là où elle faisait du bien.
Le Prophète ﷺ l'appelait l'épée d'Allah
déjà dégainée.

Mon énergie à moi, dit [PRENOM],
elle sert à quoi ?

C'est la question la plus importante, dit papy.
Pas : pourquoi je suis comme ça. Mais : à quoi
ça sert, ce que j'ai ?

[PRENOM] pensa à ça.

Il y avait des choses que son cerveau qui courait
faisait vraiment bien.

Trouver des solutions que les autres ne voyaient pas.
Réagir vite dans les situations d'urgence.
Penser à plusieurs choses en même temps.

C'est pas un défaut, dit papy. C'est une énergie.
Et les énergies, ça se dirige.
Ça ne se détruit pas.

[PRENOM] se leva du canapé.

Il alla dans sa chambre.

Il prit sa cape rouge.

Il la mit.

Et il décida que ce soir-là, il allait diriger
son énergie vers quelque chose.

Ranger sa chambre. Le plus vite possible.
En un temps record. Comme une mission.

Il le fit en sept minutes.

Sa chambre n'avait jamais été aussi rangée.`,
  citation: "Chaque chose a sa place et chaque personne a sa mission.",
  source: "Sagesse islamique",
  questions: [
    "Khalid ibn al-Walid avait une énergie immense et il est devenu exceptionnel. Qu'est-ce que ça t'inspire ?",
    "Papy dit que les énergies se dirigent elles ne se détruisent pas. Tu comprends ?",
    "À quoi ton énergie sert-elle quand elle est bien dirigée ?",
  ],
  defi: "Cette semaine, trouve une activité où ton énergie est un avantage. Le sport, aider quelqu'un rapidement, résoudre un problème en vitesse. Et dis-toi : mon énergie vient d'Allah. Elle a un but.",
};

STORIES["licorne-patience-tdah"] = {
  titre: "et la licorne qui ne tenait pas en place",
  texte: `Il était une fois une petite fille prénommée
[PRENOM] dont la licorne s'appelait Barq,
ce qui veut dire éclair en arabe.

Barq ne ressemblait pas aux autres licornes.

Elle bougeait tout le temps. Ses crins
s'agitaient même quand il n'y avait pas de vent.
Ses sabots tapotaient le sol. Elle regardait
partout à la fois, attirée par chaque bruit,
chaque mouvement, chaque nouveauté.

Ta licorne est bizarre, dit un jour une cousine.

Non, dit [PRENOM]. Elle est comme moi.

C'était vrai.

[PRENOM] et Barq se comprenaient parfaitement.
Parce qu'elles fonctionnaient pareil.

Un jour, [PRENOM] demanda à Barq :

Est-ce qu'on est normales ?

Barq s'arrêta de bouger une seconde.
Ce qui était déjà beaucoup pour elle.

Qu'est-ce que ça veut dire normale ?

Comme les autres. Qui restent en place.
Qui écoutent sans que leur tête parte ailleurs.

Barq réfléchit.

Le vent reste en place, lui ? La rivière ?
Les étoiles filantes ?

Non.

Et pourtant ils sont nécessaires.
Importants. Beaux même.

Allah a créé chaque chose dans sa perfection.

[PRENOM] pensa à ça.

Mais c'est difficile, dit-elle. Quand les adultes
me disent de me calmer. Quand je rate des choses
parce que ma tête est partie ailleurs.

Je sais, dit Barq. C'est difficile pour moi aussi.
Il y a des moments où je veux rester tranquille
et je n'y arrive pas.

Et tu fais quoi ?

Je trouve les moments où bouger est permis.
Voulu. Utile. Et pendant ces moments-là,
je donne tout. Et les autres moments, j'apprends
petit à petit à tenir un peu plus longtemps
que la fois d'avant.

Un peu plus longtemps.

Pas parfaitement. Un peu plus.
C'est suffisant.

[PRENOM] regarda Barq.

Ses crins s'agitaient. Ses sabots tapotaient.

Mais ses yeux étaient posés sur [PRENOM].
Présents. Vraiment là.

Tu arrives à être là quand ça compte,
dit [PRENOM].

Toi aussi, dit Barq. Quand quelqu'un a besoin
de toi, tu es là. Vraiment là.
Mieux que beaucoup.

Oui.

C'est ça qui compte, dit Barq.`,
  citation: "Allah a créé chaque chose dans sa perfection.",
  source: "Coran, Sourate As-Sajda, verset 7",
  questions: [
    "Barq demande si le vent reste en place. Qu'est-ce qu'elle veut dire ?",
    "Un peu plus longtemps que la fois d'avant. C'est quoi ce progrès spécial ?",
    "Quand est-ce que [PRENOM] est vraiment présente et vraiment là ?",
  ],
  defi: "Cette semaine, trouve un moment où tu restes concentré un peu plus longtemps que d'habitude. Même deux minutes de plus. Et dis-toi : je progresse à ma façon.",
};

STORIES["animaux-partage-tdah"] = {
  titre: "et l'énergie qui débordait partout",
  texte: `Il était une fois un enfant prénommé [PRENOM]
dont l'énergie débordait dans toutes les directions.

Le matin, elle débordait à la maison.
À l'école, elle débordait dans la classe.
Dans le quartier, elle débordait partout.

[PRENOM] courait, criait, riait, s'agitait.

Safran le renard dit un jour à [PRENOM] :

Tu as beaucoup d'énergie.

Trop, dit [PRENOM].

Non. Beaucoup. La différence est importante.

Quelle différence ?

Trop veut dire qu'il y en a plus qu'il ne faut.
Beaucoup veut dire qu'il y en a plus qu'on
n'en utilise bien.

[PRENOM] réfléchit.

Et comment on l'utilise bien ?

Safran le regarda.

Tu vois les enfants là-bas qui n'arrivent pas
à porter leurs sacs parce qu'ils sont trop lourds ?

[PRENOM] regarda. Il y avait deux petits du
quartier qui rentraient de l'école, les épaules
basses sous des sacs trop lourds.

Oui.

Va.

[PRENOM] courut. Parce qu'il courait toujours.
Et il prit les sacs des deux petits et les porta
jusqu'à leurs maisons.

Il revenait vers Safran quand il croisa une vieille
dame avec ses courses. Il porta ses courses.

En rentrant, il vit maman qui essayait de déplacer
une table lourde. Il la poussa.

Ce soir-là, papa lui dit :

Tu as aidé cinq personnes aujourd'hui.

J'avais de l'énergie à dépenser.

Papa sourit.

Le meilleur d'entre vous est celui qui est
le meilleur envers les autres.

Tu sais ce que le Prophète ﷺ a dit ?
Le meilleur d'entre vous est celui qui rend
service aux autres.

Donc mon énergie peut me rendre meilleur ?

Ton énergie bien dirigée, dit papa, est un cadeau
pour les gens autour de toi.

[PRENOM] pensa à ça.

Pas un problème. Un cadeau.

Juste un cadeau qu'il fallait apprendre
à offrir dans la bonne direction.`,
  citation: "Le meilleur d'entre vous est celui qui est le meilleur envers les autres.",
  source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari",
  questions: [
    "Safran dit la différence entre trop et beaucoup. Tu comprends cette nuance ?",
    "Comment [PRENOM] a-t-il transformé son énergie en quelque chose d'utile ?",
    "Ton énergie à toi, elle pourrait aider qui cette semaine ?",
  ],
  defi: "Cette semaine, dirige ton énergie vers aider quelqu'un. Chaque fois que tu sens l'énergie déborder, cherche quelqu'un à qui elle peut servir.",
};

STORIES["licorne-courage-tsa"] = {
  titre: "et le monde qui faisait trop de bruit",
  texte: `Il était une fois une petite fille prénommée
[PRENOM] qui entendait le monde différemment.

Les sons qui ne dérangeaient pas les autres
pouvaient être insupportables pour [PRENOM].
Le bourdonnement d'une lumière. La musique
dans un magasin. Les voix qui se mélangent
dans une grande salle.

Parfois le monde était trop fort.
Trop plein. Trop de tout en même temps.

Et [PRENOM] avait besoin de se retirer.
Dans sa chambre, dans un coin calme,
dans sa tête.

Les gens ne comprenaient pas toujours.

Pourquoi tu pars ?

Pourquoi tu mets tes mains sur tes oreilles ?

Pourquoi tu n'aimes pas les fêtes ?

Sa licorne Nour était la seule qui comprenait
sans qu'on lui explique.

Un jour, [PRENOM] dit à Nour :

Pourquoi je suis comme ça ? Pourquoi le monde
est trop fort pour moi ?

Nour réfléchit longuement.

Tu connais l'histoire de Moussa et du buisson
ardent ?

Oui. Allah lui a parlé depuis un buisson
qui brûlait.

Et qu'est-ce qu'Allah a dit à Moussa ?

Il lui a dit de retirer ses sandales parce
qu'il était sur une terre sacrée.

Parce que cet endroit était différent.
Plus intense. La présence d'Allah y était
plus forte.

[PRENOM] écouta.

Certaines personnes, dit Nour doucement,
reçoivent le monde avec une intensité que
les autres ne ressentent pas. Comme si leurs
sens étaient sur une fréquence plus haute.
Plus fine. Plus précise.

Nous avons créé l'homme dans la plus belle
des formes.

Ce n'est pas une erreur, dit Nour.
C'est une façon d'être au monde qui demande
plus de soin. Un terrain différent.
Qui mérite qu'on retire ses sandales.

[PRENOM] pensa à ça.

Retirer ses sandales. Prendre soin du terrain.
Savoir quand on a besoin de calme.
Ce n'était pas de la faiblesse.
C'était respecter ce qu'elle était.

Et les moments où le bruit est trop fort ?
dit [PRENOM].

Ce sont des moments où tu as besoin de ta terre
calme, dit Nour. Comme Moussa avait besoin
de s'arrêter. Ton coin tranquille n'est pas
une fuite. C'est ton endroit sacré à toi.

[PRENOM] regarda sa chambre.

Ses livres rangés dans un ordre précis.
Sa lampe douce. Le silence.

Son endroit sacré.`,
  citation: "Nous avons créé l'homme dans la plus belle des formes.",
  source: "Coran, Sourate At-Tin, verset 4",
  questions: [
    "Nour dit que [PRENOM] reçoit le monde avec plus d'intensité. Est-ce que tu reconnais ça ?",
    "Ton coin tranquille n'est pas une fuite. Tu comprends cette différence ?",
    "Qu'est-ce que tu entends ou ressens que les autres ne remarquent peut-être pas ?",
  ],
  defi: "Cette semaine, crée ou reconnais ton endroit sacré. Et dis-toi qu'y aller quand tu en as besoin, c'est prendre soin de ce qu'Allah a créé en toi.",
};

STORIES["princesse-respect-de-soi-tsa"] = {
  titre: "et les règles qui avaient du sens",
  texte: `Il était une fois une petite princesse
prénommée [PRENOM] qui aimait les règles.

Pas n'importe quelles règles. Les règles qui
avaient du sens. Les règles qui étaient logiques.
Les règles qui, quand on les expliquait,
tenaient debout.

Ce que [PRENOM] aimait moins, c'étaient
les règles invisibles. Celles que tout le monde
semblait connaître sauf elle.

Pourquoi les gens se disent bonjour mais
ne s'arrêtent pas vraiment ?

Pourquoi on dit ça va quand ça ne va pas ?

Pourquoi il faut regarder quelqu'un dans les yeux
pour montrer qu'on écoute, alors qu'elle écoutait
mieux quand elle regardait ailleurs ?

Ces règles-là, [PRENOM] les apprenait.
Lentement. Soigneusement. Comme une langue
étrangère.

Mais il y avait des jours où c'était épuisant.

Grand-mère lui dit un soir :

Tu sais ce que j'admire chez toi ?

[PRENOM] la regarda.

Tu essaies de comprendre. Vraiment comprendre.
Pas juste faire semblant de comprendre.
Tu veux que les choses aient du sens.

Mais ça m'épuise.

Je sais, dit grand-mère. Apprendre une langue
étrangère c'est épuisant. Mais ça ne veut pas
dire que ta langue à toi est fausse.

Allah a créé chaque chose dans sa perfection.

[PRENOM] pensa à ça.

Sa façon de voir le monde, précise, logique,
cherchant toujours le sens derrière les choses,
c'était sa langue à elle.

Elle n'était pas fausse.

Elle était différente de la langue des autres.

Et apprendre à communiquer dans les deux langues
à la fois était un travail immense.

Un travail que très peu de gens comprenaient.

Tu es comme une ambassadrice, dit grand-mère.
Tu vis entre deux mondes et tu travailles
à les faire se comprendre.

C'est beaucoup, dit [PRENOM].

Oui, dit grand-mère. Et c'est magnifique.`,
  citation: "Allah a créé chaque chose dans sa perfection.",
  source: "Coran, Sourate As-Sajda, verset 7",
  questions: [
    "Grand-mère compare [PRENOM] à une ambassadrice entre deux mondes. Tu comprends cette image ?",
    "Ta façon de voir le monde n'est pas fausse, elle est différente. Est-ce que tu le crois ?",
    "Qu'est-ce que [PRENOM] comprend ou remarque que les autres ne remarquent pas ?",
  ],
  defi: "Cette semaine, donne-toi le droit de te reposer quand naviguer entre les deux mondes est épuisant. Et rappelle-toi : ta façon de voir est précieuse, pas fausse.",
};

STORIES["animaux-generosite-tsa"] = {
  titre: "et l'ami qui ne parlait pas comme tout le monde",
  texte: `Il était une fois un enfant prénommé [PRENOM]
dont l'ami préféré au jardin était Hikma la tortue.

Pas parce que Hikma était la plus drôle.
Ni la plus rapide.

Parce que Hikma comprenait quelque chose
d'important.

Que [PRENOM] n'avait pas toujours besoin de mots.

Ils pouvaient rester ensemble en silence.
Chacun dans ses pensées. Côte à côte.
Sans que le silence soit étrange.

Les autres animaux posaient parfois des questions
à [PRENOM] et trouvaient ses réponses surprenantes.

[PRENOM] répondait exactement ce qui lui semblait
juste. Pas ce qu'on attendait.
Pas de faux-semblants.

Un jour, un lapin demanda :

Tu vas bien ?

Non, dit [PRENOM]. J'ai mal au ventre
et je n'ai pas envie de parler.

Le lapin ne savait pas quoi répondre.

Safran dit ensuite à [PRENOM] :

Tu aurais pu juste dire oui.

Mais ce n'est pas vrai.

Je sais. Mais parfois les gens demandent
tu vas bien sans vraiment vouloir savoir.

[PRENOM] réfléchit à ça.

Alors pourquoi ils demandent ?

Pour montrer qu'ils pensent à toi.
Même sans vraiment vouloir les détails.

[PRENOM] trouva ça compliqué.

Le Prophète ﷺ était sincère, dit [PRENOM].
Il ne disait pas le contraire de ce qu'il pensait.

La sincérité guide vers la bonté.

C'est vrai, dit Safran. Et en même temps,
il était doux. Il savait quand dire la vérité
entière et quand dire la vérité suffisante.

La vérité suffisante ?

Assez de vérité pour ne pas mentir.
Assez de douceur pour ne pas blesser.

[PRENOM] pensa longtemps.

Je comprends pas encore.

Je sais, dit Safran. C'est une des choses
les plus difficiles. Et le fait que tu cherches
vraiment à comprendre, pas juste faire semblant,
c'est ce qui fait de toi quelqu'un d'honnête.

Hikma dit, depuis son coin :

L'honnêteté de [PRENOM] est un cadeau.
Elle dit ce qui est vrai. Même quand c'est
difficile. Dans un monde où beaucoup de gens
disent des demi-vérités, c'est rare.

[PRENOM] resta assis à côté de Hikma
un long moment.

En silence.

Et ce silence-là était beau.`,
  citation: "La sincérité guide vers la bonté.",
  source: "Le Prophète Muhammad ﷺ • Rapporté par Bukhari et Muslim",
  questions: [
    "[PRENOM] dit la vérité exacte même quand c'est surprenant. C'est une qualité ou un problème ?",
    "La vérité suffisante, assez vraie pour ne pas mentir, assez douce pour ne pas blesser. Tu comprends ?",
    "Hikma dit que l'honnêteté de [PRENOM] est rare et précieuse. Tu le crois ?",
  ],
  defi: "Cette semaine, rappelle-toi que ton honnêteté est un cadeau. Et quand une situation sociale est confuse, tu peux demander à quelqu'un de confiance : qu'est-ce que cette personne voulait vraiment dire ?",
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
 * @param {string} [profils]
 * @param {string} [precisions]
 * @returns {StoryEntry | null}
 */
export function getStory(
  univers,
  valeur,
  occasion,
  nbEnfants,
  prenom1 = "",
  prenom2 = "",
  profils = "",
  precisions = ""
) {
  const profilMap = {
    "dys (dyslexie, dyscalculie, dyspraxie...)": "dys",
    dys: "dys",
    tdah: "tdah",
    "autisme / tsa": "tsa",
    tsa: "tsa",
    "haut potentiel (hpi/hqi)": "hpi",
    hpi: "hpi",
    hqi: "hpi",
  };
  const profilsRaw = String(profils || "").toLowerCase();
  const profilsList = String(profils || "")
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const inferred = [];
  if (/\bdys\b/.test(profilsRaw) || profilsRaw.includes("dyslexie")) inferred.push("dys");
  if (/\btdah\b/.test(profilsRaw)) inferred.push("tdah");
  if (/\btsa\b/.test(profilsRaw) || profilsRaw.includes("autisme")) inferred.push("tsa");
  if (/\bhpi\b/.test(profilsRaw) || /\bhqi\b/.test(profilsRaw) || profilsRaw.includes("haut potentiel")) inferred.push("hpi");
  const allProfils = [...new Set([...profilsList, ...inferred])];

  for (const profil of allProfils) {
    const profilKey = profilMap[profil];
    if (!profilKey) continue;

    const neuroKeys = [
      `${normalize(univers)}-${normalize(valeur)}-${profilKey}`,
      `${segment(univers)}-${segment(valeur)}-${profilKey}`,
      `${normalize(univers)}-${profilKey}`,
      `${segment(univers)}-${profilKey}`,
    ];

    for (const neuroKey of neuroKeys) {
      const storyNeuro = STORIES[neuroKey];
      if (storyNeuro) {
        return {
          ...applyPrenomsToStory(storyNeuro, prenom1, prenom2),
          isNeuro: true,
          profil: profilKey,
          precisions: String(precisions || ""),
        };
      }
    }
  }

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

  return {
    ...applyPrenomsToStory(raw, prenom1, prenom2),
    isNeuro: false,
    profil: "",
    precisions: String(precisions || ""),
  };
}

/**
 * Comme getStory, mais retombe sur l'histoire par défaut si aucune entrée ne correspond.
 * @param {string} univers
 * @param {string} valeur
 * @param {string} occasion
 * @param {1|2} nbEnfants
 * @param {string} [prenom1]
 * @param {string} [prenom2]
 * @param {string} [profils]
 * @param {string} [precisions]
 * @returns {StoryEntry}
 */
export function getStoryOrDefault(
  univers,
  valeur,
  occasion,
  nbEnfants,
  prenom1 = "",
  prenom2 = "",
  profils = "",
  precisions = ""
) {
  const story = getStory(univers, valeur, occasion, nbEnfants, prenom1, prenom2, profils, precisions);
  if (story) return story;
  return {
    ...applyPrenomsToStory(DEFAULT_STORY, prenom1, prenom2),
    isNeuro: false,
    profil: "",
    precisions: String(precisions || ""),
  };
}

export default STORIES;
