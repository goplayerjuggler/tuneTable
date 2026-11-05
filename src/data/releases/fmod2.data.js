export default [
	{
		id: "fmod2",
		year: "1997",
		theSessionRecordingId: 1708,
		title: "The Fiddle Music of Donegal Volume 2",
		urls: [
			"https://donegalfiddlemusic.bandcamp.com/album/the-fiddle-music-of-donegal-volume-2"
		],
		references: [
			{
				//artists: "Vincent Campbell, fiddle",
				trackNumber: 1,
				url: "https://donegalfiddlemusic.bandcamp.com/track/track-1-john-mhosa-mcginley-s-hornpipe",
				notes: "Well worth a listen. Wild and crazy, you might say!"
			},
			{
				trackNumber: 5,

				url: "https://donegalfiddlemusic.bandcamp.com/track/track-5-mazurka",
				tunes: [1323]
			},
			{
				trackNumber: 9,
				// Stephen Campbell
				url: "https://donegalfiddlemusic.bandcamp.com/track/track-9-caileach-an-airgead-bean-baint-duileasc-agus-fhluich-s-a-l-ine-double-jigs",
				tunes: [351]
			},
			{
				trackNumber: 15,
				url: "https://donegalfiddlemusic.bandcamp.com/track/track-15-the-pigeon-on-the-gate-jenny-picking-cockles-reels",
				// artists: "Roisín McGrory and Damian Harrigan, fiddles",
				tunes: [{ theSessionId: 1596, name: "The Pigeon on the Gate" }, 202]
			},
			{
				trackNumber: 22,
				tunes: [{ theSessionId: 17551, abcX: 1 }]

				//The Cameronian
			}
		],
		credits: [
			{
				instrument: "fiddle",
				name: "Vincent Campbell",
				trackNumbers: [1, 2, 3, 4, 5]
			},
			{
				instrument: "fiddle",
				name: "Maurice Bradley",
				trackNumbers: [6, 7, 8]
			},
			{
				instrument: "fiddle",
				name: "Stephen Campbell",
				trackNumbers: [9, 10, 11]
			},
			{
				instrument: "fiddle",
				name: "Roisín McGrory",
				trackNumbers: [12, 13, 14, 15]
			},
			{
				instrument: "fiddle",
				name: "Damian Harrigan",
				trackNumbers: [12, 13, 14, 15]
			},
			{
				instrument: "fiddle",
				name: "James Byrne",
				trackNumbers: [16, 17, 18, 19]
			},
			{
				instrument: "fiddle",
				name: "Ronan Galvin",
				trackNumbers: [20, 21, 22, 23]
			}
		]
	}
];
