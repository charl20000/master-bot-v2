/**
 * impact.js
 * Commande "impact" — version initiale (Master Charbel)
 *
 * Fonctionnalités :
 * - Crée automatiquement impact_characters.json (50 persos) si absent
 * - Sauvegarde par utilisateur: ./saves/<userId>.json
 * - Commandes: impact, impact list, impact select <nom>, impact status, impact free
 * - Free battle: simulation simplifiée + tentative d'appel à christus-api pour décider l'IA
 *
 * Dépendances: fs-extra, node-fetch
 * Usage: place ce fichier dans ton dossier commands et adapte si nécessaire.
 */

const fs = require("fs-extra");
const path = require("path");
const fetch = require("node-fetch");

// Paths
const CHAR_PATH = path.join(process.cwd(), "impact_characters.json");
const SAVES_DIR = path.join(process.cwd(), "saves");

// Ensure saves dir exists
fs.ensureDirSync(SAVES_DIR);

// Helper : create default 50 characters file if not exists
function ensureCharactersFile() {
  if (fs.existsSync(CHAR_PATH)) return;
  const names = [
    { name: "Naruto Uzumaki", emoji: "🍥" },
    { name: "Sasuke Uchiha", emoji: "⚡" },
    { name: "Sakura Haruno", emoji: "🌸" },
    { name: "Kakashi Hatake", emoji: "📖" },

    { name: "Rock Lee", emoji: "🥋" },
    { name: "Neji Hyuga", emoji: "🌀" },
    { name: "Shikamaru Nara", emoji: "🧠" },
    { name: "Hinata Hyuga", emoji: "💜" },
    { name: "Choji Akimichi", emoji: "🍖" },
    { name: "Kiba Inuzuka", emoji: "🐕" },
    { name: "Shino Aburame", emoji: "🐞" },
    { name: "Ino Yamanaka", emoji: "🌻" },
    { name: "Tenten", emoji: "🎯" },

    { name: "Hashirama Senju", emoji: "🌳" },
    { name: "Tobirama Senju", emoji: "💧" },
    { name: "Hiruzen Sarutobi", emoji: "🎯" },
    { name: "Minato Namikaze", emoji: "⚡" },
    { name: "Tsunade Senju", emoji: "💪" },

    { name: "Pain", emoji: "🌌" },
    { name: "Obito Uchiha", emoji: "🌀" },
    { name: "Itachi Uchiha", emoji: "🕊️" },
    { name: "Kisame Hoshigaki", emoji: "🦈" },
    { name: "Deidara", emoji: "💣" },
    { name: "Sasori", emoji: "🕷️" },
    { name: "Konan", emoji: "📄" },
    { name: "Hidan", emoji: "☠️" },
    { name: "Kakuzu", emoji: "🧩" },
    { name: "Madara Uchiha", emoji: "👁️" },

    { name: "Jiraiya", emoji: "🐸" },
    { name: "Orochimaru", emoji: "🐍" },

    { name: "Gaara", emoji: "🏜️" },
    { name: "Onoki", emoji: "🗿" },
    { name: "A (Raikage)", emoji: "⚡" },
    { name: "Mei Terumi", emoji: "🌊" },
    { name: "Gengetsu Hozuki", emoji: "🦑" },
    { name: "Mu", emoji: "👻" },

    { name: "Indra Otsutsuki", emoji: "🌙" },
    { name: "Ashura Otsutsuki", emoji: "☀️" },
    { name: "Hagoromo Otsutsuki", emoji: "🌟" },
    { name: "Kaguya Otsutsuki", emoji: "🌑" },
    { name: "Isshiki Otsutsuki", emoji: "👾" },

    { name: "Killer Bee", emoji: "🐙" },
    { name: "Danzo Shimura", emoji: "🎭" },
    { name: "Yamato", emoji: "🌱" },
    { name: "Sai", emoji: "🎨" },
    { name: "Anko Mitarashi", emoji: "🐍" },
    { name: "Ibiki Morino", emoji: "⛓️" },
    { name: "Kushina Uzumaki", emoji: "🟣" },
    { name: "Rin Nohara", emoji: "🩺" },
    { name: "Fugaku Uchiha", emoji: "🔥" },
    { name: "Shisui Uchiha", emoji: "💫" }
  ];

  // Simple stat generator based on index/style
  const styles = ["équilibré", "rapide", "puissant", "technique"];
  const chars = names.map((n, i) => {
    const style = styles[i % styles.length];
    const base = 700 + (i % 10) * 20;
    const chakra = 300 + (i % 7) * 15;
    const speed = 60 + (i % 6) * 5;
    const strength = 60 + (i % 8) * 6;
    const defense = 50 + (i % 5) * 8;
    return {
      id: ("char_" + (i + 1)),
      name: n.name,
      emoji: n.emoji,
      style,
      healthMax: base,
      chakraMax: chakra,
      speed,
      strength,
      defense,
      soundtrack: "🎵",
      // minimal jutsus placeholders (4 slots)
      jutsus: [
        { slot: 1, name: "Jutsu A", chakraCost: Math.floor(chakra * 0.15), power: Math.floor(strength * 2.2) },
        { slot: 2, name: "Jutsu B", chakraCost: Math.floor(chakra * 0.12), power: Math.floor(strength * 1.6) },
        { slot: 3, name: "Jutsu C", chakraCost: Math.floor(chakra * 0.18), power: Math.floor(strength * 2.8) },
        { slot: 4, name: "Jutsu D", chakraCost: Math.floor(chakra * 0.22), power: Math.floor(strength * 3.6) }
      ],
      ultimate: { name: "Ultimate", chakraCost: Math.floor(chakra * 0.6), power: Math.floor(strength * 8) },
      awakening: { name: "Awakening", bonus: { strength: Math.floor(strength * 0.4), speed: 10 } }
    };
  });

  fs.writeFileSync(CHAR_PATH, JSON.stringify(chars, null, 2), "utf8");
}

