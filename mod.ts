import { Configuration } from "./src/configuration.ts";
import { TimeClock } from "./src/timeclock.ts";

const config = Configuration.FromEnvironment();
const clock = new TimeClock(config);
await clock.main();
