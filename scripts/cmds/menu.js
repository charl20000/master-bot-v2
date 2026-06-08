const { commands, aliases } = global.GoatBot;
const { getPrefix } = global.utils;
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

// Meta Bold Function
const metaBold = (text) => {
    const boldMap = {
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆',
        'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍',
        'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔',
        'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
        'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠',
        'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧',
        'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮',
        'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
        '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
};

// Progress Bar
const progressBar = (percentage, width = 25) => {
    const filled = Math.round((width * percentage) / 100);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
};

// Get RAM Usage
const getRAMUsage = () => {
    const totalRAM = os.totalmem();
    const freeRAM = os.freemem();
    const usedRAM = totalRAM - freeRAM;
    const percent = (usedRAM / totalRAM) * 100;
    return { used: (usedRAM / 1024 / 1024 / 1024).toFixed(2), total: (totalRAM / 1024 / 1024 / 1024).toFixed(2), percent: percent.toFixed(1) };
};

// Get Uptime
const getUptime = () => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return { days, hours, minutes, seconds };
};

module.exports = {
    config: {
        name: "menu",
        version: "3.0",
        author: "Master Charbel • 𝐍𝐄𝐗𝐔𝐒",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "📋 𝐌𝐞𝐧𝐮 𝐢𝐧𝐭𝐞𝐫𝐚𝐜𝐭𝐢𝐟 𝐝𝐮 𝐛𝐨𝐭"
        },
        longDescription: {
            en: "𝐀𝐟𝐟𝐢𝐜𝐡𝐞 𝐮𝐧 𝐦𝐞𝐧𝐮 𝐜𝐨𝐦𝐩𝐥𝐞𝐭 𝐚𝐯𝐞𝐜 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐪𝐮𝐞𝐬, 𝐜𝐚𝐭é𝐠𝐨𝐫𝐢𝐞𝐬 𝐞𝐭 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧𝐬"
        },
        category: "info",
        guide: {
            en: "{pn} : 𝐀𝐟𝐟𝐢𝐜𝐡𝐞 𝐥𝐞 𝐦𝐞𝐧𝐮 𝐩𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥\n{pn} <𝐜𝐚𝐭é𝐠𝐨𝐫𝐢𝐞> : 𝐀𝐟𝐟𝐢𝐜𝐡𝐞 𝐥𝐞𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬 𝐝'𝐮𝐧𝐞 𝐜𝐚𝐭é𝐠𝐨𝐫𝐢𝐞\n{pn} stats : 𝐒𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐪𝐮𝐞𝐬 𝐝𝐮 𝐛𝐨𝐭\n{pn} info : 𝐈𝐧𝐟𝐨𝐬 𝐝𝐮 𝐛𝐨𝐭"
        }
    },

    onStart: async function ({ message, args, event, role, Users }) {
        const { threadID, senderID } = event;
        const prefix = getPrefix(threadID);
        const now = new Date();
        const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('fr-FR');
        
        const user = await Users.get(senderID);
        const userName = user?.name || "Utilisateur";

        // ─────────────────────────────────────────────
        // 1️⃣ STATISTIQUES DU BOT
        // ─────────────────────────────────────────────
        if (args[0] && args[0].toLowerCase() === "stats") {
            const ram = getRAMUsage();
            const uptime = getUptime();
            const totalCommands = commands.size;
            const totalAliases = aliases.size;
            
            const statsMsg = 
`╔══════════════════════════════════════════╗
║      📊 ${metaBold('𝐍𝐄𝐗𝐔𝐒 𝐒𝐓𝐀𝐓𝐒')} 📊            ║
╠══════════════════════════════════════════╣
║                                          ║
║  ${metaBold('🖥️ 𝐒𝐘𝐒𝐓𝐄̀𝐌𝐄')}                           ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║  🔹 𝐑𝐀𝐌 : ${ram.used}GB / ${ram.total}GB            ║
║  🔹 ${progressBar(parseFloat(ram.percent))} ${ram.percent}%          ║
║                                          ║
║  ⏱️ ${metaBold('𝐔𝐏𝐓𝐈𝐌𝐄')}                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║  🔹 ${uptime.days}𝐣 ${uptime.hours}𝐡 ${uptime.minutes}𝐦 ${uptime.seconds}𝐬       ║
║                                          ║
║  📦 ${metaBold('𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄𝐒')}                         ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║  🔹 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬 : ${totalCommands}                     ║
║  🔹 𝐀𝐥𝐢𝐚𝐬 : ${totalAliases}                         ║
║                                          ║
╠══════════════════════════════════════════╣
║  📅 ${dateStr}  │  🕐 ${timeStr}                    ║
║  ⚡ ${metaBold('𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄')} ⚡               ║
╚══════════════════════════════════════════╝`;
            
            return message.reply(statsMsg);
        }

        // ─────────────────────────────────────────────
        // 2️⃣ INFO BOT
        // ─────────────────────────────────────────────
        if (args[0] && args[0].toLowerCase() === "info") {
            const infoMsg = 
`╔══════════════════════════════════════════╗
║      ℹ️ ${metaBold('𝐍𝐄𝐗𝐔𝐒 𝐈𝐍𝐅𝐎')} ℹ️              ║
╠══════════════════════════════════════════╣
║                                          ║
║  🤖 ${metaBold('𝐍𝐎𝐌')}                                ║
║  └─ 𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄 𝐁𝐎𝐓                  ║
║                                          ║
║  👑 ${metaBold('𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐏𝐄𝐔𝐑')}                        ║
║  └─ 𝐌𝐚𝐬𝐭𝐞𝐫 𝐂𝐡𝐚𝐫𝐛𝐞𝐥                         ║
║                                          ║
║  📌 ${metaBold('𝐕𝐄𝐑𝐒𝐈𝐎𝐍')}                           ║
║  └─ 𝟯.𝟬 • 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐄𝐝𝐢𝐭𝐢𝐨𝐧                ║
║                                          ║
║  🔧 ${metaBold('𝐏𝐋𝐀𝐓𝐄𝐅𝐎𝐑𝐌𝐄')}                        ║
║  └─ 𝐆𝐨𝐚𝐭𝐁𝐨𝐭 / 𝐍𝐄𝐗𝐔𝐒 𝐂𝐨𝐫𝐞                  ║
║                                          ║
║  💡 ${metaBold('𝐅𝐄𝐀𝐓𝐔𝐑𝐄𝐒')}                          ║
║  └─ ✨ 𝐌𝐞𝐭𝐚 𝐁𝐨𝐥𝐝                           ║
║  └─ 📊 𝐆𝐫𝐚𝐩𝐡𝐢𝐪𝐮𝐞𝐬 𝐢𝐧𝐭𝐞𝐫𝐚𝐜𝐭𝐢𝐟𝐬            ║
║  └─ 🔐 𝐒é𝐜𝐮𝐫𝐢𝐭é 𝐚𝐯𝐚𝐧𝐜é𝐞                    ║
║  └─ ⚡ 𝐏𝐞𝐫𝐟𝐨𝐫𝐦𝐚𝐧𝐜𝐞𝐬 𝐨𝐩𝐭𝐢𝐦𝐢𝐬é𝐞𝐬            ║
║                                          ║
╠══════════════════════════════════════════╣
║  🌐 ${metaBold('@NexusUltimateBot')}                  ║
║  ⚡ ${metaBold('𝐓𝐡𝐞 𝐆𝐚𝐭𝐞𝐰𝐚𝐲 𝐭𝐨 𝐏𝐨𝐰𝐞𝐫')} ⚡        ║
╚══════════════════════════════════════════╝`;
            
            return message.reply(infoMsg);
        }

        // ─────────────────────────────────────────────
        // 3️⃣ COMMANDES PAR CATÉGORIE
        // ─────────────────────────────────────────────
        if (args[0]) {
            const categoryName = args[0].toLowerCase();
            let foundCommands = [];
            
            for (const [name, cmd] of commands) {
                const cmdCategory = cmd.config.category?.toLowerCase() || "uncategorized";
                if (cmdCategory === categoryName && cmd.config.role <= role) {
                    foundCommands.push(name);
                }
            }
            
            if (foundCommands.length === 0) {
                // Afficher les catégories disponibles
                const categories = new Set();
                for (const [_, cmd] of commands) {
                    const cat = cmd.config.category || "𝐔𝐧𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐳𝐞𝐝";
                    categories.add(cat);
                }
                
                const categoryList = Array.from(categories).sort().map(c => `  🔹 ${c}`).join('\n');
                
                return message.reply(
`╔══════════════════════════════════════════╗
║    📂 ${metaBold('𝐂𝐀𝐓𝐄́𝐆𝐎𝐑𝐈𝐄𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒')}     ║
╠══════════════════════════════════════════╣
║                                          ║
${categoryList}
║                                          ║
╠══════════════════════════════════════════╣
║  💡 𝐓𝐚𝐩𝐞 : ${prefix}menu <𝐜𝐚𝐭é𝐠𝐨𝐫𝐢𝐞>        ║
╚══════════════════════════════════════════╝`);
            }
            
            const perPage = 10;
            const page = args[1] ? parseInt(args[1]) - 1 : 0;
            const totalPages = Math.ceil(foundCommands.length / perPage);
            const start = page * perPage;
            const end = start + perPage;
            const pageCommands = foundCommands.slice(start, end);
            
            let catMsg = 
`╔══════════════════════════════════════════╗
║    📁 ${metaBold(categoryName.toUpperCase())} 📁            ║
╠══════════════════════════════════════════╣
║  📊 ${foundCommands.length} 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞(𝐬)                 ║
╠══════════════════════════════════════════╣`;
            
            for (const cmd of pageCommands) {
                catMsg += `\n║  🔹 ${cmd.padEnd(44)}║`;
            }
            
            catMsg += `
╠══════════════════════════════════════════╣
║  📄 𝐏𝐚𝐠𝐞 ${page + 1}/${totalPages}                         ║
║  💡 ${prefix}menu ${categoryName} <𝐩𝐚𝐠𝐞>          ║
╚══════════════════════════════════════════╝`;
            
            return message.reply(catMsg);
        }

        // ─────────────────────────────────────────────
        // 4️⃣ MENU PRINCIPAL
        // ─────────────────────────────────────────────
        
        // Récupération des catégories avec comptage
        const categories = new Map();
        for (const [_, cmd] of commands) {
            const cat = cmd.config.category || "𝐔𝐧𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐳𝐞𝐝";
            if (cmd.config.role <= role) {
                categories.set(cat, (categories.get(cat) || 0) + 1);
            }
        }
        
        const totalCommands = Array.from(commands.values()).filter(cmd => cmd.config.role <= role).length;
        const ram = getRAMUsage();
        const uptime = getUptime();
        
        // Construction du menu
        let menuMsg = 
`╔══════════════════════════════════════════╗
║     ✨ ${metaBold('𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄 𝐌𝐄𝐍𝐔')} ✨      ║
╠══════════════════════════════════════════╣
║                                          ║
║  👤 ${metaBold('𝐔𝐓𝐈𝐋𝐈𝐒𝐀𝐓𝐄𝐔𝐑')} : ${userName}                 ║
║  🔹 ${metaBold('𝐏𝐫𝐞́𝐟𝐢𝐱𝐞')} : ${prefix}                               ║
║  🔹 ${metaBold('𝐑𝐨̂𝐥𝐞')} : ${role === 0 ? '👤 𝐔𝐬𝐞𝐫' : role === 1 ? '🛡️ 𝐀𝐝𝐦𝐢𝐧' : '👑 𝐌𝐚𝐬𝐭𝐞𝐫'}                    ║
║                                          ║
╠══════════════════════════════════════════╣
║  📊 ${metaBold('𝐒𝐓𝐀𝐓𝐈𝐒𝐓𝐈𝐐𝐔𝐄𝐒')}                        ║
╠══════════════════════════════════════════╣
║  🔢 ${metaBold('𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬')} : ${totalCommands}                       ║
║  💾 ${metaBold('𝐑𝐀𝐌')} : ${ram.percent}% ${progressBar(parseFloat(ram.percent), 15)}    ║
║  ⏱️ ${metaBold('𝐔𝐩𝐭𝐢𝐦𝐞')} : ${uptime.hours}𝐡 ${uptime.minutes}𝐦                     ║
║                                          ║
╠══════════════════════════════════════════╣
║  📂 ${metaBold('𝐂𝐀𝐓𝐄́𝐆𝐎𝐑𝐈𝐄𝐒')}                          ║
╠══════════════════════════════════════════╣`;

        // Affichage des catégories en 2 colonnes
        const catArray = Array.from(categories.keys()).sort();
        for (let i = 0; i < catArray.length; i += 2) {
            const cat1 = catArray[i];
            const cat2 = catArray[i + 1];
            const count1 = categories.get(cat1);
            const count2 = cat2 ? categories.get(cat2) : null;
            
            let line = `║  📁 ${cat1.slice(0, 12).padEnd(12)} (${count1})`;
            if (cat2) {
                line += `   📁 ${cat2.slice(0, 12).padEnd(12)} (${count2})`;
            }
            menuMsg += `\n${line.padEnd(52)}║`;
        }

        menuMsg += `
║                                          ║
╠══════════════════════════════════════════╣
║  🎮 ${metaBold('𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄𝐒 𝐐𝐔𝐈𝐂𝐊')}                      ║
╠══════════════════════════════════════════╣
║  🔹 ${prefix}help    → 𝐋𝐢𝐬𝐭𝐞 𝐜𝐨𝐦𝐩𝐥𝐞̀𝐭𝐞                ║
║  🔹 ${prefix}menu stats → 𝐒𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐪𝐮𝐞𝐬 𝐛𝐨𝐭            ║
║  🔹 ${prefix}menu info  → 𝐈𝐧𝐟𝐨𝐬 𝐛𝐨𝐭                   ║
║  🔹 ${prefix}menu <𝐜𝐚𝐭> → 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬 𝐩𝐚𝐫 𝐜𝐚𝐭𝐞́𝐠𝐨𝐫𝐢𝐞    ║
║                                          ║
╠══════════════════════════════════════════╣
║  📅 ${dateStr}              🕐 ${timeStr}                ║
║  ⚡ ${metaBold('"𝐋𝐚 𝐩𝐮𝐢𝐬𝐬𝐚𝐧𝐜𝐞 𝐧𝐚𝐢̂𝐭 𝐝𝐞 𝐥𝐚 𝐜𝐨𝐧𝐧𝐞𝐱𝐢𝐨𝐧"')} ⚡  ║
║  💫 ${metaBold('𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄 • 𝐓𝐡𝐞 𝐆𝐚𝐭𝐞𝐰𝐚𝐲 𝐭𝐨 𝐏𝐨𝐰𝐞𝐫')} 💫  ║
╚══════════════════════════════════════════╝`;

        await message.reply(menuMsg);
    }
};
