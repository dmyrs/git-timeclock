import { checkFileExistsAsync } from "../../_lib/file-io.ts";

export class PUNCHFILE {
    private constructor(public projectId: string, public punchId: string, public punchStart: Date, public shiftRate: number) 
    {}

    public static async readFileAsync(path: string = './.timeclock') : Promise<PUNCHFILE> {
        const file = await Deno.readTextFile(path+'/PUNCHFILE');
        const split = file.split('|');
        return new PUNCHFILE(split[0], split[1], new Date(split[2]), Number.parseFloat(split[3]));
    }

    public static async createAsync(projectId: string, punchId: string, punchStart: Date, shiftRate: number, path: string = './.timeclock') : Promise<void> {
        const punchFile = new PUNCHFILE(projectId, punchId, punchStart, shiftRate);
        await punchFile.writeFileAsync(path);
    }

    public static async existsAsync(path: string = './.timeclock'): Promise<boolean> {
        return await checkFileExistsAsync(path+'/PUNCHFILE');
    }

    public async deleteAsync(path: string = './.timeclock'): Promise<void> {
        await Deno.remove(path+'/PUNCHFILE');
    }

    private async writeFileAsync(path: string = './.timeclock') {
        const file = `${this.projectId}|${this.punchId}|${this.punchStart}|${this.shiftRate}`;
        await Deno.writeTextFile(path+'/PUNCHFILE', file);
    }
}