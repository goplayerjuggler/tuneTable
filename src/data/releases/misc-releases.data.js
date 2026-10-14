export default [
	{
		theSessionRecordingId: 71,
		year: 2004,
		title: "A Man Apart",
		lead: 1,
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
		theSessionRecordingId: 432,
		title: "Frankie Gavin & Alec Finn",
		year: 1977,
		references: [
			{
				url: "https://youtu.be/AIpCH6ReCHI",
				tunes: [
					//The Bunch of Green Rushes, Sean Frank aka Mother's Delight
					1335,
					{ theSessionId: 257, name: "Sean Frank's" }
				]
			}
		],
		lead: 0,
		credits: ["gavin_fr", "finn_al"]
	}
];
