import json

lists = ["-long", "-medium", "-short", ""]

for list in lists:

	data = []

	with open("source/google-10000-english-usa-no-swears"+list+".txt", "r") as source:
		for line in source:
			stripped_line = line.strip()
			data.append(stripped_line)

	with open("google"+list+".json", 'w') as dest:
		dest.write(json.dumps(data))