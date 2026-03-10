export default {
	tags: ["crooked", "ambiguous tonic"],
	parts: "AB",
	abc: [
		`X: 1
T:The Cameronian
R: reel
S:Rónán Galvin, fiddle
D: The Fiddle Music of Donegal - Volume 2 (1997)
F: https://donegalfiddlemusic.bandcamp.com/track/track-22-the-cameronian-reel
N:0. This is a “crooked” tune
N:1. No attempt is made here to capture the fine details (bowing, rhythm,
N:ornamentation and embellishments) in R. Galvin’s setting. You need to hear the
N:(very worthwhile) recording to not miss out on anything.
N:2. Using 4/2 (and one bar of 5/2) here rather than the standard 4/4 as I feel
N:it better captures this reel’s melodic structures. Too bad if it doesn’t follow 
N:the “all reels are in 4/4” convention. (I feel reels in general are better when
N:written in 4/2, or in 4/4 with semiquavers, but that can be a discussion 
N:for another place and time.)
M: 4/2
L: 1/8
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield% 2024-11-12,13
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
K: G mixo
!fermata!A2 B||[P:Ⅰ]ScFF/F/F cFdF cFFd cFAc|BGG/G/G BGdG BGGe dcBd|
cFF/F/F cFdF cFFc cFAc| B/d/BGB DGBG DGBd cBAG||
P:Ⅱ
K:Gmajor
FGAg fdcA FGAg fdcA|Gdga bgfg dfga bgaf|
defg fdcA FGAg fdcA|Gdga bgfg dfga bgaf|
[M:5/2]defg fada egcf gbag fdcB!D.S.!|]
`,
		`X: 1
T:The Cameronian
R: reel
S: Consuelo Nerea Breschi, fiddle; Eoghan O’Shaughnessy, fiddle
D: The Morning Tree
F: https://themorningtree.bandcamp.com/track/rakish-paddy-the-cameronian
N:1. No attempt is made here to capture the fine details (bowing, rhythm,
N:ornamentation and embellishments). You need to hear the
N:(very worthwhile) recording to not miss out on anything.
N:2. Using 4/2 (and one bar of 3/2) here rather than the standard 4/4 as I feel
N:it better captures this reel’s melodic structures. Too bad if it doesn’t follow 
N:the “all reels are in 4/4” convention. (I feel reels in general are better when
N:written in 4/2, or in 4/4 with semiquavers, but that can be a discussion 
N:for another place and time.)
M: 4/2
L: 1/8
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield% 2025-09-01
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
K: G mixo
[P:Ⅰ]cF/F/F cFdF cBcd cBAc | BGG/G/G DGBG DGdG eGdG |
cF/F/F cFdF cBcd cBAc | BGG/G/G DGBG DGdG eGdG  ||
P:Ⅱ
F3e fdcA F3e fdcA|d~g3 b~g3 d~g3 b~g3 |
[M:3/2]dgeg ^fdcA G2gf | [M:4/2] egce ^fdaf gbag fgfd!D.C.!|]
`
	],
	references: [
		{
			notes: `I tagged this “Ambiguous tonic” as it’s not completely clear what to take as the tonic. The tonic can either be heard as the second note of the tune, or else one step up from that note. At the moment I’m going with the latter option. This is non-trivial question that changes where the sorting algorithm I’m using puts this tune.`
		}
	]
};
