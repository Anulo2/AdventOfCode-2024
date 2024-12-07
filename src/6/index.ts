import {
	findStartingPos,
	traverseMap,
	nextStep,
	rotateDirection,
	directionsMap,
} from "./utils";

export async function part1(input: string): Promise<number> {
	const map = input
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	const [startX, startY, startDir] = findStartingPos(
		map,
		Object.keys(directionsMap),
	);

	const worker = new Worker(new URL("./worker.ts", import.meta.url).href);

	const res: number = await new Promise((resolve) => {
		worker.onmessage = (event) => {
			resolve(event.data.steps); // Resolve the promise with the worker's result
		};

		worker.postMessage({ map, startX, startY, startDir, x: 0, y: 0 });
	});

	return res;
}

export async function part2(input: string): Promise<number> {
	// Prepare the map and find starting position
	const map = input
		.trim()
		.split("\n")
		.map((line) => line.split(""));

	const [startX, startY, startDir] = findStartingPos(
		map,
		Object.keys(directionsMap),
	);

	let jobs: {
		data: Promise<{ steps: number; id: { x: number; y: number } }>;
		id: { x: number; y: number };
	}[] = [];
	const maxJobs = 8;
	let loopCount = 0;

	// Create a pool of workers
	const workerPool: Worker[] = [];
	for (let i = 0; i < maxJobs; i++) {
		workerPool.push(new Worker(new URL("./worker.ts", import.meta.url).href));
	}

	// Function to get an available worker from the pool
	const getWorker = (): Worker => {
		const worker = workerPool.pop();
		if (!worker) {
			throw new Error("No available workers in the pool");
		}
		return worker;
	};

	// Function to return a worker to the pool
	const returnWorker = (worker: Worker) => {
		workerPool.push(worker);
	};

	// Add tasks to the queue for every open space on the map
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] === "." && !(x === startX && y === startY)) {
				// Create a new map copy and mark the current location as blocked
				const testMap = map.map((row) => row.slice());
				testMap[y][x] = "#";

				// Get a worker from the pool
				const worker = getWorker();
				const res: {
					data: Promise<{ steps: number; id: { x: number; y: number } }>;
					id: { x: number; y: number };
				} = {
					data: new Promise((resolve) => {
						worker.onmessage = (event) => {
							resolve(event.data); // Resolve the promise with the worker's result
							returnWorker(worker); // Return the worker to the pool
						};

						worker.postMessage({
							map: testMap,
							startX,
							startY,
							startDir,
							x,
							y,
						});
					}),
					id: { x, y },
				};

				jobs.push(res);

				if (jobs.length >= maxJobs) {
					// Limit the number of concurrent jobs
					try {
						const result = await Promise.any(jobs.map((job) => job.data));

						if (result.steps === -1) {
							loopCount++;
						}

						// remove the completed job
						jobs = jobs.filter((job) => {
							// deep compare
							return JSON.stringify(job.id) !== JSON.stringify(result.id);
						});
					} catch (error) {
						console.error("No job completed successfully", error);
					}
				}
			}
		}
	}

	// Wait for all remaining jobs to complete
	const results = await Promise.all(jobs.map((job) => job.data));

	// Check for any remaining loops
	loopCount += results.filter((result) => result.steps === -1).length;

	return loopCount;
}
