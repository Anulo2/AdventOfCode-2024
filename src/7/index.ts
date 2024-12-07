type Line = [number, number[]];

function parseInput(input: string): Line[] {
	return input
		.trim()
		.split("\n")
		.map((line) => line.split(":"))
		.filter((parts) => parts.length === 2)
		.map(([res, numbers]) => [
			Number(res),
			numbers.trim().split(" ").map(Number),
		]);
}

function generateCombinations(operators: string[], length: number): string[][] {
	if (length === 1) return operators.map((op) => [op]);
	return generateCombinations(operators, length - 1).flatMap((comb) =>
		operators.map((op) => [...comb, op]),
	);
}

function evaluateExpression(numbers: number[], operators: string[]): number {
	return operators.reduce((result, operator, i) => {
		if (operator === "+") return result + numbers[i + 1];
		if (operator === "*") return result * numbers[i + 1];
		if (operator === "-") return result - numbers[i + 1];
		if (operator === "/") return result / numbers[i + 1];
		if (operator === "||")
			return Number(result.toString() + numbers[i + 1].toString());
		return result;
	}, numbers[0]);
}

function calculateTotal(lines: Line[], operators: string[]): number {
	return lines.reduce((total, [result, numbers]) => {
		const combinations = generateCombinations(operators, numbers.length - 1);
		return combinations.some(
			(comb) => evaluateExpression(numbers, comb) === result,
		)
			? total + result
			: total;
	}, 0);
}

export function part1(input: string): number {
	const lines = parseInput(input);
	const operators = ["+", "*"];
	return calculateTotal(lines, operators);
}

export function part2(input: string): number {
	const lines = parseInput(input);
	const operators = ["+", "*", "||"];
	return calculateTotal(lines, operators);
}
