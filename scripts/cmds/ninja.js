const fs = require("fs-extra");
const path = require("path");

const NINJA_DATA_PATH = path.join(process.cwd(), "ninja_data.json");

function loadNinjaData() {
    if (!fs.existsSync(NINJA_DATA_PATH)) {
        const defaultData = { users: {}, characters: {} };
        fs.writeFileSync(NINJA_DATA_PATH, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(NINJA_DATA_PATH, "utf8"));
}

function saveNinjaData(data) {
    fs.writeFileSync(NINJA_DATA_PATH, JSON.stringify(data, null, 2));
}

// ─── 50 PERSONNAGES NARUTO ───
const CHARACTERS = {
    // HOKAGE
    "naruto": { name: "Naruto Uzumaki", emoji: "🍥", hp: 1000, chakra: 500, transformations: ["Normal"], jutsus: ["Rasengan", "Shadow Clone"], rank: "Genin" },
    "sasuke": { name: "Sasuke Uchiha", emoji: "⚡", hp: 950, chakra: 600, transformations: ["Normal"], jutsus: ["Chidori", "Fireball"], rank: "Genin" },
    "sakura": { name: "Sakura Haruno", emoji: "🌸", hp: 800, chakra: 400, transformations: ["Normal"], jutsus: ["Cherry Blossom", "Healing"], rank: "Genin" },
    "kakashi": { name: "Kakashi Hatake", emoji: "📖", hp: 900, chakra: 550, transformations: ["Normal"], jutsus: ["Chidori", "Kamui"], rank: "Jonin" },
    "itachi": { name: "Itachi Uchiha", emoji: "🕊️", hp: 850, chakra: 700, transformations: ["Normal"], jutsus: ["Amaterasu", "Tsukuyomi"], rank: "Sannin" },
    "minato": { name: "Minato Namikaze", emoji: "⚡", hp: 950, chakra: 600, transformations: ["Normal"], jutsus: ["Rasengan", "Flying Thunder God"], rank: "Hokage" },
    "hashirama": { name: "Hashirama Senju", emoji: "🌳", hp: 1300, chakra: 900, transformations: ["Normal"], jutsus: ["Wood Style", "Sage Mode"], rank: "Hokage" },
    "tobirama": { name: "Tobirama Senju", emoji: "💧", hp: 1100, chakra: 800, transformations: ["Normal"], jutsus: ["Water Style", "Flying Thunder God"], rank: "Hokage" },
    "hiruzen": { name: "Hiruzen Sarutobi", emoji: "🎯", hp: 900, chakra: 700, transformations: ["Normal"], jutsus: ["Fire Style", "Summoning"], rank: "Hokage" },
    "tsunade": { name: "Tsunade Senju", emoji: "💪", hp: 1200, chakra: 750, transformations: ["Normal"], jutsus: ["Cherry Blossom Impact", "Healing"], rank: "Hokage" },

    // AKATSUKI
    "pain": { name: "Pain", emoji: "🌌", hp: 1100, chakra: 800, transformations: ["Normal"], jutsus: ["Shinra Tensei", "Chibaku Tensei"], rank: "S-Rank" },
    "obito": { name: "Obito Uchiha", emoji: "🌀", hp: 1050, chakra: 750, transformations: ["Normal"], jutsus: ["Kamui", "Fire Style"], rank: "S-Rank" },
    "madara": { name: "Madara Uchiha", emoji: "👁️", hp: 1200, chakra: 800, transformations: ["Normal"], jutsus: ["Susanoo", "Fire Style"], rank: "Legendary" },
    "itachi": { name: "Itachi Uchiha", emoji: "🕊️", hp: 850, chakra: 700, transformations: ["Normal"], jutsus: ["Amaterasu", "Tsukuyomi"], rank: "S-Rank" },
    "kisame": { name: "Kisame Hoshigaki", emoji: "🦈", hp: 1000, chakra: 700, transformations: ["Normal"], jutsus: ["Water Style", "Shark Summoning"], rank: "S-Rank" },
    "deidara": { name: "Deidara", emoji: "💣", hp: 800, chakra: 600, transformations: ["Normal"], jutsus: ["Clay Explosion", "C4"], rank: "S-Rank" },
    "sasori": { name: "Sasori", emoji: "🕷️", hp: 850, chakra: 650, transformations: ["Normal"], jutsus: ["Puppet Technique", "Poison"], rank: "S-Rank" },
    "konan": { name: "Konan", emoji: "📄", hp: 800, chakra: 600, transformations: ["Normal"], jutsus: ["Paper Style", "Explosion"], rank: "S-Rank" },
    "hidan": { name: "Hidan", emoji: "☠️", hp: 900, chakra: 500, transformations: ["Normal"], jutsus: ["Curse Technique", "Scythe"], rank: "S-Rank" },
    "kakuzu": { name: "Kakuzu", emoji: "🧩", hp: 1000, chakra: 700, transformations: ["Normal"], jutsus: ["Earth Style", "Threads"], rank: "S-Rank" },

    // SANNIN
    "jiraiya": { name: "Jiraiya", emoji: "🐸", hp: 1000, chakra: 750, transformations: ["Normal"], jutsus: ["Sage Mode", "Summoning"], rank: "Sannin" },
    "orochimaru": { name: "Orochimaru", emoji: "🐍", hp: 950, chakra: 700, transformations: ["Normal"], jutsus: ["Snake Style", "Summoning"], rank: "Sannin" },

    // KONOHA 12
    "rocklee": { name: "Rock Lee", emoji: "🥋", hp: 900, chakra: 300, transformations: ["Normal"], jutsus: ["Leaf Hurricane", "Gates"], rank: "Chunin" },
    "neji": { name: "Neji Hyuga", emoji: "🌀", hp: 850, chakra: 400, transformations: ["Normal"], jutsus: ["Byakugan", "Rotation"], rank: "Jonin" },
    "shikamaru": { name: "Shikamaru Nara", emoji: "🧠", hp: 800, chakra: 350, transformations: ["Normal"], jutsus: ["Shadow Possession", "Strategy"], rank: "Jonin" },
    "hinata": { name: "Hinata Hyuga", emoji: "💜", hp: 850, chakra: 400, transformations: ["Normal"], jutsus: ["Byakugan", "Gentle Fist"], rank: "Chunin" },
    "choji": { name: "Choji Akimichi", emoji: "🍖", hp: 950, chakra: 350, transformations: ["Normal"], jutsus: ["Butterfly Mode", "Sumo"], rank: "Chunin" },
    "kiba": { name: "Kiba Inuzuka", emoji: "🐕", hp: 850, chakra: 350, transformations: ["Normal"], jutsus: ["Fang Technique", "Beast Mode"], rank: "Chunin" },
    "shino": { name: "Shino Aburame", emoji: "🐞", hp: 800, chakra: 400, transformations: ["Normal"], jutsus: ["Insect Style", "Parasite"], rank: "Chunin" },
    "ino": { name: "Ino Yamanaka", emoji: "🌻", hp: 800, chakra: 350, transformations: ["Normal"], jutsus: ["Mind Transfer", "Psychic"], rank: "Chunin" },
    "tenten": { name: "Tenten", emoji: "🎯", hp: 800, chakra: 300, transformations: ["Normal"], jutsus: ["Weapons", "Summoning"], rank: "Chunin" },

    // KAGE
    "gaara": { name: "Gaara", emoji: "🏜️", hp: 1000, chakra: 600, transformations: ["Normal"], jutsus: ["Sand Style", "Shukaku"], rank: "Kage" },
    "onoki": { name: "Onoki", emoji: "🗿", hp: 900, chakra: 650, transformations: ["Normal"], jutsus: ["Particle Style", "Earth"], rank: "Kage" },
    "a": { name: "A", emoji: "⚡", hp: 1050, chakra: 600, transformations: ["Normal"], jutsus: ["Lightning Armor", "Strength"], rank: "Kage" },
    "mei": { name: "Mei Terumi", emoji: "🌊", hp: 900, chakra: 600, transformations: ["Normal"], jutsus: ["Water Style", "Lava"], rank: "Kage" },
    "gengetsu": { name: "Gengetsu Hozuki", emoji: "🦑", hp: 850, chakra: 600, transformations: ["Normal"], jutsus: ["Water Style", "Clam Summoning"], rank: "Kage" },
    "mu": { name: "Mu", emoji: "👻", hp: 850, chakra: 600, transformations: ["Normal"], jutsus: ["Particle Style", "Flight"], rank: "Kage" },

    // LEGENDARY
    "indra": { name: "Indra Otsutsuki", emoji: "🌙", hp: 1300, chakra: 900, transformations: ["Normal"], jutsus: ["Sharingan", "Susanoo"], rank: "Legendary" },
    "ashura": { name: "Ashura Otsutsuki", emoji: "☀️", hp: 1300, chakra: 900, transformations: ["Normal"], jutsus: ["Rasengan", "Sage Mode"], rank: "Legendary" },
    "hagoromo": { name: "Hagoromo Otsutsuki", emoji: "🌟", hp: 1500, chakra: 1000, transformations: ["Normal"], jutsus: ["Rinnegan", "Creation"], rank: "God" },
    "hamura": { name: "Hamura Otsutsuki", emoji: "🌙", hp: 1400, chakra: 950, transformations: ["Normal"], jutsus: ["Byakugan", "Yin-Yang"], rank: "God" },

    // OTHER
    "killerbee": { name: "Killer Bee", emoji: "🐙", hp: 1000, chakra: 700, transformations: ["Normal"], jutsus: ["Lariat", "Tailed Beast"], rank: "Jonin" },
    "danzo": { name: "Danzo Shimura", emoji: "🎭", hp: 900, chakra: 600, transformations: ["Normal"], jutsus: ["Wind Style", "Izangi"], rank: "Kage" },
    "yamato": { name: "Yamato", emoji: "🌱", hp: 850, chakra: 500, transformations: ["Normal"], jutsus: ["Wood Style", "Earth"], rank: "Jonin" },
    "sai": { name: "Sai", emoji: "🎨", hp: 800, chakra: 450, transformations: ["Normal"], jutsus: ["Ink Style", "Summoning"], rank: "Chunin" },
    "anko": { name: "Anko Mitarashi", emoji: "🐍", hp: 800, chakra: 450, transformations: ["Normal"], jutsus: ["Snake Style", "Curse"], rank: "Special Jonin" },
    "ibiki": { name: "Ibiki Morino", emoji: "⛓️", hp: 800, chakra: 400, transformations: ["Normal"], jutsus: ["Iron Maiden", "Interrogation"], rank: "Special Jonin" },
    "raikage": { name: "Raikage", emoji: "⚡", hp: 1100, chakra: 650, transformations: ["Normal"], jutsus: ["Lightning Armor", "Strength"], rank: "Kage" },
    "mizukage": { name: "Mizukage", emoji: "🌊", hp: 1000, chakra: 650, transformations: ["Normal"], jutsus: ["Water Style", "Lava"], rank: "Kage" },
    "tsuchikage": { name: "Tsuchikage", emoji: "🗿", hp: 950, chakra: 650, transformations: ["Normal"], jutsus: ["Particle Style", "Earth"], rank: "Kage" },
    "kushina": { name: "Kushina Uzumaki", emoji: "🟣", hp: 900, chakra: 600, transformations: ["Normal"], jutsus: ["Adamantine Chains", "Sealing"], rank: "Jonin" },
    "rin": { name: "Rin Nohara", emoji: "🩺", hp: 800, chakra: 400, transformations: ["Normal"], jutsus: ["Healing", "Medical Ninjutsu"], rank: "Chunin" },
    "nagato": { name: "Nagato", emoji: "🌌", hp: 1000, chakra: 800, transformations: ["Normal"], jutsus: ["Rinnegan", "Shinra Tensei"], rank: "S-Rank" }
};

// ─── TRANSFORMATIONS PAR PERSONNAGE ───
const TRANSFORMATIONS = {
    "naruto": ["Normal", "Sage Mode", "Kurama Chakra Mode", "Six Paths Sage Mode", "Baryon Mode"],
    "sasuke": ["Normal", "Sharingan", "Mangekyo Sharingan", "Eternal Mangekyo", "Rinnegan"],
    "madara": ["Normal", "Sharingan", "Mangekyo Sharingan", "Eternal Mangekyo", "Rinnegan", "Ten Tails Jinchuriki"],
    "kakashi": ["Normal", "Sharingan", "Mangekyo Sharingan"],
    "itachi": ["Normal", "Sharingan", "Mangekyo Sharingan"],
    "minato": ["Normal", "Sage Mode", "Kurama Chakra Mode"],
    "naruto": ["Normal", "Sage Mode", "Kurama Chakra Mode", "Six Paths Sage Mode", "Baryon Mode"],
    "sasuke": ["Normal", "Sharingan", "Mangekyo Sharingan", "Eternal Mangekyo", "Rinnegan"],
    "madara": ["Normal", "Sharingan", "Mangekyo Sharingan", "Eternal Mangekyo", "Rinnegan", "Ten Tails Jinchuriki"],
    "kakashi": ["Normal", "Sharingan", "Mangekyo Sharingan"],
    "itachi": ["Normal", "Sharingan", "Mangekyo Sharingan"],
    "minato": ["Normal", "Sage Mode", "Kurama Chakra Mode"],
    "hashirama": ["Normal", "Sage Mode"],
    "tobirama": ["Normal"],
    "hiruzen": ["Normal"],
    "tsunade": ["Normal", "Byakugou Seal"],
    "pain": ["Normal"],
    "obito": ["Normal", "Sharingan", "Mangekyo Sharingan", "Rinnegan"],
    "jiraiya": ["Normal", "Sage Mode"],
    "orochimaru": ["Normal"],
    "rocklee": ["Normal", "Gate of Death"],
    "neji": ["Normal", "Byakugan"],
    "shikamaru": ["Normal"],
    "gaara": ["Normal", "Shukaku", "One Tail"],
    "killerbee": ["Normal", "Eight Tails"],
    "hagoromo": ["Normal", "Six Paths Sage Mode"],
    "indra": ["Normal", "Sharingan", "Mangekyo Sharingan"],
    "ashura": ["Normal", "Sage Mode"],
    "nagato": ["Normal", "Rinnegan"]
};

// ─── MISSIONS ───
const MISSIONS = [
    { name: "Escorte le Daimyo", rank: "D", xp: 50, money: 100 },
    { name: "Chasser le chat", rank: "D", xp: 40, money: 80 },
    { name: "Protéger le village", rank: "C", xp: 80, money: 150 },
    { name: "Affronter les bandits", rank: "C", xp: 100, money: 200 },
    { name: "Infiltration", rank: "B", xp: 150, money: 300 },
    { name: "Défendre Konoha", rank: "A", xp: 250, money: 500 },
    { name: "Mission S-Rank", rank: "S", xp: 400, money: 800 },
    { name: "Combattre l'Akatsuki", rank: "S", xp: 500, money: 1000 },
    { name: "Protéger le monde", rank: "SS", xp: 700, money: 1500 }
];

const bold = (txt) => {
    const map = {a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭'};
    return txt.split('').map(c => map[c] || c).join('');
};

module.exports = {
    config: {
        name: "impact",
        aliases: ["naruto", "ninja", "ultimate"],
        version: "7.0",
        author: "Master Charbel",
        role: 0,
        category: "game",
        shortDescription: { en: "🍥 Naruto Ultimate Ninja Impact" }
    },

    onStart: async function ({ message, args, event, api }) {
        const { senderID, threadID } = event;
        const data = loadNinjaData();
        
        if (!data.users[senderID]) {
            data.users[senderID] = { 
                character: "naruto",
                level: 1,
                xp: 0,
                xpNext: 100,
                money: 0,
                rank: "Genin",
                transformations: ["Normal"],
                jutsus: ["Rasengan", "Shadow Clone"],
                missions: 0,
                wins: 0,
                losses: 0,
                streak: 0,
                achievements: []
            };
            saveNinjaData(data);
        }

        const user = data.users[senderID];
        const playerChar = CHARACTERS[user.character] || CHARACTERS["naruto"];
        const command = args[0]?.toLowerCase();

        // ─── MENU ───
        if (!command) {
            const transform = user.transformations.join(" → ");
            return message.reply(
                `🍥 ${bold('NARUTO ULTIMATE NINJA IMPACT')}
│
│  👤 ${playerChar.emoji} ${bold(playerChar.name)}
│  📊 ${bold('Rang')} : ${user.rank} | ${bold('Niveau')} ${user.level}
│  🔥 ${bold('Transformations')} : ${transform}
│  💰 ${user.money} Ryos | 🏆 ${user.wins}V - ${user.losses}D
│
│  🎮 ${bold('COMMANDES')} :
│  • ${bold('impact')} mission        → Faire une mission
│  • ${bold('impact')} train          → S'entraîner
│  • ${bold('impact')} status         → Voir ta fiche
│  • ${bold('impact')} select <perso> → Changer de perso
│  • ${bold('impact')} list           → Liste des persos
│  • ${bold('impact')} vs <perso>     → Combat
│
│  💡 ${bold('Exemple')} : impact mission`
            );
        }

        // ─── LISTE DES PERSONNAGES ───
        if (command === "list") {
            let list = `👥 ${bold('50 PERSONNAGES')}\n│\n`;
            let i = 1;
            for (const [key, char] of Object.entries(CHARACTERS)) {
                const selected = key === user.character ? " ✅" : "";
                list += `│  ${i}. ${char.emoji} ${bold(key)} (${char.rank})${selected}\n`;
                i++;
            }
            list += `\n│  💡 impact select <nom> pour choisir`;
            return message.reply(list);
        }

        // ─── SELECTIONNER UN PERSONNAGE ───
        if (command === "select" || command === "choose") {
            const name = args[1]?.toLowerCase();
            if (!name || !CHARACTERS[name]) {
                return message.reply(`❌ Personnage "${name}" introuvable. Tape impact list pour voir les 50 persos.`);
            }
            const char = CHARACTERS[name];
            const defaultTransforms = TRANSFORMATIONS[name] || ["Normal"];
            const defaultJutsus = char.jutsus || ["Technique de base"];
            
            user.character = name;
            user.transformations = defaultTransforms;
            user.jutsus = defaultJutsus;
            saveNinjaData(data);

            return message.reply(
                `✅ ${bold('Personnage sélectionné !')}
│
│  👤 ${char.emoji} ${bold(char.name)}
│  📊 ${bold('Rang')} : ${char.rank}
│  ⚡ ${bold('Transformations')} : ${defaultTransforms.join(" → ")}
│  📜 ${bold('Jutsus')} : ${defaultJutsus.join(", ")}
│
│  💡 impact mission pour commencer !`
            );
        }

        // ─── STATUS ───
        if (command === "status" || command === "profile") {
            const transform = user.transformations.join(" → ");
            const jutsus = user.jutsus.join(", ");
            return message.reply(
                `📋 ${bold('FICHE NINJA')}
│
│  👤 ${playerChar.emoji} ${bold(playerChar.name)}
│  📊 ${bold('Rang')} : ${user.rank} | ${bold('Niveau')} ${user.level}
│  ✨ XP : ${user.xp}/${user.xpNext}
│  💰 ${user.money} Ryos
│  🔥 ${bold('Transformations')} : ${transform}
│  📜 ${bold('Jutsus')} : ${jutsus}
│  🏆 ${user.wins}V - ${user.losses}D | 🔥 Série : ${user.streak}
│  📜 Missions : ${user.missions}
│  🏅 ${bold('Succès')} : ${user.achievements.join(", ") || "Aucun"}`
            );
        }

        // ─── MISSION AVEC ÉVOLUTION ───
        if (command === "mission" || command === "quest") {
            const mission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
            const xpGain = mission.xp + Math.floor(Math.random() * 30);
            const moneyGain = mission.money + Math.floor(Math.random() * 50);

            user.xp += xpGain;
            user.money += moneyGain;
            user.missions++;

            // Level Up
            let levelUp = false;
            while (user.xp >= user.xpNext) {
                user.xp -= user.xpNext;
                user.level++;
                user.xpNext = Math.floor(user.xpNext * 1.5);
                levelUp = true;
            }

            // Changement de rang
            const ranks = ["Genin", "Chunin", "Jonin", "Anbu", "Kage", "Sannin", "Hokage", "Legendary", "God"];
            const newRank = ranks[Math.min(Math.floor(user.level / 3), ranks.length - 1)];
            if (newRank !== user.rank) {
                user.rank = newRank;
            }

            // ─── NOUVELLE TRANSFORMATION (Sasuke → Mangekyo) ───
            let newTransform = "";
            const charTransforms = TRANSFORMATIONS[user.character] || ["Normal"];
            const currentIndex = charTransforms.indexOf(user.transformations[user.transformations.length - 1]);
            
            if (currentIndex !== -1 && currentIndex < charTransforms.length - 1 && Math.random() > 0.7) {
                const nextTransform = charTransforms[currentIndex + 1];
                if (!user.transformations.includes(nextTransform)) {
                    user.transformations.push(nextTransform);
                    newTransform = `\n│  ⚡ ${bold('NOUVELLE TRANSFORMATION !')} ${nextTransform}`;
                }
            }

            // ─── NOUVEAU JUTSU ───
            let newJutsu = "";
            const allJutsus = ["Rasengan", "Chidori", "Shadow Clone", "Fireball", "Sage Mode", "Susanoo", "Amaterasu", "Kamui", "Wood Style", "Particle Style", "Rinnegan", "Six Paths Sage"];
            const availableJutsus = allJutsus.filter(j => !user.jutsus.includes(j));
            if (availableJutsus.length > 0 && Math.random() > 0.8) {
                const jutsu = availableJutsus[Math.floor(Math.random() * availableJutsus.length)];
                user.jutsus.push(jutsu);
                newJutsu = `\n│  📜 ${bold('NOUVEAU JUTSU !')} ${jutsu}`;
            }

            // ─── SUCCÈS ───
            let achievement = "";
            if (user.missions === 10 && !user.achievements.includes("Missionnaire")) {
                user.achievements.push("Missionnaire");
                achievement = `\n│  🏅 ${bold('SUCCÈS DÉBLOQUÉ !')} Missionnaire (10 missions)`;
            }
            if (user.level === 5 && !user.achievements.includes("Chunin")) {
                user.achievements.push("Chunin");
                achievement = `\n│  🏅 ${bold('SUCCÈS DÉBLOQUÉ !')} Chunin (Niveau 5)`;
            }

            saveNinjaData(data);

            let levelMsg = levelUp ? `\n│  ⬆️ ${bold('NIVEAU SUPÉRIEUR !')} Niveau ${user.level}` : "";

            return message.reply(
                `📜 ${bold('MISSION TERMINÉE')}
│
│  🎯 ${bold(mission.name)} (Rang ${mission.rank})
│  ✨ +${xpGain} XP | 💰 +${moneyGain} Ryos
│  📈 Niveau ${user.level} (${user.xp}/${user.xpNext} XP)
│  👑 ${bold('Rang')} : ${user.rank}
${levelMsg}
${newTransform}
${newJutsu}
${achievement}
│
│  💡 impact mission pour continuer`
            );
        }

        // ─── TRAIN ───
        if (command === "train") {
            const xpGain = Math.floor(Math.random() * 30) + 10;
            user.xp += xpGain;

            let levelUp = false;
            while (user.xp >= user.xpNext) {
                user.xp -= user.xpNext;
                user.level++;
                user.xpNext = Math.floor(user.xpNext * 1.5);
                levelUp = true;
            }

            const ranks = ["Genin", "Chunin", "Jonin", "Anbu", "Kage", "Sannin", "Hokage", "Legendary", "God"];
            const newRank = ranks[Math.min(Math.floor(user.level / 3), ranks.length - 1)];
            if (newRank !== user.rank) {
                user.rank = newRank;
            }

            saveNinjaData(data);

            let levelMsg = levelUp ? `\n│  ⬆️ ${bold('NIVEAU SUPÉRIEUR !')} Niveau ${user.level}` : "";

            return message.reply(
                `🏋️ ${bold('ENTRAÎNEMENT')}
│
│  💪 Tu t'es entraîné dur !
│  ✨ +${xpGain} XP
│  📈 Niveau ${user.level} (${user.xp}/${user.xpNext} XP)
│  👑 ${bold('Rang')} : ${user.rank}
${levelMsg}
│
│  💡 impact mission pour progresser plus vite`
            );
        }

        // ─── COMBAT ───
        if (command === "vs" || command === "battle" || command === "fight") {
            const target = args[1]?.toLowerCase();
            let opponent = null;

            if (target && CHARACTERS[target]) {
                opponent = CHARACTERS[target];
            } else {
                const enemies = Object.values(CHARACTERS).filter(c => c.name !== playerChar.name);
                opponent = enemies[Math.floor(Math.random() * enemies.length)];
            }

            // COMBAT SIMPLE
            let pHP = 1000 + user.level * 20;
            let oHP = opponent.hp;
            let turn = 0;
            let logs = [];

            while (pHP > 0 && oHP > 0 && turn < 10) {
                turn++;
                const pDmg = Math.floor(Math.random() * 80) + 40 + user.level * 5;
                const oDmg = Math.floor(Math.random() * 60) + 30;

                oHP -= pDmg;
                logs.push(`⚔️ ${playerChar.name} inflige ${pDmg} dégâts`);

                if (oHP <= 0) break;

                pHP -= oDmg;
                logs.push(`💥 ${opponent.name} inflige ${oDmg} dégâts`);
            }

            const victory = pHP > 0;
            const xpGain = victory ? 80 + user.level * 10 : 20 + user.level * 5;
            const moneyGain = victory ? 100 + user.level * 20 : 20;

            user.xp += xpGain;
            user.money += moneyGain;
            if (victory) { user.wins++; user.streak++; } else { user.losses++; user.streak = 0; }

            while (user.xp >= user.xpNext) {
                user.xp -= user.xpNext;
                user.level++;
                user.xpNext = Math.floor(user.xpNext * 1.5);
            }

            const ranks = ["Genin", "Chunin", "Jonin", "Anbu", "Kage", "Sannin", "Hokage", "Legendary", "God"];
            const newRank = ranks[Math.min(Math.floor(user.level / 3), ranks.length - 1)];
            if (newRank !== user.rank) {
                user.rank = newRank;
            }

            saveNinjaData(data);

            return message.reply(
                `⚔️ ${bold('COMBAT TERMINÉ')}
│
│  ${victory ? '✅' : '❌'} ${bold(victory ? 'VICTOIRE !' : 'DÉFAITE...')}
│
│  👤 ${playerChar.emoji} ${playerChar.name} VS ${opponent.emoji} ${opponent.name}
│  📊 ${playerChar.name} : ${Math.round(pHP)} HP restants
│  📊 ${opponent.name} : ${Math.round(oHP)} HP restants
│  🔄 ${turn} tours
│
│  ✨ +${xpGain} XP | 💰 +${moneyGain} Ryos
│  📈 Niveau ${user.level} | 👑 ${user.rank}
│  🔥 Série : ${user.streak}
│  🏆 ${user.wins}V - ${user.losses}D
│
│  💡 impact vs <perso> pour rejouer`
            );
        }

        return message.reply(
            `❌ ${bold('COMMANDE INCONNUE')}
│
│  📌 impact → Menu
│  📌 impact mission → Mission
│  📌 impact train → S'entraîner
│  📌 impact status → Fiche
│  📌 impact select <nom> → Changer de perso
│  📌 impact list → 50 persos
│  📌 impact vs <perso> → Combat`
        );
    }
};
