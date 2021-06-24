/*  =====================
	  TABLE OF CONTENTS
	=====================

	1. SETUP
	2. FUNCTIONS
	3. EVENT HANDLERS  */

/*  ================
	  1. SETUP
	================  */

wordLists = {};
getWordLists();

async function getWordLists() {
	let output = {};
	const links = ["wordLists/englishWikipedia.txt", "wordLists/usTvAndFilm.txt", "wordLists/wordsAlpha.txt"];
	for (let link of links) {
		const response = await fetch(link);
		const text = await response.text();
		const array = text.split("\r\n");
		wordLists[link.substring(10, link.length - 4)] = array;
	}
}

// imitation of jquery without actually having jquery
function $(id) {
	return document.getElementById(id);
}

/* String.prototype.replaceAt = function (index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}; */

/*  ================
	  2. FUNCTIONS
	================  */

function generatePassword() {
	// get password options
	let options = {
		length: $("generate-text-length").value,
		upper: $("generate-check-upper").checked,
		lower: $("generate-check-lower").checked,
		numbers: $("generate-check-numbers").checked,
		symbols: $("generate-check-symbols").checked,
		similar: $("generate-check-similar").checked,
		extraSymbols: $("generate-check-extraSymbols").checked,
	};

	// make character set
	let characterSet = [];
	if (options.upper) {
		characterSet = characterSet.concat(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"));
	}
	if (options.lower) {
		characterSet = characterSet.concat(Array.from("abcdefghijklmnopqrstuvwxyz"));
	}
	if (options.numbers) {
		characterSet = characterSet.concat(Array.from("0123456789"));
	}
	if (options.extraSymbols) {
		characterSet = characterSet.concat(Array.from("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"));
	} else if (options.symbols) {
		characterSet = characterSet.concat(Array.from("!@#$%^&*-_=+?"));
	}
	if (options.similar) {
		let similarCharacters = Array.from("iIl1oO0");
		characterSet = characterSet.filter(function (element) {
			return similarCharacters.indexOf(element) < 0;
		});
	}

	if (characterSet.length == 0) {
		return { password: "", strengthText: "Please select at least one character type." };
	}

	// generate the password
	let password = "";
	for (let i = 0; i < options.length; i++) {
		password += characterSet[Math.floor(Math.random() * characterSet.length)];
	}

	return scoreToStr(zxcvbn(password));
}

function generatePassphrase() {
	const l33tList = {
		a: ["4", "@"],
		c: ["(", "{", "[", "<"],
		e: ["3"],
		g: ["9"],
		i: ["1", "|"],
		l: ["1", "|"],
		o: ["0"],
		s: ["$", "5"],
		t: ["+"],
	};
	const options = {
		length: $("generatephrase-text-length").value,
		lists: {
			wordsAlpha: $("generatephrase-check-wordsAlpha").checked,
			usTvAndFilm: $("generatephrase-check-usTvAndFilm").checked,
			englishWikipedia: $("generatephrase-check-englishWikipedia").checked,
		},
		common: $("generatephrase-check-common").checked,
		capitalize: $("generatephrase-check-capitalize").checked,
		l33t: $("generatephrase-check-l33t").checked,
	};

	let words = [];
	for (let list in options.lists) {
		if (options.lists[list]) {
			if (options.common) {
				words = words.concat(wordLists[list].slice(0,5000))
			} else {
				words = words.concat(wordLists[list])
			}
		}
	}
	if (words.length == 0) {
		return { password: "", strengthText: "Please select at least one word list." };
	}

	let passwordWords = [];
	for (let i = 0; i < options.length; i++) {
		passwordWords.push(words[Math.floor(Math.random() * words.length)]);
	}
	let password = passwordWords.join("-");

	if (options.l33t) {
		for (let i = 0; i < Math.floor(password.length / 4); i++) {
			try {
				const char = Math.floor(Math.random() * password.length);
				const replace = l33tList[password[char]][Math.floor(Math.random() * l33tList[password[char]].length)];
				password = password.substr(0, char) + replace + password.substr(char + replace.length);
			} catch {}
		}
	}

	if (options.capitalize) {
		for (let i = 0; i < Math.floor(password.length / 4); i++) {
			const char = Math.floor(Math.random() * password.length);
			const replace = password[char].toUpperCase();
			password = password.substr(0, char) + replace + password.substr(char + replace.length);
		}
	}

	return scoreToStr(zxcvbn(password));
}

function scoreToStr(zxcvbn) {
	let text, color;
	switch (zxcvbn.score) {
		case 0:
			zxcvbn.strengthText = "Way Too Guessable";
			zxcvbn.strengthRawColor = "danger";
			break;
		case 1:
			zxcvbn.strengthText = "Very Guessable";
			zxcvbn.strengthRawColor = "danger";
			break;
		case 2:
			zxcvbn.strengthText = "Somewhat Guessable";
			zxcvbn.strengthRawColor = "danger";
			break;
		case 3:
			zxcvbn.strengthText = "Pretty Safe";
			zxcvbn.strengthRawColor = "success";
			break;
		case 4:
			zxcvbn.strengthText = "Very Safe";
			zxcvbn.strengthRawColor = "success";
			break;
	}
	zxcvbn.strengthIsColor = "is-" + zxcvbn.strengthRawColor;
	return zxcvbn;
}

function removeColor(id) {
	colorList = ["is-primary", "is-link", "is-info", "is-success", "is-warning", "is-danger"];
	for (let i = 0; i < $(id).classList.length; i++) {
		if (colorList.includes($(id).classList[i])) {
			$(id).classList.remove($(id).classList[i]);
		}
	}
}

function makeContent(zxcvbn) {
	let output = "";

	output += "<table>";
	output += "<thead><tr><td><strong>Scenario</strong></td><td><strong>Crack Time</strong></td></thead>";
	output += `<tr><td>Online Attack, Throttled</td><td>${zxcvbn.crack_times_display.online_throttling_100_per_hour}</td></tr>`;
	output += `<tr><td>Online Attack, Unthrottled</td><td>${zxcvbn.crack_times_display.online_no_throttling_10_per_second}</td></tr>`;
	output += `<tr><td>Offline Attack, Slow Hash</td><td>${zxcvbn.crack_times_display.offline_slow_hashing_1e4_per_second}</td></tr>`;
	output += `<tr><td>Offline Attack, Fast Hash</td><td>${zxcvbn.crack_times_display.offline_fast_hashing_1e10_per_second}</td></tr>`;
	output += "</table>";

	if (zxcvbn.feedback.warning != "") {
		output += `<p><strong>Warning:</strong> ${zxcvbn.feedback.warning}.</p>`;
	}

	if (zxcvbn.feedback.suggestions.length > 0) {
		output += `<p><strong>Suggestions:</strong></p><ul>`;
		for (const element of zxcvbn.feedback.suggestions) {
			output += `<li>${element}</li>`;
		}
		output += "</ul>";
	}

	$("strength-text-content").innerHTML = output;
	return output;
}

/*  ================
	  3. EVENT HANDLERS
	================  */

$("generate-button-copy").addEventListener("click", function () {
	let selector = $("generate-text-password");
	selector.focus();
	selector.select();
	selector.setSelectionRange(0, 99999); // for mobile
	document.execCommand("copy");
});

$("generate-button-regenerate").addEventListener("click", function () {
	pass = generatePassword();

	removeColor("generate-text-password");
	removeColor("generate-text-password-strength");

	$("generate-text-password").value = pass.password;
	$("generate-text-password").classList.add(pass.strengthIsColor);
	$("generate-text-password-strength").innerHTML = pass.strengthText;
	$("generate-text-password-strength").classList.add(pass.strengthIsColor);
});

$("generatephrase-button-copy").addEventListener("click", function () {
	let selector = $("generatephrase-text-password");
	selector.focus();
	selector.select();
	selector.setSelectionRange(0, 99999); // for mobile
	document.execCommand("copy");
});

$("generatephrase-button-regenerate").addEventListener("click", function () {
	try {
		let pass = generatePassphrase();
	}
	catch (e) {
		console.log("Error", e.stack);
		console.log("Error", e.name);
		console.log("Error", e.message);
	}
	

	removeColor("generatephrase-text-password");
	removeColor("generatephrase-text-password-strength");

	$("generatephrase-text-password").value = pass.password;
	$("generatephrase-text-password").classList.add(pass.strengthIsColor);
	$("generatephrase-text-password-strength").innerHTML = pass.strengthText;
	$("generatephrase-text-password-strength").classList.add(pass.strengthIsColor);
});

$("strength-button-check").addEventListener("click", function () {
	let pass = scoreToStr(zxcvbn($("strength-text-password").value));

	removeColor("strength-text-password");
	removeColor("strength-text-password-strength");

	$("strength-text-password").value = pass.password;
	$("strength-text-password").classList.add(pass.strengthIsColor);
	$("strength-text-password-strength").innerHTML = pass.strengthText;
	$("strength-text-password-strength").classList.add(pass.strengthIsColor);

	if ($("strength-check-advanced").checked) {
		$("strength-text-content").innerHTML = makeContent(pass);
	}
});

$("generatephrase-check-common").addEventListener("change", function () {
	if ($("generatephrase-check-common").checked) {
		$("generatephrase-check-wordsAlpha").checked = false;
		$("generatephrase-check-wordsAlpha").disabled = true;
		if (!($("generatephrase-check-usTvAndFilm").checked || $("generatephrase-check-englishWikipedia").checked)) {
			$("generatephrase-check-usTvAndFilm").checked = true;
		}
	} else {
		$("generatephrase-check-wordsAlpha").disabled = false;
	}
})