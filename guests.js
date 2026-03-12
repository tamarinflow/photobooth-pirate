// ══════════════════════════════════════
// GUEST DATA — 15 invités + Nathan
// TODO: Remplacer jokes avec les vrais
// ══════════════════════════════════════

const GUESTS = [
    {
        name: "Émilie",
        pirateName: "Anne Bonny",
        joke: "Commande toujours un rhum... puis prend un Spritz.",
        ancestorDesc: "Anne Bonny, l'une des femmes pirates les plus redoutées des Caraïbes. Maniait le sabre et le sarcasme avec la même aisance."
    },
    {
        name: "Cyril",
        pirateName: "Francis Drake",
        joke: "Fait le tour du monde mais oublie de ramener le pain.",
        ancestorDesc: "Sir Francis Drake, corsaire anglais, premier à faire le tour du monde pour la Couronne. Considéré héros en Angleterre, pirate en Espagne."
    },
    {
        name: "Yann",
        pirateName: "Edward 'Blackbeard' Teach",
        joke: "Allume des mèches dans sa barbe. La sécurité incendie le déteste.",
        ancestorDesc: "Barbe Noire, terreur des Caraïbes. Allumait des mèches fumantes dans sa barbe pour paraître démoniaque au combat."
    },
    {
        name: "Thomas",
        pirateName: "Bartholomew Roberts",
        joke: "Pirate le plus classe : costume trois-pièces même en abordage.",
        ancestorDesc: "Bartholomew Roberts, dit 'Black Bart'. Buvait du thé, portait du velours rouge, et a capturé plus de 400 navires."
    },
    {
        name: "Fanny",
        pirateName: "Mary Read",
        joke: "Se déguise en homme pour infiltrer l'équipage... personne n'a rien remarqué.",
        ancestorDesc: "Mary Read, pirate déguisée en homme. Compagne d'armes d'Anne Bonny, redoutable au combat et jamais vaincue en duel."
    },
    {
        name: "Delphine",
        pirateName: "Ching Shih",
        joke: "400 navires sous ses ordres, zéro patience pour les excuses.",
        ancestorDesc: "Ching Shih, impératrice des pirates de la mer de Chine. Commandait 80 000 hommes et a négocié sa propre amnistie."
    },
    {
        name: "Poline",
        pirateName: "Grace O'Malley",
        joke: "Navigue à vue, arrive toujours la première.",
        ancestorDesc: "Grace O'Malley, reine pirate d'Irlande au XVIe siècle. A rencontré la reine Elizabeth Ire d'égale à égale."
    },
    {
        name: "Muriel",
        pirateName: "Rachel Wall",
        joke: "Voit tout depuis le nid-de-pie, surtout les bêtises.",
        ancestorDesc: "Rachel Wall, l'une des dernières femmes pirates américaines. Attirait les navires en détresse pour les piller."
    },
    {
        name: "Dina",
        pirateName: "Sayyida al-Hurra",
        joke: "Négocie un trésor en cinq minutes, chrono en main.",
        ancestorDesc: "Sayyida al-Hurra, reine pirate du Maroc au XVIe siècle. Contrôlait la Méditerranée occidentale depuis Tétouan."
    },
    {
        name: "Sylvain",
        pirateName: "Henry Morgan",
        joke: "Son trésor ? Une cave pleine de rosé bien frais.",
        ancestorDesc: "Henry Morgan, le pirate devenu gouverneur de la Jamaïque. A pillé Panama puis pris sa retraite avec les honneurs."
    },
    {
        name: "Camille",
        pirateName: "Jacquotte Delahaye",
        joke: "Change de rôle à chaque abordage, personne ne sait qui c'est vraiment.",
        ancestorDesc: "Jacquotte Delahaye, pirate haïtienne surnommée 'Back from the Dead Red'. A simulé sa propre mort pour échapper à ses ennemis."
    },
    {
        name: "Vlad",
        pirateName: "Hayreddin Barbarossa",
        joke: "Tellement effrayant que les poissons changent de mer à son passage.",
        ancestorDesc: "Hayreddin Barbarossa, amiral ottoman et terreur de la Méditerranée. Commandait 36 galères et ne perdait jamais une bataille."
    },
    {
        name: "Amandine",
        pirateName: "Jeanne de Clisson",
        joke: "Sourit toujours avant l'abordage. C'est mauvais signe.",
        ancestorDesc: "Jeanne de Clisson, la Lionne de Bretagne. Devenue pirate par vengeance, elle a traqué les navires français pendant 13 ans."
    },
    {
        name: "Laurie",
        pirateName: "Charlotte de Berry",
        joke: "Trouve son chemin partout... sauf dans un IKEA.",
        ancestorDesc: "Charlotte de Berry, pirate anglaise du XVIIe siècle. S'est déguisée en marin pour suivre son mari en mer, puis a pris le commandement."
    },
    {
        name: "Gilles",
        pirateName: "Calico Jack Rackham",
        joke: "A inventé le Jolly Roger... parce qu'il s'ennuyait en mer.",
        ancestorDesc: "Calico Jack Rackham, créateur du célèbre drapeau pirate aux tibias croisés. Plus doué au crayon qu'au sabre."
    },
    {
        name: "Nathan",
        pirateName: "Capitaine Nathan le Grand",
        joke: "Le seul pirate qui organise sa propre fête... et se fait mutiner.",
        ancestorDesc: "Capitaine Nathan le Grand, légende vivante des mers du Sud. Maître des abordages festifs et terreur des buffets."
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
