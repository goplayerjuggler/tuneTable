export default [
	{
		id: "fitb",
		year: "1930s",
		// theSessionRecordingId: 4445,
		title: "A Feeling In The Blood",
		credits: ["boyle_ne"],
		url: "https://donegalfiddlemusic.bandcamp.com/album/a-feeling-in-the-blood",
		notes:
			"[CD1](https://thesession.org/recordings/4445); [CD2](https://thesession.org/recordings/4446); [CD3](https://thesession.org/recordings/4447);",
		references: [
			{
				TrackNumber: 1,
				url: "https://donegalfiddlemusic.bandcamp.com/track/the-pidgeon-on-the-gate-jenny-picking-cockles-reels",
				tunes: [{ theSessionId: 1596, name: "The Pidgeon on the Gate" }, 202]
			},
			{
				//harvest Home/GreenMountain
				TrackNumber: 3,
				url: "https://donegalfiddlemusic.bandcamp.com/track/the-harvest-home-the-green-mountain-hornpipes",
				tunes: [
					49,
					{ theSessionId: 166, name: "The Green Mountain", rhythm: "reel" }
				],
				notes: "A Néillidh Boyle recording that made a big impression on me."
			},
			{
				TrackNumber: 31,
				url: "https://donegalfiddlemusic.bandcamp.com/track/pigeon-on-the-gate-reel",
				tunes: [{ theSessionId: 1596, name: "Pigeon on the Gate" }]
			},
			{
				TrackNumber: 52,
				url: "https://donegalfiddlemusic.bandcamp.com/track/harvest-home",
				notes: `Another recording that’s well worth checking out, with some glissando effects that only he does AFAIK. It’s preceded by a [recording of him talking about the tune](https://donegalfiddlemusic.bandcamp.com/track/harvest-home-speech). One interesting thing (among others) is he calls it a reel – he doesn’t call it a hornpipe.`,
				tunes: [49]
			},
			{
				TrackNumber: 57,
				url: "https://donegalfiddlemusic.bandcamp.com/track/the-pidgeon-on-the-gate",
				tunes: [{ theSessionId: 1596, name: "The Pidgeon on the Gate" }]
			}
		]
	}
];
