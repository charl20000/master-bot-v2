const os = require("os");
const fs = require("fs-extra");
const path = require("path");

// Style NEXUS Bold
function toNexusBold(text) {
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
    return text.split('').map(c => boldMap[c] || c).join('');
}

// Style italique
function toItalic(text) {
    const italicMap = {
        'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎',
        'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕',
        'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜',
        'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
        'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨',
        'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯',
        'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶',
        'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
    };
    return text.split('').map(c => italicMap[c] || c).join('');
}

// Barre de progression stylisée
const progressBar = (percent, width = 25) => {
    const filled = Math.round((width * percent) / 100);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return bar;
};

// Format uptime
function getUptime() {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return { days, hours, minutes, seconds };
}

// RAM détaillée
function getRAMDetails() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const percent = (used / total) * 100;
    return {
        total: (total / 1024 / 1024 / 1024).toFixed(2),
        free: (free / 1024 / 1024 / 1024).toFixed(2),
        used: (used / 1024 / 1024 / 1024).toFixed(2),
        percent: percent.toFixed(1)
    };
}

// CPU détaillé
function getCPUDetails() {
    const cpus = os.cpus();
    const load = os.loadavg();
    const percent = (load[0] / cpus.length) * 100;
    return {
        model: cpus[0]?.model || "Unknown",
        cores: cpus.length,
        speed: cpus[0]?.speed || 0,
        load1: load[0].toFixed(2),
        load5: load[1].toFixed(2),
        load15: load[2].toFixed(2),
        percent: Math.min(percent, 100).toFixed(1)
    };
}

// Infos système
function getSystemInfo() {
    return {
        platform: os.platform(),
        type: os.type(),
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname()
    };
}

// Infos réseau
function getNetworkInfo() {
    const interfaces = os.networkInterfaces();
    const networks = [];
    for (const name of Object.keys(interfaces)) {
        for (const addr of interfaces[name]) {
            if (addr.family === 'IPv4' && !addr.internal) {
                networks.push({ name, address: addr.address });
            }
        }
    }
    return networks;
}

// Art ASCII Header
const getHeader = () => {
    return `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║     ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗                ║
║     ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝                ║
║     ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗                ║
║     ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║                ║
║     ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║                ║
║     ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝                ║
║                                                                  ║
║              ⚡ 𝐔 𝐋 𝐓 𝐈 𝐌 𝐀 𝐓 𝐄   𝐒 𝐓 𝐀 𝐓 𝐒 ⚡              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝`;
};

