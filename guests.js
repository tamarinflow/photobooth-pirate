// ══════════════════════════════════════
// GUEST DATA — 15 invités + Nathan
// ══════════════════════════════════════

const GUESTS = [
    {
        name: "Émilie",
        pirateName: "Anne Bonny",
        joke: "Commande toujours un rhum... puis prend un Spritz.",
        ancestorDesc: "Anne Bonny, l'une des femmes pirates les plus redoutées des Caraïbes. Maniait le sabre et le sarcasme avec la même aisance.",
        characterPrompt: "Subject is Anne Bonny, feared Caribbean pirate captain. Fierce direct gaze, slight defiant smirk. Crimson tricorn hat with gold trim, loose white linen blouse open at collar, cutlass hilt visible at hip, single pearl earring."
    },
    {
        name: "Cyril",
        pirateName: "Francis Drake",
        joke: "Fait le tour du monde mais oublie de ramener le pain.",
        ancestorDesc: "Sir Francis Drake, corsaire anglais, premier à faire le tour du monde pour la Couronne. Considéré héros en Angleterre, pirate en Espagne.",
        characterPrompt: "Subject is Sir Francis Drake, English privateer and circumnavigator. Confident composed expression, slight upward chin. Elizabethan ruff collar, polished breastplate with royal insignia, velvet doublet, naval officer's hat."
    },
    {
        name: "Yann",
        pirateName: "Edward 'Blackbeard' Teach",
        joke: "Allume des mèches dans sa barbe. La sécurité incendie le déteste.",
        ancestorDesc: "Barbe Noire, terreur des Caraïbes. Allumait des mèches fumantes dans sa barbe pour paraître démoniaque au combat.",
        characterPrompt: "Subject is Blackbeard (Edward Teach), most feared pirate of the Caribbean. Wild intense eyes, thick dark beard with two slow-burning hemp fuses emitting thin wisps of smoke. Six pistols on leather bandolier, black wide-brimmed hat, heavy dark wool coat."
    },
    {
        name: "Thomas",
        pirateName: "Bartholomew Roberts",
        joke: "Pirate le plus classe : costume trois-pièces même en abordage.",
        ancestorDesc: "Bartholomew Roberts, dit 'Black Bart'. Buvait du thé, portait du velours rouge, et a capturé plus de 400 navires.",
        characterPrompt: "Subject is Bartholomew Roberts 'Black Bart', most successful pirate of the Golden Age. Composed aristocratic expression. Crimson velvet coat with gold buttons, powdered white cravat, ornate feathered tricorn, silver-tipped sword cane held upright."
    },
    {
        name: "Fanny",
        pirateName: "Mary Read",
        joke: "Se déguise en homme pour infiltrer l'équipage... personne n'a rien remarqué.",
        ancestorDesc: "Mary Read, pirate déguisée en homme. Compagne d'armes d'Anne Bonny, redoutable au combat et jamais vaincue en duel.",
        characterPrompt: "Subject is Mary Read, pirate who sailed disguised as a man. Determined resolute expression, sharp watchful eyes. Men's naval coat and waistcoat, plain tricorn, leather baldric with pistol — deliberately austere, no jewelry, the deliberate disguise."
    },
    {
        name: "Delphine",
        pirateName: "Ching Shih",
        joke: "400 navires sous ses ordres, zéro patience pour les excuses.",
        ancestorDesc: "Ching Shih, impératrice des pirates de la mer de Chine. Commandait 80 000 hommes et a négocié sa propre amnistie.",
        characterPrompt: "Subject is Ching Shih, commander of the largest pirate fleet in history. Commanding authoritative gaze, slight regal tilt of head. Embroidered silk robe with dragon motif over a naval coat, jade ring on one finger, dark hair pinned with a gold ornament."
    },
    {
        name: "Poline",
        pirateName: "Grace O'Malley",
        joke: "Navigue à vue, arrive toujours la première.",
        ancestorDesc: "Grace O'Malley, reine pirate d'Irlande au XVIe siècle. A rencontré la reine Elizabeth Ire d'égale à égale.",
        characterPrompt: "Subject is Grace O'Malley, pirate queen of Ireland. Proud weathered expression, strong jaw set with quiet authority. Celtic knotwork brooch on a heavy woolen cloak, linen undershirt, iron sword at side, wind-loosened dark hair."
    },
    {
        name: "Muriel",
        pirateName: "Rachel Wall",
        joke: "Voit tout depuis le nid-de-pie, surtout les bêtises.",
        ancestorDesc: "Rachel Wall, l'une des dernières femmes pirates américaines. Attirait les navires en détresse pour les piller.",
        characterPrompt: "Subject is Rachel Wall, American pirate of the Atlantic coast. Alert watchful expression, eyes scanning from under brow. Practical heavy sailor's coat, rope coiled at belt, brass spyglass in one hand, simple cloth cap, no adornment."
    },
    {
        name: "Dina",
        pirateName: "Sayyida al-Hurra",
        joke: "Négocie un trésor en cinq minutes, chrono en main.",
        ancestorDesc: "Sayyida al-Hurra, reine pirate du Maroc au XVIe siècle. Contrôlait la Méditerranée occidentale depuis Tétouan.",
        characterPrompt: "Subject is Sayyida al-Hurra, pirate queen of the Moroccan Mediterranean. Composed imperious expression, direct unwavering gaze. Richly embroidered kaftan with Moorish geometric patterns, fine silk headscarf with gold thread border, rings on both hands, galley oars in dark background."
    },
    {
        name: "Sylvain",
        pirateName: "Henry Morgan",
        joke: "Son trésor ? Une cave pleine de rosé bien frais.",
        ancestorDesc: "Henry Morgan, le pirate devenu gouverneur de la Jamaïque. A pillé Panama puis pris sa retraite avec les honneurs.",
        characterPrompt: "Subject is Henry Morgan, Welsh privateer and future Governor of Jamaica. Relaxed self-satisfied expression, easy confident grin. Fine wool coat with polished brass buttons, silver gorget at throat, gentleman's wig slightly disheveled, pewter goblet held in one hand."
    },
    {
        name: "Camille",
        pirateName: "Jacquotte Delahaye",
        joke: "Change de rôle à chaque abordage, personne ne sait qui c'est vraiment.",
        ancestorDesc: "Jacquotte Delahaye, pirate haïtienne surnommée 'Back from the Dead Red'. A simulé sa propre mort pour échapper à ses ennemis.",
        characterPrompt: "Subject is Jacquotte Delahaye 'Back from the Dead Red', Haitian pirate. Enigmatic half-smile, one eye slightly narrowed. Vibrant auburn-red hair loose over shoulders, mismatched pistols on both hips, torn scarlet sash over dark coat, one gold tooth catching candlelight."
    },
    {
        name: "Vlad",
        pirateName: "Hayreddin Barbarossa",
        joke: "Tellement effrayant que les poissons changent de mer à son passage.",
        ancestorDesc: "Hayreddin Barbarossa, amiral ottoman et terreur de la Méditerranée. Commandait 36 galères et ne perdait jamais une bataille.",
        characterPrompt: "Subject is Hayreddin Barbarossa, Ottoman admiral and terror of the Mediterranean. Formidable commanding presence, dark eyes under heavy brows. Red admiral's turban with gold crescent brooch, Ottoman naval coat with silver buttons, magnificent full red beard, galley oars silhouetted in background."
    },
    {
        name: "Amandine",
        pirateName: "Jeanne de Clisson",
        joke: "Sourit toujours avant l'abordage. C'est mauvais signe.",
        ancestorDesc: "Jeanne de Clisson, la Lionne de Bretagne. Devenue pirate par vengeance, elle a traqué les navires français pendant 13 ans.",
        characterPrompt: "Subject is Jeanne de Clisson, the Lioness of Brittany, pirate of vengeance. Cold deliberate expression, eyes carrying grief and fury. Black iron breastplate over Breton heraldic cloak, hand resting on sword pommel, three black-sailed ships visible in stormy background."
    },
    {
        name: "Laurie",
        pirateName: "Charlotte de Berry",
        joke: "Trouve son chemin partout... sauf dans un IKEA.",
        ancestorDesc: "Charlotte de Berry, pirate anglaise du XVIIe siècle. S'est déguisée en marin pour suivre son mari en mer, puis a pris le commandement.",
        characterPrompt: "Subject is Charlotte de Berry, English pirate who disguised herself as a sailor to go to sea. Determined capable expression. Practical sailor's coat over a woman's blouse — the disguise half-revealed. Brass compass in one hand, cutlass at hip, simple knot earrings."
    },
    {
        name: "Gilles",
        pirateName: "Calico Jack Rackham",
        joke: "A inventé le Jolly Roger... parce qu'il s'ennuyait en mer.",
        ancestorDesc: "Calico Jack Rackham, créateur du célèbre drapeau pirate aux tibias croisés. Plus doué au crayon qu'au sabre.",
        characterPrompt: "Subject is Calico Jack Rackham, inventor of the Jolly Roger skull-and-crossbones flag. Rakish amused expression, relaxed posture. Colorful patchwork calico coat (his namesake), tricorn at a jaunty angle, quill pen tucked behind one ear beside a pistol — the pirate as artist."
    },
    {
        name: "Nathan",
        pirateName: "Capitaine Nathan le Grand",
        joke: "Le seul pirate qui organise sa propre fête... et se fait mutiner.",
        ancestorDesc: "Capitaine Nathan le Grand, légende vivante des mers du Sud. Maître des abordages festifs et terreur des buffets.",
        characterPrompt: "Subject is Capitaine Nathan le Grand, legendary captain of the Southern Seas. Proud celebratory grin, arms slightly open in a welcoming gesture. Grand gold-trimmed naval coat with epaulettes, triple-feathered tricorn, pearl-handled pistol at hip, the most ornate captain's dress of any pirate."
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
