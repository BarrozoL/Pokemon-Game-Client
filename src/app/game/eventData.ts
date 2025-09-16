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
    ],
    playerAttacks: defaultPlayerAttacks,
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
    enemyMaxHp: 70,
    playerMaxHp: 75,
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
    ],
    playerAttacks: defaultPlayerAttacks,
    introText:
      "Vaela's gaze pierces through timelines before she raises her staff.",
    victoryText:
      "Vaela smiles knowingly. \"Circle back to the fields—your journey has only begun.\"",
    defeatText:
      "The seer cradles you in shimmering light, sending you back to recover.",
  },
};

export const npcDialogues: Record<string, DialogueEntry> = {
  "grove-sage": {
    id: "grove-sage",
    name: "Aeliana the Grove Sage",
    lines: [
      "The fields are stirring with rumors of distant biomes.",
      "Seek the waystones when you're ready to wander beyond this meadow.",
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
    ],
  },
};
