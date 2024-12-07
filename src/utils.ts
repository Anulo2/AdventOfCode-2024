import type { DayScript } from "./type";
import { readdir } from "node:fs/promises";

export async function processDay(day: number): Promise<void> {
	const dayScript = require(`./${day}/index.ts`) as DayScript;

	const inputRes = await Bun.file(`./src/${day}/input.txt`).text();
	const inputTest1 = await Bun.file(`./src/${day}/test1.txt`).text();
	const inputTest2 = await Bun.file(`./src/${day}/test2.txt`).text();

	// Helper to handle sync and async results with proper typing
	const handleResult = async (
		fn: (input: string) => number | string | Promise<number | string>,
		input: string,
	): Promise<number | string> => {
		const result = fn(input);
		return result instanceof Promise ? await result : result;
	};

	// Process part1 and part2 results
	const part1TestResult = await handleResult(dayScript.part1, inputTest1);
	console.log(`Day ${day} - Part 1 Test: ${part1TestResult}`);
	const part1Result = await handleResult(dayScript.part1, inputRes);
	console.log(`Day ${day} - Part 1 Res: ${part1Result}`);
	const part2TestResult = await handleResult(dayScript.part2, inputTest2);
	console.log(`Day ${day} - Part 2 Test: ${part2TestResult}`);
	const part2Result = await handleResult(dayScript.part2, inputRes);
	console.log(`Day ${day} - Part 2 Res: ${part2Result}`);
}

export async function getAvailableDays(): Promise<number[]> {
	const directories = (await readdir(import.meta.dir)).filter(
		(f) => !f.endsWith(".ts"),
	);
	return directories.map(Number).sort((a, b) => a - b);
}
