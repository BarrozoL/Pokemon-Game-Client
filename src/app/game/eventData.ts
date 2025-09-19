export interface DialogueEntry {
  id: string;
  name: string;
  lines: string[];
}

export interface AttackDefinition {
  name: string;
  power: number;
  description?: string;
}

export interface BattleEncounter {
  id: string;
  enemyName: string;
  enemySprite: string;
  enemyMaxHp: number;
  playerMaxHp: number;
  enemyAttacks: AttackDefinition[];
  playerAttacks: AttackDefinition[];
  introText: string;
  victoryText: string;
  defeatText: string;
}

const defaultPlayerAttacks: AttackDefinition[] = [
  {
    name: "Leaf Slash",
    power: 12,
    description: "A sharp arc of verdant energy.",
  },
  {
    name: "Starfall Pulse",
    power: 16,
    description: "Starlight condenses into a brilliant strike.",
  },
  {
    name: "Gale Breaker",
    power: 20,
    description: "A roaring gust crashes into the foe.",
  },
  {
    name: "Mystic Shield",
    power: -10,
    description: "Channel protective energy to heal and fortify.",
  },
];

const advancedPlayerAttacks: AttackDefinition[] = [
  ...defaultPlayerAttacks,
  {
    name: "Elemental Fusion",
    power: 25,
    description: "Combine earth, air, fire, and water into one devastating assault.",
  },
  {
    name: "Temporal Strike",
    power: 22,
    description: "Attack that transcends time, hitting past, present, and future.",
  },
  {
    name: "Spirit Bond",
    power: -20,
    description: "Connect with ancient spirits for massive healing.",
  },
];

