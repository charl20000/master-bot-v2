const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const NINJA_DATA_PATH = path.join(process.cwd(), "ninja_data.json");

// ─── CHARGEMENT DES DONNÉES ───
function loadNinjaData() {
    if (!fs.existsSync(NINJA_DATA_PATH)) {
        const defaultData = {
            users: {},
            missions: {},
            jutsus: {},
            dojos: {},
            rankings: {},
            dailyMissions: {}
        };
        fs.writeFileSync(NINJA_DATA_PATH, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(NINJA_DATA_PATH, "utf8"));
}

function saveNinjaData(data) {
    fs.writeFileSync(NINJA_DATA_PATH, JSON.stringify(data, null, 2));
}

// ─── PERSONNAGES NARUTO ───
const CHARACTERS = {
    "naruto": {
        name: "Naruto Uzumaki",
        emoji: "🍥",
        hp: 1000,
        chakra: 500,
        level: 1,
        xp: 0,
        xpNext: 100,
        rank: "Genin",
        jutsus: ["Rasengan", "Shadow Clone"],
        jutsusMastered: [],
        modes: ["Normal"],
        attacks: [
            { name: "Rasengan", damage: 80, chakraCost: 30, type: "physical" },
            { name: "Multi Shadow Clone", damage: 120, chakraCost: 50, type: "physical" }
        ],
        ultimates: [{ name: "Ultimate Rasengan Barrage", damage: 500, chakraCost: 250 }],
        stats: { strength: 90, speed: 85, defense: 80, chakraControl: 85 }
    },
    "sasuke": {
        name: "Sasuke Uchiha",
        emoji: "⚡",
        hp: 950,
        chakra: 600,
        level: 1,
        xp: 0,
        xpNext: 100,
        rank: "Genin",
        jutsus: ["Chidori", "Fireball Jutsu"],
        jutsusMastered: [],
        modes: ["Normal"],
        attacks: [
            { name: "Chidori", damage: 100, chakraCost: 35, type: "lightning" },
            { name: "Fireball Jutsu", damage: 130, chakraCost: 45, type: "fire" }
        ],
        ultimates: [{ name: "Complete Susanoo", damage: 550, chakraCost: 300 }],
        stats: { strength: 85, speed: 90, defense: 75, chakraControl: 90 }
    },
    "madara": {
        name: "Madara Uchiha",
        emoji: "👁️",
        hp: 1200,
        chakra: 800,
        level: 1,
        xp: 0,
        xpNext: 100,
        rank: "Genin",
        jutsus: ["Sharingan Genjutsu", "Fire Style"],
        jutsusMastered: [],
        modes: ["Normal"],
        attacks: [
            { name: "Sharingan Genjutsu", damage: 90, chakraCost: 40, type: "eye" },
            { name: "Fire Style", damage: 140, chakraCost: 50, type: "fire" }
        ],
        ultimates: [{ name: "Infinite Tsukuyomi", damage: 700, chakraCost: 400 }],
        stats: { strength: 95, speed: 80, defense: 90, chakraControl: 95 }
    },
    "kakashi": {
        name: "Kakashi Hatake",
        emoji: "📖",
        hp: 900,
        chakra: 550,
        level: 1,
        xp: 0,
        xpNext: 100,
        rank: "Genin",
        jutsus: ["Chidori", "Water Dragon"],
        jutsusMastered: [],
        modes: ["Normal"],
        attacks: [
            { name: "Chidori", damage: 100, chakraCost: 35, type: "lightning" },
            { name: "Water Dragon", damage: 130, chakraCost: 45, type: "water" }
        ],
        ultimates: [{ name: "Perfect Kamui", damage: 450, chakraCost: 250 }],
        stats: { strength: 80, speed: 95, defense: 70, chakraControl: 90 }
    },
    "itachi": {
        name: "Itachi Uchiha",
        emoji: "🕊️",
        hp: 850,
        chakra: 700,
        level: 1,
        xp: 0,
        xpNext: 100,
        rank: "Genin",
        jutsus: ["Amaterasu", "Tsukuyomi"],
        jutsusMastered: [],
        modes: ["Normal"],
        attacks: [
            { name: "Amaterasu", damage: 150, chakraCost: 60, type: "fire" },
            { name: "Tsukuyomi", damage: 120, chakraCost: 50, type: "eye" }
        ],
        ultimates: [{ name: "Susanoo", damage: 600, chakraCost: 350 }],
        stats: { strength: 80, speed: 85, defense: 80, chakraControl: 95 }
    },
    "minato": {
        name: "Minato Namikaze",
        emoji: "⚡",
        hp: 950,
        chakra: 600,
        level: 1,
        xp: 0,
        xpNext: 100,
        rank: "Genin",
        jutsus: ["Rasengan", "Flying Thunder God"],
        jutsusMastered: [],
        modes: ["Normal"],
        attacks: [
            { name: "Rasengan", damage: 90, chakraCost: 30, type: "physical" },
            { name: "Flying Thunder God", damage: 160, chakraCost: 60, type: "space" }
        ],
        ultimates: [{ name: "Reaper Death Seal", damage: 650, chakraCost: 400 }],
        stats: { strength: 85, speed: 100, defense: 75, chakraControl: 85 }
    },
    "hashirama": {
        name: "Hashirama Senju",
        emoji: "🌳",
        hp: 1300,
        chakra: 900,
        level: 1,
        xp: 0,
        xpNext: 100,
        rank: "Genin",
        jutsus: ["Wood Style", "Sage Mode"],
        jutsusMastered: [],
        modes: ["Normal"],
        attacks: [
            { name: "Wood Style", damage: 120, chakraCost: 50, type: "wood" },
            { name: "Sage Mode", damage: 200, chakraCost: 80, type: "sage" }
        ],
        ultimates: [{ name: "True Thousand Hands", damage: 800, chakraCost: 500 }],
        stats: { strength: 100, speed: 70, defense: 95, chakraControl: 90 }
    }
};

// ─── JUTSUS DISPONIBLES ───
const JUTSUS = {
    "Rasengan": { damage: 80, chakraCost: 30, type: "physical", unlockLevel: 1 },
    "Shadow Clone": { damage: 60, chakraCost: 25, type: "physical", unlockLevel: 2 },
    "Chidori": { damage: 100, chakraCost: 35, type: "lightning", unlockLevel: 3 },
    "Fireball Jutsu": { damage: 130, chakraCost: 45, type: "fire", unlockLevel: 4 },
    "Rasenshuriken": { damage: 180, chakraCost: 80, type: "wind", unlockLevel: 5 },
    "Amaterasu": { damage: 150, chakraCost: 60, type: "fire", unlockLevel: 6 },
    "Tsukuyomi": { damage: 120, chakraCost: 50, type: "eye", unlockLevel: 7 },
    "Susanoo": { damage: 250, chakraCost: 120, type: "eye", unlockLevel: 8 },
    "Flying Thunder God": { damage: 160, chakraCost: 60, type: "space", unlockLevel: 9 },
    "Wood Style": { damage: 120, chakraCost: 50, type: "wood", unlockLevel: 10 },
    "Sage Mode": { damage: 200, chakraCost: 80, type: "sage", unlockLevel: 12 },
    "Six Paths Sage Mode": { damage: 250, chakraCost: 120, type: "sage", unlockLevel: 15 },
    "Baryon Mode": { damage: 350, chakraCost: 200, type: "ultimate", unlockLevel: 20 }
};

// ─── MODES DISPONIBLES ───
const MODES = {
    "Sage Mode": { boost: "strength 1.5", unlockLevel: 10 },
    "Kurama Chakra Mode": { boost: "chakra 2x", unlockLevel: 12 },
    "Six Paths Sage Mode": { boost: "all stats 2x", unlockLevel: 15 },
    "Baryon Mode": { boost: "strength 3x, chakra drain", unlockLevel: 20 },
    "Susanoo": { boost: "defense 3x", unlockLevel: 8 }
};

// ─── MISSIONS ───
const MISSIONS = [
    { name: "Escorter le Daimyo", rank: "D", xp: 50, reward: "Chakra Potion" },
    { name: "Capturer un chat", rank: "D", xp: 40, reward: "Small Scroll" },
    { name: "Protéger un village", rank: "C", xp: 80, reward: "Medium Scroll" },
    { name: "Affronter des bandits", rank: "C", xp: 100, reward: "Rare Scroll" },
    { name: "Infiltration", rank: "B", xp: 150, reward: "Chakra Boost" },
    { name: "Combat en duo", rank: "B", xp: 180, reward: "Jutsu Scroll" },
    { name: "Défendre Konoha", rank: "A", xp: 250, reward: "Power Scroll" },
    { name: "Affronter un Akatsuki", rank: "A", xp: 300, reward: "Mystic Scroll" },
    { name: "Mission S-Rank", rank: "S", xp: 500, reward: "Legendary Scroll" },
    { name: "Combat contre Pain", rank: "S", xp: 600, reward: "Rinnegan Scroll" },
    { name: "Protéger le monde", rank: "SS", xp: 1000, reward: "Sage Scroll" }
];

// ─── STYLE ───
const bold = (txt) => {
    const map = {a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭'};
    return txt.split('').map(c => map[c] || c).join('');
};

const frame = (text) => {
    const lines = text.split('\n');
    const maxLen = Math.min(Math.max(...lines.map(l => l.length)), 50);
    const top = `╭─ • ✦ 🍥 ${bold('NARUTO ULTIMATE RPG')} 🍥 ✦ • ─╮`;
    const bottom = `╰─ • ✦ ${bold('Master Charbel')} ✦ • ─╯`;
    const content = lines.map(line => `│ ${line.padEnd(maxLen)}│`).join('\n');
    return `${top}\n│\n${content}\n│\n${bottom}`;
};

// ─── GENERER UNE MISSION AVEC IA ───
async function generateAIMission(userName, charName, rank) {
    try {
        const prompt = `Génère une mission de niveau ${rank} pour un ninja nommé ${charName} dans l'univers de Naruto. La mission doit avoir un nom cool, une description et une récompense (un jutsu ou un mode). Réponds au format:
Mission: [nom]
Description: [description]
Récompense: [récompense]`;

        const res = await axios.get("https://christus-api.vercel.app/ai/copilot", {
            params: { message: prompt },
            timeout: 20000
        });

        let reply = res.data;
        if (typeof reply === "object") {
            reply = reply.message || reply.reply || reply.result || reply.answer || "";
        }
        reply = String(reply).trim();

        const lines = reply.split('\n');
        let mission = { name: "Mission Mystérieuse", description: "Une mission difficile", reward: "Jutsu Scroll" };
        
        for (const line of lines) {
            if (line.toLowerCase().includes('mission:')) {
                mission.name = line.replace(/mission:/i, '').trim();
            } else if (line.toLowerCase().includes('description:')) {
                mission.description = line.replace(/description:/i, '').trim();
            } else if (line.toLowerCase().includes('récompense:') || line.toLowerCase().includes('recompense:')) {
                mission.reward = line.replace(/récompense:|recompense:/i, '').trim();
            }
        }
        
        mission.xp = Math.floor(Math.random() * 100) + 50;
        mission.rank = rank;
        return mission;
    } catch (error) {
        // Fallback
        const fallback = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
        return {
            name: fallback.name,
            description: `Mission de niveau ${fallback.rank}`,
            reward: fallback.reward,
            xp: fallback.xp,
            rank: fallback.rank
        };
    }
}

// ─── GENERER UN JUTSU AVEC IA ───
async function generateAIJutsu(userName, charName, level) {
    try {
        const prompt = `Crée un nouveau jutsu pour ${charName} dans l'univers de Naruto. Niveau ${level}. Donne un nom cool, un type (feu, eau, vent, foudre, terre, oeil, physique), des dégâts (entre 50 et 300) et un coût en chakra (entre 20 et 150). Format:
Jutsu: [nom]
Type: [type]
Dégâts: [nombre]
Chakra: [nombre]`;

        const res = await axios.get("https://christus-api.vercel.app/ai/copilot", {
            params: { message: prompt },
            timeout: 20000
        });

        let reply = res.data;
        if (typeof reply === "object") {
            reply = reply.message || reply.reply || reply.result || reply.answer || "";
        }
        reply = String(reply).trim();

        const lines = reply.split('\n');
        let jutsu = { name: "Jutsu Mystérieux", type: "physical", damage: 100, chakraCost: 40 };
        
        for (const line of lines) {
            if (line.toLowerCase().includes('jutsu:')) {
                jutsu.name = line.replace(/jutsu:/i, '').trim();
            } else if (line.toLowerCase().includes('type:')) {
                jutsu.type = line.replace(/type:/i, '').trim();
            } else if (line.toLowerCase().includes('dégâts:') || line.toLowerCase().includes('degats:')) {
                const dmg = parseInt(line.replace(/dégâts:|degats:/i, '').trim());
                if (!isNaN(dmg)) jutsu.damage = dmg;
            } else if (line.toLowerCase().includes('chakra:')) {
                const chakra = parseInt(line.replace(/chakra:/i, '').trim());
                if (!isNaN(chakra)) jutsu.chakraCost = chakra;
            }
        }
        
        return jutsu;
    } catch (error) {
        return { name: "Mystic Jutsu", type: "physical", damage: 120, chakraCost: 50 };
    }
}

// ─── MODULE PRINCIPAL ───
module.exports = {
    config: {
        name: "ninja",
        aliases: ["narutogame", "ninjawar", "impact", "rpg"],
        version: "6.0",
        author: "Master Charbel",
        role: 0,
        category: "game",
        shortDescription: { en: "🍥 Naruto Ultimate RPG avec IA" },
        guide: {
            en: `🍥 ${bold('NARUTO ULTIMATE RPG')}

🎮 ${bold('COMMANDES')} :
  ${bold('•')} ninja start <perso>  → Créer ton ninja
  ${bold('•')} ninja status        → Voir ta fiche
  ${bold('•')} ninja mission       → Faire une mission (IA générée)
  ${bold('•')} ninja train         → S'entraîner (gagner XP)
  ${bold('•')} ninja learn         → Apprendre un nouveau jutsu (IA)
  ${bold('•')} ninja mode          → Débloquer un nouveau mode
  ${bold('•')} ninja battle <perso> → Combat en ligne
  ${bold('•')} ninja daily         → Mission quotidienne

👥 ${bold('PERSONNAGES')} :
  naruto, sasuke, madara, kakashi, itachi, minato, hashirama`
        }
    },

    onStart: async function ({ message, args, event, api }) {
        const { senderID, threadID, mentions } = event;
        const data = loadNinjaData();
        const command = args[0]?.toLowerCase();
        const charChoice = args[1]?.toLowerCase();

        // ─── INITIALISATION ───
        if (!data.users[senderID]) {
            data.users[senderID] = {
                character: null,
                level: 1,
                xp: 0,
                xpNext: 100,
                rank: "Genin",
                jutsus: [],
                jutsusMastered: [],
                modes: ["Normal"],
                missions: 0,
                wins: 0,
                losses: 0,
                streak: 0,
                lastDaily: null,
                totalXp: 0,
                stats: { strength: 50, speed: 50, defense: 50, chakraControl: 50 }
            };
            saveNinjaData(data);
        }

        const user = data.users[senderID];

        // ─── START ───
        if (command === "start" || command === "create") {
            if (!charChoice || !CHARACTERS[charChoice]) {
                let charList = "";
                for (const [key, char] of Object.entries(CHARACTERS)) {
                    charList += `${char.emoji} ${bold(key)} (${char.name})\n`;
                }
                return message.reply(frame(
                    `🍥 ${bold('CRÉE TON NINJA')}
│
│  👤 Choisis ton personnage :
${charList.split('\n').map(l => `│  ${l}`).join('\n')}
│
│  💡 ninja start naruto`
                ));
            }

            const char = CHARACTERS[charChoice];
            user.character = charChoice;
            user.level = char.level;
            user.xp = char.xp;
            user.xpNext = char.xpNext;
            user.rank = char.rank;
            user.jutsus = char.jutsus;
            user.modes = char.modes;
            user.stats = char.stats;

            saveNinjaData(data);

            return message.reply(frame(
                `🍥 ${bold('NINJA CRÉÉ !')}
│
│  👤 ${char.emoji} ${bold(char.name)}
│  📊 ${bold('Rang')} : ${char.rank}
│  📈 ${bold('Niveau')} : ${char.level}
│  💠 ${bold('Jutsus')} : ${char.jutsus.join(', ')}
│  ⚡ ${bold('Modes')} : ${char.modes.join(', ')}
│
│  💡 ${bold('Prochaines étapes')} :
│  • ninja mission → Faire une mission
│  • ninja train → S'entraîner
│  • ninja learn → Apprendre un jutsu`
            ));
        }

        // ─── STATUS ───
        if (command === "status" || command === "stats" || command === "profile") {
            if (!user.character) {
                return message.reply(frame(
                    `🍥 ${bold('PAS DE NINJA')}
│
│  ⚠️ Commence par créer ton ninja !
│  💡 ninja start naruto`
                ));
            }

            const char = CHARACTERS[user.character];
            const hp = char.hp + (user.level - 1) * 20;
            const chakra = char.chakra + (user.level - 1) * 10;

            return message.reply(frame(
                `🍥 ${bold('FICHE NINJA')}
│
│  👤 ${char.emoji} ${bold(char.name)}
│  📊 ${bold('Rang')} : ${user.rank}
│  📈 ${bold('Niveau')} : ${user.level} (${user.xp}/${user.xpNext} XP)
│
│  💚 ${bold('HP')} : ${hp}
│  💠 ${bold('Chakra')} : ${chakra}
│
│  ⚔️ ${bold('Jutsus')} :
│  ${user.jutsus.join(', ')}
│
│  ⚡ ${bold('Modes')} :
│  ${user.modes.join(', ')}
│
│  🏆 ${bold('Statistiques')} :
│  ${user.wins}V - ${user.losses}D | 🔥 ${user.streak} série
│  📜 ${user.missions} missions
│  ✨ ${user.totalXp} XP total
│
│  💡 ninja mission pour progresser`
            ));
        }

        // ─── MISSION AVEC IA ───
        if (command === "mission" || command === "quest") {
            if (!user.character) {
                return message.reply(frame(
                    `🍥 ${bold('PAS DE NINJA')}
│
│  ⚠️ Crée ton ninja d'abord !
│  💡 ninja start naruto`
                ));
            }

            const char = CHARACTERS[user.character];
            const rankIndex = Math.min(Math.floor(user.level / 3), 5);
            const ranks = ["D", "D", "C", "C", "B", "B", "A", "A", "S", "S"];
            const rank = ranks[rankIndex] || "D";

            const thinking = await message.reply(frame(
                `⏳ ${bold('Génération de la mission...')}
│
│  🧠 L'IA crée une mission pour toi...`
            ));

            const mission = await generateAIMission(user.name || "Shinobi", char.name, rank);

            // Ajouter la mission
            const xpGain = mission.xp + Math.floor(Math.random() * 30);
            user.xp += xpGain;
            user.totalXp += xpGain;
            user.missions++;

            // Vérifier level up
            let levelUp = false;
            while (user.xp >= user.xpNext) {
                user.xp -= user.xpNext;
                user.level++;
                user.xpNext = Math.floor(user.xpNext * 1.5);
                levelUp = true;
            }

            // Mettre à jour le rang
            const ranks2 = ["Genin", "Chunin", "Jonin", "Anbu", "Kage", "Sannin", "Hokage", "Legendary"];
            const newRank = ranks2[Math.min(Math.floor(user.level / 3), ranks2.length - 1)];
            user.rank = newRank;

            saveNinjaData(data);

            try { await api.unsendMessage(thinking.messageID); } catch(e) {}

            let levelUpMsg = "";
            if (levelUp) {
                const charStats = CHARACTERS[user.character].stats;
                user.stats.strength += 5;
                user.stats.speed += 5;
                user.stats.defense += 5;
                user.stats.chakraControl += 5;
                levelUpMsg = `\n\n│  ⬆️ ${bold('NIVEAU SUPÉRIEUR !')} Niveau ${user.level}\n│  📈 Stats augmentées !`;
            }

            return message.reply(frame(
                `📜 ${bold('MISSION TERMINÉE')}
│
│  🎯 ${bold(mission.name)}
│  📝 ${mission.description}
│  📊 ${bold('Rang')} : ${mission.rank}
│
│  ✨ +${xpGain} XP
│  🎁 Récompense : ${mission.reward}
│  📈 Niveau : ${user.level} (${user.xp}/${user.xpNext} XP)
│  👑 Rang : ${user.rank}
│  📜 ${user.missions} missions complétées
${levelUpMsg}
│
│  💡 ninja mission pour la prochaine`
            ));
        }

        // ─── TRAIN ───
        if (command === "train" || command === "training") {
            if (!user.character) {
                return message.reply(frame(
                    `🍥 ${bold('PAS DE NINJA')}
│
│  ⚠️ Crée ton ninja d'abord !`
                ));
            }

            const trainXp = Math.floor(Math.random() * 30) + 10;
            user.xp += trainXp;
            user.totalXp += trainXp;

            let levelUp = false;
            while (user.xp >= user.xpNext) {
                user.xp -= user.xpNext;
                user.level++;
                user.xpNext = Math.floor(user.xpNext * 1.5);
                levelUp = true;
            }

            const ranks2 = ["Genin", "Chunin", "Jonin", "Anbu", "Kage", "Sannin", "Hokage", "Legendary"];
            const newRank = ranks2[Math.min(Math.floor(user.level / 3), ranks2.length - 1)];
            user.rank = newRank;

            saveNinjaData(data);

            let levelUpMsg = "";
            if (levelUp) {
                levelUpMsg = `\n\n│  ⬆️ ${bold('NIVEAU SUPÉRIEUR !')} Niveau ${user.level}`;
            }

            return message.reply(frame(
                `🏋️ ${bold('ENTRAÎNEMENT')}
│
│  💪 Tu t'es entraîné dur !
│  ✨ +${trainXp} XP
│  📈 Niveau : ${user.level} (${user.xp}/${user.xpNext} XP)
│  👑 Rang : ${user.rank}
${levelUpMsg}
│
│  💡 ninja mission pour progresser plus vite`
            ));
        }

        // ─── LEARN (Apprendre un jutsu avec IA) ───
        if (command === "learn" || command === "jutsu") {
            if (!user.character) {
                return message.reply(frame(
                    `🍥 ${bold('PAS DE NINJA')}
│
│  ⚠️ Crée ton ninja d'abord !`
                ));
            }

            if (user.jutsus.length >= 10) {
                return message.reply(frame(
                    `📚 ${bold('TROP DE JUTSUS')}
│
│  Tu as déjà ${user.jutsus.length} jutsus !
│  Continue à les maîtriser avant d'en apprendre de nouveaux.`
                ));
            }

            const char = CHARACTERS[user.character];
            const thinking = await message.reply(frame(
                `⏳ ${bold('Génération du jutsu...')}
│
│  🧠 L'IA crée un nouveau jutsu pour toi...`
            ));

            const newJutsu = await generateAIJutsu(user.name || "Shinobi", char.name, user.level);

            user.jutsus.push(newJutsu.name);
            // Ajouter aux attaques du personnage
            if (CHARACTERS[user.character]) {
                CHARACTERS[user.character].attacks.push({
                    name: newJutsu.name,
                    damage: newJutsu.damage,
                    chakraCost: newJutsu.chakraCost,
                    type: newJutsu.type
                });
            }

            saveNinjaData(data);

            try { await api.unsendMessage(thinking.messageID); } catch(e) {}

            return message.reply(frame(
                `📜 ${bold('NOUVEAU JUTSU APPRIS !')}
│
│  🔥 ${bold(newJutsu.name)}
│  ⚡ Type : ${newJutsu.type}
│  💢 Dégâts : ${newJutsu.damage}
│  💠 Chakra : ${newJutsu.chakraCost}
│
│  📚 Jutsus : ${user.jutsus.join(', ')}
│
│  💡 ninja learn pour en apprendre un autre`
            ));
        }

        // ─── MODE (Débloquer un mode) ───
        if (command === "mode" || command === "unlock") {
            if (!user.character) {
                return message.reply(frame(
                    `🍥 ${bold('PAS DE NINJA')}
│
│  ⚠️ Crée ton ninja d'abord !`
                ));
            }

            const availableModes = Object.keys(MODES).filter(m => !user.modes.includes(m));
            if (availableModes.length === 0) {
                return message.reply(frame(
                    `⚡ ${bold('TOUS LES MODES DÉBLOQUÉS')}
│
│  Tu as déjà tous les modes disponibles !
│  💡 Continue de progresser pour en débloquer de nouveaux.`
                ));
            }

            const newMode = availableModes[Math.floor(Math.random() * availableModes.length)];
            user.modes.push(newMode);

            saveNinjaData(data);

            return message.reply(frame(
                `⚡ ${bold('NOUVEAU MODE DÉBLOQUÉ !')}
│
│  🔥 ${bold(newMode)}
│  💪 ${MODES[newMode].boost}
│
│  ⚡ Modes : ${user.modes.join(', ')}
│
│  💡 Continue les missions pour débloquer plus de modes !`
            ));
        }

        // ─── BATTLE ───
        if (command === "battle" || command === "fight") {
            if (!user.character) {
                return message.reply(frame(
                    `🍥 ${bold('PAS DE NINJA')}
│
│  ⚠️ Crée ton ninja d'abord !`
                ));
            }

            const enemyChoice = args[1]?.toLowerCase();
            let enemy = null;

            if (enemyChoice && CHARACTERS[enemyChoice]) {
                enemy = CHARACTERS[enemyChoice];
            } else {
                const enemies = Object.values(CHARACTERS).filter(c => c.name !== CHARACTERS[user.character].name);
                enemy = enemies[Math.floor(Math.random() * enemies.length)];
            }

            const char = CHARACTERS[user.character];
            const playerHP = char.hp + (user.level - 1) * 20;
            const enemyHP = enemy.hp + Math.floor(Math.random() * 100);

            // Combat simplifié
            let pHP = playerHP;
            let eHP = enemyHP;
            let turn = 0;
            let logs = [];

            while (pHP > 0 && eHP > 0 && turn < 10) {
                turn++;
                const pDmg = Math.floor(Math.random() * 80) + 40 + user.level * 5;
                const eDmg = Math.floor(Math.random() * 60) + 30 + user.level * 3;

                eHP -= pDmg;
                logs.push(`⚔️ ${char.name} inflige ${pDmg} dégâts à ${enemy.name}`);

                if (eHP <= 0) break;

                pHP -= eDmg;
                logs.push(`💥 ${enemy.name} inflige ${eDmg} dégâts à ${char.name}`);
            }

            const victory = pHP > 0;
            const xpGain = victory ? 80 + user.level * 20 : 20 + user.level * 5;

            if (victory) {
                user.wins++;
                user.streak++;
                user.xp += xpGain;
                user.totalXp += xpGain;
            } else {
                user.losses++;
                user.streak = 0;
                user.xp += Math.floor(xpGain / 2);
                user.totalXp += Math.floor(xpGain / 2);
            }

            while (user.xp >= user.xpNext) {
                user.xp -= user.xpNext;
                user.level++;
                user.xpNext = Math.floor(user.xpNext * 1.5);
            }

            const ranks2 = ["Genin", "Chunin", "Jonin", "Anbu", "Kage", "Sannin", "Hokage", "Legendary"];
            const newRank = ranks2[Math.min(Math.floor(user.level / 3), ranks2.length - 1)];
            user.rank = newRank;

            saveNinjaData(data);

            return message.reply(frame(
                `⚔️ ${bold('COMBAT TERMINÉ')}
│
│  ${victory ? '✅' : '❌'} ${bold(victory ? 'VICTOIRE !' : 'DÉFAITE...')}
│
│  👤 ${char.emoji} ${bold(char.name)} VS ${enemy.emoji} ${bold(enemy.name)}
│
│  📊 ${bold('RÉSULTAT')} :
│  ${char.name} : ${Math.max(0, Math.round(pHP))} HP restants
│  ${enemy.name} : ${Math.max(0, Math.round(eHP))} HP restants
│
│  ✨ +${xpGain} XP
│  📈 Niveau : ${user.level} (${user.xp}/${user.xpNext} XP)
│  👑 Rang : ${user.rank}
│  🔥 Série : ${user.streak}
│
│  💡 ninja train pour récupérer`
            ));
        }

        // ─── DAILY ───
        if (command === "daily") {
            if (!user.character) {
                return message.reply(frame(
                    `🍥 ${bold('PAS DE NINJA')}
│
│  ⚠️ Crée ton ninja d'abord !`
                ));
            }

            const today = new Date().toDateString();
            if (user.lastDaily === today) {
                return message.reply(frame(
                    `📅 ${bold('DÉJA FAIT')}
│
│  Tu as déjà fait ta mission quotidienne aujourd'hui.
│  Reviens demain !`
                ));
            }

            const mission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
            const xpGain = mission.xp + 50;

            user.xp += xpGain;
            user.totalXp += xpGain;
            user.missions++;
            user.lastDaily = today;

            while (user.xp >= user.xpNext) {
                user.xp -= user.xpNext;
                user.level++;
                user.xpNext = Math.floor(user.xpNext * 1.5);
            }

            const ranks2 = ["Genin", "Chunin", "Jonin", "Anbu", "Kage", "Sannin", "Hokage", "Legendary"];
            const newRank = ranks2[Math.min(Math.floor(user.level / 3), ranks2.length - 1)];
            user.rank = newRank;

            saveNinjaData(data);

            return message.reply(frame(
                `📅 ${bold('MISSION QUOTIDIENNE')}
│
│  🎯 ${bold(mission.name)}
│  📊 Rang : ${mission.rank}
│  🎁 Récompense : ${mission.reward}
│
│  ✨ +${xpGain} XP
│  📈 Niveau : ${user.level}
│  👑 Rang : ${user.rank}
│
│  💡 Reviens demain pour une nouvelle mission !`
            ));
        }

        // ─── MENU ───
        if (!command) {
            const charStatus = user.character ? `👤 ${CHARACTERS[user.character].emoji} ${bold(user.rank)} Niv.${user.level}` : "⚠️ Crée ton ninja !";

            return message.reply(frame(
                `🍥 ${bold('NARUTO ULTIMATE RPG')}
│
│  ${charStatus}
│
│  🎮 ${bold('COMMANDES')} :
│  • start <perso>  → Créer un ninja
│  • status         → Fiche du ninja
│  • mission        → Mission IA
│  • train          → S'entraîner
│  • learn          → Apprendre un jutsu (IA)
│  • mode           → Débloquer un mode
│  • battle <perso> → Combattre
│  • daily          → Mission quotidienne
│
│  👥 ${bold('PERSONNAGES')} :
│  naruto, sasuke, madara, kakashi,
│  itachi, minato, hashirama
│
│  💡 ${bold('Démarre avec')} : ninja start naruto`
            ));
        }

        // ─── COMMANDE INCONNUE ───
        return message.reply(frame(
            `❌ ${bold('COMMANDE INCONNUE')}
│
│  📌 ninja pour le menu principal
│  💡 ninja start naruto pour commencer`
        ));
    }
};
