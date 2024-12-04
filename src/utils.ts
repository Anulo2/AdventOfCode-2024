import type { DayScript } from "./type";
import { readdir } from "node:fs/promises";

export async function processDay(day: number): Promise<void> {
	const dayScript = require(`./${day}/index.ts`) as DayScript;

	const inputRes = await Bun.file(`./src/${day}/input.txt`).text();
	const inputTest1 = await Bun.file(`./src/${day}/test1.txt`).text();
	const inputTest2 = await Bun.file(`./src/${day}/test2.txt`).text();

	console.log(`Day ${day} - Part 1 Test: ${dayScript.part1(inputTest1)}`);
	console.log(`Day ${day} - Part 1 Res: ${dayScript.part1(inputRes)}`);
	console.log(`Day ${day} - Part 2 Test: ${dayScript.part2(inputTest2)}`);
	console.log(`Day ${day} - Part 2 Res: ${dayScript.part2(inputRes)}`);
}

export async function getAvailableDays(): Promise<number[]> {
	const directories = (await readdir(import.meta.dir)).filter(
		(f) => !f.endsWith(".ts"),
	);
	return directories.map(Number).sort((a, b) => a - b);
}
