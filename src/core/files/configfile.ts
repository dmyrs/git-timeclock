import { CheckFileExistsAsync, createDirectoryAsync } from "../../_lib/file-io.ts";

export class CONFIGFILE {

    constructor(public name: string, public rate: number, public company: string) {
    }

    public static async readFileAsync(path: string = './.timeclock') : Promise<CONFIGFILE> {
        const config = await CONFIGFILE.initAsync(path); // force init when reading configfile
        return config;
    }

    private static async initAsync(path: string = './.timeclock') : Promise<CONFIGFILE> {
        // check for existence
        let config: CONFIGFILE;

        if (await CheckFileExistsAsync(path+'/CONFIGFILE')) {
            const fileText = await Deno.readTextFile(path+'/CONFIGFILE');
            const split = fileText.split('|');
            return new CONFIGFILE(split[0].split(':')[1], Number.parseFloat(split[1].split(':')[1]), split[2].split(':')[1])
        }
        else {
            const name = prompt('Name: ') ?? '';
            const companyName = prompt('Company Name: ') ?? '';
            const rate = prompt('Rate: ') ?? '';
            config = new CONFIGFILE(name, Number.parseFloat(rate), companyName);
            await createDirectoryAsync(path);
            await config.writeFileAsync(path+'/CONFIGFILE');
        }
        return config;
    }

    private async writeFileAsync(path: string) : Promise<void> {
        await Deno.writeTextFile(path, `NAME:${this.name}|COMPANY:${this.company}|RATE:${this.rate}`);
    }
}