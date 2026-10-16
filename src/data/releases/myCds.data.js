export default [
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
		year: 2018,
		lead: 2,
		credits: [
			"nicgabhann_ca",
			"omaonaigh_ci",
			{
				id: "ocurrain_ca"
			}
		],
		references: [
			{
				trackNumber: 2, //Éigse an Spidéil / Come West Along the Road
				url: "https://caitlinciaran.bandcamp.com/track/igse-an-spid-il-come-west-along-the-road",

				duration: "04:28",
				tunes: [{ theSessionId: 20543 }, { theSessionId: 474 }]
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
	}
];