export const battleEncounters: Record<string, BattleEncounter> = {
  "azure-wave-warden": {
    id: "azure-wave-warden",
    enemyName: "Wave Warden Lyss",
    enemySprite: "/characters/wizard-purple.png",
    enemyMaxHp: 42,
    playerMaxHp: 60,
    enemyAttacks: [
      {
        name: "Tidal Lash",
        power: 12,
        description: "Brackish water lashes like a whip.",
      },
      {
        name: "Foam Burst",
        power: 10,
        description: "Effervescent bubbles detonate beneath your boots.",
      },
    ],
    playerAttacks: defaultPlayerAttacks,
    introText:
      "Lyss twirls a coral staff as the tide surges around the dock.",
    victoryText:
      "Lyss nods approvingly. \"May the currents carry you safely to the dunes.\"",
    defeatText:
      "Dock hands rush to pull you from the surf. Better regroup before returning.",
  },
  "azure-tideguard": {
    id: "azure-tideguard",
    enemyName: "Tideguard Serrin",
    enemySprite: "/characters/wizard-blue.png",
    enemyMaxHp: 48,
    playerMaxHp: 60,
    enemyAttacks: [
      {
        name: "Shell Slam",
        power: 13,
        description: "A shield of seashells crashes forward.",
      },
      {
        name: "Breaker Wave",
        power: 15,
        description: "A roaring wave threatens to sweep you away.",
      },
    ],
    playerAttacks: defaultPlayerAttacks,
    introText:
      "Serrin plants an anchor spear and challenges you to weather the tide.",
    victoryText:
      "Serrin laughs heartily. \"You've the grit to survive the desert winds.\"",
    defeatText:
      "Salt spray stings your eyes as the guard signals a tactical retreat.",
  },
  "dune-duelist": {
    id: "dune-duelist",
    enemyName: "Bladesong Rhea",
    enemySprite: "/characters/player-right.png",
    enemyMaxHp: 54,
    playerMaxHp: 68,
    enemyAttacks: [
      {
        name: "Glass Edge",
        power: 14,
        description: "Hardened sand forms a gleaming blade.",
      },
      {
        name: "Mirage Dash",
        power: 16,
        description: "A blur of heat and steel darts past your guard.",
      },
    ],
    playerAttacks: defaultPlayerAttacks,
    introText:
      "Rhea traces patterns in the sand before lunging with dancer's grace.",
    victoryText:
      "She sheathes her blades. \"Carry our desert's song into the glade beyond.\"",
    defeatText:
      "Heat haze engulfs you as Rhea offers a hand to help you stand again.",
  },
  "beastmaster-kai": {
    id: "beastmaster-kai",
    enemyName: "Beastmaster Kai",
    enemySprite: "/characters/character-sprite-image.png",
    enemyMaxHp: 60,
    playerMaxHp: 68,
    enemyAttacks: [
      {
        name: "Pack Ambush",
        power: 15,
        description: "Echoing howls strike from every side.",
      },
      {
        name: "Sandstorm Call",
        power: 18,
        description: "A spiraling squall pelts you with grit and stone.",
      },
    ],
    playerAttacks: defaultPlayerAttacks,
    introText:
      "Kai whistles and the dunes rumble with the steps of hidden companions.",
    victoryText:
      "Kai grins. \"The glade will welcome a champion with your resolve.\"",
    defeatText:
      "You brace against the storm, vowing to return with a stronger stance.",
  },
  "glade-guardian": {
    id: "glade-guardian",
    enemyName: "Guardian Elowen",
    enemySprite: "/characters/player-character-front.png",
    enemyMaxHp: 65,
    playerMaxHp: 75,
    enemyAttacks: [
      {
        name: "Lumen Arrow",
        power: 16,
        description: "A radiant arrow streaks across the grove.",
      },
      {
        name: "Verdant Shield",
        power: 18,
        description: "Roots surge up in a protective wave.",
      },
      {
        name: "Grove's Blessing",
        power: -12,
        description: "Natural energies restore vitality.",
      },
    ],
    playerAttacks: advancedPlayerAttacks,
    introText:
      "Elowen tests your aura, branches bending toward her call.",
    victoryText:
      "She bows deeply. \"The glade recognizes your harmony with its light.\"",
    defeatText:
      "The grove hums softly, urging you to regain your balance before returning.",
  },
  "glade-seer": {
    id: "glade-seer",
    enemyName: "Seer Vaela",
    enemySprite: "/characters/player-back.png",
    enemyMaxHp: 80,
    playerMaxHp: 85,
    enemyAttacks: [
      {
        name: "Moonpetal Flare",
        power: 18,
        description: "Moonlit petals explode in dazzling light.",
      },
      {
        name: "Chrono Whorl",
        power: 20,
        description: "Time skips as a spiral of magic unravels your stance.",
      },
      {
        name: "Future Sight",
        power: 23,
        description: "Strike from tomorrow hits you in the present.",
      },
      {
        name: "Temporal Heal",
        power: -18,
        description: "Rewind personal time to undo recent wounds.",
      },
    ],
    playerAttacks: advancedPlayerAttacks,
    introText:
      "Vaela's gaze pierces through timelines before she raises her staff.",
    victoryText:
      "Vaela smiles knowingly. \"You've mastered the ancient arts. Your true journey across expanded realms begins now.\"",
    defeatText:
      "The seer cradles you in shimmering light, sending you back to recover and grow stronger.",
  },
  "glade-druid": {
    id: "glade-druid",
    enemyName: "Druid Thornweaver",
    enemySprite: "/characters/wizard-blue.png",
    enemyMaxHp: 75,
    playerMaxHp: 80,
    enemyAttacks: [
      {
        name: "Nature's Wrath",
        power: 19,
        description: "Thorned vines erupt from the earth in a spiraling assault.",
      },
      {
        name: "Crystal Shard",
        power: 22,
        description: "Crystalline projectiles pierce through natural armor.",
      },
      {
        name: "Healing Mist",
        power: -15,
        description: "Restorative fog heals wounds and renews strength.",
      },
    ],
    playerAttacks: [
      ...defaultPlayerAttacks,
      {
        name: "Elemental Burst",
        power: 24,
        description: "Channel the power of all four elements into a devastating strike.",
      },
    ],
    introText:
      "Thornweaver rises from the crystal grove, ancient magic coursing through their veins.",
    victoryText:
      "The druid bows deeply. \"You have proven yourself worthy of the grove's deepest secrets.\"",
    defeatText:
      "Natural energies overwhelm you as the druid offers sanctuary to recover.",
  },
};

