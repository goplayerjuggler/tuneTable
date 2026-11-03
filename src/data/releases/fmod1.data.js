export default [
	{
		id: "fmod1",
		year: "1995",
		theSessionRecordingId: 283,
		title: "The Fiddle Music of Donegal Volume 1",
		urls: [
			"https://donegalfiddlemusic.bandcamp.com/album/the-fiddle-music-of-donegal-volume-1",
			"https://thesession.org/recordings/283"
		],
		notes:
			"Cairdeas Recordings CNF 001. Recorded from 31 July to 2 August 1995 at Glencolmcille, Co. Donegal; notes by Caoimhín Mac Aoidh. Solo fiddle, unaccompanied.",

		references: [
			{
				//Track 1 The Bunglas Lass and Mrs. McGinley’s (Hornpipes) 02:58
				trackNumber: 1,
				duration: "2:58",
				tunes: [
					{ name: "The Bunglas Lass", rhythm: "hornpipe" },
					{ name: "Mrs. McGinley's", rhythm: "hornpipe" }
				]
			},
			{
				//Track 2 Con Cassidy’s Waltz and The Speaking Waltz 05:35
				trackNumber: 2,
				duration: "5:35",
				tunes: [{ name: "Con Cassidy's Waltz", rhythm: "waltz" }, 12014]
			},
			{
				//Track 3 Feargal O’Gara and The Cliffs of Glencolmcille (Reels)
				trackNumber: 3,
				duration: "2:33",
				tunes: [
					{ name: "Feargal O'Gara", theSessionId: 234 },
					{ name: "The Cliffs of Glencolmcille", rhythm: "reel" }
				]
			},
			{
				//Track 4 Mac Eoghan Sheain agus Inion John Chit (Polka)
				trackNumber: 4,
				tunes: [
					{ name: "Mac Eoghan Sheain agus Inion John Chit", rhythm: "polka" }
				]
			},
			{
				//Track 5 The Marine (Single Jig)
				trackNumber: 5,
				tunes: [{ name: "The Marine", rhythm: "single jig" }]
			},
			{
				//Track 6 Maggie Pickie (Highland)
				trackNumber: 6,
				tunes: [{ name: "Maggie Pickie", rhythm: "highland" }]
			},
			{
				//Track 7 Shanie Mulhearne’s Reel
				trackNumber: 7,
				tunes: [{ name: "Shanie Mulhearne's Reel", rhythm: "reel" }]
			},
			{
				//Track 8 Moneymusk (Highland)
				trackNumber: 8,
				tunes: [{ name: "Moneymusk", rhythm: "highland" }]
			},
			{
				//Track 9 Untitled Mazurkas
				trackNumber: 9,
				tunes: [
					{ name: "Untitled", rhythm: "mazurka", theSessionId: 1276 },
					{ name: "Untitled", rhythm: "mazurka", theSessionId: 1332 } // Vincent Campbell’s
				]
			},
			{
				//Track 10 The Cock’s Tail (Single Reel), The Five Mile Chase and George White’s Fancy (Reels)
				trackNumber: 10,
				tunes: [
					{ name: "The Cock's Tail", rhythm: "single reel" },
					{ name: "The Five Mile Chase", rhythm: "reel" },
					{ name: "George White's Fancy", rhythm: "reel" }
				]
			},
			{
				//Track 11 An t-Eas and McCahill’s (Hornpipes)
				trackNumber: 11,
				tunes: [
					{ name: "An t-Eas", rhythm: "hornpipe" },
					{ name: "McCahill's", rhythm: "hornpipe" }
				]
			},
			{
				//Track 12 Con Cassidy’s and John Glackin’s (Germans)
				trackNumber: 12,
				tunes: [
					{ name: "Con Cassidy's", rhythm: "german" },
					{ name: "John Glackin's", rhythm: "german" }
				]
			},
			{
				//Track 13 The Fintown Girl’s Lament
				trackNumber: 13,
				tunes: [{ name: "The Fintown Girl's Lament", rhythm: "air" }]
			},
			{
				//Track 14 The Quaker’s Wife (Single Jig) and The Boys of the Town (Double Jig)
				trackNumber: 14,
				tunes: [{ ttId: 344 }, 1264]
			},
			{
				//Track 15 The Humours of Baile na Fead and the Wee Pickle Tow (Double Jigs)
				trackNumber: 15,
				tunes: [
					{ name: "The Humours of Baile na Fead", rhythm: "jig" },
					{ name: "The Wee Pickle Tow", rhythm: "jig" }
				]
			},
			{
				//Track 16 Neillidh Ó Baoighill’s, Banríon na Bealtaine and Dúlamán na Binne Búidhe (Highlands)
				trackNumber: 16,
				tunes: [
					{ name: "Neillidh Ó Baoighill's", rhythm: "highland" },
					{ name: "Banríon na Bealtaine", rhythm: "highland" },
					{ name: "Dúlamán na Binne Búidhe", rhythm: "highland" }
				]
			},
			{
				//Track 17 Róise Bheag Róise Móire’s and Prionnsias Ó Maonaigh’s (Germans)
				trackNumber: 17,
				tunes: [
					{ name: "Róise Bheag Róise Móire's", rhythm: "german" },
					{ name: "Prionnsias Ó Maonaigh's", rhythm: "german" }
				]
			},
			{
				//Track 18 The Soldier’s Joy (Hornpipe)
				trackNumber: 18,
				tunes: [{ name: "The Soldier's Joy", rhythm: "hornpipe" }]
			},
			{
				trackNumber: 19, //The ’21 and The Iron Man
				tunes: [
					{ theSessionId: 10390, name: "The '21", rhythm: "highland" },
					{ theSessionId: 172, name: "The Iron Man", rhythm: "highland" }
				]
			},
			{
				trackNumber: 20, //The Drunken Sailor and The Dungorman (Hornpipes) 05:00
				tunes: [553, { name: "The Dungorman", rhythm: "hornpipe" }]
			},
			{
				// Track 21 The Green Fields of Glentown and Leslie’s (Reels)
				trackNumber: 21,
				tunes: [671, { name: "Leslie's", rhythm: "reel" }]
			},
			{
				//Track 22 The Frost is all Over and Frank Cassidy’s (Double Jigs)
				trackNumber: 22,
				tunes: [448, { name: "Frank Cassidy's", rhythm: "jig" }]
			},
			{
				//Track 23 McSweeney’s Lament
				trackNumber: 23,
				tunes: [{ name: "McSweeney's Lament", rhythm: "air" }]
			},
			{
				//Track 24 The Black Fanad Mare and Drowsy Maggie (Reels)
				trackNumber: 24,
				notes: "Lovely playing here.",
				tunes: [
					{
						theSessionId: 429,
						name: "The Black Fanad Mare",
						abcX: 6,
						notes:
							"The dots here are fairly close to how Paul O'Shaughnessy plays it, albeit with a few non-trivial differences."
					},
					{
						ttId: 635,
						abcX: 2,
						notes:
							"Maybe this is the Donegal setting. I like it a lot. It makes a nice change from the [more common version](theSessionId=27) which is a bit hackneyed/overplayed these days IMO."
					}
				]
			}
		],

		// Source: GW’s comment on thesession.org/recordings/283.
		// trackNumbers: the tracks (see `trackNumber` of `references` above) that the credit applies to;
		// absent = credited on all the tracks. `indexes` (positions in `references`) works too.
		credits: [
			{
				name: "Martin McGinley",
				instrument: "fiddle",
				trackNumbers: [1, 2, 3]
			},
			{
				name: "Jimmy Campbell",
				instrument: "fiddle",
				trackNumbers: [4, 5, 6, 7, 8, 9]
			},
			{ name: "Michael McMenamin", instrument: "fiddle", trackNumbers: [10] },
			{
				name: "Mick Brown",
				instrument: "fiddle",
				trackNumbers: [11, 12, 13]
			},
			{
				name: "Proinnsias Ó Maonaigh",
				instrument: "fiddle",
				trackNumbers: [14, 15, 16, 17]
			},
			{ name: "Danny McCarry", instrument: "fiddle", trackNumbers: [18] },
			{
				name: "Peter Tracey",
				instrument: "fiddle",
				trackNumbers: [19, 20, 21]
			},
			{
				name: "Paul O'Shaughnessy",
				instrument: "fiddle",
				trackNumbers: [22, 23, 24]
			}
		]
	}
];
