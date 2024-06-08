import { Configuration } from "./src/core/configuration.ts";
import { TimeClock } from "./src/core/timeclock.ts";

const config = Configuration.FromEnvironment();
const clock = new TimeClock(config);
await clock.main();
