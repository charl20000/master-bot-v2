const axios = require("axios");
const fs = require("fs-extra");

const memoryPath = "./naruto_memory.json";
const SAVE_PATH = "./naruto_save.json";

// ─── CONFIGURATION GOAT BOT V2 ───
const gameName = "🍥 NARUTO ULTIMATE NINJA IMPACT 🍥";
const gameVersion = "PSP EDITION v3.0";

function loadMemory() {
    if (!fs.existsSync(memoryPath)) return {};
    return JSON.parse(fs.readFileSync(memoryPath, "utf8"));
}

function saveMemory(data) {
    fs.writeFileSync(memoryPath, JSON.stringify(data, null, 2));
}

function loadSave() {
    if (!fs.existsSync(SAVE_PATH)) return { 
        xp: 0, 
        level: 1, 
        ryo: 0, 
        characters: ["Naruto Uzumaki"], 
        mode: "histoire", 
        arc: 1, 
        chapitre: 1, 
        unlocks: ["Naruto Uzumaki"],
        stats: { wins: 0, losses: 0 },
        inventory: []
    };
    return JSON.parse(fs.readFileSync(SAVE_PATH, "utf8"));
}

function saveSave(data) {
    fs.writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2));
}

// Police stylisée Naruto
const ninjaStyle = (txt) => {
    const map = {
        a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',
        n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',
        A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ꜰ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',
        N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',S:'ꜱ',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'
    };
    return txt.split('').map(c => map[c] || c).join('');
};

// Barre de chargement
const loadingBar = (percent) => {
    const filled = Math.round(percent / 10);
    return '▰'.repeat(Math.max(0, Math.min(10, filled))) + '▱'.repeat(Math.max(0, 10 - filled)) + ` ${percent}%`;
};

// Frame Ninja
const ninjaFrame = (title, content) => {
    return `
╔══════════════════════════════════════╗
║  ${ninjaStyle(title)}
╠══════════════════════════════════════╣
║
${content.split('\n').map(line => `║  ${line}`).join('\n')}
║
╚══════════════════════════════════════╝
  🍥 Dattebayo ! 🍥
`.trim();
};

// Animation Rasengan
const rasenganAnimation = `
    🌀🌀🌀🌀🌀
  🌀🌀🌀🌀🌀🌀🌀
 🌀🌀🌀🌀🌀🌀🌀🌀
🌀🌀🌀🌀🌀🌀🌀🌀🌀
 🌀🌀🌀🌀🌀🌀🌀🌀
  🌀🌀🌀🌀🌀🌀🌀
    🌀🌀🌀🌀🌀
`;

