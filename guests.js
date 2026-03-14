// ══════════════════════════════════════
// GUEST DATA — 15 invités + Nathan
// ══════════════════════════════════════

const GUESTS = [
    {
        name: "Émilie",
        pirateName: "Anne Bonny",
        joke: "Commande toujours un rhum... puis prend un Spritz.",
        ancestorDesc: "Anne Bonny, l'une des femmes pirates les plus redoutées des Caraïbes. Maniait le sabre et le sarcasme avec la même aisance.",
        characterPrompt: "This is a portrait of Anne Bonny, feared Caribbean pirate. Fierce direct gaze, defiant smirk daring the viewer. Crimson tricorn hat with gold trim, loose white linen blouse open at collar revealing sun-darkened skin, cutlass hilt at hip, single pearl earring. Warm golden Caribbean sunlight, ship deck railing behind her."
    },
    {
        name: "Cyril",
        pirateName: "Francis Drake",
        joke: "Fait le tour du monde mais oublie de ramener le pain.",
        ancestorDesc: "Sir Francis Drake, corsaire anglais, premier à faire le tour du monde pour la Couronne. Considéré héros en Angleterre, pirate en Espagne.",
        characterPrompt: "This is a portrait of Sir Francis Drake, English privateer and circumnavigator. Confident composed expression, chin raised with quiet arrogance. Elizabethan ruff collar, polished breastplate catching firelight, velvet doublet, officer's hat. A globe and nautical charts visible on the table beside him, candlelit cabin warmth."
    },
    {
        name: "Yann",
        pirateName: "Edward 'Blackbeard' Teach",
        joke: "Allume des mèches dans sa barbe. La sécurité incendie le déteste.",
        ancestorDesc: "Barbe Noire, terreur des Caraïbes. Allumait des mèches fumantes dans sa barbe pour paraître démoniaque au combat.",
        characterPrompt: "This is a portrait of Blackbeard (Edward Teach), most feared pirate of the Caribbean. Wild intense eyes lit by the glow of his own burning fuses, thick dark beard braided with two slow-burning hemp fuses trailing thin smoke. Six pistols strapped across leather bandolier, black wide-brimmed hat, heavy dark wool coat. Hellish red-orange firelight from below as if lit by cannon fire, smoke curling around him."
    },
    {
        name: "Thomas",
        pirateName: "Bartholomew Roberts",
        joke: "Pirate le plus classe : costume trois-pièces même en abordage.",
        ancestorDesc: "Bartholomew Roberts, dit 'Black Bart'. Buvait du thé, portait du velours rouge, et a capturé plus de 400 navires.",
        characterPrompt: "This is a portrait of Bartholomew Roberts 'Black Bart', most successful pirate of the Golden Age. Composed aristocratic expression, the calm of a man who has taken 400 ships. Crimson velvet coat with gold buttons, powdered white cravat, ornate feathered tricorn, silver-tipped sword cane held upright, fine china teacup nearby. Elegant candlelit captain's quarters, rich warm tones."
    },
    {
        name: "Fanny",
        pirateName: "Mary Read",
        joke: "Se déguise en homme pour infiltrer l'équipage... personne n'a rien remarqué.",
        ancestorDesc: "Mary Read, pirate déguisée en homme. Compagne d'armes d'Anne Bonny, redoutable au combat et jamais vaincue en duel.",
        characterPrompt: "This is a portrait of Mary Read, pirate who sailed disguised as a man. Determined resolute expression, sharp watchful eyes that dare you to see through the disguise. Men's naval coat and waistcoat, plain tricorn pulled low, leather baldric with pistol — deliberately austere, no jewelry, nothing feminine visible. Muted storm-grey tones, rain-lashed deck behind her."
    },
    {
        name: "Delphine",
        pirateName: "Ching Shih",
        joke: "400 navires sous ses ordres, zéro patience pour les excuses.",
        ancestorDesc: "Ching Shih, impératrice des pirates de la mer de Chine. Commandait 80 000 hommes et a négocié sa propre amnistie.",
        characterPrompt: "This is a portrait of Ching Shih, commander of the largest pirate fleet in history — 1800 vessels, 80000 crew. Commanding authoritative gaze, regal tilt of head, the look of an empress. Richly embroidered Chinese silk robe with golden dragon motif, jade ring, dark hair pinned up with ornate gold hairpin. NO European clothing, NO tricorn hat — she is Chinese royalty who rules the South China Sea. Hundreds of red-sailed junks visible on the sea behind her, warm lantern light on silk."
    },
    {
        name: "Poline",
        pirateName: "Grace O'Malley",
        joke: "Navigue à vue, arrive toujours la première.",
        ancestorDesc: "Grace O'Malley, reine pirate d'Irlande au XVIe siècle. A rencontré la reine Elizabeth Ire d'égale à égale.",
        characterPrompt: "This is a portrait of Grace O'Malley, pirate queen of Ireland. Proud weathered expression, strong jaw set with quiet authority, the face of a woman who met Queen Elizabeth as an equal. Celtic knotwork brooch on a heavy woolen cloak, linen undershirt, iron sword at side, wind-loosened dark hair. Wild Irish coastline behind her, grey-green sea and dramatic storm clouds, cool Atlantic light."
    },
    {
        name: "Muriel",
        pirateName: "Rachel Wall",
        joke: "Voit tout depuis le nid-de-pie, surtout les bêtises.",
        ancestorDesc: "Rachel Wall, l'une des dernières femmes pirates américaines. Attirait les navires en détresse pour les piller.",
        characterPrompt: "This is a portrait of Rachel Wall, American pirate of the Atlantic coast. Alert watchful expression, eyes scanning from under brow like a lookout in the crow's nest. Practical heavy sailor's coat, rope coiled at belt, brass spyglass in one hand, simple cloth cap, no adornment — a working pirate. Grey New England fog and rocky coastline behind her, cold blue-grey light."
    },
    {
        name: "Dina",
        pirateName: "Sayyida al-Hurra",
        joke: "Négocie un trésor en cinq minutes, chrono en main.",
        ancestorDesc: "Sayyida al-Hurra, reine pirate du Maroc au XVIe siècle. Contrôlait la Méditerranée occidentale depuis Tétouan.",
        characterPrompt: "This is a portrait of Sayyida al-Hurra, pirate queen of the Moroccan Mediterranean who controlled the western sea from Tetouan. Composed imperious expression, direct unwavering gaze of absolute authority. Richly embroidered Moroccan kaftan with Moorish geometric patterns in gold and deep blue, fine silk headscarf with gold thread border, rings on both hands. NO European clothing, NO tricorn — she is Moroccan royalty. Moorish arched window behind her framing the Mediterranean, warm amber lamplight on gold embroidery."
    },
    {
        name: "Sylvain",
        pirateName: "Henry Morgan",
        joke: "Son trésor ? Une cave pleine de rosé bien frais.",
        ancestorDesc: "Henry Morgan, le pirate devenu gouverneur de la Jamaïque. A pillé Panama puis pris sa retraite avec les honneurs.",
        characterPrompt: "This is a portrait of Henry Morgan, Welsh privateer who sacked Panama and retired as Governor of Jamaica. Relaxed self-satisfied expression, easy confident grin of a man who won everything. Fine wool coat with polished brass buttons, silver gorget at throat, gentleman's wig slightly disheveled from drink, pewter goblet of rum raised in one hand. Warm tavern firelight, treasure and maps scattered on the table, golden tropical dusk through the window."
    },
    {
        name: "Camille",
        pirateName: "Jacquotte Delahaye",
        joke: "Change de rôle à chaque abordage, personne ne sait qui c'est vraiment.",
        ancestorDesc: "Jacquotte Delahaye, pirate haïtienne surnommée 'Back from the Dead Red'. A simulé sa propre mort pour échapper à ses ennemis.",
        characterPrompt: "This is a portrait of Jacquotte Delahaye 'Back from the Dead Red', Haitian pirate who faked her own death and returned. Enigmatic half-smile, one eye slightly narrowed — is she amused or dangerous? Vibrant auburn-red hair loose over shoulders, mismatched pistols on both hips, torn scarlet sash over dark coat, one gold tooth catching candlelight. Warm Caribbean harbor at night behind her, torchlight on dark water, mysterious amber glow."
    },
    {
        name: "Vlad",
        pirateName: "Hayreddin Barbarossa",
        joke: "Tellement effrayant que les poissons changent de mer à son passage.",
        ancestorDesc: "Hayreddin Barbarossa, amiral ottoman et terreur de la Méditerranée. Commandait 36 galères et ne perdait jamais une bataille.",
        characterPrompt: "This is a portrait of Hayreddin Barbarossa, Ottoman admiral and terror of the Mediterranean who never lost a naval battle. Formidable commanding presence, dark eyes under heavy brows radiating absolute power. Grand Ottoman turban in deep red with gold crescent brooch, richly embroidered Ottoman naval kaftan with silver buttons, magnificent full red beard. NO European clothing, NO tricorn — he is Ottoman royalty and supreme admiral. Ottoman war galleys in formation on the sea behind him, Mediterranean sunset in gold and crimson."
    },
    {
        name: "Amandine",
        pirateName: "Jeanne de Clisson",
        joke: "Sourit toujours avant l'abordage. C'est mauvais signe.",
        ancestorDesc: "Jeanne de Clisson, la Lionne de Bretagne. Devenue pirate par vengeance, elle a traqué les navires français pendant 13 ans.",
        characterPrompt: "This is a portrait of Jeanne de Clisson, the Lioness of Brittany, who became a pirate to avenge her husband's execution. Cold deliberate expression, eyes carrying grief and fury in equal measure. Black iron breastplate over Breton heraldic cloak with ermine trim, gauntleted hand resting on sword pommel. Three black-sailed warships visible in a violent stormy sea behind her, lightning illuminating the scene, dark dramatic shadows."
    },
    {
        name: "Laurie",
        pirateName: "Charlotte de Berry",
        joke: "Trouve son chemin partout... sauf dans un IKEA.",
        ancestorDesc: "Charlotte de Berry, pirate anglaise du XVIIe siècle. S'est déguisée en marin pour suivre son mari en mer, puis a pris le commandement.",
        characterPrompt: "This is a portrait of Charlotte de Berry, English pirate who disguised herself as a sailor to follow her husband to sea, then took command herself. Determined capable expression, a woman who has proven herself ten times over. Practical sailor's coat unbuttoned to reveal a woman's blouse beneath — the disguise half-shed. Brass compass in one hand, cutlass at hip, simple knot earrings. Ship's wheel and open ocean behind her, wind in her hair, dawn light breaking on the horizon."
    },
    {
        name: "Gilles",
        pirateName: "Calico Jack Rackham",
        joke: "A inventé le Jolly Roger... parce qu'il s'ennuyait en mer.",
        ancestorDesc: "Calico Jack Rackham, créateur du célèbre drapeau pirate aux tibias croisés. Plus doué au crayon qu'au sabre.",
        characterPrompt: "This is a portrait of Calico Jack Rackham, the pirate who designed the famous Jolly Roger skull-and-crossbones flag. Rakish amused expression, relaxed posture, the dandy of the pirate world. Colorful patchwork calico cotton coat (his namesake), tricorn at a jaunty angle, quill pen tucked behind one ear beside a pistol — the pirate as artist. A half-drawn skull-and-crossbones flag sketch visible on the table, warm candlelight, relaxed tavern atmosphere."
    },
    {
        name: "Nathan",
        pirateName: "Capitaine Nathan le Grand",
        joke: "Le seul pirate qui organise sa propre fête... et se fait mutiner.",
        ancestorDesc: "Capitaine Nathan le Grand, légende vivante des mers du Sud. Maître des abordages festifs et terreur des buffets.",
        characterPrompt: "This is a portrait of Capitaine Nathan le Grand, legendary captain of the Southern Seas, the greatest pirate captain of his age. Proud celebratory grin, arms slightly open in a welcoming gesture — a captain greeting his crew. Grand gold-trimmed captain's coat with ornate epaulettes, triple-feathered tricorn, pearl-handled pistol at hip, the most magnificent pirate captain's outfit imaginable. His ship's deck at sunset behind him, crew celebrating, golden light everywhere, triumphant and joyful."
    }
];

// Populate le select
function populateGuestSelect() {
    const select = document.getElementById('guestSelect');
    if (!select) return;
    GUESTS.forEach((guest, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = guest.name;
        select.appendChild(opt);
    });
}

// Get guest by index
function getGuest(index) {
    return GUESTS[index] || null;
}
