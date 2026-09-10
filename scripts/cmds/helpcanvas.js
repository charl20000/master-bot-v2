// ─── PATCH ANTI-ERROR clearLine ───
if (typeof process.stderr.clearLine !== 'function') {
    process.stderr.clearLine = function() { return this; };
}
// ──────────────────────────────────

const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

// ─── STOCKAGE DES SESSIONS ───
const sessions = {};

module.exports = {
  config: {
    name: "helpcanvas",
    aliases: ["hcanvas", "aidecanvas", "helpimg"],
    version: "3.0",
    author: "Master Charbel",
    countDown: 5,
    role: 0,
    shortDescription: "📖 Aide du bot en image avec navigation",
    longDescription: "Affiche l'aide en image. Réponds avec un numéro pour changer de page.",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ message, args, api, event }) {
    const { commands } = global.GoatBot;
    const totalCmds = commands.size;
    const { threadID, senderID } = event;

    // ─── CATÉGORIES ───
    const categories = {};
    for (const [name, cmd] of commands) {
      const cat = cmd.config.category || "Autres";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    const sortedCats = Object.keys(categories).sort();
    const perPage = 6;
    const totalPages = Math.ceil(sortedCats.length / perPage);

    // ─── PAGE DE DÉPART ───
    const page = Math.min(Math.max(parseInt(args[0]) || 1, 1), totalPages);

    // ─── GÉNÉRER L'IMAGE ───
    const imagePath = await generateHelpImage(page, sortedCats, categories, totalCmds, totalPages);

    // ─── ENVOYER ───
    const sentMsg = await message.reply({
      body: `📖 **Page ${page}/${totalPages}**\n💡 Réponds avec un numéro pour changer de page.`,
      attachment: fs.createReadStream(imagePath)
    });

    // ─── STOCKER LA SESSION ───
    sessions[sentMsg.messageID] = {
      page: page,
      totalPages: totalPages,
      sortedCats: sortedCats,
      categories: categories,
      totalCmds: totalCmds,
      author: senderID
    };

    // ─── ENREGISTRER POUR LA RÉPONSE ───
    global.GoatBot.onReply.set(sentMsg.messageID, {
      commandName: "helpcanvas",
      messageID: sentMsg.messageID,
      author: senderID
    });

    return sentMsg;
  },

  // ─── RÉPONSE À L'UTILISATEUR ───
  onReply: async function ({ message, event, api, Reply }) {
    const { messageID, author } = Reply;
    const { senderID, threadID } = event;

    // Vérifier que c'est bien l'auteur
    if (senderID !== author) return;

    const session = sessions[messageID];
    if (!session) return;

    // ─── RÉCUPÉRER LE NUMÉRO ───
    const num = parseInt(event.body.trim());
    if (isNaN(num) || num < 1 || num > session.totalPages) {
      return message.reply(`❌ Numéro invalide. Choisis entre 1 et ${session.totalPages}.`);
    }

    // ─── GÉNÉRER LA NOUVELLE IMAGE ───
    const imagePath = await generateHelpImage(
      num,
      session.sortedCats,
      session.categories,
      session.totalCmds,
      session.totalPages
    );

    // ─── ENVOYER ───
    const sentMsg = await message.reply({
      body: `📖 **Page ${num}/${session.totalPages}**\n💡 Réponds avec un numéro pour changer de page.`,
      attachment: fs.createReadStream(imagePath)
    });

    // ─── METTRE À JOUR LA SESSION ───
    sessions[sentMsg.messageID] = {
      ...session,
      page: num
    };

    // ─── ENREGISTRER POUR LA RÉPONSE ───
    global.GoatBot.onReply.set(sentMsg.messageID, {
      commandName: "helpcanvas",
      messageID: sentMsg.messageID,
      author: senderID
    });

    // Supprimer l'ancienne session
    delete sessions[messageID];

    return sentMsg;
  }
};

// ═══════════════════════════════════════════════
// ─── FONCTION DE GÉNÉRATION D'IMAGE ───
// ═══════════════════════════════════════════════