module.exports = {
    config: {
        name: "naruto impact",
        aliases: ["nni", "ultimate", "ninja", "impact", "narutogame", "narutoninja"],
        version: "3.0",
        author: "Naruto Uzumaki",
        countDown: 5,
        role: 0,
        shortDescription: { 
            en: "🍥 Naruto Ultimate Ninja Impact - PSP Game" 
        },
        longDescription: { 
            en: "Jouez à Naruto Ultimate Ninja Impact directement dans votre chat ! Mode Histoire, Combats, Missions et plus !" 
        },
        category: "game",
        guide: { 
            en: `🍥 ${gameName} 🍥
━━━━━━━━━━━━━━━━━━━━━━
📖 GUIDE COMPLET :
━━━━━━━━━━━━━━━━━━━━━━
{prefix}naruto menu - Menu Principal
{prefix}naruto histoire - Mode Histoire
{prefix}naruto combat - Combat Sans Fil
{prefix}naruto defi - Défier une Personne
{prefix}naruto missions - Mode Mission
{prefix}naruto collection - Collection
{prefix}naruto boutique - Boutique Ninja
{prefix}naruto stats - Statistiques
{prefix}naruto ecole - Académie Ninja
{prefix}naruto jouer - Continuer l'histoire
{prefix}naruto credits - Crédits
{prefix}naruto sauvegarde - Gérer sauvegarde`
        }
    },

    onStart: async function ({ api, event, args, message, usersData, threadsData, role }) {
        const { senderID, threadID, messageID } = event;
        const cmd = args[0]?.toLowerCase();
        const subArgs = args.slice(1);
        const db = loadMemory();
        let save = loadSave();

        // Initialisation joueur
        if (!db[senderID]) {
            db[senderID] = { 
                name: null, 
                ninjaRank: "Étudiant de l'Académie",
                clan: "Konoha",
                history: [], 
                inCombat: false,
                combatHP: 1000,
                chakra: 1000,
                comboCount: 0,
                modeActuel: "menu",
                dailyChallenge: null,
                lastDaily: null
            };
        }

        let userName = db[senderID].name;
        if (!userName) {
            try {
                const info = await api.getUserInfo(senderID);
                userName = info[senderID]?.name || "Shinobi Inconnu";
                db[senderID].name = userName;
                saveMemory(db);
            } catch(e) {
                userName = "Shinobi Inconnu";
            }
        }

        // ─── RÉPONSES DU JEU ───
        const gameResponses = {
            
            // MENU PRINCIPAL
            menu: () => {
                const menuText = `
🎮 ${ninjaStyle('MENU PRINCIPAL')} 🎮
━━━━━━━━━━━━━━━━━━━━━━
👤 Joueur : ${userName}
🎖️ Rang : ${db[senderID].ninjaRank}
💰 Ryôs : ${save.ryo.toLocaleString()}
⭐ Niveau : ${save.level}
⚔️ Perso : ${save.characters[0]}
━━━━━━━━━━━━━━━━━━━━━━

🍜 1. 📜 MODE HISTOIRE
   « La Voie du Maître »
   Arc ${save.arc}/5 - Chapitre ${save.chapitre}/5

⚔️ 2. ⚔️ COMBAT SANS FIL
   « Affrontez vos amis ! »
   Mode Solo & Multijoueur

👤 3. 👤 DÉFIER UNE PERSONNE
   « Testez votre puissance ! »
   CPU Niveau 1-10

📜 4. 📜 MODE MISSION
   « Accomplissez des missions ! »
   Rang D à Rang S

👥 5. 👥 COLLECTION
   « ${(save.unlocks?.length||0)}/34 Personnages ! »
   Débloquez-les tous !

🏪 6. 🏪 BOUTIQUE NINJA
   « Équipez-vous ! »
   Armes & Objets

💾 7. 💾 SAUVEGARDE
   « Continuez l'aventure ! »
   Sauvegarder / Charger

🏆 8. 🏆 STATISTIQUES
   « Votre progression ! »
   Stats de Combat

📖 9. 📖 ACADÉMIE NINJA
   « Apprenez les bases ! »
   Tutoriel Complet

🎬 10. 🎬 CRÉDITS
   « L'équipe du jeu »

━━━━━━━━━━━━━━━━━━━━━━
📊 Progression : ${loadingBar(Math.min((save.xp/(save.level*100))*100, 100))}

💡 Tapez {naruto} <mode> pour jouer !
   Exemple : {naruto} histoire
`.trim();
                return ninjaFrame("NARUTO ULTIMATE NINJA IMPACT", menuText);
            },

            // MODE HISTOIRE
            histoire: () => {
                const arcs = [
                    { id: 1, name: "La Menace de l'Akatsuki", chapitres: ["Sauvetage de Gaara 🏜️", "Confrontation avec Sasori 🦂", "Poursuite de Deidara 💥", "Combat contre Itachi 👁️", "La Vraie Nature de Pain ☁️"], boss: "Sasori - Marionnettiste Suprême" },
                    { id: 2, name: "La Traque d'Itachi", chapitres: ["Formation Hebi 🐍", "Combat contre Kisame 🌊", "Affrontement Fratricide ⚔️", "Révélation de Madara 🌀", "Héritage du Clan Uchiha 🔥"], boss: "Itachi Uchiha - Susano'o" },
                    { id: 3, name: "L'Assaut de Pain", chapitres: ["Retour au Village 🍃", "Invasion de Konoha 💀", "Naruto vs Pain ⚡", "Hinata vs Pain 💜", "Naruto Mode Sage 🐸"], boss: "Pain - Almighty Push" },
                    { id: 4, name: "Kage Summit & Grande Guerre", chapitres: ["Réunion des 5 Kage 👑", "Sasuke vs Danzo ⚔️", "Grande Guerre Ninja 💀", "Naruto vs Kyûbi 🦊", "Alliance Shinobi 🤝"], boss: "Sasuke - Mangekyô" },
                    { id: 5, name: "La Prophétie Accomplie", chapitres: ["Alliés Inattendus 🌟", "Madara vs Alliance ⚡", "Combat Final 🔥", "Naruto & Sasuke Unis 🤝", "Destin du Monde Ninja 🌍"], boss: "Kaguya Ôtsutsuki - Ultime" }
                ];

                const currentArc = arcs.find(a => a.id === save.arc) || arcs[0];
                const histoireText = `
📜 ${ninjaStyle('LA VOIE DU MAÎTRE')} 📜
━━━━━━━━━━━━━━━━━━━━━━
🎬 ARC ${currentArc.id} : ${currentArc.name}
📍 Chapitre ${save.chapitre} : ${currentArc.chapitres[save.chapitre-1] || '???'}

👹 Boss : ${currentArc.boss}

📊 Progression :
${currentArc.chapitres.map((chap, i) => {
    const emoji = i + 1 < save.chapitre ? '✅' : i + 1 === save.chapitre ? '▶️' : '🔒';
    return `  ${emoji} Ch.${i+1} : ${chap}`;
}).join('\n')}

🎮 Actions :
▶️ {naruto} jouer - Continuer
📜 {naruto} chapitre [1-5]
🎬 {naruto} arc [1-5]
👹 {naruto} boss
`.trim();
                return ninjaFrame("MODE HISTOIRE", histoireText);
            },

            // COMBAT SANS FIL
            combat: () => {
                const combatText = `
⚔️ ${ninjaStyle('COMBAT SANS FIL')} ⚔️
━━━━━━━━━━━━━━━━━━━━━━
🎮 ${ninjaStyle('AD-HOC MULTIPLAYER')}

📋 Modes Disponibles :
1. ⚔️ Combat Simple 1v1
2. 👥 Combat en Équipe 2v2
3. 👥👥 Combat en Équipe 3v3
4. 🏆 Tournoi (4-8 Joueurs)
5. 🎯 Match Rapide Aléatoire
6. ⚙️ Combat Personnalisé
7. 💀 Mode Survie
8. 👑 Rumble Royal (4 Joueurs)
9. 🏅 Championnat Bracket

⚙️ Paramètres :
⏱️ Temps : 60s/90s/120s/∞
❤️ Vies : 1/2/3/5/∞
🧪 Objets : ON/OFF
💥 Jutsu Ultime : ON/OFF
🔥 Éveil : ON/OFF

🎮 Commandes :
{naruto} combat start [perso]
{naruto} combat vs @mention
{naruto} tournoi
{naruto} survie

🔍 Statut : 🟢 En ligne
👥 Joueurs : ${Math.floor(Math.random()*50)+10}
`.trim();
                return ninjaFrame("COMBAT", combatText);
            },

            // DÉFIER UNE PERSONNE
            defi: () => {
                const defiText = `
👤 ${ninjaStyle('DÉFIER UNE PERSONNE')} 👤
━━━━━━━━━━━━━━━━━━━━━━
🤖 ${ninjaStyle('DÉFI CPU')} (Niveau 1-10) :

1. 🟢 Débutant (Genin)
2. 🟢 Apprenti (Genin Confirmé)
3. 🔵 Intermédiaire (Chûnin)
4. 🔵 Avancé (Chûnin Confirmé)
5. 🟡 Expert (Jônin)
6. 🟡 Élite (Jônin Spécial)
7. 🟠 Maître (ANBU)
8. 🟠 Légende (Sannin)
9. 🔴 Divin (Kage)
10. 💀 IMPOSSIBLE (Sage)

🎯 Défis Spéciaux :
❶ 50 Ennemis en 3 Min
❷ Combat Sans Dégâts
❸ KO en 30 Secondes
❹ Perfect Guard Master
❺ Combo 100 Hits
❻ Jutsu Ultime Seulement
❼ Mirror Match Parfait
❽ Boss Rush (10 Boss)
❾ Éveil Permanent
❿ Défi Ultime du Hokage
🔮 Défi Secret : ???

📅 Défi Quotidien :
Lun ⚡ | Mar 💪 | Mer 🎯
Jeu 💀 | Ven 👹 | Sam 🔥
Dim 👑 Ultimate Challenge

🎮 {naruto} defi cpu [1-10]
{naruto} defi special [1-10]
{naruto} defi quotidien
`.trim();
                return ninjaFrame("DÉFI", defiText);
            },

            // MODE MISSION
            missions: () => {
                const missionsText = `
📜 ${ninjaStyle('MODE MISSION')} 📜
━━━━━━━━━━━━━━━━━━━━━━

🟢 RANG D (Genin) :
📜 Récupérer 20 Parchemins
⚔️ Vaincre 30 Bandits
🏃 Course d'Obstacles
🛡️ Protéger le Convoi
😼 Attraper Tora le Chat

🔵 RANG C (Chûnin) :
🛡️ Escorte de Marchand
⚔️ Élimination de Brigands
🙏 Sauvetage d'Otage
🏰 Infiltration de Base
📦 Course de Livraison

🟡 RANG B (Jônin) :
🗡️ Assassinat Ciblé
👑 Protection VIP
🔍 Reconnaissance Hostile
💣 Destruction de Camp
📨 Interception Message

🟠 RANG A (ANBU) :
☠️ Élimination Ninja Renégat
🏘️ Infiltration Village
📜 Parchemin Interdit
⚔️ Combat 100 Ninjas
🏰 Assaut Forteresse

🔴 RANG S (Kage) :
🦊 Vaincre un Bijû
☁️ Combat Akatsuki
👑 Protection Daimyô
⚔️ Bataille 1000 vs 1
🌍 Sauver le Monde
🔮 Mission Secrète

🎮 {naruto} mission [D/C/B/A/S] [1-5]
`.trim();
                return ninjaFrame("MISSIONS", missionsText);
            },

            // COLLECTION
            collection: () => {
                const allChars = [
                    "🍥 Naruto Uzumaki", "⚡ Sasuke Uchiha", "🌸 Sakura Haruno", "📖 Kakashi Hatake",
                    "🦊 Naruto (Kyûbi)", "🔥 Sasuke (Mangekyô)", "💪 Sakura (Byakugô)", "🐍 Orochimaru",
                    "🐸 Jiraya", "💎 Tsunade", "🌵 Gaara", "🥋 Rock Lee", "🐞 Shino Aburame",
                    "🐶 Kiba Inuzuka", "🍟 Chôji Akimichi", "🌪️ Shikamaru Nara", "💐 Ino Yamanaka",
                    "👁️ Neji Hyûga", "💜 Hinata Hyûga", "🗡️ Tenten", "🔥 Might Guy", "🌊 Kisame",
                    "💥 Deidara", "🦂 Sasori", "☁️ Pain", "🌀 Madara", "👁️ Itachi", "🌙 Kaguya",
                    "🌟 Hagoromo", "🍃 Hashirama", "🌊 Tobirama", "🐒 Hiruzen", "💨 Minato", "⚡ Raikage"
                ];

                const unlocked = save.unlocks || [];
                const collectionText = `
👥 ${ninjaStyle('COLLECTION')} 👥
━━━━━━━━━━━━━━━━━━━━━━
🃏 ${unlocked.length}/${allChars.length} Débloqués

${allChars.map((char, i) => {
    const emoji = unlocked.includes(char) ? '✅' : '🔒';
    return `${emoji} ${char}`;
}).join('\n')}

⭐ Équipé : ${save.characters[0]}

🎮 {naruto} equip [nom]
{naruto} unlock [nom]
`.trim();
                return ninjaFrame("PERSONNAGES", collectionText);
            },

            // BOUTIQUE
            boutique: () => {
                const boutiqueText = `
🏪 ${ninjaStyle('BOUTIQUE NINJA')} 🏪
━━━━━━━━━━━━━━━━━━━━━━
💰 Ryôs : ${save.ryo.toLocaleString()}

🗡️ ARMES :
• Kunai Légendaire - 5,000 ㊞
• Shuriken Fûma - 8,000 ㊞
• Kusanagi - 50,000 ㊞
• Samehada - 100,000 ㊞

📜 PARCHEMINS :
• Jutsu Rang C - 3,000 ㊞
• Jutsu Rang B - 10,000 ㊞
• Jutsu Rang A - 30,000 ㊞
• Parchemin Interdit S - 100,000 ㊞

🧪 OBJETS :
• Pilule de Chakra - 500 ㊞
• Pilule du Soldat - 1,000 ㊞
• Bombe Fumigène - 300 ㊞
• Élixir de Vie - 2,000 ㊞

👤 PERSONNAGES :
• Perso Aléatoire - 50,000 ㊞
• Skin Alternatif - 25,000 ㊞

🎮 {naruto} acheter [objet]
{naruto} inventaire
`.trim();
                return ninjaFrame("BOUTIQUE", boutiqueText);
            },

            // STATISTIQUES
            stats: () => {
                const statsText = `
🏆 ${ninjaStyle('STATISTIQUES')} 🏆
━━━━━━━━━━━━━━━━━━━━━━
👤 Nom : ${userName}
🎖️ Rang : ${db[senderID].ninjaRank}
⭐ Niveau : ${save.level}
📊 XP : ${save.xp}/${save.level*100}
💰 Ryôs : ${save.ryo.toLocaleString()}

📈 COMBAT :
🏆 Victoires : ${save.stats.wins}
💀 Défaites : ${save.stats.losses}
📊 Ratio : ${save.stats.wins > 0 ? (save.stats.wins/(save.stats.wins+save.stats.losses)*100).toFixed(1) : 0}%
🔥 Meilleur Combo : ${db[senderID].comboCount}

📜 MISSIONS :
Rang D : ${Math.floor(Math.random()*20)} | C : ${Math.floor(Math.random()*15)}
Rang B : ${Math.floor(Math.random()*10)} | A : ${Math.floor(Math.random()*5)}
Rang S : ${Math.floor(Math.random()*3)}

👥 Personnages : ${(save.unlocks?.length||0)}/34
🗡️ Armes : ${save.inventory?.length||0}
🕒 Temps de Jeu : ${Math.floor(Math.random()*500)}h
`.trim();
                return ninjaFrame("STATS", statsText);
            },

            // ACADÉMIE
            ecole: () => {
                const ecoleText = `
📖 ${ninjaStyle('ACADÉMIE NINJA')} 📖
━━━━━━━━━━━━━━━━━━━━━━

📚 LEÇON 1 : BASES
⚔️ Attaque | 🛡️ Défense
💨 Esquive | ⬆️ Double Saut

📚 LEÇON 2 : JUTSUS
🔵 Rang C (100 chakra)
🟡 Rang B (200 chakra)
🟠 Rang A (300 chakra)
🔴 Rang S (500 chakra)

📚 LEÇON 3 : COMBOS
⚔️⚔️⚔️ Simple (3 hits)
⚔️⚔️⬆️⚔️⚔️ Avancé (5 hits)
⬆️⚔️⚔️⚔️ Aérien
⚔️⚔️⚔️💥 Ultime (100 hits!)

📚 LEÇON 4 : ÉVEIL
⚡ Stats x2
🔥 Forme Ultime
⏱️ Durée 30s
🔄 Cooldown 60s

📚 LEÇON 5 : STRATÉGIE
⚡ Contre-Attaque
👥 Appeler Allié
🌋 Stage Hazard
🛡️ Perfect Guard

🎓 Prêt à combattre ?
{naruto} combat start
`.trim();
                return ninjaFrame("ACADÉMIE", ecoleText);
            },

            // JOUER (COMBAT)
            jouer: () => {
                const currentArc = [
                    { chapitres: ["Sauvetage de Gaara", "Confrontation avec Sasori", "Poursuite de Deidara", "Combat contre Itachi", "La Vraie Nature de Pain"] },
                    { chapitres: ["Formation Hebi", "Combat contre Kisame", "Affrontement Fratricide", "Révélation de Madara", "Héritage du Clan"] },
                    { chapitres: ["Retour au Village", "Invasion de Konoha", "Naruto vs Pain", "Hinata vs Pain", "Naruto Mode Sage"] },
                    { chapitres: ["Réunion des 5 Kage", "Sasuke vs Danzo", "Grande Guerre Ninja", "Naruto vs Kyûbi", "Alliance Shinobi"] },
                    { chapitres: ["Alliés Inattendus", "Madara vs Alliance", "Combat Final", "Naruto & Sasuke", "Destin Final"] }
                ];
                const arc = currentArc[save.arc-1] || currentArc[0];
                const chapitre = arc.chapitres[save.chapitre-1] || arc.chapitres[0];

                const xpGain = Math.floor(Math.random() * 50) + 20;
                const ryoGain = Math.floor(Math.random() * 500) + 100;
                const comboRandom = Math.floor(Math.random() * 80) + 20;
                
                save.xp += xpGain;
                save.ryo += ryoGain;
                save.stats.wins++;
                
                if (comboRandom > db[senderID].comboCount) {
                    db[senderID].comboCount = comboRandom;
                }
                
                if (save.xp >= save.level * 100) {
                    save.level++;
                    save.xp = 0;
                }
                
                // Avancer dans l'histoire
                if (save.chapitre < 5) {
                    save.chapitre++;
                } else if (save.arc < 5) {
                    save.arc++;
                    save.chapitre = 1;
                }
                
                saveSave(save);
                saveMemory(db);

                const combatText = `
🎬 ${ninjaStyle('SCÈNE CINÉMATIQUE')} 🎬
━━━━━━━━━━━━━━━━━━━━━━
📜 Arc ${save.arc} : Chapitre ${save.chapitre}
« ${chapitre} »

${rasenganAnimation}

⚔️ ${save.characters[0]} entre en combat !
💨 Multi Clones Assault !
💥 COMBO ${comboRandom} HITS !!!
🔥 RASENGAN ULTIME !!!

🏆 VICTOIRE !!!

📊 RÉCOMPENSES :
⭐ +${xpGain} XP
💰 +${ryoGain} Ryôs

📈 Niveau ${save.level} | XP: ${save.xp}/${save.level*100}
${loadingBar(Math.min((save.xp/(save.level*100))*100, 100))}

▶️ {naruto} jouer pour continuer
`.trim();
                return ninjaFrame("COMBAT", combatText);
            },

            // CRÉDITS
            credits: () => {
                return ninjaFrame("CRÉDITS", `
🎬 ${ninjaStyle('NARUTO ULTIMATE NINJA IMPACT')}
© Bandai Namco / CyberConnect2

Basé sur le manga "NARUTO"
par Masashi Kishimoto
Shueisha (Weekly Shonen Jump)

🎮 PSP Edition
📅 2011

Bot Version 3.0
Par un fan de Naruto 💕

🍥 Dattebayo ! 🍥
`.trim());
            }
        };

        // ─── ROUTAGE DES COMMANDES ───
        if (!cmd || cmd === "menu") {
            return message.reply(gameResponses.menu());
        }

        const routeMap = {
            "histoire": gameResponses.histoire,
            "story": gameResponses.histoire,
            "combat": gameResponses.combat,
            "fight": gameResponses.combat,
            "defi": gameResponses.defi,
            "challenge": gameResponses.defi,
            "missions": gameResponses.missions,
            "mission": gameResponses.missions,
            "collection": gameResponses.collection,
            "persos": gameResponses.collection,
            "characters": gameResponses.collection,
            "boutique": gameResponses.boutique,
            "shop": gameResponses.boutique,
            "store": gameResponses.boutique,
            "stats": gameResponses.stats,
            "statistiques": gameResponses.stats,
            "ecole": gameResponses.ecole,
            "tuto": gameResponses.ecole,
            "tutoriel": gameResponses.ecole,
            "academie": gameResponses.ecole,
            "jouer": gameResponses.jouer,
            "play": gameResponses.jouer,
            "fight": gameResponses.jouer,
            "battle": gameResponses.jouer,
            "credits": gameResponses.credits,
            "credit": gameResponses.credits
        };

        if (routeMap[cmd]) {
            db[senderID].modeActuel = cmd;
            saveMemory(db);
            return message.reply(routeMap[cmd]());
        }

        // Gestion des commandes spéciales
        if (cmd === "sauvegarde" || cmd === "save") {
            const action = subArgs[0]?.toLowerCase();
            if (action === "save" || !action) {
                saveSave(save);
                return message.reply(ninjaFrame("💾 SAUVEGARDE", `✅ Partie sauvegardée !\n\n👤 ${userName}\n⭐ Niveau ${save.level}\n💰 ${save.ryo} Ryôs\n📜 Arc ${save.arc} - Ch.${save.chapitre}`));
            }
            if (action === "load" || action === "charger") {
                save = loadSave();
                return message.reply(ninjaFrame("📂 CHARGEMENT", `✅ Partie chargée !\n\n⭐ Niveau ${save.level}\n📜 Arc ${save.arc} - Ch.${save.chapitre}\n⚔️ ${save.characters[0]}`));
            }
            if (action === "delete" || action === "reset") {
                save = { xp: 0, level: 1, ryo: 0, characters: ["Naruto Uzumaki"], mode: "histoire", arc: 1, chapitre: 1, unlocks: ["Naruto Uzumaki"], stats: { wins: 0, losses: 0 }, inventory: [] };
                saveSave(save);
                return message.reply(ninjaFrame("🗑️ RÉINITIALISATION", `⚠️ Sauvegarde supprimée !\n\nNouvelle partie commencée.`));
            }
        }

        if (cmd === "equip" && subArgs[0]) {
            const charName = subArgs.join(" ");
            const found = (save.unlocks || []).find(c => c.toLowerCase().includes(charName.toLowerCase()));
            if (found) {
                save.characters[0] = found;
                saveSave(save);
                return message.reply(ninjaFrame("👤 PERSONNAGE", `✅ ${found} équipé !\n\n🍥 Prêt au combat !`));
            }
            return message.reply(ninjaFrame("❌ ERREUR", `🔒 ${charName} n'est pas débloqué !\n\nTerminez des missions pour le débloquer.\n\n🎮 {naruto} collection`));
        }

        if (cmd === "inventaire" || cmd === "inv") {
            const inv = save.inventory || [];
            const invText = inv.length > 0 ? inv.map((item, i) => `${i+1}. ${item}`).join('\n') : 'Inventaire vide';
            return message.reply(ninjaFrame("🎒 INVENTAIRE", `${invText}\n\n💰 ${save.ryo.toLocaleString()} Ryôs`));
        }

        if (cmd === "arc" && subArgs[0]) {
            const arcNum = parseInt(subArgs[0]);
            if (arcNum >= 1 && arcNum <= 5 && arcNum <= save.arc) {
                save.arc = arcNum;
                save.chapitre = 1;
                saveSave(save);
                return message.reply(ninjaFrame("🎬 ARC", `✅ Arc ${arcNum} sélectionné !\n\n📜 Chapitre 1`));
            }
            return message.reply(ninjaFrame("❌ ERREUR", `Arc invalide ou non débloqué.\nArc actuel : ${save.arc}/5`));
        }

        if (cmd === "chapitre" && subArgs[0]) {
            const chapNum = parseInt(subArgs[0]);
            if (chapNum >= 1 && chapNum <= 5) {
                save.chapitre = chapNum;
                saveSave(save);
                return message.reply(ninjaFrame("📜 CHAPITRE", `✅ Chapitre ${chapNum} sélectionné !\n\nArc ${save.arc}`));
            }
            return message.reply(ninjaFrame("❌ ERREUR", "Chapitre invalide (1-5)"));
        }

        // Aide par défaut
        const helpText = `
🍥 ${ninjaStyle('AIDE')} 🍥
━━━━━━━━━━━━━━━━━━━━━━
Commandes disponibles :
${Object.keys(routeMap).filter((v, i, a) => a.indexOf(v) === i).join(' | ')}

Commandes spéciales :
sauvegarde | equip | inventaire
arc | chapitre

💡 {naruto} menu - Menu Principal
`.trim();
        return message.reply(ninjaFrame("NARUTO ULTIMATE NINJA IMPACT", helpText));
    }
};
