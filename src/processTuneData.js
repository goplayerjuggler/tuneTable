import {
	getContour,
	getIncipit,
	getIncipitForContourGeneration,
	normaliseKey,
	getKey,
} from "@goplayerjuggler/abc-tools";

const applySwingTransform = ["hornpipe", "barndance", "fling", "mazurka"];

function parseAbc(abc) {
	const lines = abc.split("\n"),
		metadata = {},
		comments = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith("T:") && !metadata.title) {
			metadata.title = trimmed.substring(2).trim();
		} else if (trimmed.startsWith("R:")) {
			metadata.rhythm = trimmed.substring(2).trim().toLowerCase();
		} else if (trimmed.startsWith("M:")) {
			metadata.meter = trimmed.substring(2).trim();
		} else if (trimmed.startsWith("K:")) {
			metadata.key = normaliseKey(trimmed.substring(2).trim()).join(" ");
			break;
		} else if (trimmed.startsWith("S:")) {
			metadata.source = trimmed.substring(2).trim();
		} else if (trimmed.startsWith("F:")) {
			metadata.url = trimmed.substring(2).trim();
		} else if (trimmed.startsWith("D:")) {
			metadata.recording = trimmed.substring(2).trim();
		} else if (trimmed.startsWith("N:")) {
			comments.push(trimmed.substring(2).trim());
		}
	}
	if (comments.length > 0) {
		metadata.comments = comments;
	}

	return metadata;
}

function processTuneData(tune) {
	const processed = { ...tune };

	if (tune.abc) {
		const abcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];

		abcArray.forEach((abcString, index) => {
			const abcMeta = parseAbc(abcString);

			if (index === 0) {
				if (!processed.name && abcMeta.title) {
					processed.name = abcMeta.title;
					processed.nameIsFromAbc = true;
				}
				if (!processed.rhythm && abcMeta.rhythm) {
					processed.rhythm = abcMeta.rhythm;
					processed.rhythmIsFromAbc = true;
				}
				if (!processed.meter && abcMeta.meter) {
					processed.meter = abcMeta.meter;
					processed.meterIsFromAbc = true;
				}
				if (!processed.key && abcMeta.key) {
					processed.key = abcMeta.key;
					processed.keyIsFromAbc = true;
				}
			}

			if (!processed.references) {
				processed.references = [];
			}

			if (
				abcMeta.source ||
				abcMeta.url ||
				abcMeta.recording ||
				abcMeta.comments
			) {
				const abcRef = {
					artists: abcMeta.source || "",
					url: abcMeta.url || "",
					notes:
						(abcMeta.recording || "") +
						`${abcMeta.recording ? "\n" : ""}${
							abcMeta.comments ? abcMeta.comments.join("\n") : ""
						}`,
					fromAbc: true,
				};

				processed.references.push(abcRef);
			}
		});
		if (!tune.incipit) {
			try {
				processed.incipit = getIncipit({ abc: abcArray[0] });
			} catch (error) {
				console.log(error);
			}
		}
		if (!tune.contour) {
			try {
				const withSwingTransform =
					applySwingTransform.indexOf(processed.rhythm) >= 0;
				let shortAbc;
				if (processed.incipit)
					shortAbc = getIncipitForContourGeneration(processed.incipit);
				if (!shortAbc && abcArray && abcArray[0])
					shortAbc = getIncipitForContourGeneration(abcArray[0]);

				if (shortAbc) {
					processed.contour = getContour(shortAbc, {
						withSvg: true,
						withSwingTransform,
					});
				}
				// tune.contour = getContourFromFullAbc(tune.abc || tune.incipit, {
				// 	withSwingTransform,
				// });
				// );
			} catch (error) {
				console.log(error);
			}
		}
		processed.rhythm = processed.rhythm?.toLowerCase();
	} else if (tune.incipit && !processed.key) {
		processed.key = normaliseKey(getKey(tune.incipit)).join(" ");
	}
	if (!processed.name) processed.name = "Untitled";
	if (!processed.key) processed.key = "";
	if (!processed.rhythm) processed.rhythm = "";
	else processed.rhythm = processed.rhythm.toLowerCase();
	if (!processed.references) processed.references = [];
	if (!processed.scores) processed.scores = [];
	return processed;
}

export { processTuneData, applySwingTransform };
