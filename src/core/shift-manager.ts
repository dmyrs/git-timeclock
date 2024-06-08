import { PUNCHFILE as punchFile } from "./files/punchfile.ts";

export class ShiftManager {
    public static async PunchAsync(projectId: string, rate: number) {
        const PUNCHFILE = await punchFile.readFileAsync();
        if (PUNCHFILE) {
            // create the shift
            await PUNCHFILE.deleteAsync();
        }
        else {
            const punchId = ""; // generate a GUID
            await punchFile.createAsync(projectId, punchId, new Date(), rate);
        }
    }
}