async function generateHelpImage(page, sortedCats, categories, totalCmds, totalPages) {
  const W = 800;
  const H = 600;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // ─── FOND ───
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#0a0a18");
  gradient.addColorStop(0.5, "#12122a");
  gradient.addColorStop(1, "#0a0a18");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // ─── GRILLE DÉCO ───
  ctx.fillStyle = "rgba(124,58,237,0.05)";
  for (let x = 20; x < W; x += 35) {
    for (let y = 20; y < H; y += 35) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ─── HELPERS ───
  const roundRect = (x, y, w, h, r, fill, stroke, sw = 1) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke(); }
  };

  const drawText = (txt, x, y, font, color, align = "left") => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(txt, x, y);
    ctx.textAlign = "left";
  };

  // ─── HEADER ───
  const hGrad = ctx.createLinearGradient(0, 0, W, 100);
  hGrad.addColorStop(0, "#1a0533");
  hGrad.addColorStop(1, "#0d1f3c");
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, W, 100);

  ctx.fillStyle = "#7c3aed";
  ctx.fillRect(0, 0, 5, 100);

  drawText("📖 MASTER CHARBEL BOT", 28, 45, "bold 28px sans-serif", "#c4b5fd");
  drawText(`📊 ${totalCmds} commandes • Page ${page}/${totalPages}`, 28, 78, "16px sans-serif", "#6d28d9");

  ctx.strokeStyle = "rgba(124,58,237,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(W, 100);
  ctx.stroke();

  // ─── CATÉGORIES ───
  const perPage = 6;
  const startIdx = (page - 1) * perPage;
  const pageCats = sortedCats.slice(startIdx, startIdx + perPage);

  let yPos = 125;

  const emojis = {
    admin: "🛡️", info: "📚", fun: "🎮", game: "🎲",
    music: "🎵", utility: "🔧", tools: "🛠️", ai: "🤖",
    vip: "👑", config: "⚙️", image: "🖼️", economy: "💰",
    nsfw: "🔞", social: "👥", anime: "🎌", education: "📖"
  };

  for (const cat of pageCats) {
    const cmds = categories[cat].sort();
    const emoji = emojis[cat.toLowerCase()] || "📦";

    roundRect(20, yPos - 8, W - 40, 45, 8, "rgba(124,58,237,0.05)", "rgba(124,58,237,0.1)", 1);

    drawText(`${emoji} ${cat.toUpperCase()} (${cmds.length})`, 35, yPos + 18, "bold 15px sans-serif", "#a78bfa");

    let cmdX = 35;
    const cmdY = yPos + 38;
    const maxPerLine = 4;
    for (let i = 0; i < cmds.length && i < maxPerLine; i++) {
      drawText(`• ${cmds[i]}`, cmdX, cmdY, "13px sans-serif", "#c4b5fd");
      cmdX += 120;
    }
    if (cmds.length > maxPerLine) {
      drawText(`... +${cmds.length - maxPerLine}`, cmdX, cmdY, "13px sans-serif", "#6d28d9");
    }

    yPos += 60;
  }

  // ─── PAGINATION ───
  if (totalPages > 1) {
    const dots = [];
    for (let i = 1; i <= totalPages; i++) {
      dots.push(i === page ? `● ${i}` : `○ ${i}`);
    }
    drawText(dots.join("  "), W / 2, H - 45, "14px sans-serif", "#6d28d9", "center");
  }

  // ─── FOOTER ───
  const now = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Douala" });
  drawText(`Généré le ${now}  |  Master Charbel Bot`, W / 2, H - 18,
    "12px sans-serif", "#3b1f6e", "center");

  // ─── EXPORT ───
  const outPath = path.join(__dirname, "cache", `helpcanvas_page${page}.png`);
  await fs.ensureDir(path.dirname(outPath));
  await fs.writeFile(outPath, canvas.toBuffer("image/png"));

  return outPath;
  }
