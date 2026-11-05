export default [
	{
		title: "Caitlín & Ciarán",
		url: "https://caitlinciaran.bandcamp.com/album/caitl-n-ciar-n",
		itirid: "CtlnCrn",
		theSessionRecordingId: 4922,
		year: 2014,
		lead: 2,
		credits: [
			"nicgabhann_ca",
			"omaonaigh_ci",
			{ name: "Caoimhín Ó Fearghaíl", instrument: "bouzouki" },
			{ name: "Sean Óg Graham", instrument: "guitar" }
		],
		references: [
			{
				trackNumber: 2, //whistler at the wake, old flair,
				url: "https://caitlinciaran.bandcamp.com/track/the-whistler-at-the-wake-the-old-flail-the-butchers-march",

				duration: "04:43",
				tunes: [
					4236,
					839,
					{ theSessionId: 1003, name: "The Butcher's March", rhythm: "jig" }
				]
			},
			{
				trackNumber: 3,
				url: "https://caitlinciaran.bandcamp.com/track/midnight-in-virginia-the-mountain-road",

				duration: "04:08",
				tunes: [
					{ name: " Midnight In Virginia", rhythm: "reel" },
					{
						notes:
							"A five-part version “picked up from the Campbells of Glenties and Dermot McLaughlin”",
						theSessionId: 68
					}
				]
			}
		]
	},
	{
		id: "door_n_window",
		theSessionRecordingId: 3472,
		title: "Doorways & Windowsills",
		credits: ["macgabhann_an", "oconnor_mi", "whelan_ed"],
		lead: 2
	},
	{
		id: "fierce_trad",
		lead: 1,
		theSessionRecordingId: 635,
		itirid: "FG 6",
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
					{ name: "Mary O’Neill’s Fancy" }
				],
				credits: ["gavin_fr", { name: "Brian McGrath", instruments: ["piano"] }]
			}
		]
	},
	{
		title: "The High Seas",
		url: "https://caitlinciaran.bandcamp.com/album/the-high-seas",
		theSessionRecordingId: 5888,
		itirid: "HiSeas",
		year: 2018,
		lead: 2,
		credits: ["nicgabhann_ca", "omaonaigh_ci", "ocurrain_ca"],
		references: [
			{
				trackNumber: 2, //Éigse an Spidéil / Come West Along the Road
				url: "https://caitlinciaran.bandcamp.com/track/igse-an-spid-il-come-west-along-the-road",

				duration: "04:28",
				tunes: [{ theSessionId: 20543 }, { theSessionId: 474 }]
			},

			{
				trackNumber: 6,
				url: "https://caitlinciaran.bandcamp.com/track/the-speaking-waltz",
				notes: "A “sweet”, lullaby-style setting",
				duration: "04:36",
				tunes: [12014]
			},
			{
				trackNumber: 8,
				url: "https://caitlinciaran.bandcamp.com/track/the-drunken-landlady-christmas-eve-the-abbey-reel",
				duration: "04:58",
				tunes: [
					{ theSessionId: 363 },
					{ theSessionId: 440, name: "Christmas Eve", startTime: "1:48" },
					{ theSessionId: 477 }
				]
			},
			{
				trackNumber: 9,
				url: "https://caitlinciaran.bandcamp.com/track/mo-ghloine-uisce-beatha-eklunda-polska",
				duration: "04:52",
				tunes: [
					{ name: "Mo Ghloine Uisce Beatha", rhythm: "song" },
					{
						theSessionId: 15784,
						name: "Eklunda Polska"
					}
				],
				credits: [
					"nicgabhann_ca",
					"omaonaigh_ci",
					{
						id: "ocurrain_ca",
						instruments: ["voc", "bouzouki"],
						indexes: [0]
					},
					{
						id: "ocurrain_ca",
						instruments: ["bouzouki"],
						indexes: [1]
					}
				]
			},
			{
				trackNumber: 10,
				url: "https://caitlinciaran.bandcamp.com/track/an-cail-n-rua",
				title: "An Calín Rua",
				duration: "04:30",
				tunes: [
					// An Cailín Rua /The Flogging / Dinkie’s
					{
						theSessionId: 25377,
						rhythm: "song"
					},
					{ theSessionId: 195 },
					{ theSessionId: 24 },
					{
						theSessionId: 25377,
						name: "An Calín Rua",
						rhythm: "song"
					}
				],
				credits: [
					{ id: "nicgabhann_ca", indexes: [0, 1, 3] },
					{ id: "nicgabhann_ca", indexes: [2], instrument: "dance" },
					"omaonaigh_ci",
					{
						id: "ocurrain_ca",
						instruments: ["voc", "bouzouki"],
						indexes: [0, 3]
					},
					{
						id: "ocurrain_ca",
						instruments: ["bouzouki"],
						indexes: [1, 2]
					}
				]
			}
		]
	},
	{
		title: "Traditional Irish Flute Music",
		theSessionRecordingId: 1015,
		itirid: "FVlly 1",
		lead: 1,
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
	},
	{
		title: "The Fog is Lifting",
		theSessionRecordingId: 8393,
		year: 2025,
		urls: [
			"https://sylvainbarou.bandcamp.com/album/br-d-harper-libby-mccrohan-sylvain-barou-the-fog-is-lifting"
		],
		credits: ["barou_sy", "harper_br", "mccrohan_li"],
		references: [
			{
				trackNumber: 4,
				url: "https://sylvainbarou.bandcamp.com/track/hop-jigs-reel-cucanandy-top-it-off-the-sunny-banks",
				tunes: [1374, 2608, { rhythm: "reel", name: "The Sunny Banks" }]
			},
			{
				trackNumber: 7,
				urls: [
					"https://sylvainbarou.bandcamp.com/track/mazurkas-christmas-in-spiddal-twelve-to-the-bar"
				],
				tunes: [19792, { name: "Twelve To The Bar", rhythm: "mazurka" }]
			},

			{
				trackNumber: 11,
				duration: "5:54",
				url: "https://sylvainbarou.bandcamp.com/track/hornpipe-reels-the-stage-ag-filleadh-abhaile-omahoneys",
				tunes: [
					{ name: "The Stage", rhythm: "hornpipe" },
					{ name: "Ag Filleadh Abhaile", rhythm: "reel" },
					{
						theSessionId: 2716,
						startTime: "3:26",
						notes: `I think this is a bit calmer than the Jason O’Rourke 2009 recording; but perhaps it’s an easier reference for learning the tune (?)`
					}
				]
			}
		]
	}
];
