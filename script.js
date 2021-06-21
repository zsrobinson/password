function $(id) {
	return document.getElementById(id);
}

$("button-copy").addEventListener("click", function() {
	let selector = $("text-password")
	selector.focus();
	selector.select();
	selector.setSelectionRange(0, 99999); // for mobile
	document.execCommand("copy");
})

$("button-regenerate").addEventListener("click", function () {
	password = generatePassword();

	let strengthText, strengthColor;
	switch (password.score) {
		case 0:
			strengthText = "Way Too Guessable";
			strengthColor = "is-danger";
			break;
		case 1:
			strengthText = "Very Guessable";
			strengthColor = "is-danger";
			break;
		case 2:
			strengthText = "Somewhat Guessable";
			strengthColor = "is-danger";
			break;
		case 3:
			strengthText = "Pretty Safe";
			strengthColor = "is-success";
			break;
		case 4:
			strengthText = "Very Safe";
			strengthColor = "is-success";
			break;
	}

	for (let i = 0; i < $("text-password-strength").classList.length; i++) {
		if ($("text-password-strength").classList[i].startsWith("is-")) {
			$("text-password-strength").classList.remove($("text-password-strength").classList[i])
		}
	}

	for (let i = 0; i < $("text-password").classList.length; i++) {
		if ($("text-password").classList[i].startsWith("is-")) {
			$("text-password").classList.remove($("text-password").classList[i])
		}
	}

	$("text-password").value = password.password;
	$("text-password-strength").innerHTML = strengthText;
	$("text-password-strength").classList.add(strengthColor);
	$("text-password").classList.add(strengthColor);
});

function generatePassword() {
	// get password options
	let options = {
		length: $("text-length").value,
		upper: $("check-upper").checked,
		lower: $("check-lower").checked,
		numbers: $("check-numbers").checked,
		symbols: $("check-symbols").checked,
		similar: $("check-similar").checked,
		extraSymbols: $("check-extraSymbols").checked,
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

	// generate the password
	let password = "";
	for (let i = 0; i < options.length; i++) {
		password += characterSet[Math.floor(Math.random() * characterSet.length)];
	}

	return zxcvbn(password);
}
