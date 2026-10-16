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
	},
	{
		theSessionRecordingId: 344,
		lead: 1,
		year: 2000,
		title: "The Bunch Of Keys",
		credits: [
			"orourke_ja",
			{ name: "Ruadhrai O’Kane", instruments: ["fiddle"] },
			{ name: "Paul McSherry", instruments: ["guitar"] },
			{ instruments: ["bodhrán"] }
		],
		references: [
			{
				trackNumber: 1,
				//Paddy Fahey’s / Paddy Kelly’s /Father O’Grady’s Trip To Bucca
				urls: ["https://www.youtube.com/watch?v=T0e_og0XaKo"],
				tunes: [
					{ theSessionId: 1402 },
					{ theSessionId: 2125 },
					{ theSessionId: 180 }
				]
			},
			{
				trackNumber: 3,
				//O'Mahony's / the new century
				urls: ["https://music.youtube.com/watch?v=yE_iY3Z4FBs"],
				tunes: [
					// Gan Ainm/The New Century
					{
						theSessionId: 2488,
						name: "Gan Ainm"
					},
					{ theSessionId: 2001 }
				]
			},
			{
				trackNumber: 7, //The Holly Bush/O'Mahoney's/Mrs Brennan's Favourite
				tunes: [
					{ theSessionId: 1566 },
					{
						name: "O'Mahoney's",
						theSessionId: 2716,
						startTime: "01:11",
						endTime: "4:35",
						notes: `This is where I discovered this tune and got interested in it. I love the crazy energy here.`,
						urls: ["https://music.youtube.com/watch?v=oC8emJV_RJg&t=71"]
					},
					{
						// title: "Mrs Brennan's Favourite - t", //todo: add this tune (?)
						name: "Mrs Brennan's Favourite"
					}
				]
			},
			{
				trackNumber: 10,
				title: "Two Polkas",
				//Forde's / Martin O`Connor's
				urls: ["https://music.youtube.com/watch?v=HKx_-xusj_s"],
				tunes: [
					{ theSessionId: 8541 },
					{ theSessionId: 5952, name: "Gan Ainm" }
				]
			}
		]
	}
];
