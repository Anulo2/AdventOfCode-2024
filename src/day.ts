import { processDay } from "./utils";

// get number of days since 1st dicember
const day = new Date().getDate();
await processDay(day);
