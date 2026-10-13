export default [
	{
		theSessionRecordingId: 71,
		year: 2004,
		title: "Fierce Traditional",
		credits: [
			"mcguire_se",
			{ name: "Wilcil McDowell", instruments: ["piano"] }
		],
		references: [
			{
				//The Black Rogue; Morrison’s
				trackNumber: 12,
				urls: ["https://youtu.be/yfzOYOub-A0"],
				tunes: [{ theSessionId: 1076 }, { theSessionId: 71, startTime: "1:05" }]
			}
		]
	},
	{
		title: "The Star Above The Garter",
		theSessionRecordingId: 1073,
		year: 1969,
		references: [
			{
				urls: ["https://www.youtube.com/watch?v=a2ykXumZ5ks"],
				title: "The Ballydesmond polkas",
				tunes: [
					{ theSessionId: 298, abcX: 1 },
					{ theSessionId: 238 },
					{ theSessionId: 239 }
				]
			}
		],
		credits: ["farr_lu", "murphy_de"]
	}
];
