import { Configuration } from "./src/core/configuration.ts";
import { TimeClock } from "./src/app/timeclock.ts";

const config = Configuration.FromEnvironment();
const clock = new TimeClock(config);
await clock.main();