module.exports = {
    config: {
        name: "uptime",
        aliases: ["up", "status", "stats", "perf", "dashboard"],
        version: "4.0",
        author: "Master Charbel • 𝐍𝐄𝐗𝐔𝐒",
        countDown: 5,
        role: 0,
        shortDescription: { en: "⚡ Dashboard Ultime - Performance & Stats" },
        category: "info",
        guide: { en: "{pn} → Dashboard complet\n{pn} simple → Vue rapide" }
    },

    onStart: async function ({ message, args, event }) {
        const uptime = getUptime();
        const ram = getRAMDetails();
        const cpu = getCPUDetails();
        const system = getSystemInfo();
        const networks = getNetworkInfo();
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const startTime = new Date(Date.now() - process.uptime() * 1000).toLocaleString('fr-FR');

        // Version simple
        if (args[0] && args[0].toLowerCase() === "simple") {
            const statusIcon = parseFloat(ram.percent) < 50 ? "🟢" : parseFloat(ram.percent) < 75 ? "🟡" : "🔴";
            const cpuIcon = parseFloat(cpu.percent) < 50 ? "✅" : parseFloat(cpu.percent) < 75 ? "⚠️" : "❌";
            
            return message.reply(
                `⚡ ${toNexusBold('NEXUS UPTIME')} ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ Uptime : ${uptime.days}j ${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s
💾 RAM : ${ram.used}GB / ${ram.total}GB ${progressBar(parseFloat(ram.percent))} ${ram.percent}%
🖥️ CPU : ${cpu.percent}% ${progressBar(parseFloat(cpu.percent))}
📊 Statut : ${statusIcon} ${cpuIcon}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ ${toNexusBold('𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄')} 🚀`
            );
        }

        // Version complète épique
        const statusIcon = parseFloat(ram.percent) < 50 ? "🟢" : parseFloat(ram.percent) < 75 ? "🟡" : "🔴";
        const cpuStatus = parseFloat(cpu.percent) < 50 ? "✅" : parseFloat(cpu.percent) < 75 ? "⚠️" : "❌";
        const ip = networks.length > 0 ? networks[0].address : "N/A";

        // Calcul de la santé du système
        const healthScore = 100 - (parseFloat(ram.percent) * 0.4 + parseFloat(cpu.percent) * 0.4 + (100 - parseFloat(ram.percent)) * 0.2);
        const healthIcon = healthScore > 80 ? "💪" : healthScore > 60 ? "👍" : "😰";
        const healthText = healthScore > 80 ? "EXCELLENT" : healthScore > 60 ? "BON" : "À SURVEILLER";

        const msg = `${getHeader()}

╔══════════════════════════════════════════════════════════════════╗
║  📅 ${dateStr.padEnd(42)} ⏰ ${timeStr}   ║
║  👤 ${toNexusBold('Master Charbel')} │ ${toNexusBold('NEXUS ULTIMATE v4.0')}          ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ${toNexusBold('⏱️  TEMPS DE FONCTIONNEMENT')}                                   ║
║  ──────────────────────────────────────────────────────────────   ║
║                                                                  ║
║     ${uptime.days.toString().padStart(3)}  ${toNexusBold('Jours')}   │   ${uptime.hours.toString().padStart(3)}  ${toNexusBold('Heures')}   │   ${uptime.minutes.toString().padStart(3)}  ${toNexusBold('Minutes')}   │   ${uptime.seconds.toString().padStart(3)}  ${toNexusBold('Secondes')}
║                                                                  ║
║  ──────────────────────────────────────────────────────────────   ║
║  🚀 Démarrage : ${startTime}  ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ${toNexusBold('💾  MÉMOIRE RAM')}                                                ║
║  ──────────────────────────────────────────────────────────────   ║
║                                                                  ║
║     ${toNexusBold('Utilisée')} : ${ram.used} GB  │  ${toNexusBold('Libre')} : ${ram.free} GB  │  ${toNexusBold('Totale')} : ${ram.total} GB
║                                                                  ║
║     ${progressBar(parseFloat(ram.percent))} ${ram.percent}%  ${statusIcon} ${parseFloat(ram.percent) < 50 ? '🟢 OPTIMAL' : parseFloat(ram.percent) < 75 ? '🟡 MODÉRÉ' : '🔴 CRITIQUE'}
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ${toNexusBold('🖥️  PROCESSEUR CPU')}                                              ║
║  ──────────────────────────────────────────────────────────────   ║
║                                                                  ║
║     ${toNexusBold('Modèle')} : ${cpu.model.slice(0, 50)}${cpu.model.length > 50 ? '...' : ''}
║     ${toNexusBold('Cœurs')} : ${cpu.cores}  │  ${toNexusBold('Vitesse')} : ${cpu.speed} MHz
║                                                                  ║
║     ${toNexusBold('Charge')} : 1m=${cpu.load1}  │  5m=${cpu.load5}  │  15m=${cpu.load15}
║                                                                  ║
║     ${progressBar(parseFloat(cpu.percent))} ${cpu.percent}%  ${cpuStatus} ${parseFloat(cpu.percent) < 50 ? '✅ STABLE' : parseFloat(cpu.percent) < 75 ? '⚠️ MOYEN' : '❌ ÉLEVÉ'}
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ${toNexusBold('🌐  RÉSEAU & SYSTÈME')}                                           ║
║  ──────────────────────────────────────────────────────────────   ║
║                                                                  ║
║     ${toNexusBold('IP')} : ${ip.padEnd(45)} ${toNexusBold('Hostname')} : ${system.hostname}
║     ${toNexusBold('OS')} : ${system.type} ${system.release}
║     ${toNexusBold('Architecture')} : ${system.arch}  │  ${toNexusBold('Plateforme')} : ${system.platform}
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ${toNexusBold('📊  SANTÉ DU SYSTÈME')}                                            ║
║  ──────────────────────────────────────────────────────────────   ║
║                                                                  ║
║     ${healthIcon} ${toNexusBold('Score')} : ${healthScore.toFixed(1)}%  │  ${toNexusBold('Statut')} : ${healthText}
║                                                                  ║
║     ${toNexusBold('RAM')}   : ${statusIcon} ${parseFloat(ram.percent) < 50 ? 'Excellent' : parseFloat(ram.percent) < 75 ? 'Modéré' : 'Critique'}
║     ${toNexusBold('CPU')}   : ${cpuStatus} ${parseFloat(cpu.percent) < 50 ? 'Stable' : parseFloat(cpu.percent) < 75 ? 'Moyen' : 'Élevé'}
║     ${toNexusBold('Bot')}   : 🟢 ${toNexusBold('EN LIGNE')}
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

💡 ${toNexusBold('Astuce')} : uptime simple → Vue rapide
⚡ ${toNexusBold('𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄 - The Gateway to Power')} 🚀`;

        return message.reply(msg);
    }
};
