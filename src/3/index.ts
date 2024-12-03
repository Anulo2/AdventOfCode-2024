export function part1(input: string): number {
	return (
		input
			.trim()
			.match(/mul\(\d+,\d+\)/gm)
			?.reverse()
			?.map((match) => match.slice(4, -1).split(",").map(Number))
			?.reduce((acc, [a, b]) => {
				return acc + a * b;
			}, 0) || 0
	);
}

export function part2(input: string): number {
	let enabled = true;
	return (
		input
			.trim()
			.match(/(do\(\)|don't\(\)|mul\(\d+,\d+\))/gm)
			?.filter((match) => {
				if (match === "do()") {
					enabled = true;
					return false;
				}
				if (match === "don't()") {
					enabled = false;
					return false;
				}
				if (enabled) {
					return true;
				}
				return false;
			})
			?.reverse()
			?.map((match) => match.slice(4, -1).split(",").map(Number))
			?.reduce((acc, [a, b]) => {
				return acc + a * b;
			}, 0) || 0
	);
}
