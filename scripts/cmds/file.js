const fs = require('fs');
const path = require('path');

const toBold = (text) => {
    const dict = {
        'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦',
        'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
        'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return text.split('').map(c => dict[c] || c).join('');
};

module.exports = {
    config: {
        name: "file",
        aliases: ["extract", "getcmd"],
        version: "1.1",
        author: "Master Charbel",
        countDown: 2,
        role: 2, // Admin uniquement pour protéger tes codes sources
        category: "admin",
        shortDescription: { en: "Extrait et affiche le code source d'une commande." },
        guide: { en: "{pn} <nom_de_la_commande>" }
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const commandName = args[0];

        if (!commandName) {
            return api.sendMessage(toBold("⚠️ Spécifie le nom de la commande à extraire. Exemple : file clash"), threadID, messageID);
        }

        // Utilisation d'un chemin absolu propre sans interagir avec la console
        const filePath = path.join(__dirname, `${commandName.toLowerCase()}.js`);

        try {
            if (!fs.existsSync(filePath)) {
                return api.sendMessage(toBold(`❌ La commande "${commandName}.js" n'existe pas.`), threadID, messageID);
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');

            const header = `📦 **𝐄𝐗𝐓𝐑𝐀𝐂𝐓𝐈𝐎𝐍 𝐑É𝐔𝐒𝐒𝐈𝐄** 📦\n` +
                           `📄 **𝐅𝐢𝐜𝐡𝐢𝐞 r :** ${commandName}.js\n` +
                           `━━━━━━━━━━━━━━━━━━━\n\n`;

            const footer = `\n━━━━━━━━━━━━━━━━━━━\n` +
                           `⚙️ **𝐌𝐚𝐬𝐭𝐞𝐫 𝐂𝐡𝐚𝐫𝐛𝐞𝐥 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲**`;

            return api.sendMessage(header + fileContent + footer, threadID, messageID);

        } catch (error) {
            // Remplacement de console.error standard pour éviter le crash stderr sur certains hébergeurs
            console.log(`[Erreur File] Impossible de lire le fichier: ${error.message}`);
            return api.sendMessage(toBold("❌ Une erreur système interne est survenue lors de la lecture."), threadID, messageID);
        }
    }
};