// Load characters
function loadCharacters() {
  ensureCharactersFile();
  try {
    return JSON.parse(fs.readFileSync(CHAR_PATH, "utf8"));
  } catch (e) {
    return [];
  }
}

// Save / load player save
function getSavePath(userId) {
  return path.join(SAVES_DIR, `${userId}.json`);
}
function loadSave(userId) {
  const p = getSavePath(userId);
  if (!fs.existsSync(p)) {
    const base = {
      author: "Master Charbel",
      userId,
      selectedCharacter: null,
      level: 1,
      xp: 0,
      ryo: 0,
      unlocked: [],
      transforms: {},
      jutsus: {},
      story: { chapter: 0 },
      inventory: {},
      rank: "Genin",
      wins: 0,
      losses: 0,
      lastSavedAt: new Date().toISOString()
    };
    fs.writeFileSync(p, JSON.stringify(base, null, 2), "utf8");
    return base;
  }
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    // If corrupted, reset
    return loadSave(userId);
  }
}
function saveSave(userId, data) {
  const p = getSavePath(userId);
  data.lastSavedAt = new Date().toISOString();
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

// Simple render helpers
function healthBar(current, max, length = 20) {
  const filled = Math.round((current / max) * length);
  const empty = length - filled;
  return "❤️".repeat(Math.max(0, filled)) + "▫️".repeat(Math.max(0, empty));
}
function chakraBar(current, max, length = 10) {
  const filled = Math.round((current / max) * length);
  const empty = length - filled;
  return "🔵".repeat(Math.max(0, filled)) + "▫️".repeat(Math.max(0, empty));
}

// AI decision via christus-api (best-effort)
async function callChristusAI(state) {
  try {
    const body = {
      model: "gpt-4o-mini", // example; the API may accept custom
      prompt: `You are a Naruto Impact AI. Given state JSON, choose one action from: attack, heavy, jutsu1, jutsu2, jutsu3, jutsu4, block, dodge, dashFwd, dashBack, ultimate, awaken. Return only {"action":"..."} as JSON.`,
      state
    };
    const resp = await fetch("https://christus-api.vercel.app/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      timeout: 5000
    });
    if (!resp.ok) return null;
    const json = await resp.json();
    // The API format may vary; try to parse
    if (json?.choice) return json.choice.action || null;
    if (json?.choices && json.choices[0]?.message?.content) {
      const content = json.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        return parsed.action;
      } catch (e) {
        // try simple extraction
        const m = content.match(/"(attack|heavy|jutsu1|jutsu2|jutsu3|jutsu4|block|dodge|dashFwd|dashBack|ultimate|awaken)"/i);
        if (m) return m[1];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Fallback heuristic AI
function heuristicAI(enemy, player) {
  // If enemy low HP -> try awaken/ultimate if possible
  if (enemy.chakra >= enemy.ultimate?.chakraCost && enemy.health < enemy.healthMax * 0.4) {
    return "ultimate";
  }
  if (enemy.chakra >= enemy.jutsus[0].chakraCost && enemy.health > player.health) {
    return "jutsu1";
  }
  // random
  const opts = ["attack", "attack", "jutsu1", "block", "dodge"];
  return opts[Math.floor(Math.random() * opts.length)];
}

// Simple damage formula
function computeDamage(attacker, defender, power, isHeavy = false) {
  const base = power;
  const atk = attacker.strength || 60;
  const def = defender.defense || 50;
  const rand = 0.9 + Math.random() * 0.2;
  const heavyMul = isHeavy ? 1.4 : 1;
  const dmg = Math.max(1, Math.round((base + atk * 0.6) * rand * heavyMul - def * 0.3));
  return dmg;
}

// Main exported command
module.exports = {
  config: {
    name: "impact",
    aliases: [],
    version: "1.0",
    author: "Master Charbel",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: { fr: "🎮 Naruto Impact — mini‑jeu Messenger" },
    guide: {
      fr:
`impact               → Menu principal
impact list          → Liste des personnages
impact select <nom>  → Choisir un personnage
impact status        → Voir status & sauvegarde
impact free          → Combat libre (vs IA)
`
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const userId = event.senderID;
    const chars = loadCharacters();
    const save = loadSave(userId);
    const sub = (args[0] || "").toLowerCase();

    // MENU
    if (!sub) {
      return message.reply(
`╔══════════════════════════════════╗
║      🎮 IMPACT — MENU PRINCIPAL     ║
╠══════════════════════════════════╣
║  • impact list                    ║
║  • impact select <nom>            ║
║  • impact status                  ║
║  • impact free                    ║
╠══════════════════════════════════╣
║  Auteur : Master Charbel          ║
╚══════════════════════════════════╝`
      );
    }

    // LIST
    if (sub === "list") {
      let msg = `╔══════════════════════════════════╗\n║     📜 LISTE DES PERSONNAGES      ║\n╠══════════════════════════════════╣\n`;
      chars.forEach((c, i) => {
        msg += `║ ${String(i + 1).padStart(2, " ")}. ${c.emoji} ${c.name} (${c.style})\n`;
      });
      msg += `╚══════════════════════════════════╝`;
      return message.reply(msg);
    }

    // SELECT
    if (sub === "select") {
      const name = args.slice(1).join(" ").trim();
      if (!name) {
        return message.reply("⚠️ Usage: impact select <nom>\nEx: impact select Naruto Uzumaki");
      }
      // try exact id or name insensitively
      const found = chars.find(c => c.name.toLowerCase() === name.toLowerCase() || c.id.toLowerCase() === name.toLowerCase());
      if (!found) {
        // try partial
        const partial = chars.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
        if (!partial) {
          return message.reply(`❌ Personnage introuvable: ${name}`);
        }
        // use partial
        save.selectedCharacter = partial.id;
        save.unlocked = Array.from(new Set([...(save.unlocked || []), partial.id]));
        saveSave(userId, save);
        return message.reply(`✅ Personnage sélectionné : ${partial.emoji} ${partial.name}`);
      }
      save.selectedCharacter = found.id;
      save.unlocked = Array.from(new Set([...(save.unlocked || []), found.id]));
      saveSave(userId, save);
      return message.reply(`✅ Personnage sélectionné : ${found.emoji} ${found.name}`);
    }

    // STATUS
    if (sub === "status") {
      const sel = save.selectedCharacter ? chars.find(c => c.id === save.selectedCharacter) : null;
      const selName = sel ? `${sel.emoji} ${sel.name}` : "Aucun";
      const msg =
`╔══════════════════════════════════╗
║          📄 PROFIL JOUEUR          ║
╠══════════════════════════════════╣
║ Nom : ${event.senderName || userId}
║ Personnage : ${selName}
║ Niveau : ${save.level}  XP: ${save.xp}
║ Ryo : ${save.ryo || 0}
║ Rang : ${save.rank}
║ Win/Loss : ${save.wins || 0}/${save.losses || 0}
╚══════════════════════════════════╝`;
      return message.reply(msg);
    }

    // FREE (simple fight)
    if (sub === "free") {
      // must have selected character
      if (!save.selectedCharacter) {
        return message.reply("⚠️ Tu dois sélectionner un personnage d'abord: impact select <nom>");
      }
      const playerChar = chars.find(c => c.id === save.selectedCharacter);
      if (!playerChar) {
        return message.reply("⚠️ Personnage sélectionné introuvable, réinitialise avec impact select <nom>");
      }

      // choose random enemy different from player
      const enemies = chars.filter(c => c.id !== playerChar.id);
      const enemyChar = enemies[Math.floor(Math.random() * enemies.length)];

      // clone states
      const player = {
        ...playerChar,
        health: playerChar.healthMax,
        chakra: playerChar.chakraMax,
        combo: 0
      };
      const enemy = {
        ...enemyChar,
        health: enemyChar.healthMax,
        chakra: enemyChar.chakraMax,
        combo: 0
      };

      // announce
      await message.reply(
`╔══════════════════════════════════╗
║        ⚔️ COMBAT LIBRE ⚔️           ║
╠══════════════════════════════════╣
║ ${player.emoji} ${player.name}  VS  ${enemy.emoji} ${enemy.name}
║ Arène : Vallée de la Fin
╚══════════════════════════════════╝`
      );

      // fight loop (max 12 rounds)
      let round = 0;
      let lastUI = null;
      while (player.health > 0 && enemy.health > 0 && round < 12) {
        round++;
        // Player action: for Messenger interaction full control you'd wait for user input.
        // Here we simulate a simple player default action = attack (but you can extend to read quick replies)
        const playerAction = "attack";

        // Enemy decision: try christus API, else heuristic
        const aiState = {
          enemy: { health: enemy.health, chakra: enemy.chakra, healthMax: enemy.healthMax },
          player: { health: player.health, chakra: player.chakra, healthMax: player.healthMax }
        };
        let enemyAction = await callChristusAI(aiState);
        if (!enemyAction) enemyAction = heuristicAI(enemy, player);

        // resolve actions simply: attack / jutsu1 / block / dodge / ultimate
        let log = `-- Round ${round} --\n`;

        // Player resolves
        if (playerAction === "attack") {
          const dmg = computeDamage(player, enemy, 30, false);
          enemy.health -= dmg;
          player.combo++;
          log += `${player.emoji} ${player.name} attaque ( ${dmg} dmg )\n`;
        }

        // Enemy resolves
        if (enemyAction === "attack") {
          const dmg = computeDamage(enemy, player, 28, false);
          player.health -= dmg;
          enemy.combo++;
          log += `${enemy.emoji} ${enemy.name} attaque ( ${dmg} dmg )\n`;
        } else if (enemyAction.startsWith("jutsu")) {
          const j = enemy.jutsus[0];
          if (enemy.chakra >= j.chakraCost) {
            const dmg = computeDamage(enemy, player, j.power, false) + 10;
            player.health -= dmg;
            enemy.chakra -= j.chakraCost;
            log += `${enemy.emoji} ${enemy.name} utilise ${j.name} ( ${dmg} dmg )\n`;
          } else {
            log += `${enemy.emoji} ${enemy.name} manque de chakra pour ${enemyAction}\n`;
          }
        } else if (enemyAction === "ultimate") {
          const ult = enemy.ultimate;
          if (enemy.chakra >= ult.chakraCost) {
            const dmg = computeDamage(enemy, player, ult.power, true);
            player.health -= dmg;
            enemy.chakra -= ult.chakraCost;
            log += `${enemy.emoji} ${enemy.name} lance l'ULTIMATE ${ult.name} ( ${dmg} dmg )\n`;
          } else {
            log += `${enemy.emoji} ${enemy.name} essaie l'ULTIMATE mais échoue (chakra)\n`;
          }
        } else if (enemyAction === "block") {
          // reduce next incoming damage (very simplified)
          log += `${enemy.emoji} ${enemy.name} se protège (block)\n`;
        } else if (enemyAction === "dodge") {
          // chance to avoid next attack
          log += `${enemy.emoji} ${enemy.name} esquive (dodge)\n`;
        } else {
          log += `${enemy.emoji} ${enemy.name} fait ${enemyAction}\n`;
        }

        // mini regen
        player.chakra = Math.min(player.chakra + Math.round(player.chakraMax * 0.06), player.chakraMax);
        enemy.chakra = Math.min(enemy.chakra + Math.round(enemy.chakraMax * 0.06), enemy.chakraMax);

        // clamp hp
        player.health = Math.max(0, Math.round(player.health));
        enemy.health = Math.max(0, Math.round(enemy.health));

        // render UI snapshot
        const ui =
`╔══════════════════════════════════╗
║        🆚 Combat — Round ${round}         ║
╠══════════════════════════════════╣
║ ${player.emoji} ${player.name}
║ HP: ${player.health}/${player.healthMax}  ${healthBar(player.health, player.healthMax)}
║ CH: ${player.chakra}/${player.chakraMax}  ${chakraBar(player.chakra, player.chakraMax)}
╠──────────────────────────────────╣
║ ${enemy.emoji} ${enemy.name}
║ HP: ${enemy.health}/${enemy.healthMax}  ${healthBar(enemy.health, enemy.healthMax)}
║ CH: ${enemy.chakra}/${enemy.chakraMax}  ${chakraBar(enemy.chakra, enemy.chakraMax)}
╠══════════════════════════════════╣
${log}
╚══════════════════════════════════╝`;

        // avoid spamming identical UI too quickly
        if (ui !== lastUI) {
          await message.reply(ui);
          lastUI = ui;
        }

        // small delay for readability
        await new Promise(r => setTimeout(r, 600));
      } // end fight

      // result
      let resultText = "";
      if (player.health > 0 && enemy.health <= 0) {
        resultText = `🏆 Victoire ! ${player.emoji} ${player.name} a vaincu ${enemy.emoji} ${enemy.name}`;
        save.wins = (save.wins || 0) + 1;
        save.xp = (save.xp || 0) + 120;
        save.ryo = (save.ryo || 0) + 250;
      } else if (enemy.health > 0 && player.health <= 0) {
        resultText = `💀 Défaite... ${enemy.emoji} ${enemy.name} a vaincu ${player.emoji} ${player.name}`;
        save.losses = (save.losses || 0) + 1;
        save.xp = (save.xp || 0) + 20;
      } else {
        resultText = `🤝 Match nul entre ${player.emoji} ${player.name} et ${enemy.emoji} ${enemy.name}`;
        save.xp = (save.xp || 0) + 50;
      }
      saveSave(userId, save);
      return message.reply(resultText);
    }

    // Unknown subcommand
    return message.reply(
`❌ Commande introuvable.
Tape "impact" pour voir le menu.`
    );
  }
};
