import { readdir } from "node:fs/promises";
import { processDay } from "./utils";

const directories = (await readdir(import.meta.dir)).filter(
	(f) => !f.endsWith(".ts"),
);

const days = directories.length;

for (let i = 1; i <= days; i++) {
	await processDay(i);
	if (i < days) {
		console.log("############################");
	}
}
