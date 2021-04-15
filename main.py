import random

chars = {
	"low": list("abcdefghijklmnopqrstuvwxyz"),
	"upp": list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
	"num": list("0123456789"),
	"sym": list("!@#$%^&*")
}

trueInputs = ["t","true","y"]

while True:

	print("Define Parameters")

	reqs = {
		"low": input("  Lowercase (t/f): ").lower() in trueInputs,
		"upp": input("  Uppercase (t/f): ").lower() in trueInputs,
		"num": input("  Numbers   (t/f): ").lower() in trueInputs,
		"sym": input("  Symbols   (t/f): ").lower() in trueInputs,
		"len": int( input("  Length (number): "))
	}

	selectedChars = []

	for charTypes in chars:
		if reqs[charTypes]:
			selectedChars += chars[charTypes]

	output = ""

	for singleChar in range(reqs["len"]):
		output += random.choice(selectedChars)

	print("Your Password")
	print("  " + output + "\n")