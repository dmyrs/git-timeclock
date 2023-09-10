import { Punch } from "../domain/Punch/Punch.ts";
import { PunchType } from "../domain/Punch/PunchType.ts";
import { executeShellCommandAsync } from "../infra/IO/Shell.ts";
import { PunchHandler } from "./Punch/PunchHandler.ts";

export class TimeClock {
    private _punchHandler = new PunchHandler();

    private async validateCleanWorkingTreeAsync() {
        const statusOutput = (await executeShellCommandAsync("git", ["status"])).verifyZeroReturnCode();
        if (!statusOutput.stdout.includes("nothing to commit, working tree clean")) {
            throw "punches must occur on a clean working tree";
        }
    }
    
    public async main() {
        const user: string = Deno.args[0];
        const isEndPunch: boolean = Deno.args.some(x => x === "--end");
        const punchType: PunchType = isEndPunch ? PunchType.End : PunchType.Sart;
    
        const punch = new Punch(punchType, user);
        
        await validateCleanWorkingTreeAsync();
        await _punchHandler.createPunchAsync(punch);
    }
}
