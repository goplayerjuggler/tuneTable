export default {
	pipes: { qId: 543833, en: "uilleann pipes", fr: "cornemuse irlandaise" },
	fiddle: { qId: 132533685, en: "fiddle", fr: "violon" }
	// guitar: { qId: 1063, en: "guitar", fr: "guitare" },
	// bouzouki: { qId: 1393, en: "bouzouki", fr: "bouzouki" },
	// bodhran: { qId: 207444, en: "bodhrán", fr: "bodhrán" },
	// button_accordion: {
	// 	qId: 81982,
	// 	en: "button accordion",
	// 	fr: "accordéon diatonique"
	// }
};

/*
all the entries in wikidata that are instances of the class www.wikidata.org/wiki/Q1254773 (families of musical instruments)

SELECT ?item ?itemLabel
WHERE {
  ?item wdt:P31 wd:Q1254773 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
?item wdt:P31 wd:Q1254773 — finds all items (?item) where the property "instance of" (P31) points to Q1254773
SERVICE wikibase:label — retrieves readable labels for each item in English


Q1798603 string instruments
*/
