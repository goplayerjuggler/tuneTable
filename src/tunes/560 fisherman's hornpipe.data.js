export default [
	{
		groups: "alora,blr",
		aka: "Fisherman's Hornpipe",
		tags: "crooked",
		parts: "AABB",
		abc: [
			`
X:183
T:Fisher's Hornpipe
S:Laurie Hart, fiddle; Greg Sandell, piano
O:Québec
R:reel
D:Danse ce soir! Traditional tunes of Québec
F:https://lauriehart.bandcamp.com/track/fishers-hornpipe-reel-de-pointe-au-pic
B:Hart & Sandell (2001) Danse ce Soir; #2, p.40
H:This is a [setting from tunearch](https://tunearch.org/wiki/Fisher's_Hornpipe) that I (Malcolm) tweaked a little. 
H:I’ve classified this as a reel, not as a hornpipe, despite the name, because I think that’s a better fit with how it’s played.
H:The original ABC gives the source as André Alain, but for me the source is L. Hart; I don’t have any info on A. Alain.
H:More info about the album and the tunebook that go with it [here](https://lauriehartfiddle.com/danse-ce-soir-cd).
M:4/4
L:1/16
K:F
P:A
eg |: "F" f2cA "Bb" BdcB "F" AcFA "Bb" Bd~c2 | [M:3/4]"F" AFAc "Bb" dBGB "F/A" A2FA | "C/G" GECE "C" GF[FA]F "F" [FA]2[FA]e |
M:4/4
"F" ~f2cA "Gm" BdcB "F/A" (3AAA FA "Bb" BdcB | "C7" Acfa bage "F" fage [1~f2ce:| [2 f2ef ||
P:B
|: "C" gece gfbf  "F" afcf a2fa | "C" gece geba "G7" gfed "C" cABc |
"Bb" dBFB dBfd "F" cAFA cA~f2 | "C" cfed cBAG [1 "F" F2f2 ~f2ef:|2 "F" F2f2 ~f2!D.C.! |]
P:A’
"F" f2cA "Bb" BdcB  "F" AcFA "Bb" Bd~c2 | "F" Accc "Bb" bccc "F/A" accc "C/G" gcde| 
"F" ~f2cA "Gm" BdcB  "F/A" (3AAA FA "Bb" BdcB | "C7" Acfa bage "F" fage ~f2 :|

`
		],
		references: [
			{
				url: "https://juneappalrecordings.bandcamp.com/track/fishers-hornpipe-2",
				artists: `Owen "Snake" Chapman, fiddle;  Paul Smith, banjo; Al White, mandolin; `,
				album: `Fiddle Ditty by Owen "Snake" Chapman`,
				notes:
					"Another, different, oldtime setting – a “straight” one (non-“crooked”). I’m not 100% sure about the backing musicians.",
				year: 1990
			},
			{
				notes:
					"I added a “straight” setting in a [separate entry](theSessionId=872)."
			}
		],
		ttId: 560
		// theSessionSettingId: 47650
	},
	,
	{
		groups: "alora,blr",
		abc: [
			`X:1
T:Fisher's hornpipe
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-08-21,
N:from https://thesession.org/tunes/872#setting14048
N:Setting entered in thesession by user “ceolachan” on 2011-03-02
N:*abc-tools: convert to M:4/2*
N:(Edited after importing)
H:1. Bien que le nom comporte le mot « hornpipe », je préfère classer cet air comme un « reel » car à mon sens cela convient le mieux à la façon dont c'est habituellement joué de nos jours.
H:2. Voir aussi d'autres [versions québecoise ou country](ttId=560).
K:Dmajor
|:(3ABc|"D" dAFD "G" GBAG "D" FDFD "G" GBAG|"D" FDFD "G" GBAG "D" FDFD "A" E2 (3ABc|
"D" dAFD "G" GBAG "D" FDFD "G" GBAG|"D" FGAB cdec .d2c2 d2:|
|:cd|"A" ecAc efge "D" fdAd fgaf|"A" ecAc efgf edcB A2GA|
"D" BGDG BdcB "G" AFDF A2GA|"D" BdcB "A" AGFE "D"D2d2 D2:|`
		],
		theSessionId: 872,
		theSessionSettingId: 14048
	}
];
