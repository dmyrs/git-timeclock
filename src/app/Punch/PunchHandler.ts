import { IPunchHandler } from "../../domain/Punch/IPunchHandler.ts";
import { Punch } from "../../domain/Punch/Punch.ts";
import { PunchType } from "../../domain/Punch/PunchType.ts";
import { executeShellCommandAsync } from "../../infra/IO/Shell.ts";
import * as FileManager from "../../infra/IO/Files.ts";
import { Shift } from "../../domain/Shift/Shift.ts";
import { ShiftHandler } from "../Shift/ShiftHandler.ts";

export class PunchHandler implements IPunchHandler {
    async createPunchAsync(punch: Punch): Promise<void> {
        if (punch.type === PunchType.Sart) {
            await this.createStartPunchAsync(punch);
        } else {
            await this.createEndPunchAsync(punch);
        }
        await this.commitPunchAsync(punch);
    }

    private async commitPunchAsync(punch: Punch) {
        const msg = punch.type == PunchType.Sart ? "START" : "END";
        (await executeShellCommandAsync("git", ["commit", "-m", `\"TIMECLOCK PUNCH ${msg} - ${punch.user}\"`])).verifyZeroReturnCode();
    }
    
    private async createStartPunchAsync(punch: Punch) {
        await FileManager.createDirectoryAsync(punch.punchDir);
        await Deno.writeTextFile(punch.punchFilePath, Date.now().toString());
        (await executeShellCommandAsync("git", ["add", punch.punchFilePath])).verifyZeroReturnCode();
    }
    
    private async createEndPunchAsync(punch: Punch) {
        const nowUtcMs = Date.now().toString();
        const punchStartUtcMs = await Deno.readTextFile(punch.punchFilePath);
        const shift: Shift = Shift.createFromPunchTimes(punch.user, punchStartUtcMs, nowUtcMs, new Date());

        await Deno.remove(punch.punchFilePath);
        (await executeShellCommandAsync("git", ["add", punch.punchFilePath])).verifyZeroReturnCode();

        await new ShiftHandler().createShiftAsync(shift);
    }
}