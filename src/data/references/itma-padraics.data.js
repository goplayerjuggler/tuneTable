export default [
	{
		credits: [{ id: "macmahon_to" }, { id: "hill_no" }],
		urls: [
			"https://www.itma.ie/playlists/padraics-picks-november-2024/?track=7"
		],
		itmaId: "tmm-18590-1-280406",
		tunes: [
			{ theSessionId: 98 },
			{
				//foxhunters
				theSessionId: 511,
				notes: `Here they start with the C part and then play it all the way through three times before moving on to the next (the Humours of Tulla). So that gives: CDE ABCDE ABCDE ABCDE`
			},
			{
				//tulla
				theSessionId: 141,
				notes:
					`Here they start with the B part and then repeat it a few times - I haven’t counted ` + //todo
					` - and then move on to the Flogging reel. That gives: B AB AB .. AB
`
			},
			{
				//flogging
				theSessionId: 195,
				startTime: "~06:27",
				notes:
					"(2026-10-12) They have their own distinctive take on the C part that I really like. I haven't heard it played like that anywhere else."
			},
			{ theSessionId: 1552, startTime: "7:58 (-06:48)" },
			{ theSessionId: 113 },
			{
				theSessionId: 1552,
				notes:
					"Just after Toss the feathers they come back to Lucy Campbell, playing it twice before moving on. “Let's go back to Lucy!”"
			},
			{
				//durrow
				theSessionId: 891,
				notes:
					"From “-02:58” onwards. Here they play it “AABBCC”, rather than “AABCBC”, which is the way it tends to be played these days. (The score here is AABBCC.) Because of this, I tagged this tune as “flexible structure”."
			}
		],
		//[Sally Gardens](theSessionId=98) / [The foxhunters](theSessionId=511) / [The humours of Tulla](theSessionId=141) / [The flogging reel](theSessionId=195) / Lucy Campbell / [Toss the feathers](theSessionId=113) / Lucy Campbell / [Trip to Durrow](theSessionId=891)
		notes: `I’ve listened to this dozens of times. It has such great energy! And there’s lots to learn from the playing.
Warning for ITMA pages: you have to click on the link in the player.`,
		year: 1993
	},
	{
		//Morning dew / Hunter's house
		urls: [
			"https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-august-2025/?track=6"
		],
		itmaId: "lre-277086-1-277882",
		credits: ["redican_la", "mcgann_an", "dolan_fe"],
		tunes: [69, 472],
		year: "1960s"
	},
	{
		//Lark in the morning, jig ; Joe Cooley's, jig / Tony MacMahon, accordion ; Steve Cooney, guitar
		urls: [
			"https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-april-2025/?track=5"
		],
		itmaId: "tmm-18590-1-280420",
		credits: ["macmahon_to", { name: "Steve Cooney", instrument: "guitar" }],
		year: 2000,
		tunes: [
			{
				theSessionId: 2060 //morning lark
			},
			{ theSessionId: 414, name: "Joe Cooley's" } //seamus cooley's
		]
	}
];
