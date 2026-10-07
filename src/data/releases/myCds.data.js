export default [
	{
		id: "door_n_window",
		theSessionRecordingId: 3472,
		title: "Doorways & Windowsills",
		credits: ["macgabhann_an", "oconnor_mi", "whelan_ed"]
	},
	{
		id: "fierce_trad",
		theSessionRecordingId: 635,
		year: 2001,
		urls: [
			"https://frankiegavin.bandcamp.com/album/fierce-traditional",
			"https://www.irishtune.info/album/FG+6/"
		],
		title: "Fierce Traditional",
		credits: ["gavin_fr"],
		references: [
			{
				//Maud Millar / Mary O’Neill’s Fancy
				trackNumber: 2,
				duration: "2:25",
				notes: `Interesting setting and backing chords.`,
				urls: ["https://frankiegavin.bandcamp.com/track/maud-millar"],
				tunes: [
					{ theSessionId: 1177, abcX: "2" },
					{ title: "Mary O’Neill’s Fancy" }
				],
				credits: ["gavin_fr", { name: "Brian McGrath", instruments: ["piano"] }]
			}
		]
	},
	{
		theSessionRecordingId: 344,
		year: 2000,
		title: "The Bunch Of Keys",
		credits: [
			"orourke_ja",
			{ name: "Ruadhrai O’Kane", instruments: ["fiddle"] },
			{ name: "Paul McSherry", instruments: ["guitar"] },
			{ name: "?", instruments: ["bodhrán"] }
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
					{
						theSessionId: 2488,
						name: "Gan Ainm"
						// notes:
						// 	"On the album, this is the first in a set with the title: “Gan Ainm/The New Century”"
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
