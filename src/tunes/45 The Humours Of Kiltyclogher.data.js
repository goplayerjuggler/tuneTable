export default {
	groups: "su",
	tags: "ambiguous tonic",
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
		},
		{
			notes: `I tagged this as “ambiguous tonic”, as it’s not completely clear what to take as the tonic. Using the key signature and dots given here, it can be taken as A dorian, or else D mixolydian. At the moment I’m going with the first option. This is a non-trivial question that changes how the sorting algorithm here works on this tune.`
		}
	],
	theSessionId: 1043
};
