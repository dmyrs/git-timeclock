import { Punch } from "../domain/Punch/Punch.ts";
import { PunchType } from "../domain/Punch/PunchType.ts";
import { executeShellCommandAsync } from "../infra/IO/Shell.ts";
import { PunchHandler } from "./Punch/PunchHandler.ts";

async function validateCleanWorkingTreeAsync() {
    const statusOutput = (await executeShellCommandAsync("git", ["status"])).verifyZeroReturnCode();
    if (!statusOutput.stdout.includes("nothing to commit, working tree clean")) {
        throw "punches must occur on a clean working tree";
    }
}
const _punchHandler = new PunchHandler();
async function main() {
    const user: string = Deno.args[0];
    const isEndPunch: boolean = Deno.args.some(x => x === "--end");
    const punchType: PunchType = isEndPunch ? PunchType.End : PunchType.Sart;

    const punch = new Punch(punchType, user);
    
    await validateCleanWorkingTreeAsync();
    await _punchHandler.createPunchAsync(punch);
}

await main();
