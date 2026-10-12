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
	},
	{
		title: "Traditional Irish Flute Music",
		theSessionRecordingId: 1015,
		year: 1979,
		urls: [
			"https://fintanvallely.bandcamp.com/album/fintan-vallely-traditional-irish-flute-music-re-mastered-28-5-2021"
		],
		credits: [
			{ name: "Fintan Vallely", instruments: ["flute"] },
			{ name: "Mark Simos", instruments: ["guitar"] }
		],
		references: [
			{
				urls: [
					"https://fintanvallely.bandcamp.com/track/christmas-eve-the-reel-of-rio-2"
				],
				tunes: [
					{ theSessionId: 440, name: "Christmas Eve" },
					{ theSessionId: 575 }
				]
			}
		]
	}
];
