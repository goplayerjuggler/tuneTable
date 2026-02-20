export default {
	lastUpdate: "2026-02-20",
	setLists: [
		{
			id: "1771406869982-ukwxx",
			name: "Steam up sets",
			dateCreated: "2026-02-18T09:27:49.982Z",
			dateModified: "2026-02-18T10:23:46.003Z",
			groups: "su",
			sets: [
				{
					name: "Slides (3-3-3)",
					tunes: [
						{
							theSessionId: 6
						},
						{
							theSessionId: 8362
						},
						{
							theSessionId: 1398
						}
					],
					collapsed: true
				},
				{
					name: "Rookery set (4-3-4) ",
					tunes: [
						{
							theSessionId: 2958
						},
						{
							theSessionId: 9828
						},
						{
							theSessionId: 9639
						}
					],
					collapsed: true
				},
				{
					name: "Fahey's Fiddle",
					tunes: [
						{
							theSessionId: 124,
							notes: "In C; x2"
						},
						{
							theSessionId: 693,
							notes: "x2"
						},
						{
							theSessionId: 124,
							notes: "in D; x2"
						}
					],
					collapsed: true
				}
			]
		},
		{
			id: "1771465912087-9s86i",
			name: "ALORA sets",
			groups: "ALORA",
			dateCreated: "2026-02-19T01:51:52.087Z",
			dateModified: "2026-02-19T02:16:58.158Z",
			sets: [
				{
					name: "Maud Millar set",
					tunes: [
						{
							theSessionId: 1177
						},
						{
							theSessionId: 116
						},
						{
							theSessionId: 118
						}
					],
					collapsed: true
				},
				{
					name: "Christmas Eve set",
					tunes: [
						{
							theSessionId: 440
						},
						{
							theSessionId: 1555
						},
						{
							theSessionId: 1177
						}
					],
					collapsed: true
				},
				{
					name: "Barndances",
					tunes: [
						{
							norbeckId: 12,
							norbeckR: "barndance"
						},
						{
							norbeckId: 14,
							norbeckR: "barndance"
						}
					],
					collapsed: true
				},
				{
					name: "Polkas d’après Jason O’Rourke",
					tunes: [
						{
							theSessionId: 3835
						},
						{
							theSessionId: 18688
						},
						{
							theSessionId: 7386
						}
					]
				}
			]
		}
	],
	tunes: [
		{
			abc: `
%230717
X: 1
T:The Silver Slipper
R: march(?) + hop jig
S: John Doherty, fiddle
N: 1. Mostly swung throughout – so in general “♪♪=♩♪”
D: The Floating Bow (1996; recorded between 1968 and 1974)
Z:abc-transcription Malcolm Schonfield
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
M: 2/2
L: 1/8
K: D
|:FD ~D2 FD ~D2|AFdA FD ~D2|FDFA B<GEA:|
M: 3/4
|:FA dc d2|FA dA (3Bcd|FA dc ~d2|BG EF GE|
FA dc d2|FA dA (3Bcd|ec dA FA|1 BG EF GE:|2 [M: 1/2]BG E!D.C.!G ||
`,
			references: [
				{
					notes:
						"See [more comments & links I put on the session](https://thesession.org/tunes/8479#comment970217)"
				}
			],
			badges: "crooked",
			norbeckId: 20,
			norbeckR: "slip+jig",
			parts: "AABB"
		},
		{
			abc: `X:1
T:Jamesy Gannon's
R:barndance
L:1/8
M:4/2
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3515#setting3515
N:Setting entered in thesession by user “gian marco” on 2004-09-10
N:*abc-tools: convert to M:4/2*
N:(edited after importing)
K:Gmajor
|:D2GA B2B2 (3ABA GA B<ddg|e<dge dBGB A<GBG A<GEG|
D2GA B2B2 (3ABA GA B<ddg|e<dge dBGB[1 AGEF G2FE:|2 AGEF G2Gg||
gfga bage d^cde dBGg|gfga baga agab a2ef|
gfga bage dcde d2ef|g2(3fgf (3efe dB c2(3BcB A2(3GFE||`,
			theSessionId: 3515,
			parts: "AABB"
		},
		{
			incipit: `X:1
T:The Hut On Staffin Island
C:Phil Cunningham
O:Scotland
R:reel
L:1/16
M:4/4
K:Dmajor
A,B,DE D3E FDFA d2cd | B3d BAFD`,
			theSessionId: 2067,
			norbeckId: 1028,
			parts: "AABB"
		},
		{
			abc: `X:1
T:The Old Boreen
C:Vincent Broderick
R:barndance
L:1/8
M:4/4
N:This tune was composed by Vincent Broderick and is transcribed from the playing
N:of Joe Fitzgerald on YouTube: https://www.youtube.com/watch?v=mkaMPUj3Wsk where
N:it follows The Old Broom, also by Vincent Broderick and played with Bríd
N:O'Gorman. For fiddlers it is also played in a very slightly different version by
N:Antóin Mac Gabhann here:
N:https://comhaltas.ie/music/detail/comhaltaslive_351_7_antoin_mac_gabhann/
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/16299#setting30857
N:Setting entered in thesession by user “cac” on 2017-08-15
K:Gmajor
D|:G3A B3A|GAGE D3E|GABd edgd|eege edBA|
 G3A B3A|GAGE D3E|GABd edBG|1 ~A2G2 G2BA:|2 ~A2G2 GABc||
 d3e dBGB|d^cde dBGB|A3B AGEG|AGAB AGED|
 d3e dBGB|d^cde dBGD|GABd edBG|1 ~A2G2 GABc:|2 ~A2G2 G3D||`,
			theSessionId: 16299,
			theSessionSettingId: 30857
		},
		{
			abc: `X:1
T:The New Broom
C:Vincent Broderick
R:barndance
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1726#setting1726
N:Setting entered in thesession by user “paul19” on 2003-06-04
K:Gmajor
|:G3B d2Bd|e/g/e dB d2BA|GFGA ~B2AG|A2E2 E2(3DEF|
 G3B d2Bd|e/g/e dB d2Bd|edge dBAc|1 B2G2 G2(3DEF:|2 B2G2 G2ga||
 b2ba g3a|bgag e/g/e d2|edge dBGA|BAAG A2ga|
 b2ba g3a|bgag e/g/e d2|edge dBAc|B2G2 G2ga|
 b2ba g3a|bgag e/g/e d2|edge dBGA|BAAG AcBA|
 G3B d2Bd|e/g/e dB d2Bd|edge dBAc|B2G2 G2(3DEF||`,
			theSessionId: 1726,
			references: [
				{
					url: "http://media.comhaltas.ie/audio/cl351/cl351_7_64K.mp3",
					artists: "Antóin Mac Gabhann",
					notes:
						"The New Broom, Down the Old Boreen (2011-04-30) - from [comhaltas.ie](https://comhaltas.ie/comhaltaslive/comhaltaslive_351_7_antoin_mac_gabhann/)"
				}
			]
		},
		{
			abc: `X:1
T:Éigse An Spidéil
C:Caitlín Nic Gabhann
R:barndance
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/20543#setting40673
N:Setting entered in thesession by user “dersulle” on 2021-03-02
K:Gmajor
|:G2 (3GGG G2G2|GABc dBGB|A2 (3AAA A3d|(3efg ab gedB|
 G2 (3GGG G2G2|GABc dBGg|efge Bege|(3efg ab gedB:|
 |:c4 B4|(3ABc BA GEDB|c4 B2 (3GBd|eage dcBd|
 c4 B4|(3ABc BA GEDG|EFGE B,EGE|1 FGAF GBdB:|2 FGAB cBAd||`,
			theSessionId: 20543,
			theSessionSettingId: 40673
		},
		{
			abc: `X:1
T:Lynch's
R:barndance
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3536#setting3536
N:Setting entered in thesession by user “ceolachan” on 2004-09-13
K:Dmajor
|:A/|F2 F2 A2 A2|G>FG>A B2 B2|A>dc>B A>GF>E|D>E (3FDF (3A,DF A2|
 F2 F2 A2 A2|G>FG>A B2 B2|A>dc>B A>GF>E|D2 (3DFA d2- d3/2:|
 e/|f2 f2 f2 e>d|c>Bc>d e2- e>f|g2 g2 g2 (3ABc|d>cd>e f2- f>e|
 f2 f2 f2 e>d|c>Bc>d e2- e>f|g2 g2 A2 B>c|(3efe d2 d2- d>e|
 f2 f2 f2 e>d|c>Bc>d e2- e>f|g2 g2 g2 (3ABc|d>ef>g a2- a>g|
 f2 f2 f2 e>d|c>Bc>d e2 e>f|g2 g2 A2 B>c|(3efe d2 d2- d3/2||`,
			theSessionId: 3536
		},
		{
			groups: "ALORA",
			parts: "AABB",
			norbeckId: 14,
			abc: `
%251029
X: 2
T: Gypsy Princess
O:Ireland
S: Jack Talty, concertina; Cormac Begley, concertina
D: Na Fir Bolg
F:https://open.spotify.com/track/6ByfgYv6SKGJbf8EQk0z3s
F:https://music.youtube.com/watch?v=XIVMg8-OI2A&t=134
R: barndance
N: Played in F, or maybe D minor, by Talty & Begley. This version
N: transposes it up a third.
M: 4/2
L: 1/8
K: A
|:"F#m"c2-!>!cc .c2c2 "D"BcBA F2 E"<("">)"F|"A"A2-!>!Ac e2 ce "D"f2ec "E"B2 AB|
"F#m"c2-cc .c2c2 "D"BcBA F2 E"<("">)"F|"A"A2-Ac efec  "E"B2 .A2 [1 "A"A2-AB:| [2 "A"A2-Ac||
|:"A"e2-ee .e2 e2 BccB ABce|"D"f2-ff .f2 f2 "A"BccB ABcd|
e2-ee .e2 e2 BccB ABce     |"D"a2 af "E"ecBe  "A"c2 .A2 [1 A2 Ac:| [2 A2 AB||
`
		},
		{
			groups: "ALORA",
			parts: "AABB",
			norbeckId: 12,
			abc: `X: 1
T: Joe Bane's
C:John MacDonald
O:Scotland
S: Jack Talty, concertina; Cormac Begley, concertina
D: Na Fir Bolg
F:https://open.spotify.com/track/6ByfgYv6SKGJbf8EQk0z3s
F:https://music.youtube.com/watch?v=XIVMg8-OI2A
R: barndance
N: Played in F, by Talty & Begley. This version
N: transposes it up a tone.
M: 4/2
L: 1/8
K: G
|: ge|"G or Emin"dG GA B2AG d2 .G2 G2 ge|dG GA B2 AG "D"B2 .A2 A2 Bc |
"Emin"dG GA B2 AG "C"B2d2 g3e|"G"d2de "D"dB Ad "G"B2 .G2 G2:|
|: Bd|"G"g2 ga ge dg "C"e2 ed e2 ge|"G"d2 de dB GA "D"B2 A2 A2 Bd|
"G"g2 ga ge dg "C"e2 ed e2 ge|"G"d2de "D"dB Ad "G"B2 .G2 G2:|`
		},
		{
			abc: `X:1
T:Pearl O'Shaughnessy's
R:barndance
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4321#setting4321
N:Setting entered in thesession by user “*Davy Rogers” on 2005-03-16
K:Dmajor
|:d2 d2 dB ed|B2 B2 BA GB|d2 c2 cA FA|e2 d2 dB GB|
 d2 d2 dB ed|B2 B2 BA GB|d2 c2 cA FA|1 GD B,D G2 Bc:|2 GD B,D G2 dc||
 |:B2 G2 GB dB|c2 A2 A2 cB|A2 F2 F2 DF|GF GB e2 dc|
 B2 G2 GB dB|c2 A2 A2 cB|AG FE DE FD|1 G2 B2 G2 dc:|2 G2 B2 G2 Bc||
 |:dB ed B2 g2|fe ge c2 eg|(3fgf ed (3fgf ed|(3BcB AG B2 Bc|
 dB ed B2 g2|fe ge c2 eg|(3fgf ed ^cd ef|g2 b2 g2 Bc:|
 d2 b2 b2 c'b|a2 e2 e2 ag|(3fgf ed (3fgf ed|(3BcB AG B2 Bc|
 d2 b2 b2 c'b|a2 e2 e2 ag|(3fgf ed ^cd ef|g2 b2 g2 Bc|g2 b2 g4||`,
			theSessionId: 4321
		},
		{
			groups: "ALORA",
			abc: `X: 3 %240403 % in slow 6 - or 5. with chords, and in E - for whistle playing
T: Bransle d'Écosse
M: 6/2
R: bransle
L: 1/8
Q: 1/4=80
K: E dorian
|: "Em"EFGE "D"FGA2  "Bm"AGFE "Em"GAB2  "Em"BdcB "A"AG"Bm"FE |
"Em"EFGE "D"FGA2  "Bm"AGFE "Em"GAB2  "A"AG"Bm"FE "Bm"FD"Em"E2 :|
|: "Em"B2Bc "A"dedc  "Em".B2B2 "D"AGFE  "Em"B2AG "Bm"F2E2 |
[M:5/4] "Em"B2Bc "A"dedc  "Em".B2B2 "A"AG"Bm"FE "B"F<D"Em"E2 :|`,
			incipit: `X:1
M:6/2
L:1/8
K: E dorian
EFGE FGA2  AGFE GAB2  BdcB AGFE | EF`
		},
		{
			groups: "su",
			abc: `X:1
T:Kafoozalum
R:Fling
L:1/8
M:4/2
N:This has been transcribed from the 1999 self-titled album by Providence; they
N:heard it "from the playing of Macall, the all-woman group of the 1980s, with
N:which Joan [McDermott, vocalist] sang. We haven't been able to trace the source
N:of this tune but we believe it to have Donegal connections." It's the first tune
N:on the 4th track, titled "Gan Ainm."
N:---
N:Imported from https://thesession.org/tunes/8204#setting52726
N:Setting entered in thesession by user “Nigel Gatherer” on 2024-12-24
N:Transposed up a fourth & edited
K:Dmajor
e2|:fdAd f2fa gece g2ge| fdAd f2fe[1 defd e2de:|[2 defd e2df||
  |:aaag fgaf efgf efge| aaag fgaf[1 defd e2df:|[2 defd e2de||`,
			theSessionId: 8204,
			theSessionSettingId: 52726
		},
		{
			abc: [
				`X:1
T:The Boys Of Ballisodare
R:hop jig
L:1/8
M:9/8
N:Imported from https://thesession.org/tunes/1340#setting14690
N:Setting entered in thesession by user “FumblinFingersWayne” on 2010-09-08
K:Gmajor
|:"G" D2 G G2 A B2 d|"C" ege d2 e g3|"G" D2 G G2 B d2 B|"Am"AGA B2 G "D"E2 G|
 "G" D2 G G2 A B2 d|"C" ege d2 e "D"g2 a|"Em"b2 a g2 e d2 B|"Am"AGA B2 G E2 G:|
 "C" B2 d d2 B d2 B|"D" dBd e2 f "G"g3|"C" B2 d d2 B d2 B|"Am"AGA B2 G E2 G|
 "Am"B2 d d2 B d2 B|"Bm"dBd e2 f g2 a|"C" b2 a g2 e d2 B|"D" AGA B2 G E2 G:|`
			],
			theSessionId: 1340,
			theSessionSettingId: 14690
		},
		{
			groups: "ALORA",
			abc: [
				`X: 1
T: Top The Candle
S: Frank & Pat Reilly, fiddles
N:1. A hop jig played in the good old way by two County
N:Leitrim fiddlers.
N:2. Quavers are played “straight”, and not “swung”;  writing
N:this in 9/8 would be wrong here, IMO.
N:You could perhaps write that as “♪♪ ≠ ♩♪”.
N:In the recording this was played a few moments before Do it
N:Fair.
R: hop jig
F:https://www.itma.ie/playlists/furls-leitrim-performers/?track=23
D:ITMA – Furls of Music – Leitrim Performers
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield% 2024-08-22, 2024-08-25
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
M: 3/4
L: 1/8
K: D
P:Ⅰ
|:"D"~D2 AD FD|"A"CE2F GE|"D"~D2 AD FD|A,D2F [1 ED:| [2 EA ||
P:Ⅱ
"D"~f2 ed cA|"Em"Be2d cA|"G"{A}B2 AG FD|"D"A,D2F EA|
"D"~f2 ed cA|"Em"Be2d cA|"Em/G"{A}B2 AG FE|"A"DF EG FE!D.C.!|]
`,
				`X: 1
T: Top The Candle
N: 0. This is an older version I posted (in a comment) to thesession on 2024-11-27.
N: 1. A hop jig played in the good old way by two County
N: Leitrim fiddlers.
N: 2. Quavers are played “straight”, and not “swung”; writing
N: this in 9/8 would be wrong here, IMO.
N: You could perhaps write that as “𝅘𝅥𝅮𝅘𝅥𝅮 ≠ 𝅘𝅥𝅘𝅥𝅮”.
N: 3. In the recording this was played a few moments before
N: Do It Fair.
N: 4. In the recording it’s played in C; I suspect the fiddles
N: were tuned one whole tone down from the standard tuning. Here
N: it’s transposed up one tone so as to be more accessible to
N: fiddlers nowadays.
N: 5. I give some rough indications about the ornaments/
N: embellishments with the “footnotes” on the last line. But
N: there are lots of subtleties of the rhythm, or phrasing, that
N: I’ve left out.
R: hop jig
F:https://www.itma.ie/playlists/furls-leitrim-performers/?track=23
F:https://s3-eu-west-1.amazonaws.com/audio.itma.ie/Michael_McNamara_Collection/Item_036_ITMA0262643_TC00.00.05.mp3
S:Frank & Pat Reilly
D:ITMA – Furls of Music – Leitrim Performers – track #23
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield% 2024-08-22, 2024-08-25, 2024-11-27
Z:abc-copyright CC BY-NC 2.0 (https://creativecommons.org/licenses/by-nc/2.0/fr/deed.en)
M: 3/4
L: 1/8
K: D
P:A
|:"^(1)"~D2 AD FD|CE2F GE|"^(1)"~D2 AD FD|"^(2)"A,D2F [1 ED:| [2 EA ||
P:B
"^(3)"~f2 ed cA|Be2d cA|{A}B2 AG FD|A,D2F EA|
"^(3)"~f2 ed cA|Be2d cA|{A}B2 AG FE|DF EG FE!D.C.!|]
"^(1)" (D/"<("">)"E/D) || "^(2)"A,(D LD)Fyy || "^(3)" (f/"<("">)"g/f)`
			],
			theSessionId: 10116,
			theSessionSettingId: 52515
		},
		{
			groups: "ALORA",
			abc: `
% 2024-08-22, 2024-08-25, 2024-11-08, 2025-09-29, 251029
X: 1
T: Do It Fair
S: Frank & Pat Reilly, fiddles
N: 1. A hop jig played in the good old way by two County Leitrim fiddlers.
N: 2. Quavers are played “straight”, and not “swung”;  writing this in 9/8 would be wrong here, IMO.
N: You could perhaps write that as “♪♪ ≠ ♩♪”.
N: In the recording this was played a few moments after Top The Candle.
N:3. Chords added by me — not in the original recording
R: hop jig
F:https://www.itma.ie/playlists/furls-leitrim-performers/?track=23
D:ITMA – Furls of Music – Leitrim Performers
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
M: 3/4
L: 1/8
Q:1/4=140
K: D
P:Ⅰ
"D"FA (A/B/A) "Bm"B2 | "Em"Be2d (c/B/A)|"D"FA (A/B/A) "A"B2 |"D"Ad2A (F/E/D)|
"D"FA (A/B/A) "Bm"B2 | "G"Be2d  (c/B/A)|"D"FA (A/B/A) "A"B2 |"D"Ad2A (F/E/D)||
P:Ⅱ
"D"~f2fd "Bm"fa | "Em"be2d (c/B/A) | "D"f2fd "A"fa |"D"Ad2A (F/E/D)|
"D"~f2fd "Bm"fa | "G"be2d (c/B/A) | "D"(f/g/f) "(A)"(e/f/e) "Bm"d2 |"D"Ad2A (F/E/D)!D.C.!|]
`,
			theSessionId: 268,
			theSessionSettingId: 52517
		},
		{
			abc: `X:1
T:The Poppy Leaf
R:hornpipe
L:1/8
M:4/2
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1058#setting1058
N:Setting entered in thesession by user “fidicen” on 2002-10-18
N:*abc-tools: convert to M:4/2*
K:Gmajor
|:(3CB,A,|G,B,DG B,DGB DGBd GBdg|edcB cBAG FdAF DCB,A,|
G,B,DG B,DGB DGBd GBdg|edcB cDEF G2 B2 G2:|
|:Bc|dBGB dBgd bagf edcB|cAFA cAfd agfe dcBA|
(3BcB GB (3cdc Ac (3ded Bd e2 dc|BgdB dcAF G2 B2 G2:|`,
			theSessionId: 1058
		},
		{
			abc: `X:1
T:Frailach
R:frailach
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/445#setting445
N:Setting entered in thesession by user “seara” on 2001-12-18
K:Aminor
|:^D2|"Am"EAcA Acec|"Dm"d2dc dec2|"C"cege cege|"G7"d2dc "C"dec2|
 "E7"cddc cBB_B|"Am"A4 Adc2|"E7"cddc cBB_B|"Am"A6:|
 |:e2|"Am"a6 gf|e6 e2|aeae a2{ba}gf|e6 e2|
 a6 g2|b6 a2|aeae "Dm"a2{ba}gf|"Am"e4 e2|
 "C"cdef efef|efef "Dm"e2d2|"Dm"dAAd dAAd|dAAd "C"d2{ed}c2|
 "E7"cddc cBB_B|"Am"A4 Adc2|"E7"cddc cBB_B|1 "Am"A2A2 c2:|2 "Am"A2z2 a2||`,
			theSessionId: 445
		},
		{
			abc: `X:1
T:The Banks
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/922#setting922
N:Setting entered in thesession by user “b.maloney” on 2002-08-23
N:(edited after importing)
K:Ebmajor
|:(3B,CD|E2 G2 G2 FE|D2 F2 F2 ED|E2 c2 c2 de|=ABcB _AGFE|
 G2 B2 B2 cB|A2 c2 c2 de|DEFG AFDF|E2 G2 E2:|
 |:~g2|g2 E2 E2 ~g2|f2 D2 D2 ~g2|e2 c2 c2 fe|dcB=A B2 B2|
 DBfB DBfB|EBgB EBgB|=ABcd ecAc|B=ABc B_AGF|
 EGBG eBFE|DFBF dFED|CEGE cBAG|FGFE DCB,A,|
 G,EBE G,EBE|A,EcE A,EcE|DEFG AFDF|E2 G2 E2:|`,
			theSessionId: 922,
			parts: "AABB"
		},
		{
			abc: `X:1
T:The Friendly Visit
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/32#setting32
N:Setting entered in thesession by user “Jeremy” on 2001-05-21
K:Gmajor
|:BA|(3GFG DG BGBd|(3cBc AB cdef|g2 dg ecAG|FGAB cBAB|
 (3GFG DG BGBd|(3cBc AB cdef|gdBG FAdc|B2 G2 G2:|
 |:(3GBd|g2 dB GBdg|e2 cA FGAg|f2 ed cdeg|(3fgf (3efe dcBA|
 (3GFG DG BGBd|(3cBc AB cdef|gdBG FAdc|B2 G2 G2:|`,
			theSessionId: 32
		},
		{
			abc: `X:1
T:The Golden Eagle
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/974#setting974
N:Setting entered in thesession by user “Paul-Kin” on 2002-09-18
K:Gmajor
|:(3cBA|GB,DG BDGB|dGBd gbag|fed^c =cAFD|GBAG (3FED (3cBA|
 GB,DG BdGB|dGBd gbag|fed^c =cAFD|(3GGG GF G2:|
 |:(3bbb|bB^df bagf|e^def gfg^g|aA^ce agfe|e=dd^c d2ab|
 c'afd ^cdef|gfga bgag|fed^c =cAFD|(3GGG GF G2:|`,
			theSessionId: 974
		},
		{
			abc: `X:1
T:The Galway
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/38#setting38
N:Setting entered in thesession by user “Jeremy” on 2001-05-21
K:Dmajor
|:FE|D2 FA dAFD|CDEF G2 FE|D2 FA dcdf|edcB AGFE|
 D2 FA dAFD|CDEF G2FG|AdcB AGFE|D2 CE D2:|
 |:de|f2 fg fedc|BABc B2 Bd|e2 ef edcB|A2 ce a2 AB|
 d2 df edAF|GFGA BdcB|AdcB AGFE|D2 CE D2:|`,
			theSessionId: 38
		},
		{
			abc: `X:1
T:Dunphy's
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1980#setting1980
N:Setting entered in thesession by user “LH” on 2003-09-15
K:Gmajor
|:(3DEF|GABA GBdg|fefd e^cAG|FADA FGA2|BGAF GFED|
 GABA g~g2z|fefd e^cAG|FAdB cADF|AGGF G2:|
 |:B^c|d2Bd gdBd|gbaf gdBd|g2fg ed^cd|(3efe d^c d2ef|
 g2dc B2Gd|ecAG FAD2|GBdB cADF|AGGF G2:|`,
			theSessionId: 1980
		},
		{
			groups: "su",
			abc: `X:1
T:Cronin's
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/478#setting478
N:Setting entered in thesession by user “lars” on 2002-01-01
K:Gmajor
|:BA|GABd dBde|gage dega|bage dBGA|BAAG AcBA|
 GABd dBde|gage dega|bage dBAc|AGGF G2:|
 |:(3efg|afd^c d2ga|beed e2ga|bg (3agf gedB|BAAG AcBA|
 GABd dBde|gage dega|bage dBAB|G2 GF G2:|`,
			theSessionId: 478
		},
		{
			abc: `X:1
T:The Plane Of The Plank
C:Liz Carroll
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/9800#setting9800
N:Setting entered in thesession by user “laveylad” on 2009-08-09
K:Gmajor
|:(3DEF|GABd g2fg|eGce d2Bd|cece d2BG|DFAB cAFA|
 BGBd g2fg|eceg f2ga|bgdB cGEG|(3FED BA G2:|
 |:(3ABc|d2d^c dAFA|BAGF G2AB|c2cd edcB|Adfg a2fa|
 g2dg e2ce|d2Bd cece|dcAG FDBA|G2 (3FGA G2:|`,
			theSessionId: 9800
		},
		{
			abc: `X:1
T:The Wonder
C:James Hill
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/337#setting337
N:Setting entered in thesession by user “Joerg Froese” on 2001-10-21
K:Gmajor
|:(3DEF|GdBG FcAF|(3GFG BG D2GF|EGAB cBAG|Fd (3d^cd ed=cA|
 GdBG FcAF|(3GFG BG D2GF|Eedc BAGF|A2G2 G2:|
 |:AG|FAd^c dBAG|FAd^c dfed|^cdef (3gfe ^ce|d^cde d2 =c2|
 BcBA ^GBe2|ABA=G FAd2|egfe (3ded (3cBA|GgdB G2:|`,
			theSessionId: 337
		},
		{
			abc: `X:1
T:The Harvest Home
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/49#setting49
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
K:Dmajor
|:AF|DAFA DAFA|defe dcBA|eAfA gAfA|(3efe (3dcB AGFE|
 DAFA DAFA|defe dcBA|eAfA gfec|d2 f2 d2:|
 |:cd|eAAA fAAA|gAfA eAAA|eAfA gAfA|(3efe (3dcB (3ABA (3GFE|
 DAFA DAFA|defe dcBA|eAfA gfec|d2 f2 d2:|`,
			theSessionId: 49
		},
		{
			abc: `X:1
T:The Cuckoo
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/573#setting573
N:Setting entered in thesession by user “b.maloney” on 2002-03-02
K:Gmajor
|:D2||BGDG cAFA|d^cde dBGF|Ec{d}cB AGFG|
 [1 (3.A.B.A (3.G.F.E (3.D.E.D B,2:|2 (3.A.B.A GF G2|ga||
 bg ~g2 dgBg|bg ~g2 dgBg|
 [1 c'a~a2 eaca|c'a~a2 eaca:|
 [2 ((3aba) ((3gag) ((3fgf) ((3efe)|((3ded) ((3cdc) B2||`,
			references: [
				{
					artists: "John Joe Gardiner, fiddle; Moya Acheson, piano",
					url: "https://www.itma.ie/blog/lesser-known-musicians-of-the-78-rpm-era/?track=8",
					notes: `(78 rpm) The cuckoo, hornpipe; The sweeps [Jim Coleman’s], hornpipe
Gardiner, John Joe, 1893-1979`
				}
			],
			theSessionId: 573
		},
		{
			abc: `X:1
T:The Stage
C:James Hill
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1249#setting1249
N:Setting entered in thesession by user “fidicen” on 2002-12-24
K:Gmajor
|:BGFG (3EFG DB,|G,B,DG cBAG|AGAB cBcB|(3ABA (3GFE (3DED (3CB,A,|
 G,B,DG cBcd|edef ga (3gfe|d<b c<a B<g A<f|1 ecAF G3A:|2 ecAF G2 (3def||
 |:ga (3gfe dgbd|ceac Bdg2|dBG2 (3gfg ag|fgef defd|
 ga (3gfe dgbd|ceac Bdg2|(3gag (3fgf egfg|1 ecAF G2 (3def:|2 ecAF G4||`,
			theSessionId: 1249,
			contourShift: 0
		},
		{
			abc: `X:1
T:The Mathematician
C:James Scott Skinner
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1755#setting1755
N:Setting entered in thesession by user “cj” on 2003-06-14
K:Dmajor
G|F>G ^G>A f>d A>F|G>A _B>=B g>e B>d|c>b a>g f>e d>c|(3dfe (3dcB (3ABA (3GFE|
 F>G ^G>A (3fed (3cBA|G>A _B>=B (3gfe (3dcB|(3cba (3gfe (3dcB (3ABc|(3dAf (3dAF D3 a|
 d'>a f>d A>F D>=C|B,>^D E>G B>e g>b|e'>b g>e B>G E>D|C>E A>c e>a c'>e'|
 f'>d' a>f d>A F>D|G>B d>g b>d' g'>b|(3ad'c' (3bag (3fgf (3gfe|(3dfa (3d'af d4|`,
			theSessionId: 1755
		},
		{
			abc: `X:1
T:The Dance Of The Honeybees
C:Charlie Lennon
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/130#setting130
N:Setting entered in thesession by user “Will Harmon” on 2001-06-08
K:Dmajor
AG|:(3FGF EF DFAF|GAFG E2 EF|GFGA (3Bcd ed|cded cAGE|
 FGEF DFAF|(3GAG (3FGF E2 EF|GFGA (3Bcd ed|1 cAGE D2 DE:|2 cAGE D2 (3ABc||
 |:d2 ad fded|(3Bcd AF DFAd|Beed Bded|cdef gece|
 d2 ad fded|(3Bcd AF DEFA|Bdef gfed|1 cAGE D2 (3ABc:|2 cAGE D2 DE||`,
			theSessionId: 130
		},
		{
			abc: `X:1
T:Kitty Hayes'
R:hornpipe
L:1/8
M:4/4
N:ABC borrowed from here: https://tunesfromdoolin.com/kitty-hayes-hornpipe/ I
N:added a c#. The proprietor of that site, Charles Monod, says this about the
N:tune:
N:"I learned Kitty Hayes’ Hornpipe from the great album “Rooska Hill” by Tony
N:O’Connell and Éamonn O’Riordan. Kitty Hayes recorded this tune herself as Junior
N:Crehan’s. I couldn’t find this hornpipe in the book of Junior Crehan’s
N:compositions published by his daughters Angela and Ita, However there is a reel
N:called Crehan’s Banbhs in the book which shares a lot of similarities with this
N:tune."
N:I asked about this tune here: https://thesession.org/discussions/46814
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/21525#setting43012
N:Setting entered in thesession by user “What's the name of this tune?” on 2022-02-06
K:Eminor
|:BEED E2DE|GABG A2GA|BEED E2DE|GABG A2d^c|
 BEED E2DE|GABG AAGA|B2BA GEDE|G2GF G2GA:|
 |:BABd e2eg|fedf edBA|BA (3Bcd e2eg|fe (3def e2ed|
 edBA d2ed|BAGA BAGE|B2BA GEDE|G2GF G2GA:|`,
			parts: "AABB",
			theSessionId: 21525,
			theSessionSettingId: 43012
		},
		{
			abc: `X:1
T:The New Century
R:hornpipe
L:1/8
M:4/2
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2001#setting2001
N:Setting entered in thesession by user “gian marco” on 2003-09-21
N:*abc-tools: convert to M:4/2*
N:(edited after importing)
K:Gmixo
|:Bc|dBG^F GB (3dcB cA=FE FAcA|BAG^F GB (3de^f gb (3agf gage|
dgdB (3GBG AB cfcA (3FAF GA|(3BAG gG ^fGe^F|1 AGG^F GA:|2 AGG^F G2-|:GA||
Bcde fdce dDE^F GFGA|Bcde =fd (3e^fg afd^c d2 (3def|
gdBG ecA^F GFGc AGEG|(3^FED AB cedF AGGF G2:|`,
			parts: "AABB",
			theSessionId: 2001,
			references: [
				{ notes: `See O'Mahony's for a recording by Jason O’Rourke` }
			]
		},
		{
			abc: `X:1
T:O'Mahony's
R:hornpipe
L:1/8
M:4/2
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2488#setting2488
N:Setting entered in thesession by user “dafydd” on 2003-08-28
N:*abc-tools: convert to M:4/2*
K:Dmajor
|:dB|AFEF (3DDD DE FDFA d2 de|fedB AFDE FEED E2 dB|
AFEF (3DDD DE FDFA d2 de|fedB AFEF D2 DE D2:|
|:dB|ABde f2 ef gfed e2 de|f2 fe dBAF FEED E2 dB|
AFEF (3DDD DE FDFA d2 de|fedB AFEF D2 DE D2:|`,
			parts: "AABB",
			theSessionId: 2488
		},
		{
			abc: `X:1
T:John Mhosaí McGinley's
R:hornpipe
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/6274#setting6274
N:Setting entered in thesession by user “LongNote” on 2006-10-20
K:Dmajor
|:dB|AF~F2 DEFA|dced BAdB|AF~F2 DEFD|G2FG EA,CE|
 AF~F2 DEFA|dced BAdB|AdcB AFGE|D/E/D CE D2:|
 dc|BABc dcdf|b z fa gfgf|ecec BA B/c/d|AFAF EA,CE|
 AF~F2 DEFA|dced BAdB|AdcB AFGE|D/E/D CE D2:|`,
			theSessionId: 6274
		},
		{
			abc: `X:1
T:Kitty's Wedding
C:George Saunders
R:hornpipe
L:1/8
M:4/2
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/869#setting869
N:Setting entered in thesession by user “Bannerman” on 2002-08-01
N:*abc-tools: convert to M:4/2*
K:Dmajor
|:fe|d2Bd A2FA BAFA D2 ED|B,DA,D DFBF AFDF E2fe|
d2Bd A2FA BAFA D2 ED|B,DA,D DFBF AFEF D2:|
|:fg|afed bafd Adfd edBd|DFAd FAde fdgf e2fg|
afed bafd Adfd edBd|DFAd FAdf eABc d2:|`,
			theSessionId: 869
		},
		{
			groups: "su",
			name: "An Paistin Fionn",
			rhythm: "hornpipe",
			incipit: `X:1
C:Jackie Daly
L:1/8
M:4/2
K:Edorian
(3B,CD|E2FE DFEF GEAG (3FGA GF|EFED`,
			references: [
				{
					notes: "SU: Follows the Beauties Of Autumn"
				}
			],
			theSessionId: 5675,
			theSessionSettingId: 17673
		},
		{
			abc: [
				`X:1
T:The Butlers Of Glen Avenue
C:Tony Sullivan
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-27,
N:from https://thesession.org/tunes/820#setting42781
N:Setting entered in thesession by user “James Dumbelton” on 2022-01-13
N:(edited after importing)
N:*abc-tools: convert to M:12/8*
K:Gmajor
|:DEG EDB, DEG ~B3|DEG B2 e dBe dBA|
DEG EDB, DEG ~B3|dBd gfe dBA G3:|
|:gab age deg ~B3|gab gab dBd e2 d|
gab age deg ~B3|dBd gfe dBA G3:|
`
			],
			theSessionId: 820,
			theSessionSettingId: 42781,
			norbeckId: 365,
			parts: "AABB"
		},
		{
			abc: `X:1
T:The Old Flail
C:Vincent Broderick
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/839#setting839
N:Setting entered in thesession by user “gian marco” on 2002-07-14
N:*abc-tools: convert to M:12/8*
K:Gmajor
|:DEG GAB Bdg gab|age ege dBG AGE|
DEG GAB Bdg gab|age ege dBG A3:|
~a3 aga ega ega|deg ged ged BAG|
DEG GAB Bdg gab|age ege dBG A3:|`,
			parts: "AABB",
			theSessionId: 839,
			norbeckId: 320
		},
		{
			abc: `X:1
T:I Ne'er Shall Wean Her
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/803#setting803
N:Setting entered in thesession by user “slainte” on 2002-06-24
N:(edited after importing)
K:C
|:G|EGG GED EGG c2B|AcA AGA cde ecd|
 cde g2a ged c2d|eaa e2d cAA A2:|
 |:d|egg ged egg g2d|eaa aga baa a2g|
 cde g2a ged c2d|eaa e2d cAA A2:|`,
			theSessionId: 803
		},
		{
			aka: ["The Lilting Banshee", "The Miller Of Glanmire"],
			abc: `X: 1
T: Leave it down easy
T: As played by Danny Smith
S: Danny Smith, whistle
F:https://www.itma.ie/playlists/first_itma_fieldrecordings_1992/?track=7
R: jig
N: 0. 1992 or 1993.
N: 1. Notated in 12/8 on purpose; I think it’s better that way for this sort of jig.
N: 2. I tried to transcribe the notes more or less as they were played; as usual 
N: I’ve omitted the phrasing and ornaments, or embellishments.
N: 3. The variation indicated by (*) the first time around, with a little bit at the 
N: bottom of the score could be an accident or “by mistake” but I rather like it.
N: 4. This is clearly the tune The Lilting Banshee a.k.a. The Miller Of Glanmire; 
N: it’s mostly played a bit differently in sessions these days. 
D:ITMA – First ITMA Audio Field Recordings, 1992-93
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield% 2024-09-03
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
M: 12/8
L: 1/8
K: A dorian
{G}!fermata!A2G|:EAA EAA   BAB  "_(*)"G2A|Bde  "_(**)"dBA   BAB GED|
EAA EAA   BAB G2A|Bde dBA   BAA [1 A2G :| [2 A2z ||
eaa age   dBA G2A|Bde dBA   def gag|
eaa age   dBA G2A|Bde dBA   BAA A2z|
eaa age   dBA G2A|Bde dBA   d"<("e">)"f g2g| 
a3 age   dBA G2A|Bde dBA   BAA !fermata!A3|]
P:note for (*): the first time round there was an E here rather than a G:
EAA EAA   BAB "here"E2A| 
P:note for (**): the first time round maybe it was a C#, like this (but I’m not sure):
d^cAy
`,
			theSessionId: 60,
			parts: "AABB",
			norbeckId: 186
		},
		{
			groups: "su",
			abc: `X:1
T:Wellington's Advance
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2191#setting2191
N:Setting entered in thesession by user “swisspiper” on 2003-11-25
N:*abc-tools: convert to M:12/8*
K:Adorian
E.A.A AGA cBA c2d|~e3 efg dBG GFG|
E.A.A AGA cBA Bcd|e(3.g.f.e dcB c.A.A BAG|
E.A.A AGA cBA c2d|~e3 efg dBG GFG|
E.A.A AGA cBA Bcd|e(3.g.f.e dcB c.A.A ~A2 e|
aea a.ea aed cBA|BAG ~g3 dBG GBd|
e2a a^ga e2g gfg|e(3.g.f.e dcB cAG A2e|
aea a.ea aed cBA|BAB ~g3 dBG GBd|
e2a a^ga e2g gfg|e(3.g.f.e dcB c.A.A A2G|`,
			parts: "AABB",
			theSessionId: 2191,
			norbeckId: 480
		},
		{
			abc: `X:1
T:Down The Hill
R:set dance
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/7352#setting7352
N:Setting entered in thesession by user “ethical blend” on 2007-06-14
N:(edited after importing)
K:Gdorian
|:G/F/|DGG G2A|B/A/G/A/B/G/ A/G/F/G/A/F/|G/F/D/C/D/E/ F2G|
 A{dc}BG FDC|DGG G2B|A/G/F/G/A/B/ cAc|d/e/fd cAd|~G3 G2:|
 |:B/c/|dgg g2a|b/a/g/a/b/g/ afd|cff f2g|a/g/f/g/a/f/ gfd|
 dgg g2a|b/a/g/a/b/g/ a/g/f/g/a/f/|gfd cAd|~G3 G2:|
 |:=B/d/|gd=B G>Bd/B/|G>=Bd/B/ c_BA|fcA F>Ac/A/|F/G/AB cBA|
 B/A/G/A/B/G/ c/B/A/B/c/A/|dg^f gab|gfd cAd|~G3 G2:|`,
			theSessionId: 7352
		},
		{
			groups: "alora",
			abc: `X:1
T:The Lounge Bar
C:Annlaug Børsheim
O:Norway
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-06,
N:from https://thesession.org/tunes/8853#setting53996
N:Setting entered in thesession by user “chansherly212” on 2025-05-04
N:*abc-tools: convert to M:12/8*
K:Dmajor
A,|:"Bm"B,DF "D"E2 D "D"DFA d2 c|"G"BGB "D"AFD "A"EGF EDA,|
"Bm"B,DF "D"E2 D- "D"DFA d2 c|"G"BGB "D"AFD[1 "A"E2 D-"D" D2 A,:|2 "A"E2 D-"D" DFA||
|:"D"d2 d dcA "D"F3 FEF|"G"GBd dcA "A"E3 EDE|
"Bm"F3 FED "G"B,3 B,A,B,|"A"D2 (E E)FE [1 "D"D3 DFA:|2 "D"(D3 D2) c||
|:"Bm"dBd c2 B- "G"Bdf e2 c|"G"dcB "D"AdB "D"AFD "A"E2 c|
"Bm"dBd c2 B- "G"Bdf e2 c|"G"dcB "D"AFD[1 "A"E2 D- "D"DFA:|2 "A"E2 D- "D"D3||`,
			parts: "AABBCC",
			theSessionId: 8853,
			theSessionSettingId: 53996
		},
		{
			abc: `X: 2
T:The Chicago
R: jig
M: 6/8
L: 1/8
N:Imported into *tuneTable* on 2025-11-07,
N:from https://thesession.org/tunes/2096#setting15489
N:Setting entered in thesession by user “Dr. Dow” on 2004-12-23
K: Dmix
|:F2D DAG|F2D DAG|F2D DED|C2A, A,AG|
F2D DAG|F2D DAD|BDB cAF|1 AGF GAG:|2 AGF G2A||
|:~B3 cBc|~d3 ABc|B2G GAG|F2D DAD|
BDB cDc|~d3 ABc|~B3 cAF|1 AGF G2A:|2 AGF GAG||
 `,
			theSessionId: 2096
		},
		{
			groups: "su",
			abc: `X:1
T:Palm Sunday
R:jig
L:1/8
M:12/8
N:Imported from https://thesession.org/tunes/770#setting29548
N:Setting entered in thesession by user “JACKB” on 2016-12-24
N:(edited after importing)
K:Adorian
B|:AGE G2E G2E G2E|A2B c2d e2d efg|
   e3 dBA BAG Bcd|edc BAG [1 B2A A2B:| [2 B2A A2e||
 |:a3 efg a3 bge|g3 gfe dBA GB/c/d|
   efg ded BAG Bcd|edc BAG [1 B2A A2e:| [|2] B2A A2B||`,
			parts: "AABB",
			theSessionId: 770,
			theSessionSettingId: 29548,
			norbeckId: 312
		},
		{
			groups: "su",
			parts: "AABB",
			abc: `X:1
T:The Humours Of Kiltyclogher
R:jig
L:1/8
M:12/8
N:Imported from https://thesession.org/tunes/1043#setting1043
N:Setting entered in thesession by user “slainte” on 2002-10-14
N:(edited after importing)
K:Adorian
|:B|AGE G2E c2E G2E|DED D2E GED D2B|
    AGE G2E c2E DEG|A3 BGE A3 A2:|
|:B|c2B c2d ecA ABc|BAG GAB dBG GAB|
    c2B c2d ecA ABc|BAG GEG A3 A2:|`,
			references: [
				{
					url: "https://thekellyfamily.bandcamp.com/track/the-humours-of-kilclougher-elizabeth-kelly-s-delight-jig-slip-jig",

					artists:
						"The Kelly Family: John Kelly Jnr, fiddle; James Kelly, fiddle; Johnny Kelly, fiddle; Leah Kelly, fiddle; Aoife Kelly, concertina; Cathy Potter, harp; Charlie Le Brun, flute",
					album:
						"A Family Tradition: Traditional Irish Music from The Kelly Family "
				}
			],
			theSessionId: 1043
		},
		{
			parts: "AABB",
			abc: [
				`X:1
T:Unknown
C: Mick O’Connor (?)
R:jig
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield% 2025-02-07
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
M:12/8
L:1/8
K:Dmajor
D2A, DFA def edB | B/B/AB dBA FDD EFE | D2A, DFA def edB | BAB dBA FED [1 DDA, :| [2 D2A ||:
dcd e^de f=dA BdA | B/c/dB AFD E/E/EE EDB, | D2A, DFA def edB | BAB dBA FED [1 D2A :| [2 D2A, !D.C.! |]
`,
				`
X: 1
T: Unknown
R: jig
S: Mick O’Connor
F: https://archive.comhaltas.ie/tracks/5596
N:very roughly as played by the artist
Z: abc-transcription Malcolm Schonfield% 2025-03-06
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
M: 12/8
L: 1/8
K: D
DFA def  edB | B/B/AB dBA F/F/DD EFE | DDA, DDA Aef edB | BAB dBA FED DDA, |
DDA, DFA [Dd]ef edB | B/B/AB dBA F/E/DD EFE | DDA, DDA def edB | BAB dBA FED D2A ||
dcd e^de f=dA  BdA | B/c/dB AFD DEE  EDB, | DDA, DFA [Dd]ef edB | B/B/AB dBA FED D2A |
dcd e^de f=dA  BdA | B/c/dB AFD D/E/EE EDB, | DDD DFA [Dd]ef edB | BAB dBA FED DDA, ||
DDA, DFA def  edB | B/B/AB dBA F/F/DD EFE | DDA, DDA [Dd]ef edB | BAB dBA FED DDA, |
DDA, DFA [Dd]ef edB | B/B/AB dBA FED  EFE | DDA, DDA def edB | BAB dBA FED D2A ||
dcd e^de f=dA  BdA | B/c/dB AFD DEE  FDA, |
`
			]
		},
		{
			abc: `X:1
T:Arthur Darley's
C:Arthur Darley
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/417#setting417
N:Setting entered in thesession by user “Josh Kane” on 2001-12-06
N:(edited after importing)
K:D
[M:15/8]|:A3 AGF EDC D3 d2e|[M:12/8]fgf edc d3 d2e|
 fgf edc dAA BAG|FED EDC DFE CDE|
 Ddd Aee Aff Agg|fed edc d2d dcB:|
 |:A=ff fef A=ff fef|A=ff Agg Aaa A_bb|
 A=ff fef A=ff f2g|=fed ed^c d2d d2e:|
 |:fgf edc dAA BAD|FED EDC DEF CDE|
 Ddd Aee Aff Agg|fed edc d2d d3:|`,
			theSessionId: 417,
			badges: "crooked"
		},
		{
			abc: `X:1
T:The Munster
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/372#setting372
N:Setting entered in thesession by user “Jdharv” on 2001-11-14
N:*abc-tools: convert to M:12/8*
K:Gmajor
D|:~G3 AGA ~B3 gdB|GAB cBA BGE EDE|
~G3 AGA ~B3 gdB|cBA (3Bcd B[1 AGG G2D:|2 AGG G2f||
|:gfg efg eag edB|gfg efg afd d2f|
gfe agf gfe fdB|cBA (3Bcd B[1 AGG G2f:|2 AGG G3||`,
			theSessionId: 372
		},
		{
			abc: `X:1
T:Gallagher's Frolics
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/160#setting160
N:Setting entered in thesession by user “Will Harmon” on 2001-06-28
N:*abc-tools: convert to M:12/8*
K:Edorian
D|:~E3 GFE ~B3 dBA|BdB BAB GBG AFD|
~E3 GFE BAB dBA|BAG FAF[1 GEE E2 D:|2 GEE E2 e||
|:e2 g gfe g2 b bge|dcd fed fad fed|
e2 f gfe dfe dBA|BAG FAF[1 GEE E2 e:|2 GEE E2 D||`,
			theSessionId: 160,
			parts: "AABB"
		},
		{
			abc: `X:1
T:Whelan's
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1447#setting1447
N:Setting entered in thesession by user “gian marco” on 2003-02-17
N:*abc-tools: convert to M:12/8*
K:Edorian
|:~E3 BAF FEB AFD|~E3 BAF dAF FED|
~E3 BAF FEB AFA|B/c/dB BAF dAF FED:|
|:BAB ~e3 fed e2d|BAB g2e fdB AFA|
~B3 ede fed e2 f|gbg faf edB AFA:|`,
			theSessionId: 1447,
			parts: "AABB"
		},
		{
			incipit: `X: 5
T:The Orphan
R: jig
M: 12/8
L: 1/8
K: Emin
~E3 EDB, GFG A3|B3 ABA`,
			theSessionId: 217,
			theSessionSettingId: 12898
		},
		{
			abc: `%251029
X: 3
T: Jockey At The Fair
R: Set dance
O: Ireland and England
M: 6/8
L: 1/8
B: “The Roche Collection of Traditional Irish Music, Volume II”, page 32, tune #277
N: “Jockey at the Fair” ~ Roche, 1912
N: Category = Set Dances
N: 0. this was posted on thesession by user ceolachan in 2013; I then 
N: added some comments.
N: 1. From posts on thesession I learned that a) this was 
N: originally an English tune; and was adopted by Irish musicians some time ago.
N: b) In (English Cotswold) morris dancing this is part of a set “Jockey _to_ the Fair”, 
N: which is played AA BBB.
N: 2. There’s some further info about it on thesession, including lyrics.
N: 3. It’s got a striking A part, and unusual phrase lengths in the B. Just my cup of tea!
K: Gmaj
|:D|G2 A B2 c|dge d2 c|BdB {A/}GFG|AcB A2 B|
G2 B def|g2 e d2 f/g/|afd AB^c|d3 d2:|
|:f/g/|afd dcB|c2 c B2 d|egd dcB|cBA B2 d|
e2 f gfg|ede B2 g|edc BcA|G/A/BG E2 F|
G2 G GBd|e2 f gfe|dBG A2 B|E2 F G2 A|BgB TB2 A|G3 G2:|
`,
			references: [
				{
					artists: "Pat Barton, button accordion",
					url: "https://www.youtube.com/watch?v=TZPPskWXqIw",
					notes:
						"“Jockey To The Fair - Irish traditional jig/ set dance on button accordion”"
				}
			],
			theSessionId: 2257,
			theSessionSettingId: 22264
		},
		{
			abc: `X:1
T:Andy McGann's
C:Andy McGann
R:jig
L:1/8
M:12/8
K:Dmajor
A,|D2 F EDB, DFA dcd|edB AFE `,
			theSessionId: 8000
		},
		{
			abc: `X:1
T:Don't Touch That Green Linnet
C:Tommy Peoples
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2309#setting2309
N:Setting entered in thesession by user “fidicen” on 2003-12-26
N:(edited after importing)
N:*abc-tools: convert to M:12/8*
K:Dmajor
|:D2F FEF AFA d3|baf afd ege fdA|
D3 FEF AFA d2a|baf gfe fdB A3:|
|:a3 fdf g2B bge|afd B/c/de dcB A3|
afd dfa bge efg|afd d2e[1 fdc d3:|2 fdc dAG||
F3 dAF G2B gdB|c2e a2a ba^g a2f|
afd dAF G2B gdB|c2e age fdc d3||`,
			parts: "AABBCC",
			theSessionId: 2309
		},
		{
			abc: `X:1
T:Pay The Reckoning
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1805#setting1805
N:Setting entered in thesession by user “nobu” on 2003-07-07
N:*abc-tools: convert to M:12/8*
K:Gmajor
|:G2e dBG ~B3 dBA|G2e dBG ~A3 BGE|
G2e dBG ~B3 deg|age dBG ~A3 BGE:|
~g3 faf e/f/ge def|gfg efg aga bge|
gbg f/g/af ege deg|age dBG ~A3 BGE:|`,
			parts: "AABB",
			theSessionId: 1805
		},
		{
			abc: `X:1
T:Father Kelly's
C:Father P.J. Kelly
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2156#setting2156
N:Setting entered in thesession by user “Peter Piper” on 2003-11-15
N:*abc-tools: convert to M:12/8*
K:Gmajor
|:D|GGG BAG FFF AFD|GGG BAG BdB cBA|
G2A BAG FFF AFD|d^cd ((3gfe) d cAF G2:|
A|B2d gdB dgB dgB|c2e gec egc ege|
d2f afd fad faf|gfg efg afd cBA|
B2d gdB dgB dgB|c2e gec egc ege|
d2f afd fad faf|d^cd ((3gfe) d cAF G2|
|:A|B2.B {c}BAG FFF AFD|BBB {c}BAG BdB cBA|
B2.B {c}BAG FFF AFD|d^cd ((3gfe) d cAF G2:|`,
			theSessionId: 2156
		},
		{
			groups: "ALORA",
			norbeckId: 88,
			parts: "AABB",
			abc: `X: 1
T: I Buried My Wife And Danced On Her Grave
R: jig
M: 12/8
L: 1/8
N: 1. All the A major chords could be played with an F# or E in
N: the bass to give it something extra.
N: 2. This version adds chords and makes some minor tweaks to a score from thesession:
N: https://thesession.org/tunes/381#setting383
N: 3. One of the tweaks is to write it in 12/8 rather than 6/8.
N: %250526
I:abc-charset utf-8
K: D mixo
P:Ⅰ
|:"D"DED F2 G AdB cAF|"G"GFG BAG    "A"FAF GEA|
  "D"DED F2 G AdB cAF|"G"GFG "A"BAG[1 "D"AFD D2 A,:|2 "D"AFD DFA||
P:Ⅱ
|:"D"d2 e fed faf gfe| d2 e fed      "Asus4"dcA dcA|
"D"d2 e fed   faf gfe|"G"dcA "A"BAG [1 "D"AFD DFA:|2 "D"AFD D3!D.C.!|]
`
		},
		{
			groups: "su",
			abc: `X:1
T:Drummond Castle
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2540#setting2540
N:Setting entered in thesession by user “Jamie” on 2004-02-20
N:*abc-tools: convert to M:12/8*
K:Aminor
|:ABA a2 (a {b}a)ge ~g3|~c3 edc Bdg dBG|
(ABA) ~a3 a(ge) g3|ege deg|1 edB A3:|2 edB A2 B||
|:~c3 cec ~d3 ded|~c3 edc Bdg dBG|
~c3 edc deg a2 (a|{b}a)ge deg[1 edB A2 B:|2 edB A3||`,
			theSessionId: 2540
		},
		{
			abc: `X:1
T:Saddle The Pony
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/307#setting307
N:Setting entered in thesession by user “Jdharv” on 2001-10-03
N:*abc-tools: convert to M:12/8*
K:Gmajor
|:D|GBA G2B def gdB|GBA G2B AFD AFD|
GBA G2B def gfg|efe dBA BGG G2:|
|:d|efe edB def gfg|efe edB dBA ABd|
efe edB def gfg|efe dBA BGG G2:|`,
			theSessionId: 307
		},
		{
			abc: `X:1
T:Jump At The Sun
C:John Kirkpatrick
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/736#setting736
N:Setting entered in thesession by user “Musicalbison” on 2002-06-05
N:(edited after importing)
K:Dminor
|:DFA ^G2 A DFA G2 A|dAA dAA BAG F3|
DFA ^G2 A DFA G2 A|dAA BAG FGE D3:|
d2 e fed e2 f gfe|d2 e fed A^GA B2 A|
d2 e fed e2 f gfe|dAA BAG FGE D3:|`,
			parts: "AABB",
			theSessionId: 736
		},
		{
			abc: `X:1
T:The Wishing Well
C:Tommy Peoples
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1642#setting1642
N:Setting entered in thesession by user “pchaffee” on 2003-05-06
N:*abc-tools: convert to M:12/8*
K:Dmajor
|:F|DFA d2e fdB BAF|d2B BAF B/c/dB BAF|
DFA d2e fdB BAF|BAF dBA fac d2:|
|:B|Adf ~a3 baf afd|~f2g afd Bdg bge|
Adf ~a3 baf afd|b2a afd Ace d2:|
|:e|fdd ceA d2g fdB|c2B ceA ~a3 bag|
~f2d ecA d2g fdA|FAD GBD Aec d2:|`,
			theSessionId: 1642,
			parts: "AABBCC"
		},
		{
			incipit: `X: 4
T: Captain White's
R: jig
M: 12/8
N: Apparently it’s sometimes played AABBC or AABC or AABCBC or ABC or …
L: 1/8
K: Dmaj
DFA d2 f edc B2d|A2 d F2 B AGF E2 F`,
			theSessionId: 2134,
			parts: "AABBCC",
			references: [
				{
					url: "https://www.youtube.com/watch?v=0qAH2ravRrU",
					artists: "Tommy & Siobhán Peoples, fiddles",
					notes: "Captain White’s / The Bank Of Turf "
				}
			]
		},
		{
			abc: `X:1
T:Muireann's
C:Niall Vallely
R:jig
L:1/8
M:12/8
N:Imported from https://thesession.org/tunes/1902#setting1902
N:Setting entered in thesession by user “Dr. Dow” on 2003-08-24
N:(edited after importing)
K:Baeol
|:dBA ~B3 def ede|f2e ede faf efe|
  dBA ~B3 def ede|fba fed fee edB:|
|:BAB e3 BAB fef|Bba fed fee edB|
  BAB e3 BAB fef|baf aba fee edB:|
|:BAF E2F FDE FDA|DAA DBB Ddd edB|
  BAF E2F FDE FDE|FAB def [1 fed edB:|2 fed e3||
|:fef b2B fef ~a3|fba fed fee ede|
  fef b2B fef ~a3|baf aba [1 fee ede:|2 fee edB||`,
			theSessionId: 1902
		},
		{
			abc: `X:1
T:The Black Rogue
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1076#setting1076
N:Setting entered in thesession by user “b.maloney” on 2002-10-24
N:*abc-tools: convert to M:12/8*
K:Amixo
|:cAA BGG cAA ABd|cAA BAG AFD D2 B|
cAA BGG cAA AFD|G2 A (B/c/d)B[1 AFD D2 B:|2 AFD D3||
|:~f3 ~g3 afd cBA|~f3 gfg afd dfg|
agf gfe fed e/f/ed|cBA BAG AFD D3:|`,
			theSessionId: 1076,
			references: [
				{
					url: "https://open.spotify.com/track/3ooiN8bT2gx1hzDokGpQpI",
					artists: "Seán Maguire, fiddle; Wilcil McDowell, piano",
					notes: `The Black Rogue; Morrison’s
Album: A Man Apart (2004)`
				}
			]
		},
		{
			groups: "su",
			abc: [
				`X:1
T:Strop The Razor
R:jig
L:1/8
M:12/8
N:Imported from https://thesession.org/tunes/693#setting23367
N:Setting entered in thesession by user “JACKB” on 2014-02-01
N:(edited after importing)
K:Gmajor
|:BGG AGG BGG AGF|DGG GAG DGG G2A|
  BGG AGG BGG AGF|D2E F2G ADE FGA:|
|:dcB cAA dcB cAF|DGG GFG DGG G(3ABc|
  dcB cAA dcB cAF|D2E F2G ADE FGA:|
|:B3 cBc d(3Bcd dBd|g3 gfd gba gdc|
  B3 cBc dB/c/d d2e|=f3 fde fdg ^fdc:|`
			],
			references: [
				{
					notes: "SU: 2nd in the Fahey’s Fiddle set"
				}
			],
			theSessionId: 693,
			theSessionSettingId: 23367
		},
		{
			abc: `X:1
T:Brian O'Lynn
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/830#setting830
N:Setting entered in thesession by user “Mark Cordova” on 2002-07-08
N:*abc-tools: convert to M:12/8*
K:Adorian
B|:cAd cAG EDE GAB|cBc BAG EAA ~A2B|
cAd cAG EDE GAB|cde =fed[1 cAA A2B:|2 cAA A2f||
gea ged cAB cde|eaa age ed^c def|
geg fed cAB cde|=fed cAG[1 EAA A2f:|2 EAA A2||`,
			theSessionId: 830
		},
		{
			abc: `X:1
T:Jocelyn's Tree
C:Tommy Peoples
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2132#setting2132
N:Setting entered in thesession by user “heike” on 2003-11-08
K:Dmajor
DE|:FDB BAG|FAd faf|fgb ege|Bcc AGE|
 FDB BAG|FAd faa|bge cAF|GFE DED:|
 |:EFF DED|FAd fdA|fgg ege|Bcd ecA|
 B2e bge|A2f afd|FAd gec|AGE DED:|
 |:ABA eff|aba afd|BGE G,A,A,|CEA gec|
 dcd eff|aba afd|Bge cAF|GFE DED:|`,
			theSessionId: 2132
		},
		{
			abc: `X:1
T:The Luck Penny
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1334#setting1334
N:Setting entered in thesession by user “Bannerman” on 2003-01-15
K:Gmajor
|:BAG AFD|G2G FGA|BAG BdB|cAG Fdc|
 BAG AFD|GBd ~g3|def gdB|1 cAF G2A:|2 cAF G2B||
 |:d2g gfg|abg fga|bag agf|def g2a|
 bag agf|g2g fd^c|def gdB|1 cAF G2B:|2 cA F GBc||
 |:dBG GFG|DGB dBG|cA=F FEF|C=FA cBA|
 dBG GBd|g2g fd^c|def gdB|1 cAF GBc:|2 cAF G2A||`,
			theSessionId: 1334
		},
		{
			aka: ["The Frieze Breeches", "Cúnla"],
			incipit: `X: 11
T:The Frieze Britches
R: jig
M: 12/8
L: 1/8
K: Dmix
FED EFG A2 d cAG|A`,
			theSessionId: 34,
			references: [
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2025/?track=7",
					artists:
						"Tony MacMahon, accordion; Noel Hill, concertina; John Beag Ó Flatharta, guitar",
					notes:
						"Cúnla [The frieze britches], jig; Na ceannabháin bhána, slip jig; Cailleach an airgid, jig"
				}
			]
		},
		{
			abc: `X:1
T:Hudie Gallagher's March
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/810#setting810
N:Setting entered in thesession by user “Mark Cordova” on 2002-06-27
K:Amixo
|:cBA ecA|fed cBA|def gfg|~B3 Bed|
 cBA ecA|fed cBA|c2e dBG|1 ABA Aed:|2 ABA Afg||
 |:agf gfe|fed cBA|def gfg|~B3 Bfg|
 agf gfe|fed cBA|c2e dBG|1 ABA Afg:|2 ABA Aed||`,
			theSessionId: 810
		},
		{
			abc: [
				`X:1
T:The Sunny Side of the Latch
R:jig
Z: Malcolm Schonfield % 231212,3,4
C: Jason O’Rourke
N:This pretty jig composed by Jason O’Rourke is from his latest album, also called
N:The Sunny Side of the Latch. In the sleeve notes for the album he tells the
N:story behind the title but I can't fully remember the details (don’t have it to
N:hand today) and prefer not to miss-tell the story here. Buy the album and find
N:out for yourself!
N:It’s a lovely album with lots of great compositions on it, all very well played.
N:My transcription aims to give a feel of how Jason plays it, without going into
N:too much detail.
Q:3/8=100
M:12/8
L:1/8
K:C
EDE CDC EFG AdB | cBc ABc GEC ~D2C | EDE CDC EFG AdB | cGE _BFD CDC C2E | 
EDE CDC EFG A2{^c}d | cBc ABc GEC ~D3 | EDE CDC EFG AdB | cGE _BFD CDC C2e || 
efg fed ecA dBG | cGE _BFD CGc =Bcd | efg fed ecA d^cd | cGE _BFD CDC C2e |
efg fed ecA d^cd | cGE _BFD Cec =Bcd | efg ~f3 ~e3 ~d3 | cGE _BFD CDC C2E !D.C.! |]
"^second time, at the end"efg f(3edf e(3Gce d(3GBd | c(3GEG _B(3FDF C(3EGc =Bcd | efg ~f3 efg fed | cGE _BFD CDC C3 |]`
			],
			theSessionId: 23818,
			theSessionSettingId: 49004
		},
		{
			groups: "su",
			abc: `X:1
T:Con Cassidy's
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1570#setting1570
N:Setting entered in thesession by user “gian marco” on 2003-04-04
K:Gmajor
|:BAB cBc|dgg d2g|fed cAF|Ggg d2c|
 BAB cBc|dgg d2g|fed cAF|1 ~G3 G2A:|2 ~G3 G2d||
 |:gGG fGG|efg d2c|BA^G Aag|fe^d efg|
 azf gfe|fed fga|gfe def|1 gGG G2d:|2 gGG G2A||`,
			theSessionId: 1570
		},
		{
			abc: [
				`
X: 1
T: Tommy Potts' Rampling Pitchfork
T: As played by Jimmy Power
%C: Tommy Potts
S: Jimmy Power, fiddle
D: Irish Fiddle Player
F: https://music.youtube.com/watch?v=JCoioqMwFU0
F: https://open.spotify.com/track/36qbAuJDpdPnmmeaqEjMaH
Z: abc-transcription Malcolm Schonfield% 2024-05-15 - 17, 24
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
N:accompanied by Reg Hall (piano)
R: jig
M: 12/8
L: 1/8
K: D minor
[P:A] D2SE || FEF GFG  AGA dA^F | G/G/^FG A2g  fed cAG |
^FDD ADD  CDD A,DD | ([GG,3]FG) ABG AFD D2E | 
FEF [GG,]FG AGA dA^F |  G/G/^FG A2g fed cAG |
^FDD ADD CDD A,DD | ([GG,3]FG)  A/A/BG AFD
 [P:B] D2A |:  d2g fed ecA ABc |  d/d/de fed  f/g/af gec |
d2g fed ecA EFG |  F/F/GA ABG AFD [1 [A2D2]A:| 
[2 [P:C] D2E |: FEF AFF cFF AFF | GFG A2g fed cAG |
^FDD ADD CDD A,DD | GFG ABG AFD [1D2E:| 
[2 [P:D] D2e |: (fef) ecA BAB AFD | (GFG) A2g fed cAG |
^FDD ADD CDD A,DD | (GFG) ABG AFD [1 D2e :| [2 D2!D.S.! |]
`,
				`
X: 2
T:The Rambling Pitchfork
T: Tommy Potts' Rambling Pitchfork
%C: Tommy Potts
T: As played by Paddy O'Brien and Nathan Gourley
S: Paddy O’Brien, accordion; Nathan Gourley, fiddle
D: Bright And Early - The Ballykeale / The Rambling Pitchfork 
F: https://music.youtube.com/watch?v=FqNstTlVggE&t=64
F: https://open.spotify.com/track/05m3z6WmKqWGd4xluoujTT
Z: abc-transcription Malcolm Schonfield% 2024-05-17,24
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
N: Paddy O’Brien, button accordion; Nathan Gourley, fiddle; Dáithí Sproule, guitar
R: jig
M: 12/8
L: 1/8
K: Dmin
E |:[P:A] F2F AFF cFF AGF | G2A Bde fed cAG | 
FDD ADD CDD A,DF | G2A BAG [1 AFD DCD :| [2 AFC D2d ||
|:[P:B] d^cd ^fed e^cA =B/c/de | d^cd e^fg a2^f gfe |
d2e =fed e^cA E^FG | ^FGA BAG A^ce [1 dcA:| [2 dag ||
[P:C] fed ecA dAc AFD | G2A Bde fed cAG |
FDD ADD CDD A,3 | G2A BAG AFC D2 !D.C.! |]`
			],
			theSessionId: 2329
		},
		{
			groups: "su",
			abc: `X:1
T:The Thornton
C:Donald Cameron
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2481#setting2481
N:Setting entered in thesession by user “dafydd” on 2003-08-28
N:*abc-tools: convert to M:12/8*
K:Amixo
|:c2A ABA d2e fed|c2A ABA B2g gdB|
c2A ABA d2e fec|d2f c2e B2g gdB:|
|:c2e efe ef^g a3|c2e efe B2g gdB|
c2e efe ef^g a2e|d2f c2e B2g gdB:|`,
			theSessionId: 2481
		},

		{
			abc: `X:1
T:Partie De Quadrille
O:Quebec
R:jig
L:1/8
M:12/8
N:This is a ‘crooked’ jig from Quebec which features a couple of bars of 9/8 in
N:the A section. I learnt it from the 2007 self-titled album by the group Tidal
N:Wave/Raz-de-Marée, where its source is listed as the repertoire of the Verret
N:family.
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/23388#setting47849
N:Setting entered in thesession by user “Jake” on 2023-08-04
N:(edited after importing)
K:Fmajor
|:A2^G AcB A2^G AcB|A2G FAc f2f e2d|
 B2A Bdc B2A Bdc|[M:9/8]B2A GBd g2f|1 ege cde fcB:|2 [M:12/8]ege cde fcA F3||
 |:a2a aga b3 b2a|g2g gfg ac'a cde|
 f2f fef g3 g2f|ege cde [1 fcA F3:|2 fcA FcB !D.C.! |]`,
			theSessionId: 23388,
			theSessionSettingId: 47849,
			badges: "crooked"
		},
		{
			abc: `X:1
T:Kit O'Mahony
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4234#setting4234
N:Setting entered in thesession by user “CreadurMawnOrganig” on 2005-02-17
K:Gmajor
|:G/A/|~B3 ABA|GAG FGA|B/c/dB cAF|DGG G2A|
 B2G AGF|DGE FGA|fed cAF|DGG G2:|
 D|GBd deg|f2d cAF|GBd def|~g3 def|
 g2e fed|edB cde|fed cAF|DGG G2:|
 D|GBd cAc|BGG G (3Bcd|gdB cAE|FGA cAF|
 GBd cAc|BGG G2g|fed cAF|1 DGG G2:|2 DGG G||
 (3Bcd|~g3 dBG|fed cAF|GBd deg|~f3 def|
 ~g3 afd|bag afd|fed cAF|1 DGG G:|2 DGG G2||`,
			theSessionId: 4234
		},
		{
			abc: `X:1
T:Fasten The Leg In Her
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2838#setting2838
N:Setting entered in thesession by user “Stewart” on 2004-04-17
K:Gmajor
c|:B3BAB|GBd gdB|A3AGA|Bee dBA|
 BcB BAB|GBd g3|efg eag|1 fdd d2c:|2 fdd def||
 |:g3fgf|efe dBA|G3AGA|Bee def|
 gag fgf|efe d3|efg eag|1 fdd def:|2 fdd dcA||`,
			theSessionId: 2838
		},
		{
			abc: `X:1
T:Dave And Dan's
C:Tommy Peoples
R:jig
L:1/8
M:6/8
N:This is a jig Tommy Peoples wrote while spending time and going to sessions in
N:the Boston area around 2003, as I understand it. It was named for and given to
N:Dave Cory and Dan Isaacson, who recorded it on their album The Magic Square. In
N:the liner notes Dan mentions that their session mates often jokingly called this
N:the Dudes' Jig. Tommy recorded it on his Live at Fiddler's Hearth album and
N:plays a characteristically ornamented setting on a YouTube video with Daithi
N:Sproule here: https://www.youtube.com/watch?v=LivlT1JyQrw. The setting I've
N:given here is the more basic one from The Magic Square. The tune also works fine
N:in D major, but it's lovely on the fiddle in C.
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/21254#setting42412
N:Setting entered in thesession by user “Robert Engelman” on 2021-11-23
K:Cmajor
|:E3 FGA|G3 G,CD|E3 cGE|DCC CA,G,|E3 FGA|G3 EGB|c2c B/c/dB|ced c3:|
 |:g3 ege|c3 ceg|a3 faf|Acf afd|g3 ege|c3 agf|gfe fed|ced c3:|
 |:ecf g2g|f/g/af gec|f/g/af e/f/ge|dcA G2E|F3 Acf|a3 gfe|fed edc|B/c/dB c3:|`,
			theSessionId: 21254,
			theSessionSettingId: 42412
		},
		{
			abc: `X:1
T:The Whistler At The Wake
C:Vincent Broderick
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4236#setting4236
N:Setting entered in thesession by user “gian marco” on 2005-02-18
K:Dmajor
|:A|F2A AFA|Bdd efg|fed ~B3|AFE EDE|
 F2A AFA|Bdd efg|fed ~B3|AFD D2:|
 |:e|fed BdB|AFE EDF|AFB AFB|AFB AFA|
 fed BdB|AFE E2e|fed BdB|AFD D2:|`,
			theSessionId: 4236
		},
		{
			abc: `X:1
T:Seanamhac Tube Station
C:John Carty
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/280#setting280
N:Setting entered in thesession by user “scottythefiddler” on 2001-09-09
N:(edited after importing)
K:Gdor
|:GFD D2F GAc d3|dcA cAF GFD C3|
  GFD D2F GAc d3|dcA cAF G3 G3:|
   d3 dcA c3 cAc|dcA cAF GFD C3|
   d3 dcA c3 cAc|dcA cAF G3 G3|
   d3 dcA c3 cAc|dcA cAF GFD C3|
 GFD D2F GAc d3|dcA cAF G3 G3||`,
			theSessionId: 280,
			norbeckId: 423,
			parts: "AABB",
			badges: "optional C part"
		},
		{
			abc: `X:1
T:Gráinne's
C:Tommy Peoples
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/488#setting488
N:Setting entered in thesession by user “radriano” on 2002-01-06
K:Gmajor
|:B|dGF GDB,|G,A,G, DB,D|EcB ABA|FED cBA|
 B2/^c2/d2/B G3|EF/G/E CEG|DGc BDF|AGF G2:|
 |:A|~B3 ~G3|eBc ADE|~F3 ~f3|edc d2c|
 Bc/d/B Ggf|ecA E3|DBc BDF|AGF G2:|
 |:D|GBd ~g3|edB cBA|Bc/d/B a2g|fdc d2f|
 gdB Ggf|ecA ~E3|DGc BDF|AGF G2:|`,
			theSessionId: 488
		},
		{
			abc: `X:1
T:The Chapel Bell
C:Frank McCollum
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/5405#setting5405
N:Setting entered in thesession by user “gian marco” on 2006-01-07
K:Edorian
|:BEE EFA|Bee d2f|edB BAF|d2B AFE|
 BEE EFA|Bee d2f|edB BAF|AFE EFA:|
 |:Bee efe|def f2e|edB BAF|d2f edB|Bee efe|
 [1def f2e|edB BAF|AFE EFA:|
 [2def b2a|fed BAF|AFE EFA||`,
			theSessionId: 5405
		},
		{
			abc: `X:1
T:Ard Baithen
C:Tommy Peoples
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/6807#setting6807
N:Setting entered in thesession by user “Ger the Rigger” on 2007-02-13
K:Dmajor
|:ADD B2 D|ADD FGA|d2 e fdB|ecA fdB|
 ADD ~F2 G|ABA fec|dcA~G3|ecA ~G3:|
 |:Ade ~f2 g|afd cAF|G=cA ~G3|=cGE =cGE|
 ABA f~g2|g~a2 d=cA|B~=c2 E=cE|DFA d2 z:|
 |:DED DED|dAd cAF|[E3/2A,3/2][E/A,/][EA,] GEC|A,CE GEC|
 (3.D.D.DD DED|dAd cAF|[E3/2A,3/2][E/A,/][EA,] GEC|A,EC D2 z:|`,
			theSessionId: 6807
		},
		{
			abc: `X:1
T:Aherne's Egg
C:Finbarr Dwyer
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4440#setting4440
N:Setting entered in thesession by user “petemay” on 2005-04-27
K:Emixo
|:BGE EDB,|DEF EGB|e3 geB|edB AFA|
 Bec d2B|cAB GEF|=GDB, BA^G|1 AFB EGA:|2 AFB EGB||
 ege d2B|cAE AFD|B,EG ABA|FBG ABc|
 BGB e2c|dAF DFA|GBG AFB|1 EFE EGB:|2 EFE EGA||`,
			theSessionId: 4440
		},
		{
			abc: `X:1
T:Health To The Ladies
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/327#setting327
N:Setting entered in thesession by user “Jdharv” on 2001-10-14
K:Amajor
|:f|ecA BAF|AFE EFA|Bdc BAB|cBB B2f|
 ecA BAF|AFE EFA|Bdc BAB|cAA A2:|
 A|cee dff|cee ecA|cee dff|ecA B2A|
 cee dff|cee ecA|Bdc BAB|cAA A2:|`,
			theSessionId: 327
		},
		{
			abc: `X:1
T:The Lark In The Morning
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/62#setting62
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
K:Dmajor
|:AFA AFA|BGB BdB|AFA AFA|fed BdB|
 AFA AFA|BGB BdB|def afe|dBB BdB:|
 |:def afe|bff afe|def afe|dBB BdB|
 def afe|bff afe|g2e f2d|edB BdB:|
 |:dff fef|fef fef|dff fef|edB BdB|
 dff fef|fef def|g2e f2d|edB BdB:|
 |:Add fdd|edd fdd|Add fdd|edB BdB|
 Add fdd|edB def|g2e f2d|edB BdB:|`,
			theSessionId: 62
		},
		{
			abc: `X:1
T:The Trip To Athlone
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1301#setting1301
N:Setting entered in thesession by user “fidicen” on 2003-01-06
N:*abc-tools: convert to M:12/8*
K:Dmajor
|:ABA D2d {e}dcA AGF|ABG ABc dAB =cde|
ABA D2d {e}dcA AGF|GFG Ade [1 fdc d2d:|2 fdc d2e||
|:fed edc Adc Ade|fed efg AB=c def|
~g3 age {a}ed=c AGF|~G3 Ade[1 fdc d2e:|2 fdc d2d||`,
			theSessionId: 1301
		},
		{
			abc: `X:1
T:A Trip To The Cottage
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/833#setting833
N:Setting entered in thesession by user “Mark Cordova” on 2002-07-10
K:Gmajor
|:ded ~B3|cBc AFD|DGG FGA|~B3 ABc|
 dgd BAB|cBc AFD|DGG FGA|1 BGF GBc:|2 BGF GBd||
 gfe d^cd|edc Bcd|ecA dBG|FAG FED|
 gfe d^cd|edc Bcd|efg eag|1 fd^c def:|2 fd^c dB=c||`,
			theSessionId: 833
		},
		{
			abc: `X:1
T:The Donegal Lass
C:Brian Finnegan
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1497#setting1497
N:Setting entered in thesession by user “lefthander al” on 2003-03-10
N:(edited after importing)
N:*abc-tools: convert to M:12/8*
K:Amix
|:Ace aed edB A3|GBd G3 FAd F3|
Ace aed cdB A2a|aed cdB ABG A3:|
GBd G3 FAd F3|e2e ecA e2e ecA|
GBd G3 FAd F2a|aed cdB ABG A3:|`,
			parts: "AABB",
			theSessionId: 1497
		},
		{
			abc: `
X: 3
T: Spórt
C:Peadar Ó Riada
R: jig
M:12/8
L: 1/8
N:Imported into *tuneTable* on 2025-11-01,
N:from https://thesession.org/tunes/870#setting14042
N:Setting entered in thesession by user “daveboling” on 2012-10-01
N:*abc-tools: convert to M:12/8*
K: Dmaj
|:AdF A2 A GBE G2 G|AdF A2 A GEd cEA|
AdF A2 A GBE G2 A|cdc A2A GEA D3:|
|:cBc dcd cec A2g|fed ged cec A3|
fef gfg faf d2e|fdF AFA GEA D2 A:|
|:AGG AEE AGE EDD|AGG c2 e dcA AGE|
AGG AEE AGE EDD|cdc A2G EAA D3:|
`,
			theSessionId: 870,
			norbeckId: 469
		},
		{
			aka: "Cailleach an airgid",
			incipit: `X:1
T:The Hag With The Money
R:jig
L:1/8
M:12/8
K:Dmixo
Add A3 AGE G3|Add ABA AGE EDD|`,
			theSessionId: 351,
			references: [
				{
					notes: "See the Frieze Britches for a set by McMahon & Hill"
				},
				{
					url: "https://donegalfiddlemusic.bandcamp.com/track/track-9-caileach-an-airgead-bean-baint-duileasc-agus-fhluich-s-a-l-ine-double-jigs",
					name: "Stephen Campbell, fiddle",
					album: "The Fiddle Music Of Donegal - Volume Two (1997)"
				}
			]
		},
		{
			abc: `X:1
T:The Road To Banff
C:Malcolm Reavell
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4435#setting4435
N:Setting entered in thesession by user “Yooval” on 2005-04-26
N:*abc-tools: convert to M:12/8*
K:Dmajor
|:A|Add dcd BAG A3|AdA eAf g2g ecB|
Add dcd BAG A3|AdA eAf gec d2:|
|:g|a2a fdA g2g ecB|AdA eAf g2g efg|
a2a fdA g2g ecB|AdA eAf gecd2:|`,
			parts: "AABB",
			theSessionId: 4435
		},
		{
			aka: "A Curious Denis Murphy Jig",
			incipit: `X:1
T:Trip To The Quarry
C:Thady Murphy
S:Mick O'Brien, uillean pipes; Caoimhín Ó Raghallaigh, fiddle
D:Deadly buzz | Aoibhinn Crónán 
H:https://irishmusic.bandcamp.com/track/a-curious-denis-murphy-jig-the-belles-of-liscarroll
R:jig
L:1/8
M:12/8
N:A Curious Denis Murphy Jig / The Belles of Liscarroll
K:Amix
|:B|Bcd efg aba age|~d3 dcd efg ecA|`,
			theSessionId: 11868,
			norbeckId: 491,
			parts: "AABB"
		},
		{
			incipit: `X: 2
T: The Diplodocus
R: jig
M: 12/8
L: 1/8
K: Amix
cAA edB cAA ABc|def g3 a2e`,
			parts: "AABBCC",
			theSessionId: 620,
			theSessionSettingId: 22648
		},
		{
			abc: `X:1
T:The Maid In The Meadow
C:Walker Jackson
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/942#setting942
N:Setting entered in thesession by user “Bryce” on 2002-08-31
K:Dmixo
|:cec BdB|AGA AGE|DEG AGA|BdB AGE|
 c3 BdB|ABA AGE|DEG AGA|1 AGF GAB:|2 AGF G2 D||
 |:GBd gfg|ede gdB|GBd gdB|AGA AGE|
 GBd gfg|ede gdB|GAB AGA|AGF G3:|`,
			theSessionId: 942
		},
		{
			abc: `X:1
T:Australian Waters
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2607#setting2607
N:Setting entered in thesession by user “Will Harmon” on 2004-03-05
K:Dmajor
ABc|:dAG FED|=c3 ed^c|dAF GFE|FED gfe|
 dAG FED|=cBc ed^c|dAF GFE|FDC DFA:|
 |:dcd efg|fed cBA|dcd efg|fdc def|
 gbg faf|ecA ABc|dAF AFD|EDC DFA:|
 ABc|:dAG FED|~=c3 ed^c|dAF GFE|FED gfe|
 dAG FED|=cBc ed^c|dAF GFE|FDC DFA:|
 dcd efg|fed cBA|~d3 efg|fdc def|
 ~g2 e ~f3|ecA ABc|dAF AFD|EDC DFA|
 ~d3 efg|fed cBA|dc/c/d efg|fdc def|
 gbb faa|ecA ABc|dAF AFD|EDC DFA|`,
			theSessionId: 2607
		},
		{
			abc: `X:1
T:The Cuil Aodha
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/825#setting825
N:Setting entered in thesession by user “gian marco” on 2002-07-04
K:Gmajor
|:gfd cAd|GAG B2c|dcB cAG|FED cBA|
 ~G3 GFG|~A3 fga|gfd cAd|1 GAG G2g:|2 GAG G2d||
 |:d2g gfg|ade fga|gfd cAd|cAG FGA|
 G2g gfg|ade fga|gfd cAd|1 GAG G2d:|2 GAG G2g||`,
			theSessionId: 825
		},
		{
			abc: `X:1
T:The Maid On The Green
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1831#setting1831
N:Setting entered in thesession by user “gian marco” on 2003-07-20
K:Gmajor
|:gfg e2d|Bee dBA|BGG dBG|BAG AB/c/d|
 ~g3 eGd|BeB dBA|BGG dBA|AGF GA/B/d:|
 |:~g3 afd|~g3 a2a|bag agf|gef g2a|
 bag agf|~g3 e2d|Bee dBA|AGF GA/B/d:|`,
			theSessionId: 1831
		},
		{
			abc: `X:1
T:The Knights Of Saint Patrick
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1822#setting1822
N:Setting entered in thesession by user “KeepFiddlin'” on 2003-07-14
K:Dmajor
|:"D"dcd faf|dcd AFD|"G"GBG FAF|"A"EFG ABc|
 "D"d3 faf|dcd AFD|"G"GBG "D"FAF|1 "A"EDE D2A:|2 "A"EDE D2f||
 "D"aga fdf|aba agf|"A"g3 gec|Ace gfe|
 "D"aga fdf|aba afg|afd "Em"bge|"A"edc "D"d2f|
 "D"aga fdf|aba agf|"A"g3 gec|Ace gfe|
 "D"d3 "Em"ede|"F#m"fef "G"gfg|"D"afd "Em"bge|"D"dAF D2 "(A)"A||`,
			theSessionId: 1822
		},
		{
			aka: "Paddy Fahey’s",
			abc: `X:1
T:Paddy Fahey’s No. 2
C:Paddy Fahey
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2667#setting2667
N:Setting entered in thesession by user “carrie” on 2004-03-15
N:*abc-tools: convert to M:12/8*
K:Cmajor
|:c3 dcB cGE CEG|F3 DEF GAB ced|
c3 dcB cGE CEG|F3 DGF ECC C3:|
|:c3 g^fg eaf gec|A2 f fef Adf afd|
c3 g^fg eaf g2 a|gec fdB cGE C3:|`,
			theSessionId: 2667,
			parts: "AABB"
		},
		{
			abc: `X:1
T:Sixpenny Money
R:jig
L:1/8
M:6/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/387#setting387
N:Setting entered in thesession by user “Jdharv” on 2001-11-21
K:Dmajor
|:fAA fAA|BAG FGE|DED AFA|dfd efg|
 FAA FAA|BAG FGE|DED AFA|dfd e2 d:|
 fef gfg|afd ede|fef gfg|afd e2 d|
 fef gfg|afd fga|ABA AFA|dfd e2 d:|`,
			theSessionId: 387
		},
		{
			abc: `X:1
T:The Balmoral Highlanders
C:Angus MacKay
R:march
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/8121#setting8121
N:Setting entered in thesession by user “benhockenberry” on 2008-01-06
K:Amixo
|:e2|A>e c<e A>e c<e|e>Af>A e2d>B|G>d B<d G>d B<d|G>AB>c d>Be>c|
 A>e c<e A>e c<e|e>Af>A e2d>c|B<dG>B g>fe>d|c2A2 A<A:|
 |:e2|c<ea2 c<ea2|c<ea>f e2d>c|BBg2 BBg2|BBg2 a>gf>d|
 c<ea2 g>ea2|g>ef>d e2d>c|B<dG>B g>fe>d|c2A2 A<A:|`,
			theSessionId: 8121
		},
		{
			abc: `X:1
T:Dornoch Links
C:John MacDonald
R:march
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1649#setting1649
N:Setting entered in thesession by user “gian marco” on 2003-05-10
K:Amajor
|:af|eAAB c2 BA|e2 A2 Aaaf|eA AB c2 BA|c2 B2 B2 Ac|
 eAAB c3 B|ABce a3 f|e3 f ecAc|B2 A2 A2:|
 |:ce|a3 a afea|f3 e faaf|e3 f ecAB|c2 B2 B2 ce|
 a3 a afea|fece faaf|e3 f ecAc|B2 A2 A2:|`,
			theSessionId: 1649
		},
		{
			groups: "su",
			abc: `X:1
T:Beauties Of Autumn
C:John Brady
R:march
L:1/8
M:4/2
N:Imported from https://thesession.org/tunes/4553#setting4553
N:Setting entered in thesession by user “Michael Eskin” on 2005-06-02
N:(edited after importing)%251118
K:Edorian
E>G|:BEGB AFDE FB,DF A2(3Bcd|e>fed BAFE FdFE D2BA|
 G>AGE BEGB ADFA d2e>f|afef deBA[1 F2E2 E2E>G:|2 F2E2 E2F/G/A||
 |:B2ef eBef g2fe fdeB|ABAF defa bafe fdef|
 B2ef eBef g2fe fdeB|Aaef deBA[1 F2ED E2GA:|2 F2ED E2EG||`,
			references: [
				{
					notes: "SU: Followed by An Paistinn Fionn"
				}
			],
			theSessionId: 4553
		},
		{
			groups: "su",
			incipit: `X:1
T:The Tax Max
R:mazurka
L:1/8
M:3/4
K:F
C DE|F3G FE|F3E FG|A3F EC|D3C `,
			theSessionId: 19631,
			theSessionSettingId: 38741
		},
		{
			abc: `X:1
T:The Rose Of Raby
C:Dave Shepherd
R:mazurka
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/7885#setting7885
N:Setting entered in thesession by user “mehitabel23” on 2007-10-19
K:Gminor
GA|:B2 BG Bd|A4 AB|(3cBA Bcde|dc BA GA|
 B2 BG Bd|A4 AB|(3cBA dc BA|G4 GA:|
 |:B2GB GB|c4 dc|B2 GB dB|c4 Bc|
 dc Bd cB|cB Ac BA|B2 GA Bc|A2 AF GA|
 B2 BG Bd|A4 FA|c2 cd (3edc|d2 dB GA|
 B2 GB dc|A2 FA cB|G2 G2 (3AGF|1 G4 GA:|2 G6||`,
			theSessionId: 7885
		},
		{
			abc: `X:1
T:Vincent Campbell's
R:mazurka
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1332#setting1332
N:Setting entered in thesession by user “ScottC” on 2003-01-15
K:Gmajor
GA|:"G"B2BAGE|DB, D2B,D|"C"EC E2CE|"G"DB, D2GA|
 B2BAGE|DB, D2B,D|"C"E2"D"F2D2|"G"G4GA:|
 |:"G"B2B2dB|"C"cB c2AF|"D"A2A2dc|"G"BA B2GA|
 B2B2dB|"C"cB c2DF|"D"A2AcBA|1 "G"G4GA:|2 "G"G6||`,
			theSessionId: 1332
		},
		{
			abc: `X:1
T:The Irish
R:mazurka
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1276#setting1276
N:Setting entered in thesession by user “fidicen” on 2003-01-01
K:Gmajor
|:DG|B2 BA GB|d2 dB AB|c2 ce dc|(3Bcd g2 DG|
 B2 BA GB|d2 dB AB|c2 cA FA|1 G4:|2 G3 ggf||
 |:e2 ce ce|d2 dB AB|c2 cA FA|B2 B ggf|
 e2 ce ce|d2 dB AB|c2 cA FA|1 G3 ggf:|2 G4||`,
			theSessionId: 1276
		},
		{
			groups: "alora",
			abc: [
				`X:1
T:The First Draft
C:Siobhán Peoples
S:Fidil: Aidan O’Donnell, Ciarán Ó Maonaigh, and Damien McGeehan, on fiddles
F:https://raelachrecords.bandcamp.com/track/the-first-draft-mazurka
D:Decade
R:mazurka
L:1/8
M:3/4
N: This lovely mazurka is a composition by Siobhán Peoples. I first heard it on
N:www.itma.ie.
N:Currently there’s a page on itma.ie for this tune:
N:https://www.itma.ie/scores/first-draft/
N:In it there are the following words from S. Peoples: "This tune simply got its
N:title as it presented itself to me fully formed. It was recorded by the band
N:Fidil on their 2019 recording, Decade, and they kindly allowed us to include the
N:track here."
N:The score I’m sharing is, I believe, identical to the one written by S. Peoples;
N:I copied it from the itma.ie page. I got in touch with S. Peoples and she kindly
N:agreed for me to do this. (MS, 2023)
K:Gmajor
DG|Bc d/c/B cA|G<B D2 GF|EG ce dc|BG [D2B,2] DG |
 Bc d/c/B cA|G<B DG FG|EG ce DF|G2 G2:|
 ga|ba gb a^g|af d2 =gf|ec ef g/f/e|dB G2 ga|
 ba gb a^g|af de f=g|eB eg f/e/d|[e3c3] f ge|
 d<B G2 gf|ec Gg fe|dA FG A/B/c|B<G DG FG|
 EG ce d^c|dB GB DG|EG ce DF|G2 G2||`,
				`X:1
T:The First Draft
C:Siobhán Peoples
R:mazurka
L:1/8
M:3/4
N:This is my own transcription of a version of this tune by the group Fidil
N:(well, just the first time they play it through). Their setting of the tune is
N:lovely. I also like the meditative coda they added on – not given here in this
N:score.
N:You can hear it via a player on this page: https://www.itma.ie/scores/first-draft/
N:---
N:I chose to use more dots than is perhaps traditional when writing things down.
N:It may well not be to many people’s taste, but it’s how I wanted to do it. I
N:feel it’s better suited to getting down the swung rhythm and the variations more
N:precisely; I wanted to get closer to the variations and ornaments played in the
N:recording.
K:Gmajor
M:9/16
 L: 1/16
 |:D2G|B2c d/c/B2 c/B/A2|GB2 D2G F2G|E2G c2e d2c|B2G DGD .B,3|
 B2c d/c/B2 c/B/A2|GB2 D2G F2G|E2G ce2 D2F|1 .G3 G3:|2 .G3 (G3 G2)g||
 b2a g2b a2(^g|!tenuto!a2)f d2g f2g|ec2 e2f gfe|!tenuto!d2B (G3 G2)g|
 b2a g2b a2^g|a2f d2g f2g|eB2 e2g fed|.[e3c3] z2f g2e|
 d2B G2g f2g|ec2 G2g f2e|d2A F2z ABc|B2G D2G F2G|
 E2G c2e d2^c|d2B G2B D2G|E2G ce2 D2F|.G3 (G3 G2)g||
 b2a g2b a2^g|a2f d2g f2g|ec2 e2f gfe|d2(g {a}g2)f g2a|
 b2a g2b a2^g|a2f d2g f2g|eB2 e2g fed|e3 a3 g2e|
 d2B (G3 G2)g|ec2 G2g f2e|d2A F2G ABc|B2G D2G F2G|
 E3 cde d2^c|d2B G2B D2G|E2G ce2 D2F|.G3 G3||`,
				`X:1
T:The First Draft
T:with chords added by M. Schonfield, 2025-01-26
%T:(second score from https://www.itma.ie/scores/first-draft/)
C:Siobhán Peoples
N: 1. This is the first score here, with added chords. They may not be quite right, but 
N: should be better than nothing.
N: 3. I put a passing D chord on the third beat in a couple of places; it can 
N: played or left out, depending on how you feel.
R: Mazurka
M: 3/4
L: 1/8
K:G
DG | "G"Bc d/c/B cA | "G"G<B D2 GF | "C"EG ce dc | "G"BG [D2B,2] DG | "G"Bc d/c/B cA | "G"G<B DG FG |
"C"EG ce "D"DF | "G"G2 G2 :| ga | "G"ba gb a^g | "D"af d2 =gf | "C"ec ef g/f/e | "G"dB G2 ga |
"G"ba gb a^g | "D"af de f=g | "Em"eB eg "D"f/e/d | "C"[e3c3] f ge | "G"d<B G2 gf | "C"ec Gg fe | 
"D"dA FG A/B/c | "G"B<G DG FG| "C"EG ce d^c | "G"dB GB DG | "C"EG ce "D"DF | "G"G2 G2 ||`
			],
			references: [
				{
					url: "https://www.youtube.com/watch?v=S7JhPQI9Uew",
					artists:
						"Caitlín Nic Gabhann, concertina; Ciarán Ó Maonaigh, fiddle; Natalie Haas, cello",
					notes: `(2021; Galway) A version that’s quite close to the Fidil one; it also has some very pretty things going on on the cello.
More info in youtube - follow the link.`
				}
			],
			theSessionId: 23320,
			theSessionSettingId: 47650
		},
		{
			groups: "su",
			abc: `X:1
T:La Polverita Fiera
C:L. E. McCullough
R:mazurka
L:1/8
M:3/4
N:from "At The Racket" by "At The Racket"
N:this is the first Mazurka in the "The Tax Max Mazurkas"
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/15563#setting29178
N:Setting entered in thesession by user “Yooval” on 2016-09-26
K:Fmajor
AB|:cF Ac BA|GC EG BA|FG FE (3CB,A,|B,2 -B,B, A,B,|
 CA, CF AF|AB Bc BA|Gc BA BA|G4 AB|
 cF Ac BA|GC EG BA|FG FE (3CB,A,|B,2 -B,B AG|
 FA, CF AF|AB BA GF|Gc BG EC|F2- FA BA||
 GC BC AC|GC BC AC|GA GF EF|G2- GF FE|
 DF AF GA|Bc BA GF|Gc BG EC|F2-FA BA|
 GC AB AF|GC AB AF|GA GF EF|G2- GF FE|
 DF AF GA|Bc BA GF|Gc BG EC|F2-FG AB:|`,
			theSessionId: 15563,
			theSessionSettingId: 29178
		},
		{
			groups: "su",
			abc: `X:1
T:The Walking Stick
C:Tommy Peoples
F:https://youtu.be/1UhBWPM4uA8?t=62
S:Kevin Crawford, fiddle; Tommy Peoples, fiddle
D:In Good Company
R:mazurka
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1302#setting1302
N:Setting entered in thesession by user “gian marco” on 2003-01-06
N:(edited after importing)
K:Dmajor
|:(3AAA|d2 f2 ag|bg B2 (3ggg|fe Ac eg|fd A2 (3AAA|
 d2 f2 ag|bg B2(3ggg|fe Ac ec|d2d2:||:AF|
 D2 (3FGA df|a2 ge Ad|g2 fd Ad|(3fff dA FE|
 D2 (3FGA df|a2 ge Ad|fg fd AG|FA d2:|`,
			theSessionId: 1302
		},
		{
			groups: "su",
			abc: [
				`%abc-2.1
X: 1
T:Toonagh Mazurka
C:Eamonn Coyne
S:Eamonn Coyne
Z:abc-transcription Malcolm Schonfield%, 2018-11-19,26; 2024-12-04,05; 2025-01-28, 2026-02-12
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
R: Mazurka
N: 1. Mostly swung throughout – so in general “♪♪=♩♪”.
N: 2. I asked Eamonn Coyne about this tune and he told me it’s a version of a Tommy
N: Peoples tune that he learned from T. Peoples’ and T. Peoples’ daughter (Siobhán)’s playing. He 
N: never intended it to be a new tune of his.
N: 3. The T. Peoples tune in question is called the Walking Stick.
N: 4. I personally think this tune, or setting or variation of a T. Peoples tune, is sufficiently 
N: different from the T. Peoples tune to be considered as a different tune in its own right. 
M: 3/4
L: 1/8
K: D
P:Ⅰ
Dd fd ad | ba Bg g/g/g | fd Ac eg | f<d FA AA | 
Dd fd ad | ba Bg g/g/g | [M: 5/4] fd AG FA "_(V1)"dd AA |
[M: 3/4] Dd fd ad | ba Bg g/g/g | fd Ac eg | f<d FA AA | 
Dd fd ad | ba Bg g/g/g | fd AG FA || [P:Ⅱ]dA FE DD |
"_(V2)"ED Df aa| gd "_(V3)"(3Bcd gg | fd Ad ff| dA FE DD |
"_(V2)"ED Df aa| gd "_(V3)"(3Bcd gg| fd AG FA | dA FE DD |
"_(V2)"ED Df aa| gd "_(V3)"(3Bcd gg| fd Ad ff | dA FE DD | 
"_(V2)"ED Df aa| gd "_(V3)"(3Bcd gg| [M: 5/4] fd AG FA "_(V1)"dd AA!D.C.! |]
P:Variations / embellishments
"_(V1)"dA B/B/A ||"_(V2)"D/D/D || "_(V3)"Bd |]
`
			],
			references: [
				{
					artists: "Éamonn Coyne, banjo; Kris Drever, guitar",
					url: "https://www.youtube.com/watch?v=xGEHMm_zOgc",
					notes: `mazurka / highland / guns of the magnificent seven (reel)
live; 2012`
				},
				{
					artists:
						"Éamonn Coyne, banjo; Kris Drever, guitar; Megan Henderson, fiddle",
					url: "https://www.youtube.com/watch?v=czy3XDPzOLU",
					notes: "EP"
				}
			]
		},
		{
			abc: `
X: 1
T: John Doherty's Mazurka
S: John Doherty, fiddle
D: Bundle and Go
F: https://open.spotify.com/track/14llNbrqpfrhKkBB2Q94qx
N: * This is a “crooked” tune. It’s mostly in three, but there are two bars 
N: in two beats, in the middle.
N: * This is just a rough approximation of Doherty’s playing. No attempt is made
N: to get his decorations, embellishments, subtleties of phrasing etc which make up such a 
N: vital part of the music.
N: * Swing: sometimes two quavers are swung a bit here; and sometimes not!
N: * [A transcription](https://thesession.org/tunes/2497#setting15797) by ceolachan 
N: on thesession.org was used as a starting point.
N: * The track notes for the album are shared here: https://thesession.org/recordings/344#comment756354.
N: They have this info about this mazurka:
N: “Learned from the playing of a travelling Antrim fiddler, Francie Welsch or Walsh, 
N: this evocative tune is unique in the Irish tradition for its transition 
N: from ¾ mazurka signature to slip jig tempo.”
N: Perhaps the “slip jig tempo” parts mentioned are the C and D sections. I would perhaps prefer
N: to use the term “hop jig tempo”.
Z: abc-transcription Malcolm Schonfield % 2024-05-29; 2025-03-26
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
I:abc-charset utf-8
M: 3/4
L: 1/8
Q: 1/4=180
R: mazurka / hop jig
K: A
%swing 0.25 0
P:A
|: E AB | !segno! cd cE Ac | ea ec df | B2 Ba gf | fe e2 EA |
cd cE Ac | ea ec df | Bc BA GB | A2 A :| E Ac | 
P:B
e2 ec (3efg | a2 ab (3agf | e2 ea (3gfe | d2 dg (3fed | c2 cB Ac |
e2 ec (3efg | a2 ab (3agf | e2 ea (3gfe | d2 cB cd |[M:2/4] e2 B2 || 
P:C
[M:3/4]e^d eB ge | fa fB ^df | e^d eB ge | fa fB ^df | [M:2/4] ef de ||
P:D
|: [M:3/4] cd BA eA | cd BA eA | Bc B=G dG | Bd B=G dG |
cd BA eA | cd BA eA | !coda!GA Bc (3dBG |[1 A2 A2 ed :|[2 A2 A2 E2 !D.S.! |] 
P:E (coda)
!coda! GA Bc (3dBG | !fermata!A4|]
`
		},
		{
			abc: `X:1
T:An Feochán
C:Tommy Peoples
R:slow air
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/5182#setting5182
N:Setting entered in thesession by user “Red Crow” on 2005-11-11
K:Eminor
|:E>F G/E/-E|{A}B2{^c/B/}A>B|G<E d2|B/^c/d B/c/d|e>f d>f|
 e3 B|g>B f>B|ef|eB F>B|E4:|
 ee- ed/B/|b/^a/b- b2|ee- ed/B/|d2- de/f/|e2 {f/e/} dB|
 g>B f>B|e>f ed|B/^c/d- d>e|E/F/G- Ge|B(4c/B/A/G/ F>B|
 EE- E2|B|EF G>B|E>^cd2|`,
			theSessionId: 5182
		},
		{
			abc: `X:1
T:Ray's Classic
C:Willie Hunter
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-11-16,
N:from https://thesession.org/tunes/6170#setting36341
N:Setting entered in thesession by user “NfldWhistler” on 2019-10-19
K: Gmaj
|:G>F GD|EG D2|EA AG/A/|BA AB/A/|
G>F GD|EG D2|EA G/F/E/F/|1 G2 GB/A/:|2 G2 GB/c/||
|:d>e dG|e2 eB|Ae ed/e/|f>g f/e/d/c/|
Bf fe/f/|g2 f>e|dG A/G/A/B/|1 G2 GB/c/:|2 G2 GB/A/|| `,
			theSessionId: 6170
		},
		{
			groups: "alora",
			abc: `X:1
T:I Looked East And I Looked West
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/6015#setting6015
N:Setting entered in thesession by user “ceolachan” on 2006-07-24
K:Gmajor
|:GD|GB B/c/B/A/|FA AD|G>A Bc|d2 cA|
 GB B/c/B/A/|FA AB|cA FA|G2:|
 |:Bd|g2 fe|fA A>B|cd ef|g2 fe|
 dg fe|fA AB|cd/c/ BA|G2:|`,
			theSessionId: 6015
		},
		{
			groups: "alora",
			abc: `X:1
T:Daly's Mill
C:John Walsh
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/8918#setting8918
N:Setting entered in thesession by user “bogman” on 2008-09-14
K:Amajor
|:E|Ac ef|ec c/d/c/B/|Ac ef|e2 ec|
 Ac ef|ec c/d/c/B/|AF FE|A3:|
 |:d/e/|fe cB|AF FE|A>A Ac|e2 ed/e/|
 fe cB|AF FE|A>A AF|A3:|`,
			theSessionId: 8918
		},
		{
			abc: `X:1
T:Memories Of Ballymote
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1560#setting1560
N:Setting entered in thesession by user “Bannerman” on 2003-04-01
K:Gmajor
d/c/|:BG D>D|Ec cA/B/|cE F>E|Dd d/e/d/c/|
 BG D>D|Ec cA/B/|c/B/A/G/ F/D/E/F/|1 GB Gd/c/:|2 GB GB/d/||
 |:g2 f2|c7/ d/|ee dd|B3 B/c/|
 d>e dc|A2 AB/A/|1 G>A Bc|d2 de/f/:|2 Gg fa|g2 g||`,
			theSessionId: 1560
		},
		{
			abc: `X:1
T:The Trip To Sado
C:Dónal Lunny
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/8904#setting8904
N:Setting entered in thesession by user “bogman” on 2008-09-11
K:Eminor
|:G2 EG|DE GD|E/G/A GE|DG DE|AG/E/ GA|G/E/D GD/E/|GA/G/ EG|DE E2:|
 BA/G/ AE|DE GE|GA/G/ ED/E/|GE AG|BA/G/ AE|DG EG|GE GE|DE E2|
 BA/G/ AE|DG EG|GE GD|GE GG/E/|D/G/E D/E/G|EA GE|A/G/E GE|DE E2||`,
			theSessionId: 8904
		},
		{
			groups: "alora",
			abc: `X: 1
T:The Ballydesmond
R: polka
M: 4/4
L: 1/8
K: Ador
|: "C"!tenuto!cd/c/ "G"!tenuto!Bc/B/ "Am"!tenuto!AB/A/ "Em"!tenuto!G>A| "G".Bd. ed "Em"(ga/g/) .ed|
"Am".ea g>e "G".dB GA/B/ |"C".ce "Em".dB "Am"A2A2:|
"Am".ea ag/e/ "G".dg g>d |"Am".ea ab "Em"(ga/g/) .ed|
"Am".ea g>e "G".dB GA/B/ |"Am".ce "Em"dB "Am"A2A2:|`,
			theSessionId: 239
		},
		{
			abc: `X:1
T:The Frozen Mouse
C:Jason O’Rourke
R:polka
L:1/8
M:2/4
N:Belfast concertinist Jason O’Rourke wrote this polka. He recorded it in his
N:second solo album "The Northern Concertina" (2015), in the middle of a set of 3
N:polkas (the two other are traditional). First part in G, second part in Dmix,
N:nice !
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/18688#setting36502
N:Setting entered in thesession by user “fiddlebzh” on 2019-11-07
K:Gmajor
|:B>c de|dB Bd|cA AB/d/|ed BA|
 B>c de|de/d/ Bd|cA DF|AG G2:|
[K:D mix]F>G AB|cA AG|Ad cA|AG FD|
 F>G AB|1 cA AG|Ad cA|G2 G2:|
 [2 cA c/d/e|dc AF|G2 G2||`,
			theSessionId: 18688,
			theSessionSettingId: 36502
		},
		{
			abc: `X:1
T:Forde's
R:polka
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/8541#setting8541
N:Setting entered in thesession by user “gian marco” on 2008-05-17
N:*abc-tools: convert to M:4/4*
K:Dmajor
|:AD FA dc AB|=c>B cE EF GF/G/|
AD FA dc AB|=c>B cE[1 ED D2:|2 ED D>e||
fd ed cA Ad/e/|fd ef ag ef/g/|
fd ed cA AB|=c>B cE[1 ED D>e:|2 ED D2||`,
			references: [
				{
					url: "https://music.youtube.com/watch?v=HKx_-xusj_s",
					artists: "Jason O’Rourke, concertina",
					album: "The Bunch Of Keys",
					notes: `The first tune on a track entitled “Two Polkas”. Well worth a listen!`
				}
			],
			theSessionId: 8541
		},
		{
			abc: `X:1
T:J. B. Milne
C:Angus Fitchet
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3479#setting3479
N:Setting entered in thesession by user “jakki S” on 2004-09-02
K:Gmajor
B>c|:d/e/d/c/ BG|DG B2|B/d/c/B/ AG|c2 A>B|
 c/d/c/B/ AF|DF A2|B/c/B/A/ GA|B2 B>c|
 d/e/d/c/ BG|DG B2|B/d/c/B/ AG|e2 e>f|
 g/e/c/G/ E/G/c/e/|e/d/B/G/ D/G/B/d/|d^c =cf/a/|g2 B>c:|
 |:dB eB|dB eB|d^c/d/ e/d/=c/B/|c2 A>B|cA dA|
 cA dA|cB/c/ d/c/B/A/|B2 B>c|dB eB|
 dB eB|gf/g/ a/g/f/g/|e2 e>f|g/a/g/f/ e/g/f/e/|
 e/d/B/G/ D/G/B/d/|d^c =cf/a/|1 g2 B>c:|2 g2 z2||`,
			theSessionId: 3479
		},
		{
			abc: `X:1
T:Tripping On The Mountain
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/564#setting564
N:Setting entered in thesession by user “Josh Kane” on 2002-02-25
K:Dmajor
|:dA FA|dc d/e/f/e/|dA FA|Be ef/e/|
 dA FA|dg fe|d/B/A/F/ A/B/d/e/|1 fd df/e/:|2 fd df/g/||
 |:af ge|fd df/g/|af g/f/g/a/|be ef/g/|
 af ge|fd fe|d/B/A/F/ A/B/d/e/|1 fd df/g/:|2 fd d||`,
			theSessionId: 564
		},
		{
			abc: `X:1
T:Captain Bing
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/8624#setting8624
N:Setting entered in thesession by user “swisspiper” on 2008-06-17
K:Gmajor
|:g>f gd|BG GA/B/|c/B/A a>g|fd ef|
 g>f gd|BGGA/B/|c/B/A dF|G2 G>d:|
 BG dG|BG GA/B/|c/B/A eA|cAA>c|
 BG dG|BG GA/B/|c/B/A dF|G2GA:|`,
			theSessionId: 8624
		},
		{
			abc: `X:1
T:Walsh's
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2105#setting2105
N:Setting entered in thesession by user “gian marco” on 2003-10-31
K:Dmajor
|:f|a2 af/a/|ba fa|g2 Bc|ed c/B/A|
 a2 af/a/|ba fa|g2 Bc|ed d:|
 |:e|f>e fe|dc BA|g>f ga|ba f/g/a|
 f>e fe|dc BA|g2 Bc|ed d:|`,
			theSessionId: 2105
		},
		{
			groups: "alora",
			abc: `X:1
T:Eklundapolska nr 3
C:Viksta-Lasse
R:Polska
O:Sweden; Uppland.
Z:Erik Ronström 2008-01-31
F:https://youtu.be/wS-iUNnb_wU?t=23
N:Youtube: Erik Svansbo
N:this abc comes from http://www.folkwiki.se/Musik/96
M:3/4
L:1/16
K:G
"G" g2fg b2g2 d2B2|"C" cBcd egec A2c2|"G" B2AB "C" cdcA "G" BcBG|"D7" A2d2 d8|
"G" g2fg b2g2 d2B2|"C" cBcd egec A2c2|"G" B2AB "C" cdcA "G" BcBG|"D7" ABAF "G" G8:|
[|"G" [DB]3[DB] [Dc]2[Dc]2 [DB]2[DB]2|"D7" A2d2 d8|"G"[DB]3[DB] [Dc]2[Dc]2 [DB]2[DB]2|"D7" ABAF D8|
"G" [DB]3[DB] [Dc]2[Dc]2 [DB]2[DB]2 |"D7"A2d2 d8|"G"G2AB "C"cdcA "G" BcBG|"D7"ABAF "G"G8 ||
"Em" [EB]3[EB] [Ec]2[Ec]2 [EB]2[EB]2|"D7"A2d2 d8|"Em" [EB]3[EB] [Ec]2[Ec]2 [EB]2[EB]2|"D7"ABAF D8|
"Em" [EB]3[EB] [Ec]2[Ec]2 [EB]2[EB]2|"D7"A2d2 d8|"G" G2AB "C" cdcA "G" BcBG|"D7"ABAF "G" G8|]
`
		},
		{
			groups: "ALORA",
			abc: `% Bransle d’écosse — détournée, à 3 temps
X: 1 
T: Bransle d'Écosse — déstructurée ; à 3 temps
C:Malcolm Schonfield %2025-07-29, 2025-09-05, 2025-10-02
M: 3/4
R: polska?
L: 1/8
P:ABAC
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
K: E dorian
[P:A]|: "Em"EF GE "Em"FG | "D"AG FE "D or Bm"GA |  "Em" Bd "D"cB (3AGF |
        "Em"EF GE "Em"FG | "D"AG FE "D or Bm"GA |  "Em" (3BAG "Bm"FE FD :|
[P:B]|: "Em"B2 Bc "D"dc | "Em"B2 AG "D" FE | "Em"B2 AG "D" FE | 
        "Em"B2 Bc "D"dc | "Em"(3BAG "Bm"FE FD :|
[P:C]|: "Em"B2 Bc "D"dc | "Em"B2 AG "D" (3BAG | "Em"FE Bc "D"dc | "Em"(3BAG "Bm"FE FD :|`
		},
		{
			abc: `X:1
T:Kringelleken
Z:Malcolm Schonfield%230427,250325,251025
N:On the recording, it’s played “ABABA2BC”
R:Polska?
O:Sweden
S:Per Gudmundson, fiddle; Bengan Janson, accordion
D:Hjeltamôs
F:https://music.youtube.com/watch?v=m8mfkFcY17Q
M:3/4
Q:1/4=140
L:1/8
K:Dmajor
P:ABABA2BC
[P:A]d2 Pce d2 | eg fe d2 | eg fa/f/ [1,3 dd | ed BG A2 :| [2 de | cd d3A :| [4 de | cd d3f ||
|: [P:B]ag bf af/e/ | f>a f2 df | ag bf af/e/ | f>a f2 df | eg fe df/e/ | ed BG A2 | 
a>g bf af/e/ | f>a f2 df | eg fe de |[1 cd d3f :| [2 c<d d3"<("">)"A !D.C.! |]
[P:C (la dernière fois)]|: d2 ce d2 | eg fe d2 | eg fa/f/ [1 dd | ed BG A2 :| [2 de | cd !fermata!d4 |]
`
		},
		{
			abc: `X:1
T:The Red Crow
C:Mairéad Ní Mhaonaigh
R:reel
L:1/8
M:4/2
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/184#setting184
N:Setting entered in thesession by user “Will Harmon” on 2001-07-03
N:(edited after importing)
K:Adorian
|:A,2EA, B,G,G,B, (3A,A,A, EG FDEG|AGED EA,A,D ECDC B,G,G,B,|
(3A,A,A, EA, B,G,G,B, (3A,A,A, EG (3FFD EG|
[1 AGED EA,A,C DB,G,B, A,2 (3G,A,B,:|2 AGED EA,A,C DB,G,B, A,2 (3AAA||
A2eA ceAc eAce dcBA|(3GGG dc BdGB dGBd edcB|
(3AAA eA ceAc eAcb ageg|age^c d=fed (3cBA BG A2AG|
A2eA ceAc eAce dcBA|(3GGG dc BdGB dGBd edcB|
(3AAA aA gAfA (3AAA cA BAGB|(3cBA BG AGED ECDB, CA,B,G,||`,
			theSessionId: 184
		},
		{
			abc: `X:1
T:The Green Fields Of Glentown
C:Tommy Peoples
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/671#setting671
N:Setting entered in thesession by user “Kuddel” on 2002-05-04
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Adorian
|:EA,~A,2 E2DB, G,B,~B,2 G,A,B,D|EA,~A,2 E2DE GBeB dBAB|
eB~B2 eBdB AE~E2 DG,B,G,|A,E~E2 E2DE GEDB, B,A,~A,2:|
|:A2EA cAEA G2DB, G,A,B,D|EA~A2 GABd edBA aged|
bg~g2 afge dB~B2 GEDB,|A,E~E2 E2DE GEDB, B,A,~A,2:|
|:A2EA cAEA aged bage|dG~G2 DGBd gded Bdgd|
e2Be eBdB AE~E2 DG,B,G,|A,E~E2 E2DE GEDB, B,A,~A,2:|`,
			theSessionId: 671
		},
		{
			abc: [
				`X: 14
T: Christmas Eve
T: version as of 2025-12-05
C:Tommy Coen
Z:abc-transcription Malcolm Schonfield
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
R: reel
M: 4/4
L: 1/16
K: Gmaj
|:GE|"G/B" ~D3E ~G3A B2dB ABGB|"C"ABGE ~D3E "C"G2BG ABGE|
"G/B"~D3E ~G3A B2dB ABGA|"C"B~A3 GEBG "C"ABGE G2:| 
|:GA|"G/B"BGBd edeg "C"abge g2eg|"C"a3f g2ge "C"dedB "D"A2GA | 
"G/B"BGBd ~e3g "C"abge g2eg |"C"abge ~d3B "D"ABGE G2:| 
|:dc|"G/B"B~G3 BGBd "C"e~g3 egdc|"G"B~G3 DGBG "Am"EAAG A2dc|
"G/B"B~G3 BGBd "C"e~g3 g3a|"C"bgaf gedB "D"ABGF G2:|`,
				`X: 14
T: Christmas Eve
T: version as of 2025-12-01
C:Tommy Coen
Z:abc-transcription Malcolm Schonfield% 2025-11-13, chords from 2025-10-23
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
R: reel
M: 4/4
L: 1/16
K: Gmaj
|:GE|"G/B" ~D3E ~G3A B2dB ABGB|"C"ABGE ~D3E "C"G2BG ABGE|
"G/B"~D3E ~G3A B2dB ABGA|"C"BAGE D2BG "C"ABGF G2:| 
|:GA|"G/B"BGBd edeg "C"a2ge g2eg|"C"a3f g2ge "D"dedB A2GA | 
"G/B"BGBd ~e3g "C"abge g2eg |"D"abge ~d3B "D"ABGE G2:| 
|:dc|"G/B"B~G3 D2Bd "C"e~g3 egdc|"G"B~G3 DGBG "Am"E~A3 F~A3|
"G/B"B~G3 BGBd "C"e~g3 g3a|"D"bgaf gedB "G"ABGF G2:|`,
				`X: 14
T: Christmas Eve
T: version with rolls; 2025-11-13
Z:abc-transcription Malcolm Schonfield% 2025-11-13
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
R: reel
M: 4/4
L: 1/16
K: Gmaj
|:GE|~D3E ~G3A B2dB ABGA|BAGE ~D3E G2BG ABGE|
~D3E ~G3A B2dB ABGA|B~A3 G~E3 ABGE  G2:| 
|:GA|BG (3Bcd ~e3g a2ge g2eg|a2ge g2ge dedB A2GA | 
BG (3Bcd ~e3g abge g2eg | abge ~d3B ABGE G2:| 
|:dc|B~G3 BGBd e~g3 egdc|B~G3 DGBG E~A3 A2dc|
B~G3 BGBd e~g3 g3a|bgaf gedB ABGE G2:|`,
				`X: 14
T: Christmas Eve
R: reel
M: 4/4
L: 1/16
K: Gmaj
N:based on a score by MarMac on thesession.org
GE|:DB,DE G2GA B2dB ABGA|BAGE DB,DE G2BG ABGE|
DB,DE GFGA B2dB ABGA|BAAB G~E3 [1 ABGF G2EG:| [2 ABGF G2GA||
|:BG (3Bcd edeg a2ge g2eg|a2ge g2ge dedB A2GA | 
BG (3Bcd edeg abge g2eg | abge dBGB [1 ABGF ~G3A:| [2 ABGF G2dc||
|:BG (3GGG BGBd eg (3ggg egdc|BG (3GGG DGBG FAAG FAdc|
BGGA BGBd eg (3ggg gfga|bgaf gedB [1 ABGF GAdc:| [2 ABGF G2GE||`
			],
			groups: "ALORA",
			origin: "Ireland",
			references: [
				{
					artists:
						"Caitlín Nic Gabhann, concertina; Ciarán Ó Maonaigh, fiddle; Cathal Ó Curráin, Bouzouki",
					url: "https://caitlinciaran.bandcamp.com/track/the-drunken-landlady-christmas-eve-the-abbey-reel",
					notes: `1:48 onwards
The Drunken Landlady / Christmas Eve / The Abbey Reel`
				},
				{
					artists: "Fintan Vallely, flute; Mark Simos, guitar",
					url: "https://fintanvallely.bandcamp.com/track/christmas-eve-the-reel-of-rio-2",
					notes: "Christmas Eve / The Reel of Rio"
				},
				{
					artists:
						"“The Vashon Sessions” - flute, button accordion, fiddle, guitar, octave mandolin, percussion",
					url: "https://thevashonsessions.bandcamp.com/track/christmas-eve-reel-of-mullinavat-bucks-of-oranmore",
					notes: "Christmas Eve / Reel of Mullinavat / Bucks of Oranmore"
				},
				{
					artists: "Micho Russel, flute",
					url: "https://youtu.be/1FUi3f3pDFc",
					notes:
						"album: Rarities & Old Favorites 1949–1993: Tin Whistle, Flute & Songs from North Clare & Beyond"
				},
				{
					artists: "Sonny Murray, concertina",
					url: "https://music.youtube.com/watch?v=MNscUYF0ybU",
					notes: "album: It Was Mighty! the Early Days of Irish Music in London"
				}
			],
			theSessionId: 440,
			theSessionSettingId: 48642
		},
		{
			abc: `X:1
T:Mick O'Connor's
C:Mick O'Connor
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4198#setting4198
N:Setting entered in thesession by user “Limeretti Lumeretti Hillhocker” on 2005-02-04
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Dmajor
|:A,B,DE FDED B,EED EDB,D|A,B,DE FABc dBAG FDDD|
A,B,DE FDED B,EED EDB,E|A,B,DE FABc dBAG FDDD:|
|:d2fd adfd edBd edBA|defa defa e2de fddc|
d2fd adfd edBd edBA|faab afdf[1 gefd e4:|2 e2de fdd2||`,
			theSessionId: 4198
		},
		{
			abc: `X:1
T:The Reel Of Rio
C:Sean Ryan
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/575#setting575
N:Setting entered in thesession by user “laura nesbit” on 2002-03-03
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gmajor
|:GE|DEGA BABd egg2 agef|gede gedB AcBA GEE2|
DEGA BABd egg2 agef|gede gedB AcBA G2:|
|:Bc|dgg2 bgg2 bgag edBd|eBB2 GABd e2dB AGEG|
DEGA BABd egg2 agef|gede gedB AcBA G2:|`,
			theSessionId: 575,
			references: [
				{
					notes: "see also: Christmas Eve"
				}
			]
		},
		{
			name: "Paddy on the Turnpike – crooked settings",
			abc: [
				`X:1
T:Paddy on the Turnpike 
T:as played by Fidel Martin
S:Fidel Martin, fiddle
O:USA
M:4/4
Q:1/4=110
L:1/16
R:reel
N:Probably was played on a fiddle tuned one tone down from the standard tuning.
F: https://bmac.libs.uga.edu/index.php/Detail/objects/331630
D:UGA Brown Media Archives: identifier artrosen_00180 (Track 3 -29:03 of the tape)
Z:abc-transcription Malcolm Schonfield (using A. Kuntz’s transcription 
Z:as a starting point)%2024-06-26, 2025-11-21
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
K:Fmajor
P:A
FD||SCFCF F_EFF AFcF dFcF|CD_EF EDEE (CE)BE cEBE|
CFF_E {FE}F2FG Acde f-eff|[M:3/4] cABG ABG_E F2FD|
[M:4/4]CFCF F_EFF "*"AFcF dFcF|CD_EF ED(E/D/E) (CE)BE cEBE|
CFF_E {FE}F2FG "**"Acde f2{g}fd|[M:3/4]cABB AcG_E F2Ac | 
P:B
[M:4/4]dfeg feff afcf afcf|dgdg edee gece gece|
dfeg {g}f-e(f/e/f) afcf afcf| [M:5/4]d(cAc) fgff cABG AFGE F2Ac | 
[M:4/4]dfeg feff afcf afcc|dgdg {ef}edee gece gece|
dfeg (f/g/f/e/)ff afcf afcf|[M:5/4]!coda!d(cAc) fgfd cABG (A/B/G/A/)GE .Fz FDS||
P:Substitution
"*"AccA dAcA||"**"Acde fe(f/e/f)||
P:Coda
[M:5/4]!coda!d(cAc) fgfd cABG (A/B/G/A/)GE .F2z2|]`,
				`X:5
T:Paddy on the Turnpike
T: as played by Manco Sneed
S:Manco Sneed, fiddle
M:4/4
L:1/16
R:reel
D:Field Recorders Collective FRC 505, "Byard Ray, Manco Sneed & Mike Rogers" (2006).
N:Manco Sneed (1885-1975, Jackson & Graham Counties, western N.C.)
N:Recorded by Peter Hoover in the 1960’s.
F:https://www.slippery-hill.com/recording/paddy-turnpike-2
Z:Transcribed by Andrew Kuntz; then edited (time signatures & bars) by Malcolm Schonfield%2024-12-10
K:Gmixo
GF|:!segno!D2GA G2GF DFGA BAGG|DFFG F2DF CFDF- GFDC|
DFGA G3A Bcd2 ^f2d2 | [M:2/4] !slide! BAGB AG^FA|1[M:1/4]G2GF:|2 [M:2/4] G2G4 
|: g2-|[M:4/4]gage dg2a g2g2 Bcde | fed2 edce d4(3DE^F GA|
[M:3/4]Bcd(e fe)d(f e)d-d(A|[M:2/4] B)AGB AG^FA|1G2 G4:|2 [M:1/4]G2GF!D.S.!|]`
			],
			badges: "crooked"
		},
		{
			abc: `X:1
T:Gallow's Hill
C:Kevin O'Connor
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/7898#setting7898
N:Setting entered in thesession by user “Yvan” on 2007-10-23
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Bminor
|:FBBA B2FB dBcB BAFA|EAdB cAAc dBcA BAGA|
FBBA B2FB dBcB BAFA|EAdB cAAc dBcA ~B2BA:|
K:Bdor
effe f2Bf fece gaec|A2Aa geea ~f3a edcd|
~B3f fece ~f3g afec|A2af geea f2ec ABBA|
~f4 fece ~f3g afec|A2af geea ~f3a edcd|
~B3f fece ~f3g afec|A2af geea f2ec ABBA||`,
			theSessionId: 7898
		},
		{
			abc: `X:1
T:The Bunch Of Keys
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/344#setting344
N:Setting entered in thesession by user “Will Harmon” on 2001-10-30
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gdorian
|:DGGF G2Ac BG (3GGG dGBG|DFFE EF2B A~F3 DFAF|
DGGF G2Ac BGGA Bcde|~f3d cAFA[1 ABAF DGGF:|2 BGAF DGGA||
|:dgg^f fgdg (3ggg dg agfd|cffe efcf (3fff ag fAcf|
dgg^f fgdg (3ggg dg agfd|c~f3 cAFA[1 BGAF DGGA:|2 BGAF DGGF||`,
			references: [
				{
					artists: "John Joe Gardiner, fiddle; Moya Acheson, piano",
					url: "https://www.itma.ie/blog/lesser-known-musicians-of-the-78-rpm-era/?track=9",
					notes: `(78 rpm) The mountain top; Lord Wellington’s [The bunch of keys]
Gardiner, John Joe, 1893-1979`
				}
			],
			theSessionId: 344
		},
		{
			groups: "su",
			abc: `X: 7
T:The Guns Of The Magnificent Seven
R: reel
M: 4/4
L: 1/16
N: a crooked tune
K: Ador
EAAG ABcA EAFA GEDG|EAAG ABcd egdB [1 BAAG:| [2 BAA2 ||
|:ABcd eAA2 gedc BAGB|ABcd eaaf gedB BAA2 :|
|: [M:7/8] e/f/gdBA2 e/f/gdB GABd|[M:4/4]eBdA a3f gedB [1BAA2 :| [2 BAAG !D.C.! |]`,
			theSessionId: 40,
			badges: "crooked"
		},
		{
			abc: `X:1
T:Kiss The Maid Behind The Barrel
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/676#setting676
N:Setting entered in thesession by user “Josh Kane” on 2002-05-10
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gmajor
|:DG~G2 AG (3GGG DG~G2 cAFA|DG~G2 ADFA defd cAFA:|
dg~g2 aggf dg~g2 agfe|df~f2 af~f2 defd cAFA|
dg~g2 agfg a2ag ~f2fg|afge fde^c d2eg fdcA||
G2dG BGdG ~G2dB cAFA| G2dG BGBc defd cAFA|
G2dG BGdG ~G2dB cAFA| ~B3G ADFA defd cAFA||
B3G ~A2AG BABd gedc|B2GB ADFA defd cAFA|
B3G ~A2AG BABd gedc|BG~G2 ADFA defd cAFA||`,
			theSessionId: 676
		},
		{
			abc: `X:1
T:Sweeney's Buttermilk
C:Brendan McGlinchey
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/556#setting556
N:Setting entered in thesession by user “barney morgan” on 2002-02-20
N:*abc-tools: convert to M:4/4 & L:1/16*
N:(edited after importing)
K:Bminor
|:FBB2 fBB2 dcBc AEE2|FBB2 ABce afec Ba^ga|
  f3a  fecf ecc2 BAFE|FBB2 ABce afec B2BA:|
|:FBdc BFF2 EAcB AE E2|FBdB cefb afec d3c|
  Bcde fBB2 afec ABce|f2bf afea afec B2BA:|`,
			theSessionId: 556
		},
		{
			groups: "su",
			incipit: `X: 1
T: Paddy Canny's Toast
C:Charlie Lennon
R: reel
M: 4/4
L: 1/16
K: Gdor
FGcG dGcG EFcF dFcF|FGcG`,
			theSessionId: 541
		},
		{
			incipit: `X:1
T:Paddy Canny's Toast
C:Frankie Gavin
R:reel
L:1/16
M:4/4
K:Gdor
GF|DG~G2 dGcG dGcA GFDC|DG~G2`,
			theSessionId: 675
		},
		{
			abc: `X:1
T:The Girl In Danger
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2120#setting2120
N:Setting entered in thesession by user “Peter Piper” on 2003-11-05
N:(edited after importing)
K:Adorian
[M:5/4]EAAB cABd cABA G2GF GAGD | [M:4/4]EAAB cABd cABG [1 EAAG :| [K:A mixo] [2 ABcd ||
 |: eeec d2cd efec d2cd|[1 eeec dfed cABG A2cd:| [2 eage dged [K:Ador] cABd cABG||
 `,
			theSessionId: 2120
		},
		{
			abc: `X:1
T:Dowd's Favourite
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/229#setting229
N:Setting entered in thesession by user “JD” on 2001-08-08
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gdorian
|:F|DGGA BABF DFF2 DFCF|DGGA BABd cAfA AGG:|
A|B2dB fBdB B2dB cAFA|B2dB fBdB cAFA BGGA|
B2dB fBdB B2dB cAFA|BAGF Ggge fdcA BGG||
z|gdd2 g2ag fcc2 fcAc|gdd2 g2ag fdcA BGG2|
gdd2 g2ag fcc2 fcAF|GABc dgge fdcA BGG||`,
			theSessionId: 229
		},
		{
			abc: `X:1
T:Master Crowley's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/281#setting281
N:Setting entered in thesession by user “Will Harmon” on 2001-09-13
K:Edorian
|:B,E (3EEE B,EFE|EDB,D A,DFD|B,E (3EEE B,EGB|AFDE FEED|
 B,E (3EEE B,EFE|EDB,D A,DFD|B,E (3EEE B,EGB|1 AFdF FEED:|2 AFdF FEEA||
 |:Bbab fgeg|fd (3ddd Adfd|Bbab fgeg|fdAF FEEA|
 Bbab fgeg|fd (3ddd Adfd|EFGA BABd|1 AFdF FEEA:|2 AFdF FEED||`,
			theSessionId: 281
		},
		{
			incipit: `X:1
T:The Moving Clouds
O:Ireland; Donegal.
C:Néillidh Boyle
F: https://donegalfiddlemusic.bandcamp.com/album/a-feeling-in-the-blood
N:1. Composed in 1942.
N:2. The album [A Feeling In The Blood](https://donegalfiddlemusic.bandcamp.com/album/a-feeling-in-the-blood) has
N: several recordings of the composer playing his tune. They were are real eye-opener to me and I’m very fond
N: of them; N Boyle has a unique way of playing. His playing may not be to everyone’s taste these days of course – pity!
N:3. It’s quite unlike the standard setting, which is often heard these days. For me they could be seen as 
N: two separate tunes, even though there’s a very strong link between them.
M:4/4
L:1/16
R:Reel
K:Dmin
CFAF DFAF CFAF cFAF | GddG (^cd)Gd dGAd c/B/AF/E/D |`,
			theSessionId: 1091,
			theSessionSettingId: 14333
		},
		{
			abc: `X:1
T:Shamrock Hill
C:Sean Ryan
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2584#setting2584
N:Setting entered in thesession by user “Conway” on 2004-02-29
K:Gmajor
|:DGBG dGBG|~c3 d efga|bg ~g2 agef|gedB AGEG|
 DGBG dGBG|~c3 d efga|bg ~g2 aged|1 cAFA ~G3 E:|2 cAFA G2 ga||
 |:bg ~g2 agef|gedB AGEG|DB, ~B,2 DEGA|Bdgb ageg|
 bg ~g2 agef|gedB AGEG|DB, ~B,2 DEGA|1 BdAF G2 ga:|2 BdAF ~G3 E||`,
			theSessionId: 2584
		},
		{
			abc: `X:1
T:The Man Of Aran
C:Darach De Brun
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/973#setting973
N:Setting entered in thesession by user “Mark Cordova” on 2002-09-18
K:Bminor
|:FBfe dB (3BBB|Aced cA A2|FBfe dB B2|FB B2 cB B2|
 FBfe dB B2|ce e2 ce e2|f3e dB B2|cedc dB B2:|
 |:df f2 df f2|ce e2 ce e2|df f2 df f2|c2ec dB B2|
 dfaf dfaf|cege cege|dfeg fB B2|f3e fedc:|`,
			theSessionId: 973
		},
		{
			abc: `X:1
T:Sporting Paddy
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/430#setting430
N:Setting entered in thesession by user “Josh Kane” on 2001-12-09
K:Gmajor
EAAB GABG|EAAB G2ED|EAA2 GABd|edge dBAG|
 EAAB GABG|EAAB G2ED|EAA2 GABd|edge d2ef||
 geee gede|geee a2ba|gee2 ged2|efge d2ef|
 geee gede|geee a2ga|bgab gabg|efge dBAG||`,
			theSessionId: 430
		},
		{
			abc: `X:1
T:The Fly Fishing
C:Jackie Daly
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/313#setting313
N:Setting entered in thesession by user “Zina Lee” on 2001-10-07
K:Amajor
A2-|:AGEC D2 CD|EA,A,B, CD EC|DECE D2 CD|EAAc B2 cB|
 AGEC D2 CD|EA,A,B, CD EC|DECE D2 CD|EA-AG A2 AB:|
 |:c2 ec Acec|=Gcec F2 FE|DEFA dAFA|GBef edcB|
 c2 ec Acec|=Gcec F2 FE|DEFA dAFA|GBAG A2 AB:|`,
			theSessionId: 313
		},
		{
			abc: `X:1
T:The Humours Of Tulla
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/141#setting530
N:Setting entered in thesession by user “Josh Kane” on 2002-01-31
K:Gmajor
|:G2DG EGDE|G2BG AGEF|G2DG EGDG|(3EFG AB c2BA:|
 |:dBAB GB~B2|dB~B2 c2Bc|dBAB GBAB|(3EFG AB c2Bc:|`,
			contourShift: 0,
			parts: "AB",
			theSessionId: 141,
			theSessionSettingId: 530
		},
		{
			abc: `X:1
T:Maudabawn Chapel
C:Ed Reavy
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/302#setting302
N:Setting entered in thesession by user “Will Harmon” on 2001-10-01
N:*abc-tools: convert to M:4/4 & L:1/16*
N:(edited after importing)
K:Gmajor
|:G3D E2DB, G,A,B,D EGDB,|G,A,B,D GABd gabg eaaf|
gbag efge dged B^cde|g2fa gedB AcBA GEED:|
|:E2BE dEBE Ed^cB AFDF|~E3F GFGB AF (3FFF DFAF|
EBBA B3B BAGA B^cde|f2af gfe^c dBAF GEED:|`,
			contourShift: 1,
			theSessionId: 302,
			norbeckId: 62,
			parts: "AABB"
		},
		{
			abc: `X:1
T:The Abbey
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/477#setting477
N:Setting entered in thesession by user “Josh Kane” on 2002-01-01
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Adorian
|:B|A3B A2GE A2GA BddB|A3B AGEF G3A Bdd:|
g|egg2 a2ba gabg aged|egg2 a2ga bgaf gedg|
egg2 a2bg agbg aged|egg2 a2ga bgaf ged|`,
			theSessionId: 477
		},
		{
			abc: `X:1
T:Jerry McMahon's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4263#setting4263
N:Setting entered in thesession by user “gian marco” on 2005-02-27
K:Adorian
|:A2AG A2cA|EGDE GEDG|EAAG ABcd|1 e/f/ged eAdc:|2 edcA G3^G||
 Addc d2cA|d2cA G2EG|Addc AB^cd|1 e/f/ged cAGG:|2 e/f/ged cAdc||`,
			theSessionId: 4263
		},
		{
			abc: `X:1
T:The Humours Of Loughrea
C:Tommy Whelan
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1767#setting1767
N:Setting entered in thesession by user “Kenny” on 2003-06-20
K:Gmajor
G2 GA BA A2|bgag egdB|G2 GA BAGE|ABAG EDB,D|
 G2 GA BA A2|bgag egdB|G2 GA BAGE|ABAG ED D2||
 g2 eg fdBd|ge e2 gaba|ge e2 edBd|egfg edef|
 g2 fg edBd|ge e2 gaba|g2 ge a2 af|dgbg egdB||`,
			theSessionId: 1767
		},
		{
			abc: `X:1
T:The Trip To Durrow
C:Dan Cleary
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/891#setting891
N:Setting entered in thesession by user “SPeak” on 2002-08-12
K:Dmajor
|:D2DF ADFA|dfed B3c|dBBA dBBA|FADE FE E2|
 D2DF ADFA|dfed B3c|dBBA FAdB|AFEG FD D2:|
 |:dcde fefg|afdf gfed|(3Bcd ef gebe|gebe gfef|
 d2de fefg|afdf gfed|(3Bcd ef gbag|fdec d2de|
 fdec d2de|fded B3c|dBBA dBBA|FADE FE E2|
 D2DF ADFA|dfed B3c|dBBA FAdB|AFEG FD D2:|`,
			theSessionId: 891
		},
		{
			abc: `X:1
T:Sonny's Delight
C:Nora Hurley
R:reel
L:1/8
M:4/4
N:A lovely reel composed by Nora Hurley, played on the Doireann Glackin and Sarah
N:Flynn album The Housekeepers. Those long lonesome notes...
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/20851#setting41404
N:Setting entered in thesession by user “benhockenberry” on 2021-06-03
K:Cdorian
C2DB,C2DF|GFGAB4-|BcBA F2BA|FDB,C DCCB,|
 C2DB,C2DF|GFGAB4-|BcBA F2BA|FDCDB,4|
 E3D C2DB,|CDFGB4-|BcBA F2BA|FDB,C DCCB,|
 C2DB,C2DF|GFGAB4-|BcBA F2BA|FDCDB,4||
 |:Gccc B3c|dcBG cAGF|GccB c2Bc|dcBG c3e|
 dGBG cAGA|BcBA FDB,C|DFFF GABG|FDCD B,4:|`,
			theSessionId: 20851,
			theSessionSettingId: 41404
		},
		{
			abc: `X:1
T:That's Right Too!
C:Liz Carroll
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1703#setting1703
N:Setting entered in thesession by user “Kenny” on 2003-05-28
K:Dmajor
|:D2 EF ED D2|d2 ef edBA|D2 FA FEED|BcdD FE E2|
 D2 FA FEED|d2 ef edfd|BD D2 Bd d2|AFEF D4:|
 |:afef d2 dB|A2 FD EDDb|afef d2 da|efae f2 fe|
 d2 ef edBA|BcdD FE E2|BD D2 Bd d2|AFEF D4:|`,
			theSessionId: 1703
		},
		{
			abc: `X:1
T:The College Groves
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1272#setting1272
N:Setting entered in thesession by user “fidicen” on 2002-12-30
K:Dmajor
D2 (3FED ADFD|E2=cE dEcE|(3DDD FA dfed|cAGE {F}EDCE|
 D2 (3FED ADFD|E2=cE dEcE|(3DDD FA dfed|cAGE {F}EDD2||
 fd (3ddd fagf|e=c (3ccc efge|fd (3dcd dfed|cAGE {F}EDD2|
 fd (3ddd fagf|e=c (3ccc efge|dfeg (3fga gb|afge fdd2||
 fa{b}ag fddf|efgf e=cc2|fa{b}ag fded|cAGE {F}EDD2|
 fa{b}ag fddf|efgf e=cc2|dfeg (3fga gb|afge fdd2||
 f2df f2df|~e2=ce ~e2ce|f2df f2ed|cAGE {F}EDD2|
 f2df f2df|~e2=ce ~e2ce|dfeg (3fga gb|afge fdd2||`,
			theSessionId: 1272
		},
		{
			abc: `X:1
T:The Crooked Road To Dublin
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/227#setting12914
N:Setting entered in thesession by user “slainte” on 2006-04-12
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gmajor
|:G3G FGAF G2FG AdcA|G2AG FGAg[1 fdcA dBcA:|2 fdcA d2Bc||
dg~g2 fgaf dg~g2 agfe|dg~g2 fgag fdcA d2Bc|
dg~g2 fgaf dg~g2 a2ga|bgaf gbag fdcA d2cA||`,
			theSessionId: 227,
			theSessionSettingId: 12914
		},
		{
			abc: `X:1
T:Castle Kelly
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/21#setting21
N:Setting entered in thesession by user “Jeremy” on 2001-05-21
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Aminor
|:A2cA ABcA GcEG G2EG|A2cA ABcd ecdB cAA2:|
  agec dfed cAGE G2eg|agec d2cd eaag a2ba|
  gedc dfed cAGE|G2EG|A2cA ABcd ecdB cAA2|`,
			theSessionId: 21,
			parts: "AABB",
			norbeckId: 118
		},
		{
			groups: "su",
			abc: `X:1
T:Boil The Breakfast Early
R:reel
L:1/16
M:4/4
N:Imported from https://thesession.org/tunes/3#setting3
N:Setting entered in thesession by user “Jeremy” on 2001-05-14
N:(edited after importing)
K:Gmajor
BA|G2BG AFDF G2Bd c2BA| G2BG AFDF GEEG c2BA|
   G2BG AFDF G2Bd c2Bc| dBcA BGAF GEEG c2Bc||
   d2fd eBAB d2fa g2fe| d2fd eBAB BGEG c2Bc|
   d2fd eBAB d2fa g2fg| afge fded BGEG c2Bc||
   dAAA dAFA dAAA defe| dAAA dAFA GEEG c2Bc|
   dAAA dAFA d^cde dgfe|dBcA BGAF GEEG c2||`,
			theSessionId: 3
		},
		{
			abc: `X:1
T:Miss McLeod's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/75#setting75
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
K:Gmajor
|:G2 BG AGBG|B2 BA BcBA|G2 BG AGBG|A2 AG AcBA|
 G2 BG AGBG|B2 BA B2 d2|e2 ef edef|gfed BcBA:|
 |:G2 gf edeg|B2 BA BcBA|G2 gf edeg|a2 ag aeef|
 g2 gf edeg|BcBA B2 d2|edef edef|gfed BcBA:|`,
			theSessionId: 75
		},
		{
			abc: `X:1
T:Tommy Peoples'
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1100#setting1100
N:Setting entered in thesession by user “slainte” on 2002-10-31
K:Gmajor
|:G2BG cGBG|ADDE FGAF|G2BG cGBG|1 Addc BGGF:|2 Addc BGGf||
 |:g2dg egde|g2bg fgaf|g2dg egdB|1 cAdc BGGf:|2 cAdc BGGF||`,
			theSessionId: 1100
		},
		{
			abc: `X:1
T:Little Katie Taylor
C:Paddy Taylor
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2172#setting2172
N:Setting entered in thesession by user “Will Harmon” on 2003-11-19
K:Dmajor
|:D2 FD GEFE|(3DDD FA d2 ef|geaf fged|cA (3AAA EFGE|
 D2 FD GEFE|(3DDD FA dfef|geaf edcd|1 ed (3ddc dBAF:|2 edce d3 g||
 |:fdfa (3ggg ag|fdfa (3ggg ag|fd=cA BG (3GGG|ABcA dcAg|
 fdfa (3ggg ag|fdfa (3ggg ag|fd=cA BG (3GGG|1 ABcA [d3DA3] g:|2 ABcA dBAF||`,
			theSessionId: 2172
		},
		{
			abc: `X: 1 %230502, 260210
T: Toss The Feathers
R: reel
M: 4/4
L: 1/16
Z: Malcolm Schonfield
D: Mícheál Ó Raghallaigh • Inside Out
F: https://music.youtube.com/watch?v=-5TqQuQyPS8&t=157
K: D mixo
[P:A] 
DDFD  ADFD  ABc-[ce]- cAGE | DDFD  A2FA  dfed ^cAGE |
d3B   AFFF  ABcA       GEEE | cABG  ABcA  dfed  cAGE |
DDFD  ADFD  ABcA       GECE | DDFD  A2FA  dfed ^cAGE |
d3B   AFFF  ABc-[ce]-  AGE | cABG  ABcA  dfed  c3d  ||
[P:B] 
Ad^cd  Adcd   Adcd   edcd   | efge  a3g   e3a-  aged |
efge   ~a2ge  dfed   ^ceAB  | c3B   ABcA  dfed  cAGc  |
Ad~d2  Ad~d2  Ad~d2  edcd   | efge  a3g   e2ag  ed^cd |
efge   ~a2ge  dfed   ^ceAB  | c3B   ABcA  dfed  ^cAGE !D.C.! |]
`,
			theSessionId: 138,
			parts: "AABB",
			norbeckId: 110
		},
		{
			abc: `X:1
T:Glory
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1268#setting1268
N:Setting entered in thesession by user “emily_bmore” on 2002-12-29
K:Gmajor
|:G2BG dGBG|G/G/G BG AFDF|G2BG dGBG|c/c/c Bc AFDF:|
 |:E6 cA|BGEB AFDF|E2~E2 E2cA|1 BdcB AFDF:|2 BdcB AFDf||
 |:gagf e3f|g2fg e^cAf|gagf eaaf|1 g2fg e^cAf:|2 g2 fg e^cAF||`,
			theSessionId: 1268
		},
		{
			abc: `X:1
T:The Fisherman's Island
C:Ed Reavy
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/181#setting181
N:Setting entered in thesession by user “CreadurMawnOrganig” on 2001-06-30
K:Dmajor
|:D2 FA d2 cA|BAGB AFDF|GEFD EFGA|(3Bcd ed cAAg|
 fd ~d2 edcA|BcdB AGFD|EFGA (3Bcd ed|1 cAGE FDCE:|2 cAGE D2 z2||
 |:fd ~d2 AF ~F2|DFAd fdef|ge~e2 bece|dfed cAGE|
 DF~F2 AddA|B2gf edcB|Adfa gbed|1 cAGE D2 z2:|2 cAGE FDCE||`,
			theSessionId: 181
		},
		{
			abc: `X:1
T:The Bag Of Spuds
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/579#setting579
N:Setting entered in thesession by user “Toni Ribas” on 2002-03-06
K:Adorian
|:A2eA cAeA|ABcd edBA|G2dG BGdG|GABc dcBG|
 A2eA cAeA|ABcd edcB|ABcd efge|dBGA BAA2:|
 |:a2ea ageg|agbg agef|gedB GABd|gfga bgeg|
 a2ea ageg|agbg ageg|d2de g2ge|dBGA BAA2:|
 |:A2eA A2eA|ABcd e2dB|G2dG BGdG|GB~B2 GBdB|
 A2eA cAeA|ABcd e2dB|ABcd eg~g2|dBGA BAA2:|
 |:a2ea a2ea|agbg agef|gedc BGBd|gfga bgeg|
 a2ea ageg|agbg agef|gedc BGBd|1 gedB BAA2:|2 gfge dBGB||`,
			theSessionId: 579
		},
		{
			abc: `X:1
T:Drowsy Maggie
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/27#setting27
N:Setting entered in thesession by user “Jeremy” on 2001-05-21
K:Edorian
|:E2BE dEBE|E2BE AFDF|E2BE dEBE|BABc dAFD:|
 d2fd c2ec|defg afge|d2fd c2ec|BABc dAFA|
 d2fd c2ec|defg afge|afge fdec|BABc dAFD|`,
			theSessionId: 27
		},
		{
			abc: `X:1
T:Ormond Sound
C:Paddy O’Brien (Offaly)
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/426#setting426
N:Setting entered in thesession by user “Will Harmon” on 2001-12-08
K:Adorian
|:A2 ed BedB|AG (3GGG AGEG|A2 ed (3B^cd ef|gfga gedg|
 eA (3AAA BedB|AGEF G3 A|EA (3AAA GABd|1 gedB A2 (3EFG:|2 gedB A3 e||
 |:efge agfg|e ~a3 edBd|(3efg fa ~g3 e|dgge dBGB|
 cBcA d^cdB|efge a2 ga|bg (3ggg agab|1 gedB A3 e:|2 gedB A2 (3EFG||`,
			theSessionId: 426
		},
		{
			abc: `X:1
T:The Maple Leaf
C:Darach De Brun
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1050#setting1050
N:Setting entered in thesession by user “SPeak” on 2002-10-16
K:Edorian
|:E (3EEE F GE (3EEE|B2AB AGED|EDEF GFGA|B2dB AGED|
 E (3EEE F GE (3EEE|B2AB AGED|Beed BA (3AAA|B2AB AGED:|
 |:Beed efg2|Beed edBA|Beed efge|a2eg fedA|
 Beed efg2|Beed edB2|a2eg fedA|B2AB AGED:|`,
			theSessionId: 1050
		},
		{
			abc: `X:1
T:Devanny's Goat
C:Tommy Whelan
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-18,
N:from https://thesession.org/tunes/2881#setting47359
N:Setting entered in thesession by user “Fernando Durbán Galnares” on 2023-06-10
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Dmajor
|:E|"D"DFAB AFAB "G"defe dBAF|"D"DFAF BFAF "A"EEDF EGFE|
"D"DFAB AFAB "G"defe dBAf|"D"efdB AFFG "A"AFEG "D"FDD:|
|:e|"D"faab afdf "G"aafd edBd|"D"ABde fddd "A"edfd edBd|
"D"ABde fddd "G"edfd edBd|"D"ABdB AFFG "A"AFEG "D"FDD:|`,
			theSessionId: 2881,
			theSessionSettingId: 47359
		},
		{
			abc: `X:1
T:Reel De Valleyfield
O:Quebec
R:reel
L:1/16
M:4/4
N:Quebec reel, composer unknown.
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/17457#setting33504
N:Setting entered in thesession by user “Siúlóir” on 2018-11-10
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Dmajor
|:DFAF DFAF EGAG EGAG|DFAF DFAd fedf e2AF|
DFAF DFAF EGAG EGAG|DFAF DFAd[1 fedc d2AF:|2 feBc d2fd||
|:Adfd Adfa gfed e2B2|ABcd edeg fdec d2fd|
Adfd Adfa gfed e2B2|ABcd efeg fedc d2fd:|`,
			theSessionId: 17457,
			theSessionSettingId: 33504
		},
		{
			abc: `X:1
T:The Street Player
C:Ed Reavy
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2739#setting2739
N:Setting entered in thesession by user “Kenny” on 2004-03-30
K:Dmajor
|:DFAd f2 fe|dcde fdAF|G2 FG E2 EF|GBAF EA,CE|
 FD D2 FAGA|BG G2 Bcdg|fgaf gecd|1 eddc dBAF:|2 eddc d2 Ad||
 |:fddc dfaf|gfed cdeg|f2 fa gfed|cAAG A2 EG|
 FDA,D FA A2|BG G2 Bcdg|fgaf gecd|1 eddc d2 Ad:|2 eddc d4||`,
			theSessionId: 2739
		},
		{
			abc: `X:1
T:Tie The Bonnet
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/136#setting136
N:Setting entered in thesession by user “Will Harmon” on 2001-06-12
K:Amixo
|:(3AAA Ag fdec|A2 A=c BG(3GGG|AGAg fdef|1 ~g3d BGGB:|2 ~g3d BG(3GGG||
 |:faaf gfed|(3cBA eA fAeA|faaf gfef|1 ~g3d BG(3GGG:|2 ~g3d BGGB||`,
			theSessionId: 136
		},
		{
			abc: `X:1
T:Brenda Stubbert's
C:Jerry Holland
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/727#setting727
N:Setting entered in thesession by user “seara” on 2002-06-03
K:Adorian
|:B|A/A/A (BA) GAAB|A/A/A (BA) edde|G2 (BA) BGGB|c2 (BA) BGGB|
 A/A/A (BA) GAAB|A/A/A (BA) edda|gedB GABd|{d}e2 dB eAA:|
 |:B|A/A/A a2 A/A/A g2|Aage ageg|G2 (BA) BGGB|c2 (BA) BGGB|
 [1A/A/A a2 A/A/A g2|Aage agea|gedB GABd|{B}e2 dB eAA:|
 [2A/A/A (BA) GAAB|A/A/A (BA) edda|gedB GABd|{d}e2 dB eAA||`,
			theSessionId: 727
		},
		{
			abc: `X:1
T:The Oak Tree
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/212#setting212
N:Setting entered in thesession by user “laura nesbit” on 2001-07-22
K:Dmajor
|:(3FED AD FDAD|FAAF GFEC|~A,3B, CA, (3A,A,A,|A,G,A,B, CDEG|
 (3FED AD FDAD|FAAF GFEA|~B2eg fgec|1 dcce dBAG:|2 (3ded ce dfeg||
 |:fB (3BBB fa^ge|fece ~f3e|cAAc eA (3AAA|A^GAB cdeg|
 fB (3BBB fa^ge|fece (3f^ga ec|ABce ~a3e|1 faec dfeg:|2 faec ~B3c||
 |:d2fd Adfd|c2ec Acec|d2fd Adfg|gfed cABc|
 d2fd Adfd|c2ec Acec|dfaf gfed|1 B2ec dcBc:|2 B2ec dBAG||[F8A8]||`,
			theSessionId: 212
		},
		{
			abc: `X:1
T:Miss Grant Of Grant
C:Daniel Dow
R:reel
L:1/8
M:4/4
N:From the Cape Breton Violin album. Appears in the Athole Collection. Composed by
N:Daniel Dow.
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/18630#setting36343
N:Setting entered in thesession by user “Connor Hickey” on 2019-10-19
K:Fmajor
B|:AFFCF2Ac|dfcf AGGB|AFFC DEFd|cAfc AFFB:|
 Acfc Afcf|dfcf AGGB|Acfc Afcf|egce fFFB|
 Acfc Afcf|dfcA GABd|cAFB AFAc|defg aff||`,
			theSessionId: 18630,
			theSessionSettingId: 36343
		},
		{
			abc: `X:1
T:Reel St. Jean
C:Theodore Duguay
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2870#setting2870
N:Setting entered in thesession by user “jdave” on 2004-04-21
K:Bminor
|:dB~B2 FB~B2|dfBd f2ed|cA~A2 EA~A2|ceAc e2fe|
 dB~B2 FB~B2|dfBd f2cB|~A3c e2fe|1 dAcA B2fe:|2 dAcA B2Bc||
 d2dc defg|a2ab afed|d'2 b2 afed|edef edBA|
 d2dc defg|a2ab afed|d'2 b2 afed|1 edef d2Bc:|2 edef d2fe||`,
			theSessionId: 2870
		},
		{
			abc: `X:1
T:The Tailor's Thimble
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/704#setting704
N:Setting entered in thesession by user “Josh Kane” on 2002-05-27
K:Edorian
|:GE~E2 E2AF|GE~E2 AFDF|GE~E2 EFGA|1 BcdB AFDF:|2 BcdB ABde||
 |:f2df efde|fedB ABde|f2df efdA|1 BcdB ABde:|2 BcdB AFDF||`,
			theSessionId: 704
		},
		{
			abc: `X:1
T:The Limestone Rock
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1619#setting1619
N:Setting entered in thesession by user “Kenny” on 2003-04-28
K:Gmajor
dc|BG G2 AGFG|DG G2 A2 dc|BG G2 AGAB|cABG A2 dc|
 BG G2 AGFG|DGG2 A2 dc|BG G2 AGAB|cABG A2 Bd|
 e2 dg e2 dg|e2 dB A2 Bd|eB B2 gB B2|cABG A2 Bd|
 e2 ed ea a2|gedB AcBA|G2 Bd g2 gb|agef gedc|`,
			theSessionId: 1619
		},
		{
			abc: `X:1
T:Tom Ward's Downfall
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/565#setting565
N:Setting entered in thesession by user “Josh Kane” on 2002-02-25
K:Gmajor
|:BG~G2 AGFG|EG~G2 AEGE|DEGA ~B2Bd|(3=fed ^cd Bdgd|
 BG~G2 AFGF|ECC2 ACGE|DEGA B2Bd|ecdc BGGA||
 BDAD GDFD|EG~G2 AEGE|DEGA B3d|ed^cd Bdgd|
 BGG2 AFGF|ECC2 ACGE|DEGA ~B2Bd|ecdc BGGA||
 dgg^f g2ag|~e2ab adga|bg~g2 agef|(3gfe dc BGGA|
 dgg2 bgag|eaab adga|bg~g2 agef|(3gfe dc BGGA||
 dgg2 abag|~e2ab adga|bg~g2 agef|(3gfe dc BGGA|
 dgg2 bgag|eaab adga|bg~g2 agef|(3gfe dc (3Bcd gd:|`,
			theSessionId: 565
		},
		{
			abc: `X:1
T:The Mermaid Of Mullaghmore
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2854#setting2854
N:Setting entered in thesession by user “Dr. Dow” on 2004-04-19
K:Dmajor
|:FDDF ABAF|GAAF GFED|FGAF D2 (3efg|1 fdec dBBG:|2 fdec defg||
 a2fa dafa|g2e=c Gceg|a2fa dafa|g2ag fdd2|
 a2fa dafa|g2e=c Gceg|fage fdec|dBBG FDD2||`,
			theSessionId: 2854
		},
		{
			groups: "su",
			parts: "ABC",
			abc: `X:1
T:The Flogging
R:reel
L:1/16
M:4/4
K:Gmajor
BG~G2 BGcG|BG~G2 Bdgd|BG~G2 BdcB`,
			theSessionId: 195,
			norbeckId: 1,
			references: [
				{
					notes:
						"For an amazing Tony MacMahon / Noel Hill setting/rendition, see my note for Lucy Campbell – starting around 06:27"
				}
			]
		},
		{
			abc: `X:1
T:The Blackhaired Lass
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/237#setting237
N:Setting entered in thesession by user “Will Harmon” on 2001-08-15
K:Adorian
AB|:cBAB cdec|d2 gd BGGB|cBAB cdec|dfec A2 AB:|
 cdef g2 ge|f2 fd gfed|cdef ~g3e|fdec A2 AB|
 cdef gfeg|~f3d g2 fg|(3agf ge fdec|dfec A2 AB||`,
			theSessionId: 237
		},
		{
			groups: "su",
			abc: `X:1
T:Porthole Of The Kelp
C:Bobby Casey
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/263#setting263
N:Setting entered in thesession by user “Zina Lee” on 2001-08-30
K:Ddorian
|:DE||F2DE F2DE|FEFG ECCE|F2DE FGAG|FDEC A,D DE|
 F2DE FGAB|cAGF EDCE|DEFG AddB|cAGE EDD2:|
 d2 Ad dcAG|F2DF ECC2|d3(d d)cAG|ABcA d3e|
 fded cAAG|EGcG EDCE|DEFG AddB|cAGE EDD2:|`,
			theSessionId: 263
		},
		{
			abc: `X:1
T:Dinkey's
C:Francie Dearg O'Byrne
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/24#setting24
N:Setting entered in thesession by user “Jeremy” on 2001-05-21
K:Amixo
|:ed|c2B2 ABcd|egfg edBd|gBBB gBaB|gBBB gfed|
 cdBc ABcd|egfg edBd|gfgd efed|c2B2 A2:|
 |:eg|aAAA aAbA|aAAA agef|gBBB gBaB|gBBB gfeg|
 aAAA aAbA|aAAA agef|gfgd efed|cdBc A2:|`,
			theSessionId: 24
		},
		{
			abc: `X:1
T:Mother's Delight
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/257#setting242
N:Setting entered in thesession by user “Brando ” on 2001-08-20
K:Edorian
|:G3B A3B|G3B AFDF|Eeed efgf|e3d Bcdf|
 efed B2Bc|dedA FDDF|Beed B3c|d2AF GEED:|
 |:GBeB GEED|FAAG FDED|GBeB GEED|FEDF E3F|
 GBeB GEED|FAAG FDED|G2GF GFEG|BGFG E3F:|`,
			theSessionId: 257,
			theSessionSettingId: 242
		},
		{
			abc: `X:1
T:La Grande Traversée
C:Marcel Messervier
O:Quebec
R:reel
L:1/16
M:4/4
N:This setting is a few tweaks of a 
N: [setting on thesession.org](https://thesession.org/tunes/17379#setting33333).
N:(Setting entered in thesession by user “Siúlóir” on 2018-10-14)
K:Dmajor
A2G2 S|:F3d dcde d2A2 F2A2|G3d dcde d2B2 G2B2|
A3e edef e2c2 B2A2 |1 dFAd fedc B2A2 {B}A2G2:|2 [M:3/4]d2AA BAFA d2ed||
[M:4/4][K:A]|:cecA EAce d2B2 B4 | GBBB ddBd ffed c2ed |
cecA EAce d2B2 B4 | [1 GBBB ddBd fece  a2ed:|2 [M:5/4]GBBB ddBd fece  a4 A2SG2||
`,
			badges: "crooked",
			theSessionId: 17379,
			theSessionSettingId: 33333
		},
		{
			abc: `X:1
T:Ambrose Moloney's
C:Tommy Whelan
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2896#setting2896
N:Setting entered in thesession by user “Kenny” on 2004-04-26
K:Gmajor
|:B2 BG ABGE|DGBG A3 c|BdBG ABde|gedB eA A2|
 BdBG ABGE|DGBG AGAc|BG G2 A2 Bd|gedc BG G2:|
 dgbg ageg|gedB GABd|eaag ageg|dgbg ageg|
 dgbg ageg|gedB GABd|eaag egfa|gedc BG G2:|`,
			theSessionId: 2896
		},
		{
			abc: `X:1
T:Greig's Pipes
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/605#setting605
N:Setting entered in thesession by user “Josh Kane” on 2002-03-20
K:Gmajor
~B2BA BAGA|B2GB AGEG|~B2BA BAGB|cABG AGEG|
 ~B2BA BAGA|B2GB AGEG|Bd~d2 eBdB|AcBG AGEG||
 DG~G2 DGBG|DGBG AGEG|DGGF GABc|d2BG ABGE|
 AG~G2 AGBG|DGBG AGEG|DGGF GABc|dBAc BG~G2||
 d2 (3Bcd edge|dGBG AGEG|d2 (3Bcd eg~g2|agbg ageg|
 d2 (3Bcd edge|dGBG AGEG|d2 (3Bcd eg~g2|agab aged||`,
			theSessionId: 605
		},
		{
			abc: `X:1
T:Cotillon De Baie-Ste-Catherine
O:Quebec
R:reel
L:1/16
D: Traditional tunes of Québec (2001)
S:Laurie Hart, fiddle
M:4/4
F:https://music.youtube.com/watch?v=MIXYs91NGH8
N:This reel is “crooked”: the first part is in four beats per bar, second part is
N:in five(!) beats per bar.
N:There is some confusion regarding this reel. It became well known as a part of a
N:set played by Patrick Street, called La Cardeuse. That's elsewhere on this site:
N:https://thesession.org/tunes/6749
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/23211#setting47315
N:Setting entered in thesession by user “GoPlayer” on 2023-06-02
N:(edited after importing)
K:Gmajor
|:B2BB EBGB dedB cdcB|1,3 AGFG A2FA dedc BAGA:|2 AGFG A2FA d2F2 G2z2:|
 [4 [M: 5/4] AGFG A2FA d2F2 G2Bc dcBc|:d2g2 d2g2 d2g2 D2AB cBAB|1,2 c2a2 c2a2 a2a2 D2Bc dcBc:|3 [M: 4/4] c2a2 g2f2 g2g2 g2!D.C.!z2||`,
			badges: "crooked",
			theSessionId: 23211,
			theSessionSettingId: 47315
		},
		{
			abc: `X:1
T:The Colliers'
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2154#setting2154
N:Setting entered in thesession by user “gian marco” on 2003-11-15
K:Dmixo
|:AG|~F2 FG ~A3B|cAdB cABG|AddA d3e|fdeA d^cAG|
 ~F2DF ~A3B|cAdB cABG|Add^c ~A3G|EFGE FD:|
 |:de|fded fde^c|Add^c Adde|fdde fde^c|~A3B cBcd|
 eaag efge|(3Bcd ed ^cAGG|Add^c~A3G|EFGE FD:|`,
			references: [
				{
					artists: "Denis Ryan, fiddle; Cathal McConnell, flute",
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=16"
				}
			],
			theSessionId: 2154
		},
		{
			abc: `X:1
T:The Rising Sun
C:Martin Mulhaire
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1024#setting1024
N:Setting entered in thesession by user “Brando ” on 2002-10-10
K:Dmajor
AAG|:F2AF DFAF|G2BG DGBG|A2cA EABc|dzde edAG|
 F2AF DFAF|GBBA ~B3z|cdef gecA|1 eddc dAAG:|2 eddc defg||
 |:a2fd Adfd|Adfd edcd|~e3f ~g3a|be (3eee bege|
 azfd Adfd|Adfd edcB|A2FA BcdB|1 AFEF defg:|2 AFEF DAAG||`,
			theSessionId: 1024
		},
		{
			abc: `X:1
T:Dick Gossip's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/408#setting408
N:Setting entered in thesession by user “Will Harmon” on 2001-12-02
K:Dmajor
|:F2 AF GFED|DFAF GFED|EDEF GFED|~E3 F GFED|
 F2 AF GFED|DFAF GFED|cdef gece|1 eddc d2 AG:|2 eddc d2 ef||
 |:gB (3BBB gBaB|gB (3BBB gfed|(3cBA eA fAeA|(3Bcd ef gfef|
 gB (3BBB gBaB|gB (3BBB gfed|cdef gece|1 eddc d2 ef:|2 eddc d2 AG||`,
			theSessionId: 408
		},
		{
			abc: `X:1
T:Mayor Harrison's Fedora
C:Edward Cronin
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/367#setting367
N:Setting entered in thesession by user “Will Harmon” on 2001-11-12
K:Edorian
EF|:GBEG (3BBB AF|GFGA BdAG|FADF ADFA|(3ddd cd BAGF|
 GBEG (3BBB AF|GFGA ~B3 c|dedB AGFA|1 GEFD ~E3 F:|2 GEFD ~E3 A||
 |:Beed e2 ef|g2 fg edBA|FABc d2 (3ABc|dfaf gfed|
 Beed e2 ef|g2 fg edBc|dedB AGFA|1 GEFD ~E3 A:|2 GEFD ~E3 F||
 |:G2 GF GABc|dBAG FDDA|Be (3eee edef|gefd e2 (3ABc|
 dcdB AGFA|GEFD EFGA|dedB AGFA|GEFD E2 (3DEF:|`,
			theSessionId: 367
		},
		{
			abc: `X:1
T:Sheila Coyle's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1040#setting1040
N:Setting entered in thesession by user “SPeak” on 2002-10-14
K:Dmajor
|:FA(3AAA FADF|ADFA BAFD|GBBA B(3BBBG|ABdf edBA|
 FA(3AAA FADF|ADFA BAFD|GB(3BBB AFDF|EFGE FDD2:|
 |:dffe fgfe|dcdB AFDF|Ac(3ccc ecAc|B(3BBBA BAFA|
 dffe fgfe|dcdB AFDF|GB(3BBB AFDF|EFGE FDD2:|
 |:FA(3AAA FADF|ADFA BAGF|GB(3BBB BcBG|ABdf edBA|
 FA(3AAA FADF|ADFA BAGF|GABd AF(3FFF|E(3EEEG FDD2:|
 |:dffe fgfe|dBAB ADFA|ceec e2ec|B2dA BAFA|
 dffe fgfe|dBAB AFDF|GABd AF(3FFF|E(3EEEG FDD2:|`,
			theSessionId: 1040
		},
		{
			abc: `X:1
T:The Road To The Glen
C:Ed Reavy
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2805#setting2805
N:Setting entered in thesession by user “Kerri Coombs” on 2004-04-12
K:Dminor
|:FdcB AGFD|G2 dG eGdG|FEFG Acde|fedc A=BcA|
 d3 e f2 ag|fedc AFDE|1 F3 G AGFG|Addc d2 (3CDE:|2 F3 G AFDE|FDEC D2 de||
 f2 ag fedf|ecgc acgc|f2 ag fede|fdec Adde|
 f3 g (3agf (3gfe|fedc AFDE|F3 G AGFG|1 Addc d2 de:|2 Addc d2 (3CDE||`,
			theSessionId: 2805
		},
		{
			badges: "crooked",
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
			]
		},
		{
			abc: `X:1
T:Branohm
C:Máire Breatnach
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/504#setting504
N:Setting entered in thesession by user “CreadurMawnOrganig” on 2002-01-13
K:Adorian
a3 g|eA ~A2 cdec|degd BAGB|AEEE ABcd|egfa geag|
 eA ~A2 cdec|degd BAGB|AEEE cdec|d2gd BAag|
 eA ~A2 cdec|degd BAGB|AEEE FGAB|cdea geag|
 eA ~A2 cdec|degd BAGB|AEEE cdec|d2gd BAAd|
 |:edef g2af|gedc Bcdg|eaag a3 a|aged ^cdef|geaf fgef|
 gedc BAGB|AEEE cdec|d2gd BAag:|`,
			theSessionId: 504
		},
		{
			incipit: `X:140
T:The Pigeon on the Gate
R:reel
M:4/4
L:1/16
K:Edor
dc | BE~E2 BEdE BE~E2 BAFE |`,
			theSessionId: 1596,
			parts: "AABB",
			norbeckId: 140
		},
		{
			incipit: `T:Pigeon on the Gate, The
F:https://donegalfiddlemusic.bandcamp.com/album/a-feeling-in-the-blood
D:A Feeling In The Blood
N:Néillidh Boyle's version
N:There are two different N. B. recordings here
R:reel
M:4/4
L:1/16
K:Gmix
dG~G2 GedG G2ce dcAG | FEFd cF~F2 `,
			theSessionId: 1596,
			parts: "AABB",
			norbeckId: 935
		},
		{
			abc: `X:1
T:The Drunken Landlady
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/363#setting363
N:Setting entered in thesession by user “Jdharv” on 2001-11-11
K:Edorian
|:BE~E2 BAFA|BE~E2 BAFA|ABAF D2FD|FA~A2 BAFA|
 BE~E2 BAFA|BE~E2 BAFA|A2Bc dfec|dBAF E4:|
 |:Beed e2de|f2df efdB|ABAF D2FD|FA~A2 BAFA|
 Beed e2de|f2df efdB|A2Bc dfec|dBAF E4:|`,
			theSessionId: 363
		},
		{
			abc: `X:1
T:Waiting For A Call
C:Tommy Peoples
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3435#setting3435
N:Setting entered in thesession by user “gian marco” on 2004-08-23
K:Edorian
|:B(E ~E2) B2 AF|{e}(3cBB AF AdAG|FDAD A,DAD|FAdA (3Bcd ed|
 B(E ~E2) B2 AF|{e}(3cBB AF D3 z|afed fedB|1 AF (3(DEF) E3 d:|2 AF (3(DEF) E3:|
 |:F|G2 GF GBdB|GABG AFDF|{A}G/G/G GF GABd|efga {a} b2 ef|
 g2 (3(fga) gedB|(3(EFG) BG AFDF|EFGB {c}d2 (B/c/d)|1 DFAF GEE:|2 DFAF GEE z||
 |:B2 ef gbef|dfaf dfbf|g3 a (3(bag) gf|gefd Beeg|
 bg (3(efg) fedA|(3(Bcd) fe dBAF|EFGB {c}d2 (B/c/d)|DFAF GEE z:|`,
			theSessionId: 3435
		},
		{
			abc: `X:1
T:The Ceilier
C:Ed Reavy
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/4525#setting4525
N:Setting entered in thesession by user “Kenny” on 2005-05-23
K:Gmajor
Bc|:dGBd c=FAc|BGBd gfdc|Bcde =fdeg|fdBd c=FAc|
 BGGF GABc|dGBd c2 Bc|dgfa gbag|1 fdcA GABc:|2 fdcA G2 Bc||
 dggf g2 gf|dgBg dcBc|de=fe f2 fe|d=fcf dcBc|
 dggf gfga|bgaf gfde|=f2 fe fdeg|1 fdcA GABc:|2 fdcA G4||`,
			theSessionId: 4525
		},
		{
			abc: `X:1
T:The Leitrim Lilter
C:Charlie Lennon
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3943#setting3943
N:Setting entered in thesession by user “Dr. Dow” on 2004-11-29
K:Dmajor
|:B|AF~F2 DEFA|dfaf eB~B2|dAea ~f3e|dBAF FEEB|
 AF~F2 DEFA|dfaf eB~B2|GBge fgef|dBAG FDD:|
 E|FAdf a2bf|afdf eB~B2|ABde f2af|g2fg eABA|
 FAdf a2bf|afdf eB~B2|GBge fgef|dBAG FDDE|
 FAdf a2bf|afdf eB~B2|ABde f2af|g2fg efge|
 af~f2 dB~B2|ABdf eB~B2|GBge fgef|dBAG FDD||`,
			theSessionId: 3943
		},
		{
			abc: `X:1
T:Carmel Mahoney Mulhaire
C:Martin Mulhaire
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2716#setting2716
N:Setting entered in thesession by user “Kenny” on 2004-03-26
K:Dmajor
|:AF F2 DF F2|AF F2 ABde|fdad bdad|efge cABc|
 d2 cd BAFE|D2 FD ADFA|BG G2 cA A2|1 faeg fddB:|2 faeg fdde||
 |:f2 fe fgfe|df f2 af f2|DFAd fdaf|geed eAce|
 f2 fe fgfe|df f2 dfaf|g2 gf gbag|1 faef d2 de:|2 faef defg||
 |:a2 fa b2 gb|affe fgaf|gfed efga|baa^g a=gf=g|
 adfa bdgb|affe fgaf|gefd ecdB|1 cABc defg:|2 AFGE D2 DE||
 |:FA A2 FADF|ADFA bagf|g2 fg efde|cdBc ABAG|
 FA A2 FADF|ADFA bagf|gefd ecdB|1 AFGE D2 DE:|2 AFGE D4||`,
			theSessionId: 2716
		},
		{
			abc: `X:1
T:Jackie Coleman's
C:Jackie Coleman
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/50#setting50
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
K:Dmajor
|:AF F2 EFDE|F2 AF BFAF|E2 BE dEBE|ABde fedB|
 AFFF EFDE|F2 AF BFAF|E2 BE dEBE|ABde fd d2:|
 |:fddc dfag|fddc dfaf|eA A2 eAfA|eA A2 efge|
 fddc dfag|fddc dfaf|g2 gf gbag|faeg fd d2:|`,
			theSessionId: 50
		},
		{
			abc: `X:1
T:The Twelve Pins
C:Charlie Lennon
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1333#setting1333
N:Setting entered in thesession by user “Dr. Dow” on 2003-01-15
K:Gmajor
|:dB~B2 dBGB|dA~A2 dAFA|DEFG ABcA|defg abge|
 dB~B2 dBgB|dA~A2 fdAF|DEFG ABcA|1 d2cd AGGB:|2 d2cd AGGg||
 ~f3e defg|adfd cAAB|cA~A2 DFAB|cedB cAA2|
 ~f2ef defg|(3agf ga fdAB|c2cB cBAB|~c2dc AGG2|
 fd~d2 ad~d2|fded cAAB|cedB cdeg|abga fdde|
 ~f3g ~a3g|~f2ed cAAB|cBcB cBAB|~c2dc AGGB||`,
			theSessionId: 1333
		},
		{
			abc: `X:1
T:Bean An Tí Ar Lár
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1370#setting1370
N:Setting entered in thesession by user “fidicen” on 2003-01-24
K:Dmajor
B|:AGFE D2FD|GEFE Ddcd|AGFE DEFD|1 EG=cA BGEB:|2 EG=cA BGEd||
 cdec A3d|cdec ABcB|cdec ABAG|EG=cA BGEd|
 cdec A3d|cdec ABcd|cdeg fdec|ABcA BdcB||`,
			theSessionId: 1370
		},
		{
			groups: "su",
			abc: `X:1
T:Come West Along The Road
R:reel (single)
L:1/16
M:4/4
N:Imported from https://thesession.org/tunes/474#setting31703
N:Setting entered in thesession by user “JACKB” on 2018-01-19
N:(edited after importing)
K:Gmajor
 d2BG dGBG G2(3Bcd efge|d2BG dGBG ABcd edBe|
 d2BG dGBG G2(3Bcd efge|d2BG dGBG ABcd edBd||
 g2bg egdg egdg edBd   |g2bg egdg ABcd edBd|
 g2bg egdg egdg edBd   |gabg efge dega bage||`,
			references: [
				{
					notes: `Éigse an Spidéil / Come West Along the Road
Album: The High Seas (2018)`,
					url: "https://caitlinciaran.bandcamp.com/track/igse-an-spid-il-come-west-along-the-road",
					artists:
						"Caitlín Nic Gabhann, concertina; Ciarán Ó Maonaigh, fiddle; Cathal Ó Curráin, Bouzouki"
				}
			],
			theSessionId: 474,
			theSessionSettingId: 22920
		},
		{
			abc: `X:1
T:The Foxhunters
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/511#setting511
N:Setting entered in thesession by user “Josh Kane” on 2002-01-19
K:Gmajor
|:d2BG d2BG|d2BG AGEG|d2BG dGBG|AcBG AGEG:|
 |:D~D2B BAGE|DGBG AGEG|D~D2B BAGB|AcBG AGEG:|
 |:gedB GABd|gdBd eaaf|gedB GABG|ABcd eA~A2:|
 |:dggf ~g2ge|dggd egdB|dggf ~g2gd|egdB AGAB:|
 |:G2BG dGBG|GABG AGAB|~G2BG dGBd|egdB AGAB:|`,
			theSessionId: 511
		},
		{
			abc: `X:1
T:Sligo Creek
C:Danny Noveck
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3531#setting3531
N:Setting entered in thesession by user “jdicarlo” on 2004-09-12
K:Bdorian
|:f2ef dB~B2|f2ef defg|a2ed cAAF|EFAB cAde|
 f2ef dB~B2|f2ef defg|a2ed cAec|ABBA B2 z2:|
 |:=GBBA Bcde|fdec defd|eA~A2 cAFA|EFAB cABA|
 =GBBA Bcde|f2ec defd|ea~a2 efec|ABBA B2 z2:|`,
			theSessionId: 3531
		},
		{
			groups: "ALORA",
			abc: `X: 8
T: Tommy's Tarbukas
C: Alasdair Fraser
R: reel
M:4/4
N: Setting from thesession (*) adapted 13 & 14 May 2025%250514
N: (*) https://thesession.org/tunes/140#setting46226
L: 1/16
N:*abc-tools: convert to M:4/4 & L:1/16*
K: B minor
de|:"Bm"f2ef dBBd "A"cAeA fAeA|"Bm"f2ef dBBd "A"cAec "Bm"dBde|
"Bm"f2ef dBBd "A"cAeA fAeA|"Bm"f2df "A"cAAc[1 "Bm"Bbfe dBde:|2 "Bm"Bbfe dBBA||
|:"Bm"FBdB "G"GBed "A"ceag "D"fdA(F|"Bm"F)BdB "G"GBed "A"caec "Bm"dBBA|
"Bm"FBdB "G"GBed "A"ceag "D"fdAF|"Bm"afdg "A"ecAG[1 "Bm"FB^Ac dBB=A:|2 "Bm"FB^Ac dBde||`,
			theSessionId: 140,
			references: [
				{
					url: "https://open.spotify.com/track/1aa6Xuy5F4F2Sv1rZSN7m7",
					artists:
						"Seán Maguire, fiddle; Wilcil McDowell, piano; Sean O’Driscoll, banjo",
					notes: `Segs Hornpipe / Allister Frazer's Reel
From 1:33 onwards
Album: A Man Apart (2004)`
				}
			]
		},
		{
			incipit: `X: 6
T: Seán Sa Cheo
R: reel
M: 4/4
L: 1/16
K: Amix
e2df eABd e2ef d2BA|`,
			theSessionId: 177,
			references: [
				{
					url: "https://donegalfiddlemusic.bandcamp.com/track/sean-sa-cheo",
					artists: "Néillidh Boyle, fiddle",
					notes: "1930s"
				}
			]
		},
		{
			abc: `X:1
T:McDonagh's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1963#setting1963
N:Setting entered in thesession by user “Dr. Dow” on 2003-09-09
K:Edorian
|:B2Ad BEED|EB,EB ~B2EB|BAFA D3E|FDFA BAFA|
 B2A=c BEED|EB,EB ~B2EB|BAGF GABc|dBAG FDFA:|
 |:d2ef gfed|fB~B2 fB~B2|d2ef gfed|ceae ceae|
 d2ef gfed|fB~B2 fB~B2|~a2ge fdec|dBAG FDFA:|`,
			theSessionId: 1963
		},
		{
			abc: `X:1
T:The Enchanted Lady
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1522#setting1522
N:Setting entered in thesession by user “gian marco” on 2003-03-15
K:Dmajor
|:~A3G FAdB|AGFD EA,~A,2|~A3G FAdB|1 ABde fddB:|2 ABde fdde||
 f2df efdf|afdf edBd|f2df efdA|B/c/dAG FDDe|
 f2df efdf|afdf edB2|ABAB dfbf|afeg fddB||`,
			references: [
				{
					url: "https://irishmusic.bandcamp.com/track/an-buailteoir-aerach-the-enchanted-lady-the-holy-land",
					artists:
						"Mick O'Brien, uillean pipes; Caoimhín Ó Raghallaigh, fiddle",
					notes: "An Buailteoir Aerach / The Enchanted Lady / The Holy Land",
					album: "Deadly Buzz | Aoibhinn Crónán "
				}
			],
			theSessionId: 1522,
			norbeckId: 211
		},
		{
			abc: `X:1
T:Jackson's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3033#setting3033
N:Setting entered in thesession by user “Kenny” on 2004-05-18
K:Dmajor
|:A3 B AFDF|A2 FA GECE|A2 AB AFDF|EDCD EFGE:|
 FD D2 FDGE|FD D2 GECE|FD D2 F2 FD|1 EDCD EFGE:|2 EDCD EFGA||
 dffe f2 fe|dcdB AF F2|ceed efec|dcdB AFDF|
 dffe fgfe|d2 dB AF F2|cdef gecd|1 eddc d2 AB:|2 eddc d4||`,
			theSessionId: 3033
		},
		{
			abc: `X:1
T:Bonnie Kate
C:Daniel Dow
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/754#setting754
N:Setting entered in thesession by user “b.maloney” on 2002-06-11
K:Dmajor
|:dB|A2dA (3Bcd AF|DFAF EA,CE|DFAF GBed|cABc d2 dB|
 A2dA BdAF|DFAF EGFE|DFAF GBed|cABc d2:|
 |:fg|(3aba fd Adfa|(3gag ec Acef|~g3f gbag|fgef d2 ef|
 (3aba fd Adfa|(3gag ec Acef|~g3f gbag|fgef d2:|`,
			theSessionId: 754
		},
		{
			abc: `X:1
T:Reel Des Accordeonistes
C:Marcel Messervier
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/5933#setting5933
N:Setting entered in thesession by user “domhnall.” on 2006-07-05
K:Dmajor
|:FG|"D"A2df "G"edcB|"D"ABAG F2EF|"A"GAGF EBBB|"D"ABAG FDFG|
 "D"A2df "G"edcB|"D"ABAG F2EF|"Em"GFEF "A"GABc|"D"dfec d2:|
 |:A2|"G"(3BcB GB d2cB|"D"(3ABA FA dAFA|"A"GECE A,ECE|"D"DEFG A2FA|
 "G"(3BcB GB d2cB|"D"(3ABA FA d2cd|"A"efed cBAG|FABc "D"d2:|
 |:d2|"G"dBGd BGdA|"D"FdAF d2cd|"A"e2d2 (3cdc (3BcB|"D"ABAG Fddd|
 "G"dBGd BGdA|"D"FdAF d2cd|"A"efed cBAG|FABc "D"d2:|`,
			theSessionId: 5933
		},
		{
			aka: ["Cherry Tree", "Beauty Spot"],
			groups: "su",
			incipit: `X: 1
T:The Beauty Spot
R: reel
M: 4/4
L: 1/16
K: Dmix
A2GB A2dB cBcG EFGB|A2GB A`,
			references: [
				{
					notes: `(1974) The star of Munster; The cherry tree (at 1:07)
Cherry Tree AKA Beauty Spot`,
					artists: "Paddy Ryan, fiddle",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2024/?track=2"
				}
			],
			theSessionId: 1270
		},
		{
			groups: "ALORA,su",
			abc: `
X: 2
T: Maud Millar
T: version of 2025-10-15%2024-08-21 %2024-06-27 %2025-04-11%2025-10-15
R: reel (single)
Q:1/4=110
M: 4/4
L: 1/16
K: G
P:I
gf|"C(E)"edBA "D(F#)"GEDE "G"G2"_v1"BG  "_v2"d2Bd|"C(E)" "_v3,v4"e2dB "_v5,v6"A2GA "D(F#)"Beed efgf|
"C(E)"edBA "D(F#)"GEDE   "G" "_v7"G2BG dGBd|"Em"e2dB A2GA "D""_v8"Beed  "_v9,v10,v11"e2ge||
P:II
"G"dega bgg2   "D"agef "G"g3e|"G"dega bgg2 "C"aged eage|
"G"dega bgg2   "D"agef "G"g3a|"G"bgaf gfed !coda!"Em"Beed ef!D.C.!||
P:Coda
!coda!Beed e2gf| "C(E)"edBA "D(F)"GEDE "G"G4-!fermata!G2 |]
P:Variations/embellishments
"_v1"Be||"_v2"dG||"_v3"(3ege||"_v4"eBdB ABGA||"_v5"ABGA||"_v6"A/B/AGA||"_v7"(3GGG||"_v8"BeeB||||"_v9"efge||"_v10"eage||"_v11"e2(3gfe||`,
			references: [
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-may-2024/?track=8",
					artists: "Seán Maguire, fiddle",
					notes: "The skylark; Maud Miller"
				},
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-october-2025/?track=9",
					artists: "Seán Maguire, fiddle",
					notes: `Joe O'Dowds; Skylark; Maud Millar
He only plays Maud Millar once, in F, sandwiched in between the Skylark. Good stuff!`
				},
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-july-2025/?track=3",
					artists: "Andy McGann, fiddle, speech; Felix Dolan, piano",
					notes: "Maud Miller; Hand me down the tackle [Tom Steele's]"
				},
				{
					url: "https://www.youtube.com/watch?v=Mk5llmB-rLY",
					artists: "Brid Harper, fiddle; Harry Bradley, flute",
					notes: "Maud Miller; Donegal reel"
				}
			],
			theSessionId: 1177
		},
		{
			groups: "su",
			parts: "AABB",
			abc: `X:1
T:Lad O'Beirne’s
C:Lad O’Beirne 
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2316#setting2316
N:Setting entered in thesession by user “jdicarlo” on 2003-12-28
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Fmajor
|:d2cA dAcA GcAF GAFD|CF~F2 CFAc dcde fagf|
d2cA dAcA GcAF GAFD|CF~F2 DFBd [1 cbag f3e:|2 cbag f3g||
a2gf afgf dgfd cFAd|c2Bd cdfa gfga g2fg|
af~f2 afgf dgfd cFAd|c2Bd cdfa gfga f3g|
a2gf afgf dgfd cFAd|c2Bd cdfa gfga bagf|
~a3g ~f3c dcfd cAFD|CF~F2 DFBd cbag f3e||`,
			theSessionId: 2316
		},
		{
			abc: `X: 1
T: Gigue Du Plateau
C:Jean Claude Belanger
R: reel
M: 4/2
L: 1/8
K: F# aeol
cFAc fdBF cFce dFBd|cFAc BdcB`,
			theSessionId: 15517
		},
		{
			abc: `X:1
T:Hand Me Down The Tackle
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/800#setting800
N:Setting entered in thesession by user “b.maloney” on 2002-06-23
K:Dmajor
|:dD~D2 FDFA|dfaf gfec|dD~D2 FDFA|GFEF GABc|
 dD~D2 FDFA|dfaf gfec|d2 ec dBAF|GFEF GABc:|
 d2 fd Adfd|~d2 fd edBc|d2 fd Adfd|BdAG FDDA|
 [1 d2 fd Adfd|cdef ~g2 fg|afge fede|BdAG FDD2:|
 [2 ~a3b agfa|~g2 ef gbag|faeg fdAF|GFEF GABc||`,
			theSessionId: 800
		},
		{
			abc: `X:1
T:Reel des Éboulements
R:reel
L:1/16
M:4/4
O:Quebec
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2911#setting2911
N:Setting entered in thesession by user “jdave” on 2004-04-28
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Amajor
|:aA~A2 cAeA Bcde f2fg|aA~A2 cAeA fdge ~a3g|
aA~A2 cAeA Bcde f2fg|agfe fedc[1 dfec A2fg:|2 dfec A2ed||
cAEA cAeA Bcde f2ed|cAEA cAeA fdge a2ed|
cAEA cAeA Bcde f2fg|agfe fedc[1 dfec A2ed:|2 dfec A2AF||
EAAB cABA GABc dBEB|GBEB GBEB GBEB A2cA|
eAAB c2BA GABc defg|agfe fedc[1 dfec A2AF:|2 defg a2||`,
			parts: "AABBCC",
			theSessionId: 2911
		},
		{
			abc: `X:1
T:The Maids Of Castlebar
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1949#setting1949
N:Setting entered in thesession by user “fidicen” on 2003-09-05
K:Dmajor
ABc||dD (3DDD EDB,E|DEFA BAFA|d2cd (3Bcd AF|DEFD EDB,D|
 FD (3DDD EDB,E|DEFA BAFA|dfec dBAG|FDEF D2Bc|
 dD (3DDD EDB,E|DEFA BAFA|dDcD BDAD|DEFD EDB,D|
 FD (3DDD EDB,E|DEFA BAFA|dfec dBAG|FDEF D4|
 |:{^g}a2^ga fd (3ddd|fdad fddf|(3gfe be geef|(3gfe be geeg|
 ~f3a ~g3e|fdec dcBA|Bcde (3f^ga ec|dBAG FDD2:|`,
			theSessionId: 1949
		},
		{
			abc: `X:1
T:Dr. Gilbert's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/129#setting129
N:Setting entered in thesession by user “Will Harmon” on 2001-06-08
K:Eminor
gf|:eBBA A~B3|dBAc BAGF|EDB,D G2 FG|EDB,E DB,A,G,|
 B,E (3EEE EDB,D|GE (3EEE EFGA|(3Bcd ed Bdgb|afdf efgf:|
 |:e~B3 g~B3|defg afdf|(3ggg bg fgaf|egfd e~B3|
 afdf edB^c|dBAF FEDF|EAcA Bdgb|afdf efgf:|`,
			theSessionId: 129
		},
		{
			abc: `X:1
T:The Humours Of Lissadell
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/649#setting649
N:Setting entered in thesession by user “Caoimghgin” on 2002-04-18
K:Edorian
gf|:eB~B2 eBdB|AF~F2 EDB,A,|B,E~E2 B,EGE|FB~B2 FBdf|
 eB~B2 eBdB|AF~F2 EDB,A,|B,E{G}ED EFGA|(3Bcd ed e2gf:|
 |:eB~B2 A2FA|d2 df edef|df~f2 dfbf|afdf edBc|
 d2 fd BcdB|AF~F2 ABde|~f2ef dfbf|afdf e2gf:|`,
			theSessionId: 649
		},
		{
			abc: `X:1
T:Julia Delaney's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/589#setting589
N:Setting entered in thesession by user “b.maloney” on 2002-03-13
K:Ddorian
|:dcAG ~F2EF|~E2 DE FD D2|dcAG FGAA|Addc d2 fe:|
 |:f2fe fagf|ecgc acgc|f2fe fagf|edcG Add2:|`,
			theSessionId: 589
		},
		{
			abc: `X:1
T:Molloy's Favourite
C:Paddy Killoran
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1941#setting1941
N:Setting entered in thesession by user “Conway” on 2003-09-02
N:*abc-tools: convert to M:4/4 & L:1/16*
N:(edited after importing)
N:Goes well in a set after Maud Millar.
K:Dmajor
d2Ad fdAF GFEF GABc|d2Ad fdAF GAAG FDDd|
dcde fdAF GFEF GABc|d2Ad fdAF GAAG FDD2|
fggf gbag fggf gfeg|fggf gbag (3fga ea fddc|
dfaf gbag fgaf gfeg|feec dcBA ^GABc dgfe||`,
			theSessionId: 1941,
			parts: "AABB",
			norbeckId: 565
		},
		{
			abc: `X:1
T:The Tempest
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-27,
N:from https://thesession.org/tunes/1004#setting14222
N:Setting entered in thesession by user “birlibirdie” on 2012-07-19
K:Edorian
|:e2dB AFF2|EFdF eFdF|e2dB AF F2|EFBF AFEF|
 e2dB AFF2|EFdF eFdF|EFGB AFdF|FEdA FEE2:|
 e2fe dBAB|Beed BAFA|e2fe defg|fedf e3B|
 fgeg fedB|edBA BAFA|EFGB AFdF|FEdA FEE2:|`,
			references: [
				{
					artists: "Denis Ryan, fiddle",
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=15"
				}
			],
			theSessionId: 1004,
			theSessionSettingId: 14222
		},
		{
			abc: `X:1
T:Johnny When You Die
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/15252#setting5373
N:Setting entered in thesession by user “Avery” on 2005-12-28
K:Eminor
e2 dB eBdB|A2 GA Bd d2|e2 dB eBdB|A2 GA BGBd|
 e2 dB eBdB|A2 GA BAAB|GB B2 GBdB|A2 GA BG G2||
 g2 fg egde|g2 fg eaaf|g2 fg egdB|A2 AG BGBd|
 g2 fg egde|gbag eaaf|gbag egdB|A2 GA BG G2||`,
			theSessionId: 15252,
			theSessionSettingId: 5373
		},
		{
			aka: "The Connacht",
			abc: `X:1
T:Devils Of Dublin
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/538#setting538
N:Setting entered in thesession by user “Will Harmon” on 2002-02-09
K:Dmajor
|:d2dA BAGB|AFBF A~F3|Ad(3ddd Adfd|(3efe df e~B3|
 d2dA BAGB|AFBF A~F3|ABde fdce|1 dBAG FDFA:|2 dBAG FDD2||
 |:agfe~f3e|dcBA BAFB|Ad(3ddd Adfd|(3efe df e~B3|
 a2ag ~f3e|dcBA BAFB|ABde fdce|1 dBAG FDD2:|2 dBAG FDFA||`,
			references: [
				{
					artists: "Denis Ryan, fiddle; Cathal McConnell, flute",
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=17",
					notes: "The Connacht; Cooley's; The Bucks of Oranmore"
				}
			],
			theSessionId: 538
		},
		{
			abc: `X:1
T:Da New Rigged Ship
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/880#setting880
N:Setting entered in thesession by user “Musicalbison” on 2002-08-08
K:Adorian
eg|a2 ab ageg|a2 ab agef|g2 gg fgag|f2 d2 d2 eg|
 a2 ab ageg|a2 ab agef|g2 gg fgag|f2 d2 d2 ed||
 ^cAcA B2 ed|^cAcA E2 ed|^cAcA B2 ed|^c2 A2 A2 ed|
 ^cAcA B2 ed|^cAcA E2 ed|^cAcA B2 ed|^c2 A2 A2 AB||
 |:cdec BcdB|ABAF GF E2|cdec BcdB|1 c2 A2 A2 AB:|2 c2 A2A2||`,
			theSessionId: 880
		},
		{
			abc: `X:1
T:The Shetland Fiddler
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/97#setting97
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
K:Dmajor
|:AB|d2fd Adfe|defg afdf|e2 ge Bege|cdef gece|
 d2fd Adfe|defg afdf|(3fga fd (3fga fd|Bgec d2:|
 |:cd|eAfA gAaA|eaaf gfed|AeBe cede|efed cABc|
 dAeA fAgA|eaaf gfed|(3fga fd (3fga fd|Bgec d2:|`,
			theSessionId: 97
		},
		{
			abc: `X:1
T:The Wild Irishman
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1027#setting1027
N:Setting entered in thesession by user “Mark Cordova” on 2002-10-10
K:Dmajor
|:d2fd gefe|dfed cdec|d2fd gefd|g2fe dcBc|
 d2fd gefe|dfed cdeg|~f3d ~g3e|cdec dcdf:|
 |:edcB ABcd|eA~A2 eAfA|edcB A2de|fgfe dcdf|
 edcB ABcd|eA (3AAA eAfA|edcB ~A3e|fgfe d3c:|`,
			theSessionId: 1027
		},
		{
			abc: `X:1
T:The Humours Of Ballyconnell
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1428#setting1428
N:Setting entered in thesession by user “milesnagopaleen” on 2003-02-11
K:Dmajor
|:A|defe dBAF|BFAF E3A|defe dBAF|BFAF D3:|
 E|:F/E/DAD BDAD|G/F/EBE G/F/EBE|F/E/DAD FA A2|1 B/c/dAF D2DE:|2 B/c/dAF Defg||
 |:a2af a3f|gece gece|faaf abag|1 faec defg:|2 faec d3||`,
			theSessionId: 1428
		},
		{
			abc: `X:1
T:Pointe Au Pic
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/6183#setting6183
N:Setting entered in thesession by user “Ken Brown” on 2006-09-11
K:Cmajor
geg|:decd BcAB|GG G3 geg|decd BcAc|BB B3 geg|
 decd BcAc|BB B4 g2|ageg agec|GG G3 gec|
 decd BcAB|GG G2 G2 AB|c2 Bc d2 c2|AGAB AGAB|
 c2 Bcde cd|eceg a3 e|gffg fdAB|1 c4 cgeg:|2 c4 B4||
 A3 {A}B cBcd|eaae aAaa|eaae aAaa|eaae abae|
 {DEF}G3 {G}A BGBd|gg g3 GBd|gg g3 GBd|g^fga g=fed|
 A3 {A}B cBcd|eaae aAaa|eaae aAaa|eaae a2 b2|
 c'4 c'2 ef|g^fga gecd|egec dedB|1 c6 B2:|2 c2 z2 [c4E4]||`,
			theSessionId: 6183
		},
		{
			abc: `X:1
T:Mary McMahon
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1934#setting1934
N:Setting entered in thesession by user “Dr. Dow” on 2003-09-01
K:Dmajor
|:fdec d2AG|FGAB =cAGc|Ad~d2 fded|(3Bcd ef geag|
 fdec d2AG|FGAB =cAGc|Ad~d2 fdec|Addc d2e:|
 |:~f3g a2ga|bgag fdde|~f3g afga|bgaf g2ag|~f3g a2ga|
 bgag fdda|1 bgaf gbag|fdef g2ag:|2 bgaf gfed|(3Bcd ef gaag||`,
			theSessionId: 1934
		},
		{
			abc: `X:1
T:Saint Anne's
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/103#setting103
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
K:Dmajor
|:fedf edcB|A2FA DAFA|B2GB EBGB|A2FA DAFA|
 fedf edcB|A2FA DAFA|BGed cABc|eddc d2 de:|
 |:f2fg fedc|Bggf g2gf|edcB ABce|baa^g abag|
 f2fg fedc|Bggf g2gf|edcB ABcd|eddc d2 de:|`,
			theSessionId: 103
		},
		{
			abc: `X:1
T:The Pinch Of Snuff
R:reel
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2610#setting2610
N:Setting entered in thesession by user “Dr. Dow” on 2004-03-06
K:Dmixo
|:fage d2dB|AD (3FED EFGB|A3B cGcd|ed (3B^cd efge:|
 f2df afdf|f2df efge|f2df afdf|eA (3B^cd efge|
 f2df afdf|f2df efge|fa~a2 afdf|eA (3B^cd efge||`,
			theSessionId: 2610
		},
		{
			groups: "ALORA",
			abc: `
X: 1
T: Patsy Geary's
R: slide
M: 12/8
N: H. Norbeck has this as a single jig rather than a slide. (I’m not sure, meself!)
L: 1/8
Z:abc-transcription Malcolm Schonfield %2025-03-26
Z:abc-transcription used this score as a starting point: https://thesession.org/tunes/325#setting325
K: D
P:Ⅰ
AG|:"D"F2 A AFA "(Dsus4?)"B=cB A2 G|"D"F2 A d2 e ~f3 fef|
"G"~g3 fgf "D"efe d2 B|1 "D"ABA AFD "A"~E3 EAG:|2 "A" A2d f2e "D" ~d3 d2 e||
P:Ⅱ
|:"D"f2 e f2 e f2 e fga|"D"ABA BAF ABA ABd|
"A"efe efe efe "(D)"dfa| "G"baf "A"afe "D"~d3 d2 [1 e:| [2 A||
`,
			theSessionId: 325,
			norbeckId: 6,
			parts: "AB"
		},
		{
			abc: `X:1
T:Bedford Cross
R:slide
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/7444#setting7444
N:Setting entered in thesession by user “Nigel Gatherer” on 2007-07-04
N:(edited after importing)
K:Amix
|:e3 ede f2e d2f|edB d2B A2B d3|e3 ede f2e d2f|
 [1 edB d2B A3 ABd:|2 edB d2B A3 A2||
 a|a2e ede f2e d2f|edB d2B A2B d2a|a2e ede f2e d2f|
 [1 edB d2B A3 A2:|2 edB d2B A3 ABd||`,
			theSessionId: 7444,
			norbeckId: 85,
			parts: "AABB"
		},
		{
			abc: `X:1
T:Bill The Weaver's
R:slide
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1527#setting1527
N:Setting entered in thesession by user “gian marco” on 2003-03-17
K:Dmajor
g3|:fed B2d A2d F2B|A2F DEF E3 E2g|
 fed B2d A2d F2B|A2F EFE D3 D2g:|
 |:fef a2a baf a2f|fef a2f g3 f2e|
 [1fef a2a baf a2f|d2f a2f d3 d2g:|
 [2fga efg fed B2d|ABA GFE D3||`,
			theSessionId: 1527
		},
		{
			abc: `X:1
T:Hats Off To Dodd
C:Pádraig Rynne
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/11427#setting11427
N:Setting entered in thesession by user “zaivanbuijs” on 2011-08-16
K:Gminor
D2G GFD G2F|D2G GFD Bcd|c2A AGF CDF|D2G GFD G2F|
 D2G GFD G2F|D2G GFD Bcd|c2A AGF CDF|D2G B2A G2F|
 G3 GFG Bcd|c3 cBc d2g|f2d dcB Bcd|cAF AGF G2F|
 G3 GFG Bcd|c3 cBc d2g|f2d dcB Bcd|cAF AGF G3||`,
			theSessionId: 11427
		},
		{
			abc: `X:1
T:Trotting To Larne
C:John T. Blair
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3511#setting3511
N:Setting entered in thesession by user “lottiemaus” on 2004-09-09
K:Amajor
|:E2 c E2 c cBA|E2 c E2 c cBA|F2 A D2 F AGF|E2 C EAB cAF|
 E2 c E2 c cBA|F2 d F2 d dcB|G2 B E2 e fed|1 cec BAG AGF:|2 cec BAG Aag||
 |:~f3 edc ~e3|efe edc eag|~f3 fed e2 c|dcB BcA GFE|
 EAc A2 E A2 =G|FAd A2 F ABA|GBe d2 B fed|1 cec BAG Aag:|2 cec BAG A3||`,
			theSessionId: 3511
		},
		{
			abc: `X:1
T:Farewell To Whalley Range
C:Michael McGoldrick
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2410#setting2410
N:Setting entered in thesession by user “kiwi” on 2004-01-19
K:Amajor
|:F2c BA~F- F2E|F2c BAc fec|B3 BAB c2A|1 ~B3 BAB cBA:|2 ~B3 BAB cef||
 a3 fec fec|B3 BAB cef|a3 baf afe|fec Bce fec|
 a2f fec fec|B3 BAB cef|a3 baf afe|fec fec BAB||`,
			theSessionId: 2410
		},
		{
			aka: "Aoibhneas Éilis Ní Cheallaigh",
			groups: "ALORA,SU",
			abc: `X:1
T:Elizabeth Kelly's Delight
R:slip jig
L:1/8
M:9/8
N:Based on a setting entered in thesession by user “Will Harmon” on 2002-09-07
N:Chords by Malcolm Schonfield
N:A pentatonic tune
K:Adorian
|:"A-"A3 ABA AGE|"A-"A2 E"G"G2 E DEG|"A-"A3 ABA AGE|"G"~G3 G2 E DEG:|
 |:"A-"c2 A BAG AGE|"A-"cBA "E-"BGE DEG|"A-"c2 A BAG AGE|"G"~G3 G2 E DEG:|`,
			references: [
				{
					url: "https://thekellyfamily.bandcamp.com/track/the-humours-of-kilclougher-elizabeth-kelly-s-delight-jig-slip-jig",
					artists: "The Kelly Family",
					notes: "1:43 onwards"
				}
			],
			theSessionId: 953
		},
		{
			groups: "ALORA,su",
			origin: "Ireland",
			rhythm: "slip jig",
			abc: `
X: 1
T: Kid On The Mountain
N: 1. I attempt here to write the notes more or less as played by Michael Coleman on the It Was Mighty! album.
N: 2. With added chords - version of 2024-07-18
N: 3. Using 16/8 rather than the standard 9/8 on purpose (personal preference).
N: 4. The E part is slightly different from today’s standard version;
N: and the F part isn’t well known at all.
D: It Was Mighty! the Early Days of Irish Music in London
S: Michael Coleman
F: https://open.spotify.com/track/6ywXKcy4P31JiC9vqW2ru9
R: slip jig
Q: 3/8 = 70
M: 18/8
L: 1/8
Z:abc-transcription Malcolm Schonfield%240620, 21, 27, 240718, 260209
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
K: E minor
|:[P:A]"Em"E3 FEF G2F E3 BcA "Bm7"BGD|"Em"E3 FEF "G"G2A BAG "D"FAG FED:|
|:[P:B]"G"BGB "D"AFA "G"G2D GAB dge "Bm7"dBA|"G"BGB "D"AFA "G"G2A BAG "D"FAG FED:|
|:[P:C]"Em"~g3 eBe e2f ~g3 efg "Bm7"afd|"Em"~g3 eBe ega bag "D"fag fed:|
|:[P:D]"Em"eBB e2f gfg eBB efg "Bm7"afd|"Em"eBB e2f g2a bag "D"fag fed:|
|:[P:E]"Em"edB "D"dBA "G"G2A Bee "Bm7"dBA BGE|"G"edB "D"dBA "G"G2A BAG "D"FAG FED:|
|:[P:F]"Em"B,EE ABG "Bm7"E2D "Em"B,EE EFG "Bm7"AFD | "Em"B,EE ABG E2B BAG "D"FAG FED :|`,
			incipit: `
X: 1
M: 18/8
L: 1/8
K: E minor
E3 FEF G2F E3 BcA BGD|E3 FEF G2A`,
			parts: "AABBCCDDEEFF",
			references: [
				{
					artists: "Michael Gorman",
					url: "https://music.youtube.com/watch?v=Ftm1147osmo"
				},
				{
					artists: "Andy McGann",
					url: "http://www.juneberry78s.com/sounds/ListenToIrishDance.htm",
					notes:
						"1. Another six-part version; the sixth part is different to the M. Gorman one. 2. Played like a “normal” slip jig; I would write this one down in 9/8, not in 18/8"
				}
			],
			theSessionId: 52,
			norbeckId: 31,
			itiId: 1023
		},
		{
			abc: `X:1
T:Gort Na Mona
C:Michael Rooney
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2087#setting2087
N:Setting entered in thesession by user “Peter Piper” on 2003-10-25
K:Gmajor
|:G2B BAG ABc|d2g gfd BcA|G2B BAG ABc|1 ded ded ((3BcB) A:|2 ded dge fga||
 b2a bge dgb|a2a aga bge|e2e edB ABc|d2d dge fga|
 b2g gba ged|e2e ede ged|A2A ABG ABc|d2d dgf dcA||`,
			theSessionId: 2087
		},
		{
			abc: `X:1
T:Tír Rafartaigh
C:Michael Rooney
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2143#setting2143
N:Setting entered in thesession by user “heike” on 2003-11-11
K:Dmajor
D2F FED EFA|d2f fed efa|g2f ede fdA|B2B BAF AFE|
 D2F FED EFA|d2f fed efa|g2f ede fdA|B2B BAF EFG|
 AB/c/d def ede|f2a abf afd|g2f ede fdA|B2B BAF EFG|
 AB/c/d def ede|f2a abf afd|g2f ede fdA|B2B BAF AFE|`,
			theSessionId: 2143
		},
		{
			abc: `X:1
T:The Whinny Hills Of Leitrim
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/8976#setting8976
N:Setting entered in thesession by user “didier” on 2008-10-04
K:Gmajor
|:AAA dcA d2c|AGA dcA GFG|AAA dcA d2e|fag ege dBG:|
 GBB GBd ~g3|GBB GBG FED|GBB GBd gag|fgf efe dBA|
 GBB GBd ~g3|GBB GBG FED|GBB GBd gag|fgf efe dBG||`,
			theSessionId: 8976
		},
		{
			abc: `X:1
T:The Irish Girl
R:slip jig
L:1/8
M:9/8
N:A slip jig found on at least two recordings by fiddler Jimmy Power. Simple,
N:catchy, and I don't know of two many common slip jigs in A mixolydian... so here
N:it is.
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/17637#setting34009
N:Setting entered in thesession by user “Daniel Parker” on 2019-01-09
K:Amixo
|:c2A AEA ABA|cBc Ace ded|c2A AEA ABA|BGB gfe ded:|
 |:cde efd e3|cae efd ged|cae efd efg|1 agf gfe dBG:|2 agf gfe ded||`,
			theSessionId: 17637,
			theSessionSettingId: 34009
		},
		{
			aka: "The Fair Cannavans",
			abc: `X:1
T:Na Ceannabháin Bhána
R:slip jig
L:1/8
M:9/8
N:1. It’s interesting to compare this with the Swaggering,
N:which has a similar contour.
N:2. Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/612#setting612
N:Setting entered in thesession by user “b.maloney” on 2002-03-22
K:Gmajor
|:B2 G AGE GED|E/F/GE DEG A2 c|BAG AGE GED|E/F/GE DEF G2 A:|
 Bd/d/d edB BAG|Bd/d/d edB A3|Bd/d/d edB BAG|GED DEF G3:|`,
			theSessionId: 612,
			references: [
				{
					url: "https://www.facebook.com/watch/?v=10150769767748406",
					notes: `1. You can hear it sung here.
2. The group is called [Floating Crowbar](https://www.floatingcrowbar.com).
3. The video’s title is “Na Ceannabhain Bhana (The Fair Cannavans)/The Black Rogue/The Emi” but the last jig is Donnybrook Fair. “The Emi” may be a typo - dunno.`
				},
				{
					notes: "See the Frieze Britches for a set by McMahon & Hill"
				},
				{
					url: "https://en.wikipedia.org/wiki/Na_Ceannabh%C3%A1in_Bh%C3%A1na"
				}
			]
		},
		{
			abc: `X:1
T:The Humours Of Derrycrossane
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1550#setting1550
N:Setting entered in thesession by user “Dr. Dow” on 2003-03-27
N:(edited after importing)
K:Gmajor
|:BcB BAB c3|BAG B/c/dB ABc|BAG B/c/dB c2e|1 dBG GAF G2A:|2 dBG GAF GB/^c/d||
 g3 ed=c Bcd|ecA ABG A2d|~g3 edc Bcd|gdB G/A/BA GB/^c/d|
 g3 ed=c Bcd|ecA ABG A2d|def gfe def|g/a/bg agf ged||`,
			theSessionId: 1550
		},
		{
			groups: "alora",
			abc: [
				`X:1
T:The Snowy Path
C:Mark Kelly
R:slip jig
L:1/8
M:9/8
N:Imported from https://thesession.org/tunes/104#setting104
N:Based on a setting entered in thesession by user “Jeremy” on 2001-05-25
N:(edited after importing)
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
K:Dmajor
|"D"F2A B2F A2F|"G"G2B d2e dBG|"D"F2A B2F A2F|"A"E2D E2F GFE|
 "D"F2A B2F A2F|"G"G2B d2e dBG|"Bm"F2A B2F A2F|"A"E2D E2F GAB||
 "F#m"c3 c2e d2c|"G"B2G B2c d2e|"Bm"f3 f2e d2B|"A"A2G F2G A2B|
 "F#m"c3 c2e d2c|"G"B2A B2c d2e|"D"d2A B2F A2F|"A"E2D E2F GFE||`
			],
			references: [
				{
					artists: "Altan, 1991",
					url: "https://music.youtube.com/watch?v=BP_nsOCubf0",
					notes: "https://www.discogs.com/release/2408131-Altan-Harvest-Storm"
				}
			],
			theSessionId: 104
		},
		{
			abc: `X:1
T:Will You Come Down To Limerick
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2337#setting2337
N:Setting entered in thesession by user “gian marco” on 2004-01-02
K:Gmajor
d|:cAG GAG GBd|cAG GAB cAd|cAG GAG GAG|1 cAA fed cAd:|2 cAA fed cAG||
 ddg gbf g2f|ddg gfg abc'|bag afa gfd|1 cAA fed cAG:|2 cAA fed cAd||`,
			theSessionId: 2337
		},
		{
			groups: "su",
			abc: `X:1
T:The Turf Cutter
C:Paddy O’Brien (Offaly)
R:slip jig
L:1/8
M:9/8
N:Altan play this unusual slip jig as the second tune in this set:
N:https://www.youtube.com/watch?v=Gj001lFt0k4 Does anyone know the name of it?
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/14242#setting25937
N:Setting entered in thesession by user “hnorbeck” on 2015-03-07
K:Adorian
|:edB ABA Agf|edB def gfg|edB ABA ABA|G2B dB/c/d dgf:|
 |:efg aba a2g|efg aba ged|1 efg aba a2g|ede age dBG:|
 [2 ede aga b2a|gfg age dBG||`,
			theSessionId: 14242,
			theSessionSettingId: 25937,
			norbeckId: 81
		},
		{
			abc: `X:1
T:Comb Your Hair And Curl It
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1030#setting1030
N:Setting entered in thesession by user “EldKatt” on 2002-10-11
K:Edorian
|:B2E E2F G2A|Bcd e2c d3|B2E E2F G2A|~B3 ABG FED:|
 |:g2e e2d efg|f2d d2c def|g2e e2d e2c|dcB AGF G2E:|`,
			theSessionId: 1030
		},
		{
			groups: "ALORA,SU",
			badges: "crooked",
			abc: `
%The Spanish Lady
%abc-2.1
X:1
T:The Spanish Lady
M:3/4
S:Brian Dunne
R:song
Q:1/4=70
I:abc-charset utf-8
Z:abc-transcription Malcolm Schonfield% 2024-07-(19,25,26); 08-07;11-21
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
F:https://s3-eu-west-1.amazonaws.com/audio.itma.ie/josephinekeegan/113itmamp3.mp3
N:As sung by Brian Dunne, 25 May 2011
N:0. I find the overall rhythmic structure fascinating: (3+4)+(3+4)+(4+3+4) (=25). 
N:Beautiful; it just simply works! I think you could call this a crooked tune.
N:1. There are full details about the recording this is based on at the two following links:
N:a. https://itmacatalogues.ie/Portal/Default/en-GB/RecordView/Index/47670
N:b. https://www.itma.ie/playlists/josephine-keegan/
N:Anyway the recording is highly recommended, with lovely instrumentals by:
N:McKenna, Seán Óg, banjo; Gairbhí, Ide, concertina; Dunne, Brian, guitar
N:All the above information is from itma.ie.
N:2. The lyrics are very close to those given here:
N: http://www.celticlyricscorner.net/domhnaill/spanish.htm
N:It seems to be more or less based on the version on the album 
N: Idir an Dá Sholas (1999) by Maighread Ní Dhomhnaill, Tríona Ní Dhomhnaill and Dónal Lunny.
N:3. There’s a lot of other information about this song and its variants here:
N:https://mainlynorfolk.info/nic.jones/songs/thespanishlady.html
N:4. Interesting things are happening for the chord/harmony backing in bar number 6. 
N:There’s a sort of walking bass feel going 
N:downwards stepwise: D C B A. I’m not 100％ sure about the chords I put down there; 
N:there may well be good alternatives.
N:5. I decided not to attempt to give any rhythmic details for how
N:the song was actually sung. There’s an enormous amount of rhythmical variation in there, 
N:sometimes it’s ahead of the beat, sometimes not… I think a precise transcription would 
N:be fearsomely complicated and far beyond anything I can reasonably attempt.
N:6. Here are the rest of the lyrics: 
N:Well I stopped to look but the watchman passed
N:Says he, “Young fella, now the hour is late
N:And off wit’ you now or I will wrestle you
N:Straight to the Bridewell gate”
N:But I got a look from the Spanish lady
N:Hot as a fire of amb’ry coal
N:And in all me life I ne’er did see
N:A maid so neat about the sole
N:(Chorus)
N:As I was walking through Dublin City
N:As the dawn of day was o’er
N:Well who should we see but the Spanish lady
N:When I was weary and footsore
N:But she had a heart so full of loving
N:And all her love she longed to share
N:And in all me life I ne’er did see
N:A maid who had so much to spare
N:(Chorus)
N:Well I’ve wandered north and I’ve wandered south
N:By Stoneybatter and Patrick’s Close
N:And up around by the Gloucester Diamond
N:Back by Sally Napper Tandy’s house
N:But old age put her hand upon me
N:Cold as a fire of ashey coals
N:And gone is the lovely Spanish lady
N:Neat and sweet about the soles
N:(Chorus)
N:Well around and around goes the wheel of fortune
N:And where it goes it wearies me
N:Oh fair young maids are so deceiving
N:Sad experience teaches me
N:(Chorus)
N:7. I did a little research and it seems Bridewell Gate, Stoneybatter, 
N:Patrick’s Close and the Gloucester Diamond are places in Dublin. No idea
N:about Sally Napper Tandy’s house though.
L:1/8
K:Dmajor
%%staffsep 54
%%leftmargin 15
%%rightmargin 15
%%staffwidth 800
%%writefields N false 
%
A, | "D"DD DE FE | [M:4/4]"Bm" D<B,-B,2 z4 |[M:3/4] "D" D>D DE FA | [M:4/4] "G"B4z2z
w: As I was walking through Dub-lin ci-ty * At the hour of twelve at night
c | "Bm"dc BA "F#m"FE DE | [M:3/4] "Em7"FF "F#m7"FE "G6"DB, | [M:4/4]"A"A,4 z2z
w:Well who should~we see but~a fair young fe-male Washing her feet by can-dle light
A,| [M:3/4]"D"D>D yDE FE | [M:4/4]"Bm" DB,-B,2 z4, | [M:3/4] "D"D>D DE FA | [M:4/4] "G"B4 z2z
w: Well first she washed~them and then she dried them * Over a fire of amb-’ry coal 
c | "Bm"dc BA "F#m"FE D>E | [M:3/4] "Em7"FF "F#m7"FE "G6"DB, | [M:4/4]"A"A,4 z2z
w: And~in all me life I ne’er did see A maid so neat a-bout the sole
[P:Chorus]F/E/| [M:3/4]"D"DD DE FE | [M:4/4] "Bm"DB,-B,2 z4, | [M:3/4] "D"D>D DE FA | [M:4/4] "G"B4z2z
w: She had twen-ty eight-een six-teen four-teen * Twelve ten eight six four two none 
B/c/ | "Bm"dc BA "F#m"FE DE | [M:3/4] "Em7"FF "F#m7"FE "G6"DB, | [M:4/4]"A"A,4 z2z
w: She had nine-teen seven-teen fif-teen thir-teen eleven nine seven five three and one`
		},
		{
			abc: `X:1
T:The Low Highland
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3012#setting3012
N:Setting entered in thesession by user “Erik-Fiddler” on 2004-05-14
K:Adorian
[A,2E2] ~(3A,/B,/A,/A, E>A,B,>A,|G,>A,B,>G D<G,B,>G,|[A,2E2] ~(3A,/B,/A,/A, E>A,B,>A,|G,>A,B,>G, (3A,B,A, G,>B,:|
 [A,E]>ba>g e>de>f|g2 ~(3g/f/g/g d>gB>G|A>ba>g e>de>f|(3gfe d>B (3ABA ^G>B|
 [AE]>ba>g e>^de>f|g2 ~(3g/f/g/g d>gf>g|(3agf g>e f>dA>F|(3GFE D>B, (3A,B,A, G,>B,||`,
			theSessionId: 3012
		},
		{
			abc: `X:1
T:The Glenlivet
C:James Scott Skinner
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/11206#setting11206
N:Setting entered in thesession by user “b.maloney” on 2011-04-30
K:Amajor
A,>CE>C D>FA>F|E>Ac>A B<B, B,>C|A,>CE>C D>FA>F|E>A B<e c<A [A,2A2]|
 A,>CE>C D>FA>F|E>A .d/.c/.B/.A/ B<B, B,>C|A,>CE>C D>FA>F|E>A B<e c<A [A,2A2]||
 {g}a>A c<f e>Ac>A|E>Ac>A B<B, B,>g|{g}a>A c<f e>Ac>A|E>A B<e c<A A>g|
 {g}a>A c<f e<c {g}a>A|e>Ac>A B<B, B,>C|A,>CE>C D>FA>F|E>A B<e c<A [A,2A2]||`,
			theSessionId: 11206
		},
		{
			abc: `X:1
T:Jimmy Lyons'
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/2918#setting2918
N:Setting entered in thesession by user “Erik-Fiddler” on 2004-04-28
K:Amajor
|:A,>EC>E (3D/D/D/D F>D|E>Ac>A B<B, B,2| ~A,2 A,>E (3D/D/D/D F>D |1 E>BG>B c<A A2:|2 E>BG>B c<A ||
 (3Ace||a>e (3fga e>Ac>A|d2 (3cdc B<B, B,2| a>ef>a e>Ac>A| E>BG>B c<A (3Ace|
 a>ef>a e>Ac>A|d2 (3cdc B<B,B,>C|A,>EC>E (3D/D/D/D F>D |E>BG>B c<A A2||`,
			theSessionId: 2918
		},
		{
			abc: `X:1
T:Dusky Meadow
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/7681#setting7681
N:Setting entered in thesession by user “drone” on 2007-09-04
K:Amixo
B,|~A,>A E>C D<G, D>B,|~A,>A E>C F<D E>C|D>E C>ED/C/B,/A,/ G,>B,|~A,>A E>D C<A, ~A,>B,|
 ~A,>A E>C D<G, D>B,|~A,>A E>C F<D E>C|D>E C>E D/C/B,/A,/ G,>d|c>e B/c/d/B/ c<A ~A||
 |:^g|~a>e c>A B<=G ~ =G>^g|~a>e c>A e<Ac>A|d>B c>A d/c/B/A/ =G>g|f/g/a/f/ e>a c<A ~A:|`,
			theSessionId: 7681
		},
		{
			abc: `X:1
T:Lucy's Fling
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/3007#setting3007
N:Setting entered in thesession by user “dafydd” on 2003-08-28
K:Amajor
|:AFEF AB c2|(3dcB cA BAFA|AFEF ABcd|efec (3BcB A2:|
 feae f2 af|eccA BAFA|feae f2 af|eccA (3BcB A2|
 feae f2 af|eccA BAFA|AFEF ABcd|efec (3BcB A2|`,
			theSessionId: 3007
		},
		{
			abc: `X:1
T:The Laird Of Drumblair
C:James Scott Skinner
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/170#setting170
N:Setting entered in thesession by user “JD” on 2001-06-29
K:Amajor
(3EFG|:A2c>A E>Ac>e|a2g>a f>ae>c|(3def (3efg (3aed (3cBA|(3Bcd (3cBA (3G FE (3dcB|
 A2c>A E>Ac>e|a2g>a f>ae>c|(3def (3efg (3aed (3cBA|1 (3GFE (3dcB A2 (3EFG:|
 [2 (3GFE (3dcB A2 (3efg|:a2e>a c>aA>a|(3cBA e>A a>ec>e|b2f>b d>bB>f|
 (3dcB f>B b>fd>f|a2e>a c>aA>a|(3cBA e>A a>ec>e|(3def (3efg (3aed (3cBA|
 [1 (3GFE (3dcB A2 (3efg:|2 (3GFE (3dcB A2||`,
			theSessionId: 170
		},
		{
			abc: `X:1
T:Stirling Castle
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1762#setting1762
N:Setting entered in thesession by user “cj” on 2003-06-19
K:Dmajor
|:A|D2 F>A D>A F<A|A,2 C>E A,>E C<E|D2 F>A D>A F<A|(3Bcd (3efg (3fed (3cBA|
 D2 F>A D>A F<A|A,2 C>E A,>E C<E|D2 F>A D>A F<A|(3Bcd (3efg f<d d:|
 A|d2 f>d g>e f>d|g2 e>d c>B (3ABc|d2 f>d g>e f>d|(3Bcd (3efg f<d d>A|
 d/d/d f>d g>e f>d|B2 c>d (3efd (3cBA|(3fga (3gfe (3dcB (3AGF|(3GAB (3ABc d2 d:|`,
			theSessionId: 1762
		},
		{
			abc: `X:1
T:The Highlanders
R:strathspey
L:1/8
M:4/4
N:This strathspey/march is from John Doherty's "The Floating Bow", on track 18
N:before "Wind That Shakes the Barley". It's a very interesting tune in that
N:Doherty seems to vary the placement of the three parts quite a bit, as is also
N:found in his playing of "The Further and the Deeper". In addition, Alan Ng lists
N:this tune as a march; however I see it more as a strathspey, as it lacks the
N:common march ending of successive quarter notes. Instead each part of this tune
N:ends on either a triplet or on the seventh scale degree. Cool tune, though,
N:obviously inspired by piping.
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/16343#setting30955
N:Setting entered in thesession by user “Daniel Parker” on 2017-09-03
K:Amixo
A2 e2 (3fed {f}e>d|(3cBA e>^g a>e (3cBA|G2 (c<d) (3edB (c<d)|(3BAG B>d g<d B<G|
 A2 e2 (3fed {f}e>d|(3cBA c>e a>e c>A|(3agf (3gfe (3fed (3ed=c|(3BAG B>d (3gfe (3dcB|
 A2 e>d c<e A<e|c<e A>^g a>e c>B|A2 e>d c<e A>c|(3BAG B>d g<d B<G|
 A2 e>d c<e A>d|(3cBA c>e a>e c>A|(3agf (3gfe (3fed (3ed=c|(3BAG B>d g<d B<G|
 a2 c/B/c a2 {cB}c<a|A2 c>e a>e c>A|a2 f>a g2 d>=c|(3BAG B>d g<d B<G|
 a2 c/B/c a2 {cB}c<a|A2 c>e a>e c>A|(3agf (3gfe (3fed (3ed=c|(3BAG B>d (3gfe (3dcB|`,
			theSessionId: 16343,
			theSessionSettingId: 30955
		},
		{
			abc: `X:1
T:Charlie O'Neill's
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/655#setting655
N:Setting entered in thesession by user “Will Harmon” on 2002-04-21
K:Eminor
A|BEBE cBcA|BEBE cAFA|BEBE cBcB|Addc BGGA|
 BEBE cBcA|BEBE cAFA|BEBE cBcB|Addc BGBd||
 (3gag fg (3BBB BA|G2 ag fdef|(3gag fg (3BBB BA|GBdc BGBd|
 (3gag fg (3BBB BA|G2 ag fdcA|GBdB cdef|gbaf g3 A||`,
			theSessionId: 655
		},
		{
			abc: `X:1
T:Angus Allan & Dan J's
R:strathspey
L:1/8
M:4/4
N:As played By Angus Allan Gillis and Dan J. Campbell.
N:---
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/14694#setting27107
N:Setting entered in thesession by user “Joe MacMaster” on 2015-08-30
K:Dmajor
O:Cape Breton
 F>G|:A>BA>F !uppermordent!E2F>uG|A>B!uppermordent!A>F A/A/A {A}!mordent!c2|d<BA>F !uppermordent!E>DE>F|1 D<B,!mordent!C>A,!uppermordent!D2(3DFG:|2 D<B,!mordent!C>A,!uppermordent!D2(3DDF||
 |:A>fa>f !mordent!g2f>e|d>fa>b !uppermordent!a>fe>f|d<B!uppermordent!A>F !uppermordent!E>D (3EEF|1 D<B, (3CCA,!uppermordent!D2 (3DDE:|2 D<B, (3CCA,!uppermordent!D2(3DFG||`,
			theSessionId: 14694,
			theSessionSettingId: 27107
		},
		{
			abc: `X:1
T:Dulaman Na Binne Bui
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/10313#setting10313
N:Setting entered in thesession by user “ceolachan” on 2010-03-01
K:Dmajor
A2 B>c d2 A>F|G2 E<D E2 G2|A<AB>c d2 F>G|A2 G<E D2 D2-|HD8||
 K: DMix
 A>GE>D C>DE<G|A>GE>D G2 G2|A>GE>D C>DE>G|A>AG>E D2 D2-|HD8||`,
			theSessionId: 10313
		},
		{
			abc: `X:1
T:Con McGinley's Highland
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/6366#setting6366
N:Setting entered in thesession by user “Erik-Fiddler” on 2006-11-13
K:Amixo
|:B/c/d[A3e3] f e^d e2|efed BA B/c/d|e2 efed .g2|BGGA BA B/c/d:|
 |:eaa^g a2 ed|c<AAB cdef|g2 .f/g/a g2 d=c|BGGA BA B/c/d:|`,
			theSessionId: 6366
		},
		{
			abc: `X:1
T:Pretty Marion
R:strathspey
L:1/8
M:4/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/24127#setting49877
N:Setting entered in thesession by user “DòchasLeoA” on 2024-03-10
K:Amixo
a|f2 e>c e>fae|f2 ec fBBa|f2 e>c e>fae|faec eAAa|
 f2 ec efae|f2 ec fBBa|f2 ec efge|faec eAA||
 ||a|eAec A/A/A ef|e<Ae>c f>BB>a|e<Ae>c e<f=g<e|f>ae>c e>AA>a|
 e<Ae>c A/A/A e>f|e>fe>c f>BB>=a|f2 e>c e>f=g<e|f>ae>c e>AA|`,
			theSessionId: 24127,
			theSessionSettingId: 49877
		},
		{
			origin: "England, Northumberland",
			abc: `X:1
T:The Lads Of Alnwick
R:three-two
L:1/8
M:3/2
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/1194#setting1194
N:Setting entered in thesession by user “Dr. Dow” on 2002-12-10
K:Amajor
|:{g}a4 e2fg agfe|(3cdcA2 .a2(A2 cdec)|a4 e2fg agfe|d2B2 {g}.f2(B2 d2f2):|
 |:ABcd (3efec2 (3efec2|ABcd (3efec2 e2{g}a2|ABcd (3efec2 (3efec2|Bcde {g}.f2(B2 d2f2):|
 |:(e2.a2) (cdec .a2)(c2|e2.a2) cdec d2(3fgf|(e2.a2) (cdec .a2)c2|Bcde {g}.f2(B2 d2f2):|
 |:ABcd efed cdec|efed cdec e2{g}a2|ABcd efed cdec|Bcde {g}.f2(B2 d2f2):|`,
			references: [
				{
					artists: "Kevin Lees, fiddle; Sebastian Bloch, guitar",
					url: "https://youtu.be/R4pu91Lt7sc",
					notes: "“The Good Tune”. 2020-08-06"
				}
			],
			theSessionId: 1194
		},
		{
			groups: "alora",
			name: "Johsefins Dopvals",
			abc: `X:1
T:Josefin's
C:Roger Tallroth
O:Sweden
R:waltz
L:1/8
M:3/4
N:Here's a two-part arrangement by The Rude Mechanicals.
N:---
N:Imported from https://thesession.org/tunes/1016#setting36756
N:Setting entered in thesession by user “Bazza” on 2019-12-09
K:Gmajor
M:3/4
 V:1
 "G"D2 G2 A2|"Gmaj7"B2 d2 c2|"Em7"B2 A2 G2|"Bm7"D4 E2|"Cmaj7"C4 CC|"Am7"E2 G2 F2|"D7"E6|D6|
 "G"D2 G2 A2|"Gmaj7"B2 d2 c2|"Em7"B2 A2 G2|"Bm"D4 E2|"Am7"C4 CC|"Bm7"D2 F2 G2|1 "D"A6-|A6:|2 A6-|A2 B2 c2||
 |:"G"d2 B2 d2|"Em"g4 f2|"Am7"e6|"Bm"d6|"C"c2 e2 d2|"Am7"c2 B2 A2|"Em7"B3 c B2|"D"A2 B2 c2|"Bm"d2 B2 d2|
 "Em7"g4 f2|"C"e6|"D"d6|"Am7"c2 e2 d2|"D7"c2 B2 A2|"Am9"B3 c B2|"D7"A2 B2 c2|"Em7"B2 A2 G2|"Bm"F4 G2|
 "C"G6|C2 D2 C2|"G"B,2 D2 G2|"D"F2 E2 F2||1 "G9sus4"G6|"D"A2 B2 c2:|2 "G"G6-|G6||
 V:2
 B,2 D2 F2|G2 F2 A2|G2 F2 E2|B,2 G,4|E2 G2 B2|c2 A2 d2|c2 A2 G2-|G2 F2 D2|
 G,4 G2-|G2 F2 A2|G4 E2|B,6|A,2 G2 E2|B,2 D2 E2|1 F4 D2|D2 C2 A,2:|2 F2 G2 F2|D2 G2 A2||
 |:B2 G2 F2|E2 B,2 D2|C2 A4|F4 B,2|E2 C2 B,2|A,2 G2 F2|G2 E4|F2 G2 A2|B2 D2 B,2|
 E2 D4|C2 G4|F2 A2 cB|A2 G2 F2|E2 D2 C2|D2 E2 G2|F2 G2 A2|G3 F E2|D2 B,4|
 CE GA Bc|ec AF GE|D2 GA B2|A2 c4-|1 c2 D2 E2|F2 G2 A2:|2 c2 B2 c2|[D6G,6B6]||`,
			references: [
				{
					artists:
						"Väsen - Olov Johansson, nyckelharpa; Mikael Marin, viola; Roger Tallroth, guitar",
					url: "https://youtu.be/_ZrfjHeFEr0",
					notes: "@ Gamla Teatern, Östersund 2010"
				}
			],
			theSessionId: 1016,
			theSessionSettingId: 36756
		},
		{
			groups: "su",
			abc: `X:1
T:Flatwater Fran
C:Phil Cunningham
O:Scotland
R:waltz
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/10668#setting10668
N:Setting entered in thesession by user “onscuba” on 2010-08-27
K:Gmajor
DE|:"G"G2G2DE|G2G2Bd|"C"e2d2G2|"G"B4DE|G2G2DE|"Am"A2A2GA|
 "Em"B2AG ED|"C"E4DE|"G"G2G2DE|G2G2Bd|"C"e2d2g2|"G"B4dB|
 "Am"A2AG AB|"Em"AGE2GE|"C"DEG2"D7"G2|1 "G"G4DE:|2 "G"G4Bd||
 |:"C"e2d2G2|"G"B4Bd|"C"e2d2G2|"G"B4Bd|"C"e2d2g2|"Em"B2dB AG|
 "Am"A2AG AB|"D"A4Bd|"C"e2d2g2|"G"B2dB AG|"D7"A2d3c|"Em"B3B AG|
 "Am"EA AG AB|"Em"AG E2GE|1 "C"DEG2"D7"G2|"G"G4Bd:|2 "C"DEG2"D7"A2|"G"G4||`,
			theSessionId: 10668,
			norbeckId: 12,
			parts: "AABB"
		},
		{
			abc: `X:1
T:Our Kate
R:waltz
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/8296#setting8296
N:Setting entered in thesession by user “geoffwright” on 2008-02-24
K:Dmajor
FG|:A3d AF|G2A2 FD|=C2 (D4|D4) FG|
 A3d AF|G4A2|(G6|G3)E FG|
 A3d AF|G2A2 FD|=C2 (D4|D4) B,2|
 =C3B, =C2|D4 D=C|(D6|1 D3)E FG:|2 D4||
 A2|:d3A= F2|=c3G E2|G2 (A4|A4) AB|
 =c3G E2|B3G E2|(A6|A4)FG|
 A3d AF|G2A2 FD|=C2 (D4|D4) B,2|
 =C3B, =C2|D4 D=C|(D6|D4)||`,
			theSessionId: 8296
		},
		{
			groups: "alora",
			abc: `
X:1
T:Flatbush Waltz
C:Andy Statman
R:waltz
L:1/8
M:3/4
N:An approximate version of what people at my local session in Kassel, Germany are
N:playing.
N:---
N:Imported into *tuneTable* on 2026-02-11,
N:from https://thesession.org/tunes/3809#setting36852
N:Setting entered in thesession by user “bravesentry” on 2019-12-18
K:Eminor
B2 Be BA|GF EF GA|B2Be BG|A3c BA|EF GA BG|AE Ac BA|G2GA =FG|E6|
 B2 Be BA|GF EF GA|B2Be BG|A3c BA|GA Bc dB|AE Ac BA|G2GA =FG|E6|
 g4 fe|f2 B2 B2|e2 d2c2|B6|c4 BA|B2 e2 ef|g3 f ga|f6|
 g4 fe|f2 B2 B2|e2 d2c2|B6|c4 BA|B2 G2 EF|G2 GA =FG|E6||`,
			badges: ["klezmer"],
			theSessionId: 3809,
			references: [
				{
					url: "https://youtu.be/muwdHjcAhNA",
					artists:
						"Andy Statman, mandolin; others (see [discogs](https://www.discogs.com/release/33879498-Andy-Statman-Flatbush-Waltz))",
					notes: "Eponymous album (1980)"
				}
			]
		},
		{
			abc: `X:1
T:The Belltable
C:Maurice Lennon; Kieran Hanrahan
R:waltz
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/5067#setting5067
N:Setting entered in thesession by user “Daithi_C” on 2005-10-12
K:Dmajor
|:d3 e d2|d2 c2 B2|A3 B A2|A2 G2 F2|
 G2 GA BG|A2 AB cA|G2 GA BG|A2 B2 c2|
 d3 e d2|d2 c2 B2|A3 B A2|A2 G2 F2|
 G2 GA BG|A2 AB cA|G2 F2 E2|D6:|
 |:a3 b a2|a4 g2|f3 g f2|f2 e2 f2|
 g3 a g2|g2 f2 g2|a3 b a2|a2 f2 g2|
 a3 b a2|a4 g2|f3 g f2|f2 e2 d2|
 B4 g2|f a3 c2|e d3 c2|1 d3 A df:|2 d6||`,
			theSessionId: 5067
		},
		{
			abc: `X:1
T:Sí Bheag Sí Mhór
C:Turlough O'Carolan
R:waltz
L:1/8
M:3/4
N:Imported into *tuneTable* on 2025-10-25,
N:from https://thesession.org/tunes/449#setting449
N:Setting entered in thesession by user “dirk” on 2001-12-19
K:Dmajor
de|:f3e d2|d2 de d2|B4 A2|F4 A2|BA Bc d2|e4 de|f2 f2 e2|
 d4 f2|B4 e2|A4 d2|F4 E2|D4 e2|B4 e2|A4 dc|d6|d4 de:|
 |:f2 fe d2|ed ef a2|b4 a2|f4 ed|e4 a2|f4 e2|d4 B2|A4 BA|
 F4 E2|D4 f2|B4 e2|A4 a2|ba gf ed|e4 dc|d6|1 d4 de:|2 d6||`,
			theSessionId: 449
		},
		{
			groups: "su",
			name: "Brogan’s Ferry",
			rhythm: "Reel (single)",
			references: [
				{
					artists: "Tommy Peoples, fiddle",
					url: "https://www.itma.ie/playlists/tommy-peoples-mcconnell-recordings/?track=14",
					notes: "The Cathal McConnell Tapes: Tape One; early 1970s"
				}
			],
			incipit: `
X: 1
M: 4/4
L: 1/16
K: Dmaj
FAAF D4 FAAF GFED|F2EF DEFD EFGA BEEG|
`,
			theSessionId: 5516
		},
		{
			groups: "su",
			name: "The Roving Bachelor",
			rhythm: "Reel (single)",
			references: [
				{
					artists: "Tommy Peoples, fiddle",
					url: "https://www.itma.ie/playlists/tommy-peoples-mcconnell-recordings/?track=6",
					notes: "The Cathal McConnell Tapes: Tape One; early 1970s"
				}
			],
			incipit: `X:1
M: 4/4
L: 1/16
K: G
GA|B2BA B2ge d2ge dBGA | B2BA B2ge dB`
		},
		{
			groups: "su",
			incipit: `X: 1
M: 4/2
L: 1/8
K: Ador
EG| A2A>B A2(3Bcd eged B2AG|EG`,
			name: "Johnny Cope",
			rhythm: "hornpipe",
			references: [
				{
					artists:
						"Fintan Vallely, flute; Lori Cole, English concertina; Mark Simos, guitar;  CB Heinemann, bouzouki",
					notes: `Fintan Vallely - Traditional Irish Flute Music, 1979
 Doolin whistle player Micho Russell’s version of an old Scottish tune, as notated by Mícheál Ó hÁlmháin.
 [F. Vallely’s notes](https://imusic.ie/fintan-vallely-traditional-irish-flute-music/)`,
					url: "https://fintanvallely.bandcamp.com/track/johnny-cope-2"
				}
			],
			theSessionId: 4953
		},
		{
			name: "Shanahan’s",
			rhythm: "hornpipe",
			incipit: `X: 1
M: 4/2
L: 1/8
K: Gmaj
(3DEF|GFGA BGBd gfga bgdB | `,
			references: [
				{
					artists: "Brian Hughes, whistle; Dave Sheridan, fiddle; ? guitar",
					url: "https://brianhughesdavesheridan.bandcamp.com/track/hornpipe-reels-shanahans-eanach-mhic-coil-n-the-leitrim-thrush"
				}
			],
			theSessionId: 8753,
			theSessionSettingId: 44975
		},
		{
			name: "The Boys Of Bluehill",
			rhythm: "hornpipe",
			groups: "ALORA",
			incipit: `
X: 6
M: 4/2
L: 1/8
K: Dmaj
FA| BAFA DAFA BA (3Bcd e2de|fagf 
`,
			theSessionId: 651
		},
		{
			name: "The Home Ruler",
			rhythm: "hornpipe",
			groups: "ALORA",
			incipit: `X: 1
M: 4/2
L: 1/8
K: Dmaj
AF|D2FA DAFA dfed B2dB|A2AB AFDE 
`,
			theSessionId: 1020
		},
		{
			aka: "Paddy Fahey’s",
			groups: "su",
			rhythm: "jig",
			parts: "AABB",
			incipit: `X: 1
T: Fahey's Fiddle
C:Paddy Fahey
R: jig
M: 12/8
L: 1/8
K: Dmaj
DFA d2e dcA ~G3 | AGE ~=c3`,
			references: [
				{
					artists: "Jason O’Rourke, B♭/F concertina; Stevie Dunne, guitars",
					url: "https://jasonorourke.bandcamp.com/track/fahys-fiddle-tell-her-i-am",
					notes: `album: The Northern Concertina
SU: 1st & 3rd in the Fahey’s Fiddle set `
				}
			],
			theSessionId: 124
		},
		{
			name: "Haste To The Wedding",
			groups: "ALORA",
			rhythm: "jig",
			references: [
				{
					artists: "Malachy Bourke, Brian Bourke & Frankie Gavin",
					url: "https://music.youtube.com/watch?v=hF9fGvdO8gw&t=106",
					notes: "in G"
				}
			],
			incipit: `X: 1
L: 1/8
O:Ireland
M: 12/8
K: D
AFA Agf ede fdB|ABA AGF`,
			theSessionId: 582,
			norbeckId: 18,
			parts: "AABB"
		},
		{
			incipit: `X: 19
T: Morrison's
R: jig
M: 12/8
L: 1/8
K: Edor
EDE BAB EBE AFD|EDE ~B3`,
			parts: "AABB",
			groups: "alora",
			norbeckId: 30,
			theSessionId: 71,
			references: [
				{
					url: "https://open.spotify.com/track/3ooiN8bT2gx1hzDokGpQpI",
					artists: "Seán Maguire, fiddle; Wilcil McDowell, piano",
					notes: `The Black Rogue; Morrison’s
From 1:05 onwards
Album: A Man Apart (2004)`
				},
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-august-2025/?track=7",
					artists:
						"Larry Redican, fiddle; Joe Burke, accordion; Jack Coen, flute; Felix Dolan, piano",
					notes: "Miss Walsh, jig ; Morrison's, jig"
				}
			]
		},
		{
			name: "My Darling Asleep",
			groups: "ALORA",
			incipit: `X: 1
M: 12/8
L: 1/8
K: D
e|fdd cAA BGG A2G|`,
			origin: "Ireland",
			rhythm: "jig",
			references: [
				{
					artists: "Stockton’s Wing",
					url: "https://music.youtube.com/watch?v=HkuABOYkWws"
				}
			],
			theSessionId: 76
		},
		{
			name: "Denis Murphy’s",
			groups: "ALORA",
			incipit: `X: 1
M: 4/4
L: 1/8
K: Dmaj
f/g/f/e/ d>B AD FA | GE e>d`,
			origin: "Ireland",
			rhythm: "polka",
			references: [
				{
					artists: "Planxty",
					url: "https://youtu.be/q5Blc3k16rE",
					notes: `The (ALORA) Denis Murphy’s set is actually a widely recorded and played set of polkas. It goes back to an influential 1974 album. Credits here: https://www.discogs.com/master/137613-Planxty-Cold-Blow-And-The-Rainy-Night
        `
				}
			],
			theSessionId: 357,
			theSessionSettingId: 46411
		},
		{
			name: "John Ryan’s",
			groups: "ALORA",
			origin: "Ireland",
			rhythm: "polka",
			incipit: `X:1
M: 4/4
L: 1/16
K: D
d2d2 BcdB A2F2 A2F2 | `,
			references: [
				{
					notes: "#3 in the (ALORA) Denis Murphy’s set"
				}
			],
			theSessionId: 441,
			theSessionSettingId: 28845
		},
		{
			name: "The £42 Cheque",
			groups: "ALORA",
			incipit: `X: 1
M: 4/4
L: 1/8
K: Dmaj
Ad Bd/B/ AD FA|GE BE`,
			origin: "Ireland",
			rhythm: "polka",
			references: [
				{
					notes: "#2 in the (ALORA) Denis Murphy’s set"
				}
			],
			theSessionId: 786
		},
		{
			name: "Palmer’s Gate",
			rhythm: "reel",
			parts: "AABB",
			groups: "SU",
			incipit: `X: 1
M: 4/4
C:Joe Liddy
L: 1/16
K: Emin
GA|BE~E2 GABG AdBA GEED|~G3A `,
			references: [
				{
					artists:
						"Brian Hughes, whistle; Dave Sheridan, fiddle; ? guitar; ? bodhrán",
					url: "https://brianhughesdavesheridan.bandcamp.com/track/reels-palmers-gate-the-honeymoon-support-from-america-no-1"
				}
			],
			theSessionId: 1020
		},
		{
			name: "The Wise Maid",
			groups: "ALORA",
			incipit: `X: 1
M: 4/4
L: 1/16
K: Dmaj
DE|F2FG FEDE FAAB AFED|d2eg`,
			origin: "Ireland",
			rhythm: "reel",
			references: [
				{
					notes: "#3 in the (ALORA) Maud Millar set"
				}
			],
			theSessionId: 118,
			theSessionSettingId: 55404
		},
		{
			name: "Jerry McMahon’s",
			groups: "SU",
			rhythm: "reel (single)",
			incipit: `X: 1
M: 4/4
L: 1/16
K: Ador
EAAG ABcG E2DE GEDG|EAAG A2(3Bcd `,
			references: [
				{
					artists: "Dave Sheridan, fiddle",
					url: "https://brianhughesdavesheridan.bandcamp.com/track/reels-fiddle-solo-the-quiet-house-jerry-mcmahons-the-lass-among-the-etnochs",
					notes: `From 2:10 onwards. Dunno who the backing guitar & perc are by.
          I think he’s playing this in G (dorian), not A.
          This tune is also known as Sailing Into Walpole’s Marsh, but apparently that may be a mistake.`
				}
			],
			theSessionId: 4263,
			theSessionSettingId: 45736
		},
		{
			name: "Lucy Campbell",
			groups: "ALORA, su",
			parts: "ABCD",
			incipit: `X: 1
M: 4/4
L: 1/16
K: Dmaj
dB|A2FA A2dB A2FA BEE2|A2FA defe`,
			origin: "Ireland",
			rhythm: "reel (single)",
			references: [
				{
					notes: "Compare with The Bucks Of Oranmore"
				},
				{
					artists: "Tony MacMahon, accordion; Noel Hill, concertina",
					url: "https://www.itma.ie/playlists/padraics-picks-november-2024/?track=7",
					notes: `Sally Gardens/The foxhunters/The humours of Tulla/The flogging reel/Lucy Campbell/Toss the feathers/Trip to Durrow (1993)
I’ve listed to this track dozens of times. It has such great energy! And there’s lots to learn from the playing.
Warning for ITMA pages: you have to click on the link in the player. 7:58 (-06:48)`
				},
				{
					notes: `Chords (TBC):
\`\`\`
Part A
D D D Em | D G A D
D D D Em | D G A D

Part B
D D D Em | D G A D
D D D Em | D G A D

Part C
D D D Em | D D A D
D D D Em | G D A D

Part D
D D D A? | D G A D
D D D A  | G D A D

Part A - alternative 1st bar
D - (D/F) (D, Dsus4, G or Em) D - Em - 
\`\`\``
				}
			],
			theSessionId: 1552
		},
		{
			name: "The Bucks Of Oranmore",
			parts: "ABCDE",
			groups: "ALORA",
			incipit: `X: 1
M: 4/4
L: 1/16
K: D
dB| A2FA A2dB A2FA BEE2|A2FA A2Bd eg`,
			origin: "Ireland",
			rhythm: "reel (single)",
			references: [
				{
					notes: "Compare with Lucy Campbell"
				},
				{
					artists: "Stockton’s Wing",
					url: "https://open.spotify.com/track/4BRY3qk2hYUcVkmnIhLthV",
					notes: "0:46 onwards"
				},
				{
					artists: "Paddy Glackin & Paddy Keenan",
					url: "https://open.spotify.com/track/6RyZ6G20xL8xOa8JAsFcNK?t=104"
				},
				{
					artists:
						"“The Vashon Sessions” - flute, button accordion, fiddle, guitar, octave mandolin, percussion",
					url: "https://thevashonsessions.bandcamp.com/track/christmas-eve-reel-of-mullinavat-bucks-of-oranmore",
					notes: `3:04 onwards.
        Christmas Eve / Reel of Mullinavat / Bucks of Oranmore`
				}
			],
			theSessionId: 2
		},
		{
			name: "The Dogs Among The Bushes",
			groups: "ALORA",
			theSessionId: 595,
			incipit: `X: 1
M: 4/4
L: 1/16
K: G
BGG2 DGG2 BGG2 cedc | `,
			origin: "Ireland",
			rhythm: "reel (single)",
			references: [
				{
					artists: "Éimhear Flannery, whistle; Paul De Grae, guitar",
					url: "https://www.youtube.com/watch?v=EjNKOWT7RL8",
					notes: "in a set with The Killavil Fancy"
				},
				{
					notes: `Chords (TBC):
\`\`\`
G - - C | G - D - | G - - C | G - D - ||
G - - - | D - - - | G - - (D) | G - D - ||
\`\`\`
`
				}
			],
			scores: [
				{
					type: "tune",
					name: "tradchords",
					url: "https://tradchords.org/?tune=595"
				}
			]
		},
		{
			name: "The Drunken Tinker",
			groups: "ALORA",
			incipit: `X: 1
M: 4/4
L: 1/16
K: Amix
EAAG EGDG EA~A2 fAeA| `,
			origin: "Ireland",
			rhythm: "reel (single)",
			references: [
				{
					url: "https://comhaltas.ie/comhaltaslive/comhaltaslive_628_9tribute_concert_to_the_late_ashling_murphy/",
					notes: "from 4:32 onwards"
				}
			],
			theSessionId: 1555
		},
		{
			name: "The Killavil Fancy",
			theSessionId: 576,
			groups: "ALORA",
			incipit: `X: 1
M: 4/4
L: 1/16
K: G
DGBG A2BA GEE2 cEGE | `,
			origin: "Ireland",
			rhythm: "reel (single)",
			references: [
				{
					artists: "Éimhear Flannery, whistle; Paul De Grae, guitar",
					url: "https://www.youtube.com/watch?v=EjNKOWT7RL8",
					notes: "in a set with The Dogs Among The Bushes"
				},
				{
					notes: `Chords (TBC):
\`\`\`
G (D) C - | G (D) C - | G (D) C - | G (D) C - ||
G (C) G (D) | G (C) G - | G (C) G (D) | C - G C ||
\`\`\`
`
				}
			]
		},
		{
			name: "The Wind That Shakes The Barley",
			groups: "ALORA",
			incipit: `X: 1
M: 4/4
L: 1/16
K: Dmaj
A2AB AFED B2BA BcdB |`,
			origin: "Ireland",
			rhythm: "reel (single)",
			references: [
				{
					artists: "Tony DeMarco, fiddle; Felix Dolan, piano",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-august-2025/?track=3",
					notes: `Wind that shakes the barley; Reel of Bogie 
          #2 in the (ALORA) Maud Millar set`
				}
			],
			theSessionId: 116,
			theSessionSettingId: 45357
		},
		{
			aka: ["Denis Murphy’s", "Gleanntan Slide"],
			name: "Girl in the Dress, The",
			groups: "ALORA",
			incipit: `X: 1
M: 12/8
L: 1/8
K: Dmaj
A2D FED F2A A2f|gfe`,
			origin: "Ireland",
			rhythm: "slide",
			theSessionId: 159,
			theSessionSettingId: 35527,
			norbeckId: 5
		},
		{
			groups: "su",
			theSessionId: 879,
			abc: `
X: 1
T: O'Farrell’s Welcome To Limerick
T: (as played by Tommy Peoples)
C:Patrick O’Farrell
S: Tommy Peoples
D: The High Part Of The Road (1976)
F: https://open.spotify.com/track/1KaCOZYDak3wuTToNlUxpv
N: 1. See comments here: https://goplayerjuggler.blogspot.com/2024/06/ofarrells-welcome-to-limerick.html
N: 2. AKA An Phis Fhliuch
Z:abc-transcription Malcolm Schonfield%2024-06-17
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
R: Slip jig
M: 18/16
L: 1/16
K: D mixo
[P:A]FGA AFA Bc2 BAG FAF GED|F2D ADD d3 dfd dcA GED|
FGA AFd Bc2 BAG FAF GED|F2D ADD d2A dfd dcA GED|
[P:B]d3 ege c2A d3 f2d g3|afd ged c2A BAG FAF GED |
d3 ege c2A d3 faf ged|f3 ged c2A BAG FAF GED|
[P:C]|:FGA AFd AFd AFd AFd GED|FGA AFA Bc2 BAG FAF GED:|
[P:D]|:D3 D3 c3 c2B c2A GED|D3 D3 d2A dfd dcA GED:|
[P:E] d3 ege d2A d3 f2d g2d|f2d ged c2A BAG FAF GED|
!coda!d3 ege d2A d3 faf ged|f3 ged c2A BAG FAF GE!D.C.!D||
!coda!d3 ege d2A d3 faf g3|afd ged c2A BAG FAF GED | !fermata!D6 |]`,
			incipit: `
X: 1
M: 18/16
L: 1/16
K: D mixo
FGA AFA Bc2 BAG FAF GED|`,
			parts: "AABBCCDDEE",
			references: [
				{
					url: "https://jasonorourke.bandcamp.com/track/the-peacock-following-the-hen-ofarrells-welcome-to-limerick-my-mind-will-never-be-easy",
					artists: "Jason O’Rourke, concertina; Stevie Dunne, guitar",
					notes: `(2015) The Peacock Following the Hen/O'Farrell's Welcome to Limerick/My Mind will never be Easy
From ):45 onwards
Is the  guitarist S Dunne? See my remark under John Brosnan's polka.`
				}
			]
		},
		{
			abc: [
				`X:1
T:The Swaggering Jig
R:slip jig
L:1/8
M:9/8
N:1. It’s interesting to compare this with Na Ceannabháin Bhána,
N:which has a similar contour.
N:2. Imported into *tuneTable* on 2025-10-31,
N:from https://thesession.org/tunes/661#setting661
N:Setting entered in thesession by user “Jeremy” on 2002-04-27
N:(edited after importing)
K:Gmajor
|:B2G AGE DEG|BAG DEG A3|BGG AGE DEG|cBA BGE D3:|
 Bdd dge dBG|Bdd dBG A3|Bdd dge dBG|cBA BGE D3|
 Bdd dge dBG|Bdd dBG A3|gfe fdB cBA|cBA BGE D3||`
			],
			theSessionId: 661
		},
		{
			name: "The Holly Bush",
			rhythm: "reel",
			incipit: `X: 1
M: 4/2
L: 1/8
K: Dmix
A2FA DAFG ABde fded|cGG/G/G EGG/G/G`,
			references: [
				{
					notes: "Composed by Finbarr Dwyer"
				}
			],
			theSessionId: 1566
		},
		{
			groups: "su",
			abc: [
				`X:1
T:Joan Martin's
R:polka
L:1/8
M:2/4
N:Imported into *tuneTable* on 2025-11-02,
N:from https://thesession.org/tunes/11600#setting21930
N:Setting entered in thesession by user “ceolachan” on 2013-07-18
K:Gmajor
|:D|GB BG|FA- AD|GA Bc|de/d/ cA|
 GB- BG|FA AB|c/B/A FA|G2 G:|
 |:B/c/|dg ga|bg gf/e/|dg- gb|ab/a/ g/f/e|
 dg- ga|bg ge|dB c/B/A|G2- G:|`
			],
			references: [
				{
					notes: "Nb 1 / 2nd polka set"
				}
			],
			theSessionId: 11600,
			theSessionSettingId: 21930
		},
		{
			groups: "su",
			incipit: `X: 1
T:Cutting Bracken
R:polka
N:Was originally a strathspey
M: 4/4
L: 1/8
K: Amin
AA ~a2 ge ~g2|ed BA GA B/A/G| `,
			references: [
				{
					notes: "Nb 2 / 2nd polka set"
				}
			],
			theSessionId: 647,
			norbeckId: 14,
			norbeckR: "strathspey"
		},
		{
			name: "The Sliabh Lucan",
			groups: "su",
			rhythm: "polka",
			incipit: `X: 1
M: 4/4
L: 1/8
K: Emin
EB B>A BG E/F/G|FA`,
			references: [
				{
					notes: "Nb 3 / 2nd polka set"
				}
			],
			theSessionId: 11676
		},
		{
			name: "The Gold Ring",
			groups: "su",
			rhythm: "jig",
			incipit: `X: 1
M: 12/8
L: 1/8
K: Gmaj
BAG A2d cAF G2A|`,
			theSessionId: 37,
			references: [
				{
					artists: "Dónal Lunny & his band",
					url: "https://youtu.be/gVLtA4uX_NM?t=155",
					notes: `1987, Live at the National Concert Hall, Dublin
Nollaig Ní Cathasaigh: Fiddle, Viola
Cormac Breathnach: Flute
Arty McGlynn: Guitar
Manus Lunny: Bouzouki
Seá n Óg Potts: Uilleann pipes, Keyboards
Damien Quinn: Bodhrán
Steve White: Congas, Percussion
Dónal Lunny: Bouzouki, Keyboards`
				},
				{
					artists: "Sult Ceol",
					url: "https://www.youtube.com/watch?v=iPmJHJ0wYiQ&t=7s",
					notes: "harp, concertina, whistle and Uileann Pipes"
				},
				{
					artists:
						"Cillian Vallely, uilleann pipes; Niall Vallely, concertina; Alan Murray, guitar",
					url: "https://www.youtube.com/watch?v=0E39mRYES8M",
					notes: "The Gold Ring / The Hearty Boys of Ballymote"
				}
			]
		},
		{
			parts: "AABB",
			abc: [
				`X:1
T:A Tune For Frankie
C:Mairéad Ní Mhaonaigh
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2025-11-02,
N:from https://thesession.org/tunes/1885#setting52765
N:Setting entered in thesession by user “Jalon” on 2024-12-30
N:(edited after importing)
K:Gdorian
|: D2 G FDC ~A,3 F3 | [M:15/8] ~A,3 C3 A,CA, G,A,G, G,GF | 
M:12/8
   D2 G FDC ~A,3 F3 | [M:15/8] ~A,3 CA,C FCA, G,A,G, [1 G,A,/B,/C :|2  G,GF ||
 [M:12/8] |:DGA Bdc =BGE FED | ~F3 ~G3  Add d3 |
 [1 DGA Bdc  =BGE FED | FCA, DCA,  G,A,G, G,GF :|
 [2 dcA B2 G  AFD DCD | C2 F A,CA, G,A,G, G,3||`
			],
			badges: "crooked",
			groups: "su",
			references: [
				{
					artists:
						"Martin Hayes, fiddle; Mairéad Ní Mhaonaigh, fiddle; Dermot Byrne, accordion; Dennis Cahill guitar",
					url: "https://www.youtube.com/watch?v=tsd8nlPJSx8",
					notes:
						"A Tune for Frankie [composed by Mairéad Ní Mhaonaigh] (Jig 0:00), The Tempest (Reel 1:30) & Love At The Endings [composed by Ed Reavy] (Reel 2:46), on a Christmas episode of the TG4 music series Geantraí, recorded in 1999."
				}
			],
			theSessionId: 1885,
			theSessionSettingId: 52765,
			contourShift: 1
		},
		{
			name: "The Silver Spire",
			groups: "alora",
			rhythm: "reel",
			theSessionId: 240,
			incipit: `X: 1
M: 4/4
L: 1/16
K: Dmaj
D2FE DFAc dcde fdAF|G2BG`,
			references: [
				{
					notes: `Chords (via The Portland Collection): 
\`\`\`
|: D - - - | G D Em A |
   D - - - | G D A D :|
|: A - D - | Bm - D A |
   D A G D | G D A D :|
\`\`\`
	`
				},
				{
					url: "https://www.youtube.com/watch?v=HnDsa6dk52w",
					artists:
						"Matt Molloy, flute; Tommy Peoples, fiddle; Paul Brady, guitar",
					notes:
						"(1978) John Brennan's (Silver Spire) / Drag Her Round The Road (Reels) "
				},
				{
					url: "https://youtu.be/hNLuj5SZS_M?t=26",
					artists:
						"Ross Cooper, fiddle; Andrew Gifford, fiddle; Margaret Scollay, piano; Graham Dolan, guitar; plus other fine musicians",
					notes: "(2007) Session in Lounge Bar, Lerwick Shetland"
				},
				{
					url: "https://www.youtube.com/watch?v=jHqFlS3gNMs",
					artists: "Tommy Peoples, fiddle",
					notes:
						"(Date unknown.) Followed by a T. Peoples composition: the reel “Beautiful Gortree”."
				},
				{
					url: "https://open.spotify.com/track/0jLnKZeYtUZmEMJ2lFgFLd",
					artists:
						"Sean Maguire, fiddle; Wilcil McDowell, bass and accordion (?)",
					notes: `(2004?) Fergal O'Gara / Miss Monaghan's / The Silver Spire (from 02:20 onwards)
This setting of Miss Monaghan is quite unusual; it’s almost (but not quite) like a different tune!`
				},
				{
					url: "https://youtu.be/jZsiWNtc5EE",
					artists:
						"Paddy O’Brien, Button Accordion; Tom Schaefer, fiddle; Paul Wehling, bouzouki",
					notes:
						"The Silver Spire / Sean Ryan's. The B part (of the Silver Spire) is an interesting, unusual setting. From the album: “The Sailor’s Cravat”."
				}
			]
		},
		{
			name: "The Plains Of Boyle",
			rhythm: "hornpipe",
			incipit: `X: 1
M: 4/2
L: 1/8
K: Dmaj
FG|AFDE FEDF (3ABA GB AFD2|`,
			theSessionId: 652,
			theSessionSettingId: 52321
		},
		{
			name: "Farrel O’Gara’s",
			rhythm: "reel",
			incipit: `X: 1
M: 4/4
L: 1/16
K: Dmaj
A,3B, DEFA BFAF EFAc|d2`,
			references: [
				{
					artists: "Kathleen Harrington, fiddle; Moya Acheson, piano",
					url: "https://www.itma.ie/blog/lesser-known-musicians-of-the-78-rpm-era/?track=8",
					notes: `(78 rpm) Farrell Gara; The scholar
Mrs Kathleen Harrington née Gardiner (1897-1984)`
				}
			],
			theSessionId: 234,
			groups: "alora"
		},
		{
			groups: "alora",
			abc: `X: 1
T:The Star Of Munster
T: (as played by Patsy Hanly – more or less!)
S:Patsy Hanly, flute
R: reel
F:https://youtu.be/IpsE74EcGR0
N:2007 or 2008; more info on itma: https://www.itma.ie/playlists/wcss-2/
Z:abc-transcription Malcolm Schonfield% 2025-11-13
M: 4/4
L: 1/16
K: Ador
HAB||!segno!.c2A~B- BAGB ABBA GEDG|EAAG .A2(3Bcd egfa gedB|
.c2A~B- BAGB ABBA GEDG|.E2AG A2(3Bcd egdB BAAB|
cBAc BAGB .A2BA GEDG | EAAG .A2(3Bcd egfa gedB|
.c2A~B- BAGB ABBA GEDG|.E2AG A2(3Bcd egdB BAA2||
|: eaab ageg a2ba agef|g2(3agf gedg egfa ged2|
eaab ageg a2ba agef|~g3b a2ab- bc'ba [1 gedg :| [2 gedB !D.S.!||`,
			theSessionId: 197,
			references: [
				{
					notes: `Chords from thesession (Fernando Durbán Galnares): 
\`\`\`
|: Am G Am Em | Am - Am Em |
   Am G Am Em | Am - G  Am :|
|: Am - - -   | G -  -  Em |
   Am - - -   | G Am Em -  :|
\`\`\`
	`
				},
				{
					artists: "Seán Ryan, fiddle",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-october-2025/?track=2",
					notes:
						"(1960s) A setting in a major or mixo mode. (Sort of; ish). Interesting! H. Norbeck wrote a [score for it](https://www.norbeck.nu/abc/display.asp?rhythm=reel&ref=853)."
				},
				{
					artists: "Joe Ryan, fiddle; John Kelly, fiddle ",
					url: "https://youtu.be/NOs3GW161Co?t=163"
				}
			]
		},
		{
			groups: "alora",
			incipit: `X: 1
T:The Gravel Walks
R: reel
M: 4/4
L: 1/16
K: Ador
A2eA (3cBA eA A2eA BAGB|A2eA (3Bcd ef`,
			theSessionId: 42,
			references: [
				{
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=55",
					artists: "Frank Kelly, fiddle; Michael McNamara, flute",
					notes: "The bird in the bush, The gravel walks"
				}
			]
		},
		{
			groups: "su",
			theSessionId: 553,
			incipit: `X: 1
T:The Drunken Sailor's
R: hornpipe
M: 4/4
L: 1/16
K: Gdor
D2|G2GF GABc dcBA GFDE|F2`,
			references: [
				{
					artists: "Frank Kelly, fiddle",
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=56"
				}
			]
		},
		{
			abc: `
X: 1
T: Denis Doody's – the “Lunny” effect
T: The way I hear it, played by Dónal Lunny's band
T: 1987, Live at the National Concert Hall, Dublin
S: Dónal Lunny & his band
D: Donal Lunny
R: polka
F:https://youtu.be/gVLtA4uX_NM?t=354
M: 2/4
N: 1. I used [Dr. Dow’s setting](https://thesession.org/tunes/1338#setting14686) as a starting point and then made some tweaks,
N: as I wasn’t in complete agreement with it.
N: 2. In a comment made 23 years ago (!), Dr Dow mentions something he calls the
N: “Lunny Effect” – hearing the same tune in two different ways. It’s something 
N: I’ve noticed with some other tunes and recordings. It’s a fascinating thing.
N: On the Dónal Lunny album (link above), I can only hear it the one way; the 
N: way given here. On theSession.org there are other settings that show the 
N: “other” way; it seems to be the  “orothodox” or standard way. This spurred me 
N: on to do a little investigating. I found [another recording](https://youtu.be/X8pqy2uCVno?t=1469), by
N: Denis Doody himself. It’s recorded under the name “The Green Cottage #1” and indeed,
N: on that recording I can only hear the “other” way.
N: 3. To my ears, the “Dónal Lunny” way of hearing/playing it sounds a bit Spanish 
N: - or Galician - influenced.
N: 4. An alternative way to write this would to write longer bars using minims 
N: (half notes) as the basic pulse. This would be a bit fiddly to do as the bars 
N: would have to be of different lengths. But I think it would perhaps be an even 
N: better way of capturing the “ideas” in this “non-standard” way of hearing it.
N: (2025-11-15)
N: 5. See The Gold Ring, here, for the personnel list for the concert.
Z:abc-transcription Malcolm Schonfield
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
L: 1/8
K: Emin
G/F/G/ | EF/E/ DB,|:SEE z/G/F/G/|A/F/ D>E F|G A/c/B/A/ G|EF/E/ DB,|
E E>F G|A B/c/B/A/ G|1 Fd FG | EF/E/ DB, :|2 Fd AB||
|: e e/f/e/d/ B|e e/f/e/d/ B/^c/|de f2|ge f2|
gf ge|BB AB|zE>F G|1 A B/c/B/A/ B :|2  A B/c/B/A/ G | EF/E/ DB, !D.S.! ||

X: 2
T: Denis Doody's
T: (same as previous but “cut up” differenly)
N: 1. This is a more concise way to write it; but it’s less accurate 
N: w.r.t. the A part’s structure, IMO.
N: I don't hear it this way! Just leaving it here for reference.
R: polka
M: 2/4
L: 1/8
K: Emin
G/F/G/|:EF/E/ DB,|EE z/G/F/G/|A/F/ D>E F|GA/c/ B/A/G|
EF/E/ DB,|E E>F G|AB/c/ B/A/G|1 Fd FG :|2 Fd AB||
e e/f/e/d/ B|e e/f/e/d/ B/^c/|de f2|ge f2|
gf ge|BB AB|zE>FG|1 A B/c/B/A/ B :|2 AB/c/ B/A/ G ||
`,
			theSessionId: 1338,
			incipit: `
X: 1
M: 2/4
L:1/8
K: Emin
EE z/G/F/G/ | A/F/ D>E F|G A/c/B/A/ G|EF/E/ DB,|`
		},
		{
			abc: `X:1
T:Denis Doody's
R:polka
F:https://youtu.be/X8pqy2uCVno?t=1469
S:Denis Doody, accordion
L:1/8
M:4/4
N:Denis Doody's own version of The Green Cottage polka from his 1978 LP, which
N:must have fascinated Donal Lunny & Co. A little nuance that didn't make it to
N:the ABC is that he added G/F/E instead of GE at the start of the tune when
N:repeating part A.
N:---
N:Imported into *tuneTable* on 2025-11-16,
N:from https://thesession.org/tunes/1338#setting42834
N:Setting entered in thesession by user “Bregolas” on 2022-01-20
N:(edited after importing)
K:Eminor
|: GE ED B,E E>G|FD DE FG AB/A/|
   GE ED B,E E>F|GA B>A GF E2:|
|: Be e/f/e/d/ Be e/f/e/d/|Be e f2 g ef|
   gb/g/ fg/f/ eB BA|BB E>F GA B/d/B/A/:|`,
			theSessionId: 1338,
			theSessionSettingId: 42834
		},
		{
			groups: "su",
			incipit: `X:1
T:This Is My Love, Do You Like Her?
S:Denis Doody
D:Kerry Music [1978 LP]
F:https://youtu.be/X8pqy2uCVno?t=2059
R:slide
L:1/8
M:12/8
K:Adorian
B|A2A AGE c2B c2d|ege edB ~g3 g2`,
			references: [
				{
					notes: "SU: 1st in the This Is My Love slide set"
				}
			],
			theSessionId: 6,
			theSessionSettingId: 31114
		},
		{
			groups: "su",
			abc: `X:1
T:Paddy Cronin's
S:from Jack Talty & Cormac Begley
D:“Na Fir Bolg”, Raelagh Records RRCD002, 2011
N:Imported into *tuneTable* on 2025-11-16,
N:from https://thesession.org/tunes/8362#setting19483
N:Setting entered in thesession by user “Josie1957” on 2012-04-02
N:(edited after importing)
R:Slide
Z:transcription Johannes Schiefner (jschiefner@gmx.net)
Z:id:js_1626
Q:1/8=420
M:12/8
K:Edor
EFG F2D E2F G2A|B2E GFE B2E GFE|
D2F FED E2F G2A|1B2E GFE F2E D3:|2B2E GFE F2E D2d||
|:ded c2d e2d cBA|B2E GFE B2E GFE|
ded c2d e2d cBA|1B2E GFE F2E D2d:|2B2E GFE F2E D3|]`,
			theSessionId: 8362,
			references: [
				{
					notes: "SU: 2nd in the This Is My Love slide set"
				}
			]
		},
		{
			groups: "su",
			incipit: `X: 1
T: Crowley's
R: reel
M: 4/4
L: 1/16
K: Dmaj
A3d B2dB AD (3FED AD (3FED|`,
			theSessionId: 759,
			references: [
				{
					artists: "Joe Burke, accordion; Martin Byrnes, fiddle",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2024/?track=1",
					notes: "“Crowley’s reels”. 1973. Poor audio quality"
				}
			]
		},
		{
			groups: "su",
			incipit: `X: 1
T:The Star Above The Garter
R: slide
M: 12/8
L: 1/8
K: Gmaj
d2B BAG ~A3 ABA|G2E c2`,
			theSessionId: 1398,
			references: [
				{
					notes: "SU: 3rd in the This Is My Love slide set"
				}
			]
		},
		{
			groups: "su",
			incipit: `X: 1
T:The Rookery
C:Vincent Broderick
R: reel
M: 4/4
L: 1/16
K: Gmaj
BGAG EGDG EGDG EGDE|G2Bd egdg`,
			theSessionId: 2958,
			norbeckId: 992,
			references: [
				{
					notes: "SU: followed by (JC’s) Morning Dew"
				}
			]
		},
		{
			groups: "su",
			incipit: `X: 1
T:The Morning Dew
R: reel
N: This is a different tune from Joe Cooley’s Morning Dew
M: 4/4
L: 1/16
K: Edor
E3B- BAFD EDEB BAFD|E3B- BAFA`,
			theSessionId: 69,
			references: [
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-august-2025/?track=6",
					artists:
						"Larry Redican, fiddle; Andy McGann, fiddle; Felix Dolan, piano ",
					notes: "Morning dew; Hunter's house (1960s)"
				}
			]
		},
		{
			aka: "Mountain Dew, The Morning Dew",
			incipit: `X: 1
T: Joe Cooley's Morning Dew
R: reel
M: 4/4
L: 1/16
K: Edor
~B2EB GBEB ~B2EB ADFA|~B2EB `,
			theSessionId: 9828,
			references: [
				{
					notes:
						"SU: after the Rookery. AKA Mountain Dew; Morning Dew is a different reel!"
				},
				{
					artists:
						"Mick O'Brien, uillean pipes; Caoimhín Ó Raghallaigh, fiddle",
					notes:
						"The Lass of Carracastle, The Morning Dew, Lad O'Beirne's Geese in the Bog",
					url: "https://irishmusic.bandcamp.com/track/the-lass-of-carracastle-the-morning-dew-lad-obeirnes-geese-in-the-bog"
				}
			],
			groups: "su"
		},
		{
			groups: "su",
			incipit: `X: 1
T:The Edenderry
R: reel
M: 4/4
L: 1/16
K: Gmaj
B2AG BGGA B2AG (3Bcd gd|B2AG`,
			theSessionId: 9639,
			references: [
				{
					notes: "SU: after (JC’s) Morning Dew"
				}
			]
		},
		{
			groups: "alora",
			incipit: `X: 1
T:The Otter's Holt
R: reel
M: 4/4
L: 1/16
K: Bmin
e|fBBA FEFB (3ABA FB ABde|fBBA`,
			theSessionId: 636
		},
		{
			groups: "alora",
			incipit: `X: 1
T:The Rose In The Heather
R: jig
M: 12/8
L: 1/8
K: Dmaj
~F3 EFE DFA BAF|ABd ede fdB`,
			references: [
				{
					artists: "Kilfenora Céilí Band",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2024/?track=3",
					notes: "(1959) Old man Dillon; Rose in the heather (0:57)"
				}
			],
			theSessionId: 447,
			norbeckId: 60,
			parts: "AABB"
		},
		{
			groups: "su",
			incipit: `X: 1
T: Helvic Head
R: jig
M: 12/8
L: 1/8
K: Gmaj
G3 AGE A3 AGE|G3 AGE`,
			references: [
				{
					artists: "Brendan McGlinchey, fiddle",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2024/?track=6",
					notes: "(1993) Helvic Head; Wallop the spot (variation)"
				}
			],
			theSessionId: 3110
		},
		{
			aka: ["Joe Burke’s", "Cronin’s Favourite"],
			abc: `X:1
T:Darby The Driver
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/1137#setting14402
N:Setting entered in thesession by user “slainte” on 2006-01-09
N:*abc-tools: convert to M:12/8*
K:Adorian
|:G|EAA ABd ege dBA|GEF GAB dBA GED|
EAA ABd ege def|g2d ege dBA A2:|
|:g|eag e2d eaa bag|efg dBd eba ged|
eag e2d eaa bag|efg edB BAG A2:|`,
			parts: "AABB",
			references: [
				{
					artists: "Tulla Céilí band",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2024/?track=3",
					notes:
						"(1959) Joe Burke’s; Leitrim fancy. Poor audio quality. Joe Burke’s AKA Darby The Driver."
				},
				{
					artists: "Charlie Mulvihill, concertina",
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=11",
					notes:
						"Followed by the jig Hetty O’Hady. Neither jig is identified on the ITMA page."
				}
			],
			theSessionId: 1137
		},
		{
			incipit: `X: 1
O:Cape Breton
T: Jack Daniels'
C:John Morris Rankin
R: reel
M: 4/4
L: 1/16
K: Amaj
a2ea (3f=ga ec Acaf e2ce|fd d/d/d d2`,
			theSessionId: 9268
		},
		{
			incipit: `X: 1
T:The Scartaglen
R: reel
M: 4/2
L: 1/8
K: Dmaj
DFEF D2Ad cAAG EFGE|`,
			theSessionId: 900
		},
		{
			incipit: `X: 1
T: Bonny Anne
R: reel
M: 4/4
L: 1/16
K: Dmaj
f2ed cAAB cAdB cAA2|f2ed`,
			theSessionId: 1562
		},
		{
			incipit: `X: 1
T:The Bunch Of Green Rushes
R: reel
S: Frankie Gavin, fiddle; Alec Finn, bouzouki
D: Frankie Gavin And Alec Finn (1977)
F: https://youtu.be/AIpCH6ReCHI
P: ABC
M: 4/4
L: 1/16
K: Ddor
d|cAGA ~=F3d cAGc AddB|cAGE F2 (3efg fd`,
			theSessionId: 1335,
			norbeckId: 93
		},
		{
			incipit: `X: 1
T: Jenny Picking Cockles
R: reel
M: 4/4
L: 1/16
K: Dmix
Addc AGEF GEcE dEcE|`,
			theSessionId: 1357
		},
		{
			incipit: `X: 1
T: Leppadumdowledum
C:Dónal Lunny
R: slip jig
M: 9/8
L: 1/8
K: Dmix
ABc cBA GAB|BAG cGE GED|~D3`,
			theSessionId: 852
		},
		{
			incipit: `X: 1
T: Stone Of Destiny
C:Maurice Lennon
R: reel
M: 4/4
L: 1/16
K: Gmaj
BddB G2Bd d2Bd edBA|BddB`,
			theSessionId: 804
		},
		{
			incipit: `X: 1
T:The Broken Pledge
R: reel
M: 4/4
L: 1/16
K: Ddor
dcAG ADDB cAGF ECCE|DEFG`,
			theSessionId: 1423,
			references: [
				{
					artists: "Seán Ryan, fiddle",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-october-2025/?track=1",
					notes: "(1960s)"
				},
				{
					artists: "Máirtín Byrnes, fiddle ",
					url: "https://www.itma.ie/playlists/larry-masterson-collection/?track=3",
					notes: `The broken pledge; Rakish Paddy (late 1960s)
A v. nice mixo setting of BP (the Broken Pledge), with an improvised intro à la Tommy Potts. A fine rendition of RP too.`
				}
			]
		},
		{
			incipit: `X: 1
T: Farewell To Erin
R: reel
M: 4/4
L: 1/16
K: Dmaj
D2 (3FED ADFA Ad~d2 Adfd|`,
			theSessionId: 846,
			references: [
				{
					artists: "Catherine Brennan Grant, fiddle; Tommy Mulvihill, piano",
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-october-2025/?track=5",
					notes: "1970s?"
				}
			]
		},
		{
			incipit: `X: 1
T:The Skylark
R: reel
M: 4/4
L: 1/16
K: Cmaj
G2ge decA GEE2 CEGc|`,
			references: [
				{
					notes: "See entry for Maud Millar - with recordings by Seán Maguire"
				}
			]
		},
		{
			incipit: `X: 1
T: Give Us A Drink Of Water
R: slip jig
M: 9/8
L: 1/8
N: Interesting to compare with the Swaggering jig
K: Gmaj
GBd gdc BAG|BdB cAA A3|`,
			theSessionId: 635
		},
		{
			incipit: `X:2
T:Merrily Kiss the Quaker 
R: jig
N: H. Norbeck has this as a single jig, and thession.org has it as a slide. It doesn’t feel like a slide to me…
M:12/8
L:1/8
K:G
D|GAB DED cBA BGE |`,
			theSessionId: 70,
			norbeckId: 4,
			norbeckR: "single+jig"
		},
		{
			incipit: `X: 1
T: Larry's Favourite
C:Paddy O’Brien (Offaly)
R: reel
M: 4/4
L: 1/16
K: Ador
EAAG A2Bd eA3 BAGE|G2DG`,
			theSessionId: 2389
		},
		{
			incipit: `X: 1
T: Paddy On The Turnpike
R: reel
M: 4/4
L: 1/16
K: Gdor
DGG^F G2GA =BGdG eGdG|AF{G}FE`,
			theSessionId: 338,
			theSessionSettingId: 22051
		},
		{
			incipit: `X: 1
T:The Hare's Paw
R: reel
M: 4/4
L: 1/16
K: Gmaj
~G3B A2GA BE~E2 GEDE|GFGA`,
			theSessionId: 1462
		},
		{
			groups: "su",
			parts: "AABBCC",
			incipit: `X:1
T:Tiny The Trooper
C:Paddy O’Brien (Offaly)
S:Paddy O’Brien, accordion; Tommy O’Sullivan, guitar
F:https://youtu.be/uuDHzzQIGZE
N:Tiny the Trooper & The Turf Cutter | TG4 Composer of the Year 2012 | Gradam TG4
R:slip jig
L:1/8
M:9/8
K:Edorian
E2G FDB, E3| efe dBd efe| cAA`
		},
		{
			aka: "The Humours of Derrykissane",
			incipit: `X: 1
T:The Foxhunter
R: slip jig
M: 9/8
L: 1/8
K: Dmaj
~F3 FED G2 E|FGF FED E2 D|FGF`,
			theSessionId: 482,
			norbeckId: 33,
			parts: "AABB",
			references: [
				{
					notes: "Gone for his Tea, The Humours of Derrykissane",
					artists:
						"Mick O'Brien, uillean pipes; Caoimhín Ó Raghallaigh, fiddle",
					url: "https://irishmusic.bandcamp.com/track/gone-for-his-tea-the-humours-of-derrykissane",
					album: "Deadly Buzz | Aoibhinn Crónán "
				}
			]
		},
		{
			incipit: `X: 1
T: Gusty's Frolics
R: slip jig
M: 9/8
L: 1/8
K: Dmaj
A,DD A,DD FEF|A,DD DFA GED|A,`,
			theSessionId: 169
		},
		{
			groups: "su",
			incipit: `X: 1
T:The Virginia
R: reel
M: 4/4
L: 1/16
K: Gmaj
DBBA ~B3A BAdB AFEF|DF~F2 A3B`,
			theSessionId: 812
		},
		{
			incipit: `X: 1
T: Bantry Bay
R: hornpipe
M: 4/2
L: 1/8
K: Gmaj
GA|BGAG EGDE G2GF GBAG|EAAB `,
			theSessionId: 1061,
			theSessionSettingId: 55525
		},
		{
			incipit: `X: 19
T: Garrett Barry's
R: jig
M: 12/8
L: 1/8
K: Dmixo
DEF ~G3 AGE c2A|dcA d2e`,
			theSessionId: 544
		},
		{
			incipit: `X: 1
T:The Tenpenny Bit
R: jig
M: 12/8
L: 1/8
K: Ador
eAA eAA BAB GBd|eAA`,
			theSessionId: 109
		},
		{
			incipit: `X: 1
T: King Of The Pipers
R: jig
M: 12/8
L: 1/8
K: Dmix
cAG A3 DED A2B|cAG A2A`,
			theSessionId: 54,
			references: [
				{
					notes:
						"for most of my life I “heard” this tune the “wrong” wrong way: for me the first three notes were a pickup/anacrucis. Only realised my mistake quite recently! (2025-12-01)"
				}
			]
		},
		{
			aka: "King Of The Pipers",
			incipit: `X: 1
T: Franc A'Phoill
R: jig
M: 12/8
L: 1/8
K: Dmix
A2F B2F A2G FED|A2F B2F`,
			theSessionId: 31
		},
		{
			incipit: `X: 1
T: Another Jig Will Do
R: slip jig
M: 9/8
L: 1/8
K: Dmaj
ABA A2 G F2 G|ABA AGF G3`,
			theSessionId: 276
		},
		{
			groups: "su",
			incipit: `X: 1
T: Doctor O'Neill
R: jig
M: 12/8
L: 1/8
K: Dmaj
A|dcd AFD E2F G2A|B`,
			theSessionId: 1304
		},
		{
			incipit: `X: 1
T: Lord Gordon's
F:http://www.juneberry78s.com/sounds/ami07.mp3
S:Andy McGann, fiddle; ?, piano
N:I got this old recording from juneberry78s.com.
N:On the [index page](http://www.juneberry78s.com/sounds/ListenToIrishDance.htm) there’s a little mix-up: the audio file for Lord Gordon’s is next to the the title Trim The Velvet, whereas the entry for Lord Gordon points to a recording of Trim The Velvet.
R: reel
M: 4/4
L: 1/16
K: Dmaj
ADFD A,DFB|ADFD FAdc|BE~E2`,
			parts: "AABBCCDDEE",
			theSessionId: 1774,
			norbeckId: 203,
			itiId: 1151
		},
		{
			incipit: `X: 1
T:The Harp And The Shamrock
R: hornpipe
M: 4/2
L: 1/8
K: Gmaj
gf|edBc dBGB AGEF GA (3Bcd|e2`,
			theSessionId: 1802
		},
		{
			aka: "Lancers",
			incipit: `X: 1
T:The Beauties Of Ireland
R: jig
M: 12/8
L: 1/8
K: Dmaj
F2D DED DFD DFD|ECA, A,CA, A,CA,`,
			theSessionId: 5949
		},
		{
			incipit: `X: 1
T: Banish Misfortune
R: jig
M: 12/8
L: 1/8
K: Dmix
fed cAG A2d cAG|F2D`,
			theSessionId: 9
		},
		{
			groups: "su",
			incipit: `X: 1
T:The Milky Way
R: reel
M: 4/4
L: 1/16
K: Dmaj
D2 (3FED ADFA d2fd efd2|D2`,
			theSessionId: 2241
		},
		{
			incipit: `X: 1
T: Luke Skywalker Walks On Sunshine
R: 7/8
M:7/8
L: 1/8
K: Amaj
A2 BA cea|f2 af ecB`,
			theSessionId: 15398
		},
		{
			incipit: `X: 1
T: Byrne's
R: hornpipe
M: 4/2
L: 1/8
K: Dmaj
AG|FD (3EFG AFD2 dA (3Bcd ecAg|fd`,
			theSessionId: 1143
		},
		{
			incipit: `X: 1
T: Cooley's
R: reel
M: 4/4
L: 1/16
K: Emin
EBBA B2EB B2AB dBAG|FDAD`,
			theSessionId: 1
		},
		{
			incipit: `X: 1
T:The Cock And The Hen
R: slip jig
M: 9/8
L: 1/8
K: Bmin
~B3 BAB g2A|BcB BAB dBA|`,
			theSessionId: 93,
			references: [
				{
					artists: "Denis Ryan, fiddle",
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=18"
				}
			]
		},
		{
			incipit: `X: 1
T: Sonny Murray's
R: hornpipe
M: 4/2
L: 1/8
K: Dmaj
FG|ABAF DEFG AG (3FED =c2 (3AB^c|dcde`,
			theSessionId: 309
		},
		{
			incipit: `X: 1
T: Spootiskerry
C: Ian Burns
R: reel
M: 4/4
L: 1/16
K: Gmaj
DE|G2DE GDEG DEGA B2AB|G2`,
			contourShift: -1,
			theSessionId: 857,
			parts: "AABB"
		},
		{
			abc: `X:1
T:Bunker Hill
T:from ITMA | Selections from the McConnell Family Collection | October 2024
R:reel
M:4/4
Q:1/4=110
L:1/16
D:ITMA | Selections from the McConnell Family Collection | October 2024
S:Gussie Russel
F: https://www.itma.ie/playlists/mcconnell-playlist-october24/?track=4
N:0. As played by Gussie Russel (1927-2004) on a whistle; 1974-01-19; Doonagore, Co. Clare.
N:1. Just a rough attempt to transcribe how it was played the first 
N:time round.
N:2. I’m using my own, admittedly idiosyncratic choice of time
N:signature and note length. The standard way has bars that are
N:half as long, using 4/4 with quavers. Here it’s 4/4 with
N:semiquavers. (I did consider using 4/2 with quavers. That 
N:would be closer to the standard way but the four beats to a
N:bar would be slightly less clear IMO.)
Z:abc-transcription Malcolm Schonfield %2024-11-22,28
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
I:abc-charset utf-8
K:D mixo
P:Intro
~d2cA | GE~E2 D2z2 d2z2 D2z2 | ~d2z2 d2z2 d2z2 d2cA  ||
[P:Ⅰ]G~e3 d2z2 EDEG .c2~B2 | ABAG eg~g2 ABcA .d2cA | G~e3 d2z2 edeG .c2~B2 | ABAG eg~g2 ABcA .d2cA |
G~e3 d2z2 edeG .c2~B2 | ABAg eg~g2 ABcA .d2cA | G~e3 d2z2 edeG .c2~B2 | ABAg eg~g2 ABcA .d2cA ||
P:Ⅱ
GccB c2z2 Gcc2 cBAG | Add^c d2z2 dedB cBAG | EGAB c2z2 BAdB c2Bc | dB (3cBA Bg~g2 ABcA .d2cA |
GBcB c2z2 GBc2 cBAG | Add^c d2z2 dedB cBAG | EGAB c2z2 cAdB c2Bc | dB (3cBA Bg~g2 ABcA d2z2 ||
P:Ⅲ
ed~d2 aded aded a2z2 | ge~e2 e2ed (3Bcd ef g2ag | fAeA d2z2 (3cBA dB c2Bc | dB (3cBA BGG2 ABcA d2z2 |
ed~d2 aded aded a2z2 | g~eed e2ed (3Bcd ef g2ag | fAeA d2z2 (3cBA dB c2Bc | dB (3cBA Bgg2 ABcA .d2cA |]`,
			incipit: `X:1
M:4/4
K:D mixo
L:1/16
cA|GEE2 D3G E/F/GAB c2Bc|A3G EFGE ABcA d2`,
			theSessionId: 207
		},
		{
			incipit: `X: 1
T: Hetty O'Hady
R: jig
M: 12/8
L: 1/8
K: Gmaj
GBA B2d edB AGE|GBA B2G`,
			theSessionId: 15402,
			references: [
				{
					notes: "see entry for Darby The Driver / Charlie Mulvihill"
				}
			]
		},
		{
			incipit: `X: 1
T: Old Man Dillon
R: jig
M: 12/8
L: 1/8
K: Ador
EAA ABd edB cBA|BGG DGG Bdc `,
			norbeckId: 116,
			theSessionId: 2200,
			parts: "AABB"
		},
		{
			groups: "su",
			incipit: `X: 1
T: Winnie Hayes'
R: jig
M: 12/8
L: 1/8
K: Emin
BAF ~E3 FED ~E3|BAF EAG FED`,
			theSessionId: 797
		},
		{
			parts: "AABBCC",
			abc: `
X: 1
T:The New Policeman
S: Oisin McAuley
D: Up In The Air
F: https://youtu.be/CxAYuvcfslQ?si=Y0y7AnAa8NbZk_9i&t=99
Z: abc-transcription Malcolm Schonfield% 2024-05-28
Z: abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
R: jig
M:12/8
L: 1/8
N:*abc-tools: convert to M:12/8*
K: G
[P:A]Bc | dBG B,DG Bdd d^cd | e^cA A,EE Ace gfe | dBG B,DG Bd/d/d dcB | Ace a2g fd^c d
B=c | dBG B,DG Bd/d/d d^cd | e^cA A,^CE Ace gfe | dBG B,DG Bd/d/d dcB | Ace a2g fd^c d
[P:B]ef | gea fdg ece dBG | GBd gfe dBG GBd | gea fdg ece dcB | Ace ^ga=g fd^c d
ef | gea fdf ece dBG | GBd fg/f/g dBG GBd | g3 fed e/f/ge dcB | Ace ^ga=g fd^c d
[P:C]|: ^c=c | Bc^c dbf agd fe_e | dbf agd g/f/ed bge | dbf aed ~B3 gdB | Ace a2g fd^c d :|`
		},
		{
			groups: "su",
			incipit: `X: 1
T: Jim Donoghue's
C: Jim Donoghue
R: reel
M: 4/4
L: 1/16
K: Dmaj
~A3F BFAF BFAF EDB,D|~A3F`,
			theSessionId: 2536,
			references: [
				{
					artists:
						"John Carty, fiddle; Alec Finn, bouzouki; Artie McGlynn: guitar",
					url: "https://youtu.be/2fibzyiSZ3k",
					notes: `
Album: At It Again (2003)
A comment on thesession I wholeheartedly agree with: “I think John Carty’s version on the fiddle is pure magic where he plays it innumerable times but each one is that bit different so that one could almost listen to it forever!”`
				}
			]
		},
		{
			incipit: `X: 1
T: George White's Favourite
R: reel
D:Last Night’s Fun (1996)
M: 4/4
L: 1/16
K: Gmaj
eB~B2 eBdB AGAB GEDE|GB (3BBB`,
			theSessionId: 718,
			references: [
				{
					url: "https://youtu.be/lQ1d3TvE1Ow",
					artists: "John Carty, fiddle; Brian McGrath, piano",
					notes: "George White's Favourite / The Lass Of Carracastle"
				}
			]
		},
		{
			incipit: `X: 2
T:The Banks Of The Ilen
R: reel
M: 4/4
L: 1/8
K: Dmaj
FDFA d2fd ~d2fd ecAG|FDFA defe
`,
			theSessionId: 747
		},
		{
			incipit: `X: 1
T: I'm Not Fed Up With The Pacific Ocean
C:Ola Bäckström
R: reel
M: 4/4
L: 1/16
K: Dmaj
F3F- FDEG F3F- FDEG|F2EF `,
			theSessionId: 16478
		},
		{
			incipit: `X: 1
T: McGoldrick's
C:Michael McGoldrick
R: jig
M: 12/8
L: 1/8
K: Dmaj
~f3 efg fdA ~G3|FAd`,
			theSessionId: 628
		},
		{
			incipit: `X: 6
T:The Mason's Apron
R: reel
M: 4/4
L: 1/16
K: Amaj
eg|aA (3AAA cBAF EFAB cABc|dB 
`,
			theSessionId: 74
		},
		{
			incipit: `X: 1
T:The Monaghan
R: jig
M: 12/8
L: 1/8
K: Emin
BGE F2E BGE FGA|BGE F2E AFD FGA|`,
			theSessionId: 67,
			references: [
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-august-2025/?track=1",
					artists:
						"Brian Conway, fiddle; Tony DeMarco, fiddle; Felix Dolan, piano",
					notes: "Monaghan; Larry O'Gaff (1996)"
				}
			]
		},
		{
			incipit: `X: 1
T:The Hunter's House
C: Ed Reavy
R: reel
M: 4/4
L: 1/16
K: Gmaj
B2dB cAFA G2BG DGBG |`,
			theSessionId: 472,
			references: [
				{
					notes: "See the entry for the Mountain Road"
				}
			]
		},
		{
			groups: "su",
			incipit: `X: 9
T:The Dunmore Lasses
R: reel
M: 4/4
L: 1/8
K: Emin
|:E3F G3A Beed Beed|E2EF G2BG `,
			theSessionId: 462,
			references: [
				{
					url: "https://www.itma.ie/playlists/furls-leitrim-performers/?track=3",
					artists: "The Leitrim Trio",
					notes: `The Dunmore lasses; The youngest daughter; The Aughavas reel. 
0:24 onwards.
“The Furls of Music – The Michael McNamara Collection” From field recordings made by Leitrim flute player Michael McNamara from 1959 to the mid-1990s.`
				}
			]
		},
		{
			groups: "su",
			incipit: `X: 1
T:The New Copperplate
R: reel
M: 4/4
L: 1/16
K: Gmaj
G2dG BGdG ~G2dc BGGB|A2`,
			theSessionId: 887,
			references: [
				{
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=23",
					artists: "Cathal McConnell, flute",
					notes: "“The Copperplate”"
				}
			]
		},
		{
			abc: `X:1
T:The Mountain Road
C:Michael Gorman
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/68#setting25940
N:Setting entered in thesession by user “slainte” on 2015-03-08
N:*abc-tools: convert to M:4/4 & L:1/16*
N:(edited after importing)
K:Dmajor
|F2AF BFAF F2AF EFDE|F2AF BFAF GEFD EDB,D|
F2AF BFAF F2AF EFDE|FA~A2 BAFB ABde ~f3e||
~d3B A2FA dcde ~f3e|~d3B A2FA GEFD EDB,c|
~d3B A2FA dcde ~f3e|defd BAFA G2FG EDB,E||`,
			theSessionId: 68,
			theSessionSettingId: 25940,
			references: [
				{
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=2",
					artists: "The mountain road; The hunter's house",
					notes:
						"Charlie Mulvihill, button accordion; Michael McNamara, flute; Pee Fitzpatrick, fiddle"
				},
				{
					url: "https://www.cranfordpub.com/mp3s/michaelgorman2.mp3",
					artists: "Michael Gorman, fiddle",
					notes:
						"The original six part version, as played by the tune's composer. [More info from Cranford Publications](https://www.cranfordpub.com/tunes/Irish/Mountain_Road.htm)"
				}
			]
		},
		{
			groups: "alora",
			incipit: `X: 1
T: John Brosnan's
R: polka
M: 4/2
L: 1/8
K: Dmaj
D>E DB AF FB|AF DE FEEF/E/|`,
			parts: "AABBCC",
			theSessionId: 3835,
			references: [
				{
					url: "https://jasonorourke.bandcamp.com/track/john-brosnans-the-frozen-mouse-polka-timmy-mccarthys",
					artists: "Jason O’Rourke, concertina; Stevie Dunne, guitar",
					notes: `John Brosnan’s / The Frozen Mouse / Timmy McCarthy’s
Album:  The Northern Concertina (2015)
The guitar could be Tim Edey and not S Dunne, going from the meagre info available online; but I suspect it’s S Dunne as he seems to be the main backer for JO’R.`
				}
			]
		},
		{
			groups: "alora",
			incipit: `X: 1
T:The Frozen Mouse
C:Jason O’Rourke
R: polka
M: 4/2
L: 1/8
K: Gmaj
B>c de dB Bd|cA AB/d/ ed BA|`,
			parts: "AABB",
			theSessionId: 18688,
			references: [
				{
					url: "https://jasonorourke.bandcamp.com/track/john-brosnans-the-frozen-mouse-polka-timmy-mccarthys",
					artists: "Jason O’Rourke, concertina; Stevie Dunne, guitar",
					notes: `John Brosnan’s / The Frozen Mouse / Timmy McCarthy’s
Album:  The Northern Concertina (2015)
2 parts`
				}
			],
			scores: [
				{
					type: "tune",
					name: "composer’s score",
					url: "http://jasonorourke.info/wp-content/uploads/2020/11/The-Frozen-Mouse-Polka.pdf"
				}
			]
		},
		{
			groups: "alora",
			incipit: `X: 5
T: Neilí's
R: polka
M: 4/2
L: 1/8
K: Amix
ed cA ed c2|AA/c/ ef ge d2|`,
			theSessionId: 7386,
			parts: "AABBCC",
			references: [
				{
					url: "https://jasonorourke.bandcamp.com/track/john-brosnans-the-frozen-mouse-polka-timmy-mccarthys",
					artists: "Jason O’Rourke, concertina; Stevie Dunne, guitar",
					notes: `John Brosnan’s / The Frozen Mouse / Timmy McCarthy’s
Here this polka, Neilí's, is given the name Timmy McCarthy’s.
Album:  The Northern Concertina (2015)`
				}
			]
		},
		{
			incipit: `X: 1
T: My Mind Will Never Be Easy
R: slip jig
M: 9/8
L: 1/8
K: Cmaj
AGE EDE C2 D|E2 G GAE GcB|`,
			theSessionId: 191,
			references: [
				{
					url: "https://jasonorourke.bandcamp.com/track/the-peacock-following-the-hen-ofarrells-welcome-to-limerick-my-mind-will-never-be-easy",
					artists: "Jason O’Rourke, concertina; Stevie Dunne, guitar",
					notes: `(2015) The Peacock Following the Hen/O'Farrell's Welcome to Limerick/My Mind will never be Easy
From 2:40 onwards
Is the  guitarist S Dunne? See my remark under John Brosnan's polka.`
				}
			]
		},
		{
			groups: "alora",
			incipit: `X: 3
T:The Sligo Maid
R: reel
M: 4/4
L: 1/16
K: Ador
A2BA Bdef gedB AGEF|G2`,
			theSessionId: 399,
			references: [
				{
					url: "https://open.spotify.com/track/0y4zNhYmRi4mb4njDGztZR",
					artists: "Seán Maguire, fiddle; Wilcil McDowell, piano",
					notes: `Donegal Reel / Sligo Maid / The White Leaf
From 1:07 onwards
Album: A Man Apart (2004)`
				}
			]
		},
		{
			group: "su",
			parts: "ABCDEFG",
			aka: "Fisher street",
			incipit: `X: 2
T: Paddy Fahey's No. 4
C:Paddy Fahey
R: jig
M: 12/8
L: 1/8
K: Ador
cBA EAB cBA aed|c`,
			theSessionId: 4930,
			references: [
				{
					url: "https://open.spotify.com/track/20Grwxqv2wiZy3aBbO7Kd1",
					artists: "Fisher Street",
					notes: `(1991) album: Out in the night
Steam up: played in a set followed by Drummond Castle`
				}
			]
		},
		{
			incipit: `X: 3
T:The Roscommon
R: reel
M: 4/4
L: 1/16
K: Edor
EFGA BAGB AFF2 dFAF|EFGA`,
			theSessionId: 637
		},
		{
			groups: "su,alora",
			incipit: `X:4
L:1/8
M:12/8
K:Am
EBc ~G3 FBc ~G3 | ~e3 dcB AGF EFD |`,
			abc: `
X:4
T:SNCF jigs
R:jig
C:Malcolm Schonfield
L:1/8
N: 1. This tune came to me sometime between 2010 and 2016. I chose not to
N:  completely fix the order the parts are played in; and whether or not to double them. 
N: 2. Obviously the SNCF jingle is prominent in the tune, whence its name.
N: 3. This score has many defects and maybe sometime soonish I’ll get round to redoing it.
N: 4. The ABC code here has many hidden comments which are related to “ossia” – alternative
N: ways of playing a section. Not sure if that idea (ossias embedded in ABC) will be developed
N: or not in the foreseeable future.
M:12/8
K:Am
%160509, 160510, 160519, 160623 (chords), 160627, 171107 transposed from G aeol to A aeol, 260206 abc syntax, 260212 comments, 260217
P:A
"Am"EBc "F"~G3 \\ % or { EBc G2G } or { .E2B cG2 } or { EBc GAE }
"Am"FBc "F"~G3 | \\ %  or { .F2B cG2 | }  or { .E2B cG2 |} or { EBc ~G3 | } or { EBc GAF | } or { .E2B cG2 |}
"Am"~e3  \\ %  or {| efe} or {| d2e} or {| Ace } or {| .e2e }
dcB \\%
"Dm"AGF EFD |  %  or { AGA BAG |}  or { ABG E3 |}
"Am"EBc "F"~G3 "Am"FBc "F"~G3 | "Am"~e3 dcB 
[1 AGF "^⇒c or B"~E3 |] \\ % or { AAA A z A |]}
[2 A"^⇒D"z |] \\
[3 Az"^⇒F or G"z |]
P:B
"Dm"FED "G"~B3 "Am"BcG ~A3 | "Dm"FED "G"BcG "Am"AEA cBA | % or { B2c B3 A3 }
"Dm"FED \\
"G"~B3 \\ % or { B2B } or { B2B- }
"Am"BcG ~A3 | "Dm"FED "G"BcG "Am"AAA A z "^⇒B or c""<("">)"A |]
P:C
|: c BAG | "F"FEF AB(G "Am"E)DE AB(G | \\ % or {F2(c B)AG E2c BA(G} or {FEF AB(F E)DE AB(G}
"Dm"F)A(e d)B(d c)A(c B)A(G | % or { F)A(e d)c(B c)B(A B)A(G |}
"F"F)EF AB(G "Am"E)DE AB(G | \\ %
"Dm"F)A(e "G"d)B(G \\ % or {| F)A(e d)c(B }
[1 "Am".A)"^⇒D"z :| \\ % 
[2 "Am"A)AA A z "^⇒B or c""<("">)"A |]  \\
[3 "Am"A)AA A "^⇒E"z |]  
P:D
|: (E | "Dm".F2)(A "Em".G2)(B "Am".d2)c- cA(E | \\ % or { (B .d3) cA(E | }
"Dm"F2)(A "G".G2)B "Am"EGF ~E3 | % or { EdE | }
.F2(A .G2)B d2c- cde | dcB A2G [1 AAA A "^⇒E"z :| [2 "^⇒F"A3 |] 
P:E
e2f |: e3-edc dBG F2E | c3 \\
-cBc \\ % or {ABc} 
dBd g2f | \\ % or { d3  e2f |} or(?) { a2g |} or { g2 f- | fe2-edc }
       e3-edc dBG F2E | \\
 c3 ABc % or { c3-cBc } 
 \\
[1 BGE A "^⇒E"z :| \\
[2 BGE [Ae] z "^⇒F"f :| \\
[3 BGE A z "^⇒B or c""<("">)"A |] \\ % or { A3 |] }
[4 "^⇒G or G’"~B3 |] \\ % or {BG"^⇒G or G’"E}
[5 B "^⇒D"z :| 
P:F
|: ABc | F2d B3 BcG A3 | \\ % or { ABc E3 |}
FAd B3 Bdg e3 | % 
      F2d B3 BcG A3 | FAd \\
BcG \\ % or { BGE } 
~A3 :|
P:G
|: ABc | .F2d -d2 B- BcB ABc | .F2d- d2B- Bcd ecA | % or { Bdg e3 | }
      .F2d -d2 B- BcB ABc | F2d BGE A3 :|`
		},
		{
			incipit: `
X: 1
T:The Humours Of Ballyloughlin
R: jig
M: 12/8
L: 1/8
K: Dmix
A3 AGE GED ~D3|c2A ded cAG FED|`,
			theSessionId: 210,
			norbeckId: 65,
			references: [
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2025/?track=12",
					artists:
						"Liam O'Flynn, uilleann pipes; Liam O'Connor, fiddle; Steve Cooney, guitar"
				}
			],
			parts: "AABBCCDD"
		},
		{
			incipit: `
X: 1
T:The Liffey Banks
R: reel
M: 4/4
L: 1/8
K: Gmaj
G2GF GBdB ~c3eg2 dc |`,
			theSessionId: 502,
			references: [
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2025/?track=5",
					artists:
						"Brian Conway, fiddle; Andy McGann, fiddle; Martin Wynne, fiddle; Felix Dolan, piano"
				}
			]
		},
		{
			incipit: `X: 1
T: Paddy Fahey's
C:Paddy Fahey
R: reel
M: 4/4
N: Playable on the cello, IMO
L: 1/16
K: Ddor
D2A,D FEFG AdcA d2de|fedf edcA`,
			theSessionId: 463,
			references: [
				{
					url: "https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-december-2025/?track=3",
					artists: "Andy McGann, fiddle; Felix Dolan, piano"
				}
			]
		},
		{
			aka: "Paddy Fahey’s No. 10",
			incipit: `X: 2
T: Paddy Fahey's
C:Paddy Fahey
R: jig
M: 12/8
L: 1/8
K: Gmaj
DGA B2d cBG AFD|dBd cAc BGB AFD|`,
			theSessionId: 2561,
			theSessionSettingId: 46659,
			parts: "AABB"
		},
		{
			incipit: `X: 5
T:The Gooseberry Bush
R: reel
M: 4/4
L: 1/16
K: Dmaj
ADFD EFGE AGAB =c2AG|AB=cA d^cAG |`,
			parts: "AABBCC",
			theSessionId: 2732
		},
		{
			incipit: `X: 5
T: Up And About In The Morning
R: jig
M: 12/8
L: 1/8
K: Dmaj
A3 DED ABG AdB|=cAG EFG ~FFD EFG| `,
			theSessionId: 3145,
			norbeckId: 162,
			theSessionSettingId: 54859,
			parts: "AABBCC"
		},
		{
			aka: "Fahey’s Favourite, Paddy Fahey’s Jig #1",
			incipit: `X: 3
T: Paddy Fahey's
C:Paddy Fahey
R: jig
M: 12/8
L: 1/8
K: Gmaj
DGA ~B3 cBc d2g|gfd Bcd
%todo:check title`,
			parts: "AABB",
			theSessionId: 532,
			norbeckId: 208
		},
		{
			groups: "alora",
			incipit: `
X: 6
T: Allistrum's March
R: jig
F:https://www.itma.ie/playlists/padraic-mac-mathunas-monthly-picks-january-2026/?track=11
S:Liam O'Flynn, uilleann pipes; Arty McGlynn, guitar; Rod McVey, keyboards
N:Allistrum's march / Paddy whack
M: 12/8
L: 1/8
K: Dmix
B2G AGF G2g fdc|B2G AGF Ggf d2c|`,
			theSessionId: 6188,
			parts: "AABB"
		},
		{
			incipit: `X: 7
T:The Humours Of Drinagh
R: jig
M: 12/8
L: 1/8
K: Dmaj
FDF ABc dfd ecA|FDF ABc`,
			parts: "AABB",
			theSessionId: 413
		},
		{
			incipit: `X: 1
T:The Bank Of Turf
R: jig
M: 12/8
L: 1/8
K: Dmaj
ABA DFA BAF DFA|dcd ede ~f3 def|`,
			theSessionId: 1819,
			parts: "AABB"
		},
		{
			abc: `X: 1
T:La Vicoise
O:France; Massif central.
R: Bourrée à 3 temps
M:3/8
L:1/16
K:C
GAB|c2e2de|c2e2de|f4e2|degGAB|c2e2de|c2e2de|f2e2d2|1 c3:|2 c6||
|:ABcdcA|d2c2B2|ABc2d2|ABcdcA|d2edcB|1 cdefg2:|2 c3 !D.C.!|]
`,
			parts: "AABB",
			badges: "pas carrée"
		},
		{
			abc: `X:1
T:Le curé de la chapelle
M:3/8
L:1/8
R:Bourrée à 3 temps
O:France; Massif central
Z:Malcolm Schonfield%2013-03-21
K:G dor
P:A
D|:G^F/G/A|BA/B/c|d/c/d/e/d/c/|ABA|D/G/^F/G/A/|BA/B/c|d/c/d/e/d/c/|d3-|d2(D|
D/)G/^F/G/A|BA/B/c|d/c/d/e/d/c/|ABA|D/G/^F/G/A/|BA/B/c|d/c/d/e/d/c/|d3-|dAB||
P:B
|:c/A/BA/G/|^FDA-|A/G/^F/G/A|BA/B/c-|c/A/BA/G/|^FDG|^F/G/A/B/A/F/|GAB:|
`,
			parts: "AABB",
			badges: "pas carrée"
		},
		{
			badges: "pas carrée",
			parts: "AABB",
			abc: `X: 1
R:Bourrée à 3 temps
O:France; Massif central
M:3/8
L:1/8
K:C
G, |: C2D | C/D/.E(F | .E)D2 | C2D | C/D/.E.F | D2G, :|
G, |: A,2G, | A,2G, | A,/B,/CD | CB,G, | A,2G, | A,2G, | A,/B,/CD | CE.G,:|`
		},
		{
			badges: "pas carrée",
			parts: "AABB",
			abc: `X:2
T:La Giate de Coualhon
R:Bourrée à 3 temps
O:France; Massif central(?)
Z:Malcolm Schonfield, 2023-04-02
Q:3/8=90
M:3/8
L:1/8
K:Gmix
[P:A]|: .G2B | .AD2 | G.B.c | d2(e | f/2)e/2d/2c/2B/2A/2 | 
.BGB | .AD2 | G.B.c | d2(e | f/2)e/2d/2c/2B/2A/2 :| G2.G ||
[P:B]|: A/2B/2cB/2A/2 | B/2c/2dc/2B/2 | A/2B/2cB/2A/2 | .BGB |
A/2B/2cB/2A/2 | B/2c/2dc/2B/2 |  [1 A/2B/2cB/2A/2 | G2B :|  [2 A/2B/2cB/2A/2 A,.G,|]`
		},
		{
			aka: ["Paddy Fahey’s No. 20", "Fahey’s Drink At The Well"],
			groups: "su",
			parts: "AABB",
			incipit: `X: 4
T:Paddy Fahey's
C:Paddy Fahey
R: reel
F:https://www.youtube.com/watch?v=T0e_og0XaKo
D:The Bunch Of Keys
N:Paddy Fahey’s, Paddy Kelly’s, Father O’Grady’s Trip To Bucca
S:Jason O’Rourke, button accordion; Ruadhrai O’Kane, fiddle; Paul McSherry, guitar; ?, bodhrán
M: 4/4
L: 1/16
K: Dmaj
dcAG EFGE A2dA cdec|dcAB cdef`,
			theSessionId: 1402
		},
		{
			incipit: `X:530
T:Mrs. Galvin's
R:jig
M:12/8
L:1/8
K:G
B2A BGG dGG BAG | ~A3 ABA  GB/c/d gdc |
`,
			norbeckId: 530,
			theSessionId: 10733,
			parts: "AABB"
		},
		{
			incipit: `
X:212
T:Connie the Soldier
R:jig
M:12/8
K:Amix
EAA ABd cAG E2D|EFG EFG EAF GED|
`,
			norbeckId: 212,
			theSessionId: 373,
			parts: "AABB"
		},
		{
			aka: "Martin Wynne's #1",
			incipit: `
X:1
T:
T:Martin Wynne's
R:reel
C:Martin Wynne 
M:C|
K:D
AF~F2 GE~E2 F2AF EFDB,|A,B,DE FEFB AB`,
			theSessionId: 347,
			norbeckId: 210
		},
		{
			incipit: `
X:1
T:The Hag at the Churn
R:jig
N:1. Classified by A. Ng as a single jig, but as a jig (not as a single jig) by H. Norbeck.
N:2. H. Norbeck’s site gives some interesting background on this tune.
M:12/8
K:Dmix
A2G ADD A2G Adc|A2G ADD EFG EFG:|`,
			norbeckId: 102,
			theSessionId: 829,
			parts: "AB"
		},
		{
			incipit: `
X:1
T:Donnybrook Fair
R:jig
M:12/8
K:G
~G3 AGA B2e dBA|~B3 GAB AGE EDE|`,
			norbeckId: 176,
			theSessionId: 26,
			parts: "AABB",
			incipitB: "gfe fed e/f/ge dBA|Bee dBA"
		},
		{
			incipit: `X: 1
M: 12/8
L: 1/8
K: D mixo
FED c2A d^cd efg | fed cAG FAF GFE |`,
			parts: "AABBCC",
			abc: `X: 1
T: Kitty's Rambles
S: Leo Rowsome, uilleann pipes
F:https://www.itma.ie/playlists/leo-rowsome/?track=1
%D:
I:abc-charset utf-8
%Z:abc-transcription Malcolm Schonfield% 2025-07-31
%Z:abc-copyright CC BY-NC 2.0 (https://creativecommons.org/licenses/by-nc/2.0/fr/deed.en)
R: Jig
M: 12/8
N: Kitty’s Rambles / Donnybrook Fair
H: The first time round he does something a bit different (part A; start of bar nb. 3)
H: that somewhat throws my ear off w.r.t. where the downbeat/start of the bar is. 
H: It’s interesting and is probably what spurred me to attempt this transcription.
H: The second time round he doesn’t do this.
L: 1/8
K: D mixo
!fermata!A-{B}AF || ~D3 cBA d^cd efg | fed ^cAF GFE AFD | 
AFD cBA d^cd efg | fed ^cAG ABc dAF |
~D3 cBA d^cd efg | afd ^cAF GFE AFD | 
~D3 cBA d^cd efg | fed ^cAF ABc d3 ||
df/g/a df/g/a df/g/a afd | ceg ceg ceg gfe | 
~f3 ~g3 afd efg | fed ^cAG ABc d3 |
df/g/a df/g/a df/g/a afd | ceg ceg ceg gfe | 
~f3 ~g3 ~a3 bag | fed ^cAG ABc dAF ||
~D3 cBA d^cd efg | afd ^cAF GFE AFD | 
~D3 cBA d^cd efg | fed ^cAG ABc dAF| 
"^The rest is omitted"y `,
			norbeckId: 300
		},
		{
			groups: "alora",
			abc: [
				`X:1
T:Säckpipslåt från Norra Råda
R: March
O:Sweden;Värmland.
N:Copied from [folkwiki.se](http://www.folkwiki.se/Musik/1869)
Z: Jimmy U, 2011-07-21
M:4/4
L:1/8
K:Ddor
DE|F2EFD2EF|G2FGE2FG|A2BA GFEF|D2EDC2DE|
F2EFD2EF|G2FGE2FG|A2BA GFEF|D6:|]|:DF|
A2FA cBGB|BAced2dc|A2FA cBGB|BAAG FEFG|
A2FA cBGB|BAced2dc|A2BA GFEF|D6:|]`,
				`X: 71
T: Murar Jans marsch
O:Sweden;Västmanland.
R: Gånglåt
Z: Nils L
N:Copied from [folkwiki.se](http://www.folkwiki.se/Musik/1786)
M: 2/4
L: 1/16
K: Am
(,AB | c2)(Bc) A2(Bc) | (d2cd) B2"#"cd | e2^fe (d^cBc) | A2A2 [E2A,2]AB | 
       c2(Bc A2)Bc | d2(^cd B2)cd | e2fe (d^c)(Bc) | !>![A6A6] :: [K:D]
(Ac) | e2(ce) gfdf | (fe)gb a2>(g2 | e2)ce gfdf | feed (cB)(cd) |
       e2ce gfdf | (fe)gb a2>(g2 | e2)fe (dc)(Bc) | [AA]6 :|`
			],
			references: [
				{
					url: "https://open.spotify.com/track/3mQDLVbdR6oSxhsrXWG4iN",
					artists: "Blå Bergens Borduner",
					notes:
						"[discogs](https://www.discogs.com/release/4225382-Bl%C3%A5-Bergens-Borduner-Bl%C3%A5-Bergens-Borduner)"
				},
				{
					url: "https://open.spotify.com/track/5HxW6YtjoooW0xgnekPPax",
					artists: "Anders Norudde, bagpipes",
					notes: "Album: Kan Själv! Track name: Sura Råda"
				}
			]
		},
		{
			groups: "su",
			incipit: `X: 2
T: Barra To Balloch
C:Angus MacKenzie
S:Dàimh
D:Tuneship (2013)
F:https://daimh.bandcamp.com/track/barra-to-balloch
N: As far as I can tell from info on Bandcamp, the artist/instrument list here is:
N: Angus MacKenzie, whistle; Damian Helliwell, mandolin; Gabe McVarish, fiddles; 
N: Ross Martin, guitar; Griogair Labhruidh, uillean pipes; Eilidh Shaw: fiddle; Duncan Lyall: bass
R: jig
M: 12/8
L: 1/8
K: Baeol
BAB d2 B efe edB|BAB`,
			parts: "AABB",
			theSessionId: 13601
		},
		{
			incipit: `X: 1
T: Lad O'Beirne’s
C:Lad O’Beirne
R: reel
M: 4/4
L: 1/16
K: Gdor
dc|BG~G2 DGBG AF~F2 AdcA|GDGA`,
			theSessionId: 4551,
			references: [
				{
					url: "https://www.itma.ie/playlists/josephine-keegan/?track=4",
					artists: "John Daly, fiddle; unidentified, piano",
					notes: `Devanny’s goat; Lad O’Beirne’s (2011)
From 1:13 onwards. NB There are three different reels called Lad O’Beirne’s!`
				}
			]
		},
		{
			abc: `X:1
T:The Ace And Deuce Of Piping
S:Doireann Glackin, fiddle; Sarah Flynn, concertina
D:The housekeepers
F:https://thehousekeepers.bandcamp.com/track/the-ace-and-deuce-of-piping-hornpipe
R:Hornpipe
M:4/2
N: Swung throughout – so always have “𝅘𝅥𝅮𝅘𝅥𝅮=𝅘𝅥𝅘𝅥𝅮”
Q:1/2=80
L:1/8
Z:abc-transcription Malcolm Schonfield %2025-03-17, 260212
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)I:abc-charset utf-8
K:C mixo
P:Ⅰ
|: GF | DEFD "^v1"(3EDC FD (3EDC FD E2DC | (3GAG AF (3GAG AF (3GAB AF GD (3DCD |
B3G AGFD C2cA GF (3EDC  |  ECFD E2DE C2c2 =BGFD | C2DE FGFD CDCD CDCD | C4-C2 :|
P:Ⅱ
|: z2 | GFGA BcBA GFGA Bc (3BGF | G2c2 (3dc=B c2 G2c2 C2(3BGF |
D2B2 D2BA GFGA B3d | (3edc (3dc=B (3cBG (3AGF DEFD E2DE |
C2c2 =BGFD C2DE FGFD | CDCD CDCD C4-C2 :|
P:variations
(3"^v1"EDC (3FED (3EDC FD`
		},
		{
			incipit: `X:216
T:The Holy Land
R:reel
M:4/4
L:1/16
K:D
B3d A2Bc dF~F2 DFAd|BG~G2 ABdf`,
			theSessionId: 616,
			norbeckId: 216
		},
		{
			aka: ["Aggie Whyte’s Chattering Magpies", "Paddy Kelly’s"],
			groups: "su",
			parts: "AABB",
			incipit: `X:1
T:Aggie Whyte's
C:Paddy Kelly
R:reel
M:4/4
L:1/16
K:G
BGAF DG~G2 ABcA defg|afge ~f3e `,
			norbeckId: 692,
			theSessionId: 1878
		},
		{
			incipit: `X: 3
T: Father O'Grady’s Visit To Bocca
C:Josie McDermott
R: reel
M: 4/4
L: 1/16
K: Dmaj
d3e fded cAAG EG~G2|fded cAAG EF `,
			theSessionId: 180,
			norbeckId: 368
		},
		{
			incipit: `X: 6
T: The Glen Road To Carrick
S:Séamus Glackin, fiddle
F:https://www.youtube.com/watch?v=uk1WwjvBiTE
D:Fiddlesticks: Irish Traditional Music from Donegal (1991)
R: reel
M: 4/4
L: 1/16
K: Dmaj
FD~D2 FDGE FDFG AdAG|FD~D2`,
			theSessionId: 2285,
			theSessionSettingId: 46044,
			norbeckId: 336,
			parts: "ABCDE"
		},
		{
			abc: `X:1
R:Polska
O:Sweden
H:2026-02-13, question sur groupe whatsApp/trad scandinave essaie d'identifier une polska ; ceci 
H: est mon relevé de l'enregistrement partagé.
M:3/4
L:1/8
K:Daeol
(3 d2 A3 c .B>>(G|(3A2)F2A2 G>E |(3F2D2F2 E>C |(3D2F2G2 A2 |
(3 d2 A3 c .B>G|(3A2F2A2 G>E |(3F2D2F2 E>C |D2 D4 :|
A,D2F E>C | (3D2F2G2 {AG}A2 | A,D2F E>C | (3D2B,2D2 A,2|
A,D2F E>C | (3D2F2G2 {AG}A2  | (3 d2 A2 G2 F>E| C2 D4 :| 

X:2
R:Polska
H: Ceci est mon souvenir de cette polska, il me semble l'avoir apris avec Marc Maurer 
H: sur les quais de seine il y a 15 ou 20 ans.
M:3/4
L:1/8
K:Ddor
(3 d2 A2 c2 B<G|(3A2F2A2 G<E |(3F2D2F2 E<C |D>E F<G A2 |
(3 d2 A2 c2 B<G|(3A2F2A2 G<E |(3F2D2F2 E<C |D2 D4 :|
(3 A,2 D2F2 E<C | D>E F<G A2 | (3 A,2 D2F2 E<C | (3D2_B,2D2 A,2|
(3 A,2 D2F2 E<C | D>E F<G A2 |(3 d2 A2 G2 E>C|  D2 D4 |]
`
		},
		{
			incipit: `X: 3
T: Off To California
R: hornpipe
M: 4/2
L: 1/8
K: Gmaj
(3DEF|GFGB AGED GBdg e2 (3def|gfgd edBG`,
			theSessionId: 30,
			parts: "AABB",
			norbeckId: 81
		},
		{
			incipit: `X: 1
T: The Merry Blacksmith
R: reel
M: 4/4
L: 1/16
K: Dmaj
d2dA BAFA ABdA BAFA|ABde`,
			theSessionId: 72,
			norbeckId: 17,
			parts: "AABB"
		},
		{
			parts: "AABB",
			aka: ["The Connacht", "The Devil's in Dublin"],
			incipit: `X: 1
T: Devils Of Dublin
R: reel
N: A close relative of the Merry Blacksmith.
M: 4/4
L: 1/16
K: Dmaj
dcBA BAFB AFBF A~F3|Ad (3ddd Adfd`,
			theSessionId: 538,
			norbeckId: 868,
			references: [
				{
					url: "https://www.itma.ie/playlists/josephine-keegan/?track=3",
					artists:
						"Josephine Keegan, fiddle; Dan Healy, flute; Tom Moran, banjo; Seán Óg McKenna, banjo; Kathleen Smith, fiddle; Antóin Mac Gahbann, fiddle; Phil Callery, fiddle; Ita Garvey, fiddle; Seán Keane, fiddle; Mick O'Connor, flute; Unidentified, flute; Unidentified, fiddle",
					notes: `The boys of the lough; The devil's in Dublin; The duke of Leinster (2011)
From 1:46 onwards. An “impromptu session of music in the old style led by Josephine [Keegan] herself”.`
				},
				{
					url: "https://www.itma.ie/playlists/michael-mcnamara-sound-collection-playlist/?track=17",
					artists: "Denis Ryan, fiddle; Cathal McConnell, flute",
					notes: `The Connacht; Cooley’s; The Bucks of Oranmore
(A warning for ITMA links: you have to click on the tune in the playlist once the page is displayed rather than simply clicking on play.)
I’m very fond of this reel. There’s a lot of scope for variation in it I think.`
				}
			]
		},
		{
			abc: `X:1
T:Pull The Knife And Stick It Again
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-16,
N:from https://thesession.org/tunes/398#setting13240
N:Setting entered in thesession by user “milesnagopaleen” on 2003-02-10
N:*abc-tools: convert to M:12/8*
K:Edorian
|:E3 GFE DB,E DB,D|E3 GFE ABG AFD|
E2F GFE DB,E DEF|G2E FED B,ED E3:|
|:edB BAF EDB, D3|edB BAF ABc def|
edB BAF EDB, DEF|G2E FED B,ED E3:|`,
			theSessionId: 398,
			parts: "AABB",
			norbeckId: 49
		},
		{
			groups: "su",
			parts: "AABB",
			incipit: `%abc-2.1
X: 1
T: The Sour Mash
C: Angus Mackenzie; Gabe McVarish
S:Dàimh
D:Tuneship (2013)
F:https://daimh.bandcamp.com/track/coddywatch
Z:abc-transcription Malcolm Schonfield
Z:abc-copyright CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
I:abc-charset utf-8
N: As far as I can tell from info on Bandcamp, the artist/instrument list here is:
N: Angus MacKenzie, uillean pipes; Damian Helliwell, mandolin; Gabe McVarish, fiddles; 
N: Ross Martin, guitar; Griogair Labhruidh, uillean pipes; Jenny Hill: double bass
N: Waiting to hear from Dàimh before publishing my full transcription.
R: strathspey
M: 4/2
L: 1/8
Q:1/2=90
K: Amin
d/ |c<AA>G A>ce>d c<AB>d c<AG2 |`
		},
		{
			incipit: `X: 1
T: O'Mahony's
F:https://music.youtube.com/watch?v=yE_iY3Z4FBs
S:Jason O’Rourke, concertina
D:The Bunch Of Keys
R: hornpipe
M: 4/2
N:On the album, this is the first in a set with the title: “Gan Ainm/The New Century”
L: 1/8
K: Gmaj
ge|dBAB ~G3A (3BAG Bd ~g3a|bgaf gede`,
			theSessionId: 2488,
			parts: "AABB"
		},
		{
			aka: "Allistrum’s",
			incipit: `X: 3
T: Martin O'Connor's
R: polka
M: 4/4
S:Jason O’Rourke, concertina
D:The Bunch Of Keys
F:https://music.youtube.com/watch?v=HKx_-xusj_s&t=81
N:On the album, this is the second in a set with the title: “Two Polkas”.
N: The first one is Forde's.
L: 1/8
K: Gmaj
e>d|BA AG/A/ BG G>A|BG g>a ge ed|`,
			theSessionId: 5952,
			norbeckId: 115,
			parts: "AABB"
		},
		{
			abc: `X:1
T:Out On The Ocean
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/108#setting108
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
N:*abc-tools: convert to M:12/8*
K:Gmajor
|:GE|D2B BAG BdB A2B|GED G2A B2B AGE|
D2B BAG BdB A2B|GED G2A BGE G:|
Bd|e2e edB ege edB|d2B def gfe dBA|
G2A B2d ege d2B|AGE G2A BGE G:|`,
			theSessionId: 108
		},

		{
			abc: `X:1
T:The Mist Covered Mountain
C:Junior Crehan
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/256#setting256
N:Setting entered in thesession by user “glauber” on 2001-08-25
N:*abc-tools: convert to M:12/8*
K:Adorian
|:G|EAA ABd e2 A AGE|~G3 GAB dBA GED|
EAA ABd e2A AGE|efg dBG BAG A2:|
a|age a2b age edB|AGE G2A BAB GED|
age a2b age edB|AGE G2A BAG A3|
age a2b age edB|AGE G2A BAB GED|
EDE G2A BAG ABd|efg dBG BAG A2||`,
			theSessionId: 256
		},
		{
			abc: `X:1
T:The Kesh
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/55#setting55
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
N:*abc-tools: convert to M:12/8*
K:Gmajor
|:G3 GAB A3 ABd|edd gdd edB dBA|
GAG GAB ABA ABd|edd gdd BAF G3:|
|:B2B d2d ege dBA|B2B dBG ABA AGA|
BAB d^cd ege dBd|gfg aga bgg g3:|`,
			theSessionId: 55
		},
		{
			abc: `X:1
T:The Blarney Pilgrim
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/5#setting5
N:Setting entered in thesession by user “Jeremy” on 2001-05-14
N:*abc-tools: convert to M:12/8*
K:Dmixolydian
|:DED DEG A2A ABc|BAG AGE GEA GED|
DED DEG A2A ABc|BAG AGE GED D3:|
ded dBG AGA BGE|ded dBG AGA GAB|
g2e dBG AGA BGE|B2G AGE GED D3:|
A2D B2D A2D ABc|BAG AGE GEA GED|
ADD BDD ADD ABc|BAG AGE GED D3:|`,
			theSessionId: 5
		},
		{
			abc: `X:1
T:The Castle
C:Sean Ryan
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/273#setting273
N:Setting entered in thesession by user “Will Harmon” on 2001-09-06
N:*abc-tools: convert to M:12/8*
K:Adorian
|:~c3 BAG AGE DB,G,|~A,3 EDB, DEG AGE|
cBA BAG AGE DB,G,|A,2 E EDE DB,G, A,2 B:|
|:cBA ~a3 bag edB|GBd ~g3 GBd cBA|
cBc dcd ede gab|age dBG EFG A2 B:|`,
			theSessionId: 273
		},
		{
			abc: `X:1
T:The Pipe On The Hob
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/81#setting81
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
N:*abc-tools: convert to M:12/8*
K:Adorian
B|:c2c edc edc BAG|ABA g3 eaa ged|
c3 edc edc deg|age edB ABA A3:|
g2g gea age dBA|ABA g2e aba gef|
g3 gea age deg|age dBe ABA A3:|
c2c d2d edc AGE|c3 d2d edc A2B|
cBc dcd ede gab|age dBe ABA A3:|`,
			theSessionId: 81
		},
		{
			abc: `X:1
T:The Connaughtman's Rambles
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/19#setting19
N:Setting entered in thesession by user “Jeremy” on 2001-05-18
N:*abc-tools: convert to M:12/8*
K:Dmajor
|:FAA dAA BAA dAG|FAA dfe dBB BAG|
FAA dAA BAA def|gfe dfe[1 dBB BAG:|2 dBB B3||
|:fbb faf fed ede|fbb faf fed e3|
fbb faf fed def|gfe dfe[1 dBB B3:|2 dBB BAG||`,
			theSessionId: 19
		},
		{
			abc: `X:1
T:The Mug Of Brown Ale
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/888#setting888
N:Setting entered in thesession by user “gian marco” on 2002-08-11
N:*abc-tools: convert to M:12/8*
K:Adorian
g/f/|:eAA fAA ~g3 age|dBG GAG ~B3 Bcd|
eAA fAA ~g3 age|dBd gdB ABA ABd:|
efg ~a3 aba age|dBd ~g3 gba ged|
efg ~g3 aba age|dBd gdB ABA ABd|
efg ~a3 aba age|dBd ~g3 gba ged|
efg a2b ^c'ac' age|dBd gdB ABA A2||`,
			theSessionId: 888
		},
		{
			abc: `X:1
T:The Cliffs Of Moher
R:jig
L:1/8
M:12/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/12#setting12
N:Setting entered in thesession by user “Jeremy” on 2001-05-18
N:*abc-tools: convert to M:12/8*
K:Adorian
|:a3 bag eaf ged|c2A BAG EFG ABd|
eaa bag eaf ged|c2A BAG EFG A3:|
e2e dBA e2e dBA|GAB dBA GAB dBd|
e2e dBA e2e dBA|GAB dBA EFG A3|
efe dBA efe dBA|GAB dBA GAB dBd|
efe ded cec BeB|GAB dBA EFG A3|`,
			theSessionId: 12
		},
		{
			incipit: `X: 1
T: The Frost Is All Over
R: jig
M: 12/8
L: 1/8
K: Dmaj
def edB AFD E2 D|DFA AFA`,
			theSessionId: 448
		},
		{
			incipit: `X:1
T:Tam Lin
C:Davey Arthur
R:reel
L:1/16
M:4/4
K:Dminor
A,2DA, FA,DA, B,2DB, FB,DB,|C2EC GCEC`,
			theSessionId: 248
		},
		{
			abc: `X:1
T:The Aughacashel
C:Josephine Keegan
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/1498#setting1498
N:Setting entered in thesession by user “MichaelBolton” on 2003-03-10
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gmajor
|:DEGA BG (3GGG AGBG ABGE|DEGA Bded gedB ABGE|
DEGA BG (3GGG AGBG ABGE|Bded Bdge[1 dBAc BGAG:|2 dBAB GABd||
|:(3ggg dB G3B e2dB G3B|(3AAA AB AE(3EEE c2B2 ABcd|
(3ggg ga (3bbg ef gage d3B|cABG AGEG[1 DGGF GABd:|2 DGGF G4||`,
			theSessionId: 1498
		},
		{
			incipit: `X:1
T:The Musical Priest
R:reel
L:1/16
M:4/4
K:Bminor
BA|FBBA B2Bd cBAf ecBA|FBBA B2Bd`,
			theSessionId: 73
		},
		{
			incipit: `X:1
T:Farewell To Chernobyl
C:Michel Ferry
R:reel
L:1/16
M:4/4
K:Dminor
D3F ADFA DFAF GFED|A,3C EA,CE`,
			theSessionId: 767
		},
		{
			incipit: `X:1
T:The Banshee
C:James McMahon
R:reel
L:1/16
M:4/4
K:Gmajor
G2GD EDEG AGAB d2Bd|eged BAGA `,
			theSessionId: 8
		},
		{
			abc: `X:1
T:The Sally Gardens
R:reel
L:1/16
M:4/4
K:Gmajor
G2DG BAGB dBeB dBAB|d2Bd efge`,
			theSessionId: 98
		},
		{
			abc: `X:1
T:The Mullingar Races
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/225#setting225
N:Setting entered in thesession by user “b.maloney” on 2001-08-06
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Dmajor
A,2|D2(FD) EA,A,E DEFA Bcde|(3(fga) ec dcdA (3BcdAF EGFE|
DEFD EA,A,E DEFG Bcde|(3(fga) ec dBAG FGEF D2||
(3(ABc)|d2(fd) adfb afdf edBc|d2(fd) adfd Beed egfe|
d2(fd) adfb afdf edBc|dgfe dBAG FGEF D2||`,
			theSessionId: 225
		},
		{
			abc: `X:1
T:The Maids Of Mitchelstown
R:reel
L:1/8
M:4/2
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/120#setting120
N:Setting entered in thesession by user “Jeremy” on 2001-06-04
N:(edited after importing))
K:Dminor
|:D2AG EEG2 A2GA cAGE|D2AG EEG2 A2GE EDDC:|
|:EGA=B c2AG Adde f2ed|cAGE F3G [1 AcGE EDD2:|2 Ac=Bd cAGE||`,
			theSessionId: 120
		},
		{
			incipit: `X:1
T:The Maid Behind The Bar
R:reel
L:1/16
M:4/4
K:Dmajor
FAAB AFED FAAB ABde|fBBA Bcde`,
			theSessionId: 64
		},
		{
			incipit: `X:1
T:The Silver Spear
R:reel
L:1/16
M:4/4
K:Dmajor
A|:FA (3AAA BAFA dfed BddA|FA (3AAA BAFA `,
			theSessionId: 182
		},
		{
			groups: "su",
			parts: "AABB",
			incipit: `X:1
T:Sergeant Early's Dream
R:reel
L:1/8
M:4/2
K:Ddorian
|:dc|ADDE FAcA GECD ~E3F|DA,DE FEFG`,
			theSessionId: 1651
		},
		{
			incipit: `X:1
T:Palmer's Gate
C:Joe Liddy
R:reel
L:1/16
M:4/4
K:Eminor
GA|BE (3EEE Gz BG AcBA GEDE|~G3A BAGA `,
			theSessionId: 1020,
			groups: "su",
			parts: "AABB"
		},
		{
			abc: `X:1
T:The Concertina
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/18#setting18
N:Setting entered in thesession by user “Jeremy” on 2001-05-18
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Dmajor
|:A2FA BAFA A2FA BAFA|B2BA B2BA B2BA BAFA|
A2FA BAFA A2FA BAFA|FABc d2dA BAFE D4:|
|:Addd Addd AddA BAFA|B2BA B2BA B2BA BAFA|
Addd Addd AddA BAFA|FABc d2dA BAFE D4:|`,
			theSessionId: 18
		},
		{
			abc: `X:1
T:The Old Bush
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/1499#setting1499
N:Setting entered in thesession by user “gian marco” on 2003-03-11
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Dmixolydian
|:d^c|A2GA cA~A2 d^cde fdec|A2GA cA~A2 dfed cAd^c|
A2AG cAA2 d^cde ~f3g|af (3gfe fde^c dfed =cA:|
|:Ag|eg~g2 edcd efge c3d|eg~g2 a2ge dfed cAAg|
eg~g2 ag~g2 efge defg|af (3gfe fde^c dfed =cA:|`,
			theSessionId: 1499
		},
		{
			abc: `X:1
T:The Bird In The Bush
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/629#setting629
N:Setting entered in thesession by user “Josh Kane” on 2002-04-03
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gmajor
|:d2eB dB~B2 dBAB GAAG|EGAd BG~G2 BGBd g2ge|
d2eB dB~B2 dBAB ~G2GE|DEGA B2eB dBAd BG~G2:|
|:Bdef g2fg afdf gfed|Bdef g~g2b agab g~g2a|
bg~g2 agef ~g2fe dBGE|DEGA B2eB dBAd BG~G2:|`,
			theSessionId: 629
		},
		{
			abc: `X:1
T:Swinging On The Gate
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/236#setting236
N:Setting entered in thesession by user “b.maloney” on 2001-08-13
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Gmajor
|:gedB G2AB cABG AGEG|DGBd g2fg eaag fdef|
gedB G2AB cABG AGEG|cABG AGEG DGGF GABd:|
|:~g3a bgaf gfed cBAG|EAAB cBAG (3EFG AB cdef|
~g3a bgaf gfed cBAB|cABG AGEG DGGF GABd:|`,
			theSessionId: 236
		},
		{
			abc: `X:1
T:The Road To Monalea
C:Colm O'Donnell
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/2878#setting2878
N:Setting entered in thesession by user “gian marco” on 2004-04-23
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Ddorian
|:dcAc d3e dcAG EDD2|cAGA cded cAGE EDD2|
dcAc d3e dcAG EGD2|EGAG cded cAGE EDD2:|
|:dcAc d2cd eaag egd2|gede c3d egag ged2|
dcAc d2cd eaag egd2|cG~G2 cded cAGE D4:|`,
			theSessionId: 2878
		},
		{
			abc: `X:1
T:Dinny O'Brien's
C:Paddy O'Brien
R:reel
L:1/16
M:4/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/1667#setting1667
N:Setting entered in thesession by user “Will Harmon” on 2003-05-17
N:*abc-tools: convert to M:4/4 & L:1/16*
K:Dmixolydian
g|:fd (3ddd d^cAB =c2dB cAGE|D2 (3FED ADFD EGAB cdeg|
fdd^c d=cAB =c2dB cAGE|D2 ~E3G AB cAGE {G} EDDg:|
fdd^c defg ad (3ddd dcAB|c2 ~c3d e=f gc (3ccc gceg|
fd (3ddd d^cAB =cBdB cAGE|D2 ~E3G AB cAGE {G} EDDg:|`,
			theSessionId: 1667
		},
		{
			abc: `X:1
T:King Of The Fairies
R:hornpipe
L:1/8
M:4/2
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/475#setting475
N:Setting entered in thesession by user “Jeremy” on 2002-01-01
N:*abc-tools: convert to M:4/2*
K:Edorian
|:B,2|EDEF GFGA B2B2 G2GA|B2E2 EFGE FGFE D2B,2|
EDEF GFGA BAGB d3c|B2E2 GFE_E =E6:|
|:d2|e2e2 Bdef gagf e3f|e2B2 BABc dedc BcdB|
e2B2 Bdef gagf efed|Bdeg fedf e6 ef|
g3e f3d edBc d3e|dBAF GABc dBAF GFED|
B,2E2 EFGA B2e2 edef|e2B2 BAGF E6:|`,
			theSessionId: 475
		},
		{
			abc: `X:1
T:The Rights Of Man
R:hornpipe
L:1/8
M:4/2
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/83#setting83
N:Setting entered in thesession by user “Jeremy” on 2001-05-25
N:*abc-tools: convert to M:4/2*
K:Eminor
|:GA|B2A2 G2F2 EFGA B2ef|gfed edBd cBAG A2GA|
BcAB GAFG EFGA B2ef|gfed Bgfg e2 E2 E2:|
|:ga|babg efga babg egfe|d^cde fefg afdf a2gf|
edef gfga bgaf gfef|gfed Bgfg e2 E2 E2:|`,
			theSessionId: 83
		},
		{
			abc: `X:1
T:Peacock Follow The Hen
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/1145#setting1145
N:Setting entered in thesession by user “cuchulain54” on 2002-11-19
K:Adorian
|:cde cAA cAA|cde cAA B2G|cde cAA cAA|Bcd dgd B2G:|
 cde gee gee|cde gee f2d|cde gee gee|Bcd dgd B2G:|`,
			theSessionId: 1145
		},
		{
			abc: `X:1
T:The Butterfly
C:Tommy Potts
R:slip jig
L:1/8
M:9/8
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/10#setting10
N:Setting entered in thesession by user “Jeremy” on 2001-05-18
K:Eminor
|:B2E G2E F3|B2E G2E FED|B2E G2E F3|B2d d2B AFD:|
 |:B2d e2f g3|B2d g2e dBA|B2d e2f g2a|b2a g2e dBA:|
 |:B3 B2A G2A|B3 BAB dBA|B3 B2A G2A|B2d g2e dBA:|`,
			theSessionId: 10
		},
		{
			abc: `X:1
T:Roly Gentle
C:Kathryn Tickell
R:waltz
L:1/8
M:3/4
N:Imported into *tuneTable* on 2026-02-17,
N:from https://thesession.org/tunes/4037#setting4037
N:Setting entered in thesession by user “dafydd” on 2003-08-28
N:(edited after importing)
K:Ddorian
|:D2 DE FA|f2 fe dc|A2 AG Ac|E2 ED EF|
 D2 DE Fd|^c2 cA GE|1 A2 dA GE:|2 D2 DA B^c||
 d2 de fd|ec A2 AG|F2 FEFA|EA FA EA|
 d2 de fd|ec A2 B2|c2 cA cd|ed cA GE|
 d2 de fd|ec A2 AG|F2 FE FA|EA FA EA|
 d2 de fa|gf ed ^cA|c2 cA cd|ed cA GE||`,
			theSessionId: 4037,
			badges: "crooked",
			parts: "AABB"
		},
		{
			groups: "su",
			incipit: `
X:1
T: Na Farraigí Dearga
T: The Seas They Ran Red with Blood 
T: Descriptive piece
R:Hornpipe
D: Decade(2019)
S:Fidil
F:https://raelachrecords.bandcamp.com/track/na-farraigi-dearga-the-seas-they-ran-red-with-blood-descriptive-piece
M:4/2
N: Mostly swung throughout – so in general “♪♪=♩♪”
N: It's a lovely tune; remarkable.
N: Waiting to hear from Raelach Records before publishing my full transcription.
L:1/8
K:Dm
A,DDE F2AG FD (3EDC B,CA,B, | G,2 (3G,B,D`,
			parts: "AABBCC"
		},
		{
			groups: "su",
			incipit: `X: 4
T: The Devil In The Kitchen
R: strathspey
M: 4/4
L: 1/8
K: Amix
f<a|:e>A A/A/A e>Ag>d|e>A A/A/A g2 f<a|`,
			theSessionId: 1746
		}
		/*
		,{incipit:``,theSessionId:}
		,{incipit:``,theSessionId:
			references: [
				{
					url: "",
					artists: "",
					notes: ``,
				},
				],}
		 */
	]
};