export const npcDialogues: Record<string, DialogueEntry> = {
  "grove-sage": {
    id: "grove-sage",
    name: "Aeliana the Grove Sage",
    lines: [
      "The fields are stirring with rumors of distant biomes.",
      "Seek the waystones when you're ready to wander beyond this meadow.",
      "I sense you've grown stronger since we last spoke. The ancient energies respond to your presence.",
    ],
  },
  "verdant-merchant": {
    id: "verdant-merchant",
    name: "Gareth the Traveling Merchant",
    lines: [
      "Welcome, traveler! I've got potions, maps, and trinkets from across the realms.",
      "That mysterious orb you're carrying... I've seen its like in the Azure Approach.",
      "Business has been good lately - more adventurers are exploring these expanded lands.",
    ],
  },
  "verdant-explorer": {
    id: "verdant-explorer",
    name: "Kira the Pathfinder",
    lines: [
      "These fields have grown vast and wild! I've discovered three new secret passages this week alone.",
      "The ancient rune near the eastern edge... when activated, it reveals hidden pathways.",
      "Beware the quicksand in the desert - I barely escaped it myself!",
    ],
  },
  "azure-chronicler": {
    id: "azure-chronicler",
    name: "Marin the Chronicler",
    lines: [
      "Every tide etches a new entry in our ledgers.",
      "Mind the slick planks—some lead to hidden coves brimming with lore.",
    ],
  },
  "azure-cartographer": {
    id: "azure-cartographer",
    name: "Ryn the Cartographer",
    lines: [
      "I chart the currents that spiral out toward the dunes.",
      "Follow the waystone atop the long pier when you're ready to brave the heat.",
    ],
  },
  "azure-bard": {
    id: "azure-bard",
    name: "Lysa the Harbor Bard",
    lines: [
      "I sing for sailors watching the horizon.",
      "Bring back a melody from the desert and I'll weave it into tonight's song.",
      "The new pier networks have inspired so many songs - each bridge tells a story.",
    ],
  },
  "azure-fisherman": {
    id: "azure-fisherman",
    name: "Old Salt Marcus",
    lines: [
      "Been fishing these waters for forty years, but I've never seen the tides this active.",
      "The bridge levers control ancient mechanisms - some say they date back to the First Builders.",
      "Caught something strange today... a key that glows with azure light. You might need it.",
    ],
  },
  "azure-scholar": {
    id: "azure-scholar",
    name: "Thessarian the Lore Keeper",
    lines: [
      "These underwater ruins hold secrets from a sunken civilization.",
      "I've decoded partial texts about 'The Great Linking' - pathways between all realms.",
      "The healing fountains are not natural - they're ancient magical constructs still functioning.",
    ],
  },
  "desert-storyteller": {
    id: "desert-storyteller",
    name: "Sahir the Storyteller",
    lines: [
      "Every dune hides a legend beneath its crest.",
      "Trade me tales of the sea and I'll share whispers of the glowing grove ahead.",
    ],
  },
  "desert-navigator": {
    id: "desert-navigator",
    name: "Iria the Navigator",
    lines: [
      "The winds carve paths that only keen eyes notice.",
      "Keep your bearings on the cairns if a sandstorm rises suddenly.",
    ],
  },
  "desert-oracle": {
    id: "desert-oracle",
    name: "Oracle Nadir",
    lines: [
      "Starlight pools beneath the dunes at dusk.",
      "Touch the crystalline waystone once your spirit resonates with the desert.",
      "The quicksand speaks of ancient burial chambers far below the surface.",
    ],
  },
  "desert-trader": {
    id: "desert-trader",
    name: "Zahra of the Oasis Markets",
    lines: [
      "The finest goods from every caravan route pass through my stall.",
      "That locked door you found? I have keys, but they don't come cheap.",
      "The nomads speak of a hidden treasure vault beneath the Great Dune.",
    ],
  },
  "desert-nomad": {
    id: "desert-nomad",
    name: "Jamal the Windwalker",
    lines: [
      "I've walked these sands since I was a child, but the dunes have shifted into new patterns.",
      "The ancient runes are awakening - something stirs in the deep desert.",
      "Follow the star patterns at night - they'll guide you to the secret oases.",
    ],
  },
  "glade-historian": {
    id: "glade-historian",
    name: "Eloi the Historian",
    lines: [
      "The glade blooms in cycles older than any kingdom.",
      "Record what you witness—memories keep the lights aglow.",
    ],
  },
  "glade-songweaver": {
    id: "glade-songweaver",
    name: "Nyra the Songweaver",
    lines: [
      "Every petal hums a note only travelers can hear.",
      "Share a verse from the dunes and I'll braid it into a lullaby for the grove.",
    ],
  },
  "glade-caretaker": {
    id: "glade-caretaker",
    name: "Caretaker Moss",
    lines: [
      "We nurture seedlings brought from every biome.",
      "When you're ready to return to the fields, the eastern waystone will guide you.",
      "The crystal vines have been growing restless - they sense the awakening of old magic.",
    ],
  },
  "glade-sprite": {
    id: "glade-sprite",
    name: "Luminara the Grove Sprite",
    lines: [
      "The mushroom circles are portals - but only the pure of heart can use them safely.",
      "I've seen travelers appear from thin air when they step through the fairy rings.",
      "The ice patches aren't natural - they're tears in reality where winter bleeds through.",
    ],
  },
  "crystalvine-spirit": {
    id: "crystalvine-spirit",
    name: "The Crystalvine Consciousness",
    lines: [
      "We are the living memory of this grove, growing since the First Dawn.",
      "Your presence accelerates our growth - you carry the spark of ancient magic.",
      "Beware the locked doors in distant realms - not all barriers should be opened.",
    ],
  },
};
