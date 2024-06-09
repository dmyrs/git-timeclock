import { generateGuidAsync } from "../../_lib/guid.ts";
import { PUNCHFILE as punchFile } from "../files/punchfile.ts";

export class ShiftManager {
    public static async PunchAsync(projectId: string, rate: number, path: string = './.timeclock') {
        if (await punchFile.existsAsync()) {
            const PUNCHFILE = await punchFile.readFileAsync();
            await ShiftManager.CreateShiftAsync(projectId, PUNCHFILE);
            await PUNCHFILE.deleteAsync();
        }
        else {
            await punchFile.createAsync(projectId, await generateGuidAsync(), new Date(), rate);
        }
    }

    // todo - do the math on `shift-total`
    private static async CreateShiftAsync(projectId: string, punch: punchFile, path: string = './.timeclock'): Promise<void> {
        const file = `${punch.punchStart}|${new Date()}|${punch.shiftRate}|shift-total|${false}`;
        const shiftId = await generateGuidAsync();
        await Deno.writeTextFile(path+`/projects/${projectId}/shifts/${shiftId}`, file);
    }

    public static async CancelShiftAsync(): Promise<void> {
        if (await punchFile.existsAsync()) {
            await (await punchFile.readFileAsync()).deleteAsync()
        }
    }
}