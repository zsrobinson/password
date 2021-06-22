function $(id) {
	return document.getElementById(id);
}

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
	$("generate-text-password").classList.add(pass.strengthColor);
	$("generate-text-password-strength").innerHTML = pass.strengthText;
	$("generate-text-password-strength").classList.add(pass.strengthColor);
});

$("strength-button-check").addEventListener("click", function () {
	pass = scoreToStr(zxcvbn($("strength-text-password").value));

	removeColor("strength-text-password");
	removeColor("strength-text-password-strength");

	$("strength-text-password").value = pass.password;
	$("strength-text-password").classList.add(pass.strengthColor);
	$("strength-text-password-strength").innerHTML = pass.strengthText;
	$("strength-text-password-strength").classList.add(pass.strengthColor);


});

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

function scoreToStr(zxcvbn) {
	let text, color;
	switch (zxcvbn.score) {
		case 0:
			zxcvbn.strengthText = "Way Too Guessable";
			zxcvbn.strengthColor = "is-danger";
			break;
		case 1:
			zxcvbn.strengthText = "Very Guessable";
			zxcvbn.strengthColor = "is-danger";
			break;
		case 2:
			zxcvbn.strengthText = "Somewhat Guessable";
			zxcvbn.strengthColor = "is-danger";
			break;
		case 3:
			zxcvbn.strengthText = "Pretty Safe";
			zxcvbn.strengthColor = "is-success";
			break;
		case 4:
			zxcvbn.strengthText = "Very Safe";
			zxcvbn.strengthColor = "is-success";
			break;
	}
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
