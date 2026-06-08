const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "2.0",
		author: "Master Charbel • NEXUS",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "𝐌𝐎𝐑𝐍𝐈𝐍𝐆",
			session2: "𝐍𝐎𝐎𝐍",
			session3: "𝐀𝐅𝐓𝐄𝐑𝐍𝐎𝐎𝐍",
			session4: "𝐄𝐕𝐄𝐍𝐈𝐍𝐆",
			// ⚠️ C'EST ICI QU'ON MODIFIE ⚠️
			welcomeMessage: `╔══════════════════════════════════════════╗
║         ✨ 𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄 ✨          ║
╠══════════════════════════════════════════╣
║                                          ║
║   🌟 𝗕𝗼𝘁 𝗮𝗷𝗼𝘂𝘁é 𝗮𝘃𝗲𝗰 𝘀𝘂𝗰𝗰è𝘀 ! 🌟        ║
║                                          ║
║   🔹 𝗣𝗿é𝗳𝗶𝘅𝗲 𝗱𝘂 𝗯𝗼𝘁 : %1                 ║
║   🔹 𝗧𝗮𝗽𝗲 %1𝗵𝗲𝗹𝗽 𝗽𝗼𝘂𝗿 𝗹𝗮 𝗹𝗶𝘀𝘁𝗲           ║
║   🔹 𝗧𝗮𝗽𝗲 %1𝗺𝗲𝗻𝘂 𝗽𝗼𝘂𝗿 𝗹𝗲 𝗺𝗲𝗻𝘂             ║
║                                          ║
║   💫 𝗣𝗼𝘂𝘃𝗼𝗶𝗿 • 𝗦𝘁𝗮𝗯𝗶𝗹𝗶𝘁é • 𝗜𝗻𝗻𝗼𝘃𝗮𝘁𝗶𝗼𝗻 💫 ║
║                                          ║
╠══════════════════════════════════════════╣
║   ⚡ 𝗡𝗘𝗫𝗨𝗦 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗕𝗢𝗧 ⚡               ║
╚══════════════════════════════════════════╝`,
			multiple1: "𝐲𝐨𝐮",
			multiple2: "𝐲𝐨𝐮 𝐠𝐮𝐲𝐬",
			defaultWelcomeMessage: `╔══════════════════════════════════════════╗
║         ✨ 𝐍𝐄𝐗𝐔𝐒 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄 ✨          ║
╠══════════════════════════════════════════╣
║                                          ║
║   🌸 𝗕𝗶𝗲𝗻𝘃𝗲𝗻𝘂𝗲 𝗱𝗮𝗻𝘀 𝗹𝗲 𝗴𝗿𝗼𝘂𝗽𝗲 ! 🌸      ║
║                                          ║
║   👤 {userName}                          ║
║   📦 {boxName}                           ║
║                                          ║
║   🔹 𝗣𝗿é𝗳𝗶𝘅𝗲 : %1                       ║
║   🔹 𝗧𝗮𝗽𝗲 %1𝗵𝗲𝗹𝗽 𝗽𝗼𝘂𝗿 𝗹𝗲𝘀 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝗲𝘀      ║
║                                          ║
║   🌤️ 𝗕𝗼𝗻𝗻𝗲 {session} {multiple} !        ║
║                                          ║
╠══════════════════════════════════════════╣
║   ⚡ 𝗡𝗘𝗫𝗨𝗦 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗕𝗢𝗧 ⚡               ║
╚══════════════════════════════════════════╝`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}

					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
					
					// Remplacer %1 par le prefix
					welcomeMessage = welcomeMessage.replace(/%1/g, prefix);
					
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
