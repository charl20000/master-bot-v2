const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
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
			leaveType1: "tự rời",
			leaveType2: "bị kick",
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		},
		en: {
			session1: "𝐌𝐎𝐑𝐍𝐈𝐍𝐆",
			session2: "𝐍𝐎𝐎𝐍",
			session3: "𝐀𝐅𝐓𝐄𝐑𝐍𝐎𝐎𝐍",
			session4: "𝐄𝐕𝐄𝐍𝐈𝐍𝐆",
			leaveType1: "𝐥𝐞𝐟𝐭",
			leaveType2: "𝐰𝐚𝐬 𝐤𝐢𝐜𝐤𝐞𝐝 𝐟𝐫𝐨𝐦",
			defaultLeaveMessage: `╔══════════════════════════════════════════╗
║           👋 𝐍𝐄𝐗𝐔𝐒 𝐋𝐄𝐀𝐕𝐄 👋           ║
╠══════════════════════════════════════════╣
║                                          ║
║   📤 {userName}                           ║
║   🔹 {type} {boxName}                    ║
║                                          ║
║   🌤️ 𝗕𝗼𝗻𝗻𝗲 𝗷𝗼𝘂𝗿𝗻é𝗲 𝗲𝘁 𝗮̀ 𝗯𝗶𝗲𝗻𝘁ô𝘁 !      ║
║                                          ║
╠══════════════════════════════════════════╣
║   ⚡ 𝗡𝗘𝗫𝗨𝗦 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗕𝗢𝗧 ⚡               ║
╚══════════════════════════════════════════╝`
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage)
					return;
				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID())
					return;
				const hours = getTime("HH");

				const threadName = threadData.threadName;
				const userName = await usersData.getName(leftParticipantFbId);

				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
				
				// Déterminer le type de départ
				const isSelfLeave = leftParticipantFbId == event.author;
				const leaveType = isSelfLeave ? getLang("leaveType1") : getLang("leaveType2");
				
				const form = {
					mentions: leaveMessage.match(/\{userNameTag\}/g) ? [{
						tag: userName,
						id: leftParticipantFbId
					}] : null
				};

				leaveMessage = leaveMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName)
					.replace(/\{type\}/g, leaveType)
					.replace(/\{threadName\}|\{boxName\}/g, threadName)
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, hours <= 10 ?
						getLang("session1") :
						hours <= 12 ?
							getLang("session2") :
							hours <= 18 ?
								getLang("session3") :
								getLang("session4")
					);

				form.body = leaveMessage;

				if (leaveMessage.includes("{userNameTag}")) {
					form.mentions = [{
						id: leftParticipantFbId,
						tag: userName
					}];
				}

				if (threadData.data.leaveAttachment) {
					const files = threadData.data.leaveAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}
				message.send(form);
			};
	}
};
