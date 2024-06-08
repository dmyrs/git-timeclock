import { CheckFileExistsAsync, createDirectoryAsync } from "../../_lib/file-io.ts";
import * as uuid from "jsr:@std/uuid";

export class PROJECTFILE {
    private constructor(public projects: Array<Project>)
    {}

    public static async readFileAsync() : Promise<PROJECTFILE> {
        const file = await PROJECTFILE.initAsync();
        return file;
    }

    private static async initAsync(path: string = './.timeclock') : Promise<PROJECTFILE> {
        // check for existence
        let config: PROJECTFILE;

        if (await CheckFileExistsAsync(path+'/PROJECTFILE')) {
            const fileText = await Deno.readTextFile(path+'/PROJECTFILE');
            const split = fileText.split('\n');
            return new PROJECTFILE(split.map(x => x.split('|')[0]).map(x => new Project(x)));
        }
        else {
            config = new PROJECTFILE([]);
            await createDirectoryAsync(path);
            await config.writeFileAsync(path+'/PROJECTFILE');
        }
        return config;
    }

    private async writeFileAsync(path: string) : Promise<void> {
        let file: string = '';
        let i = 0;
        for (const project of this.projects) {
            file += `${project.name}|${await project.IdAsync()}`;
            i++;
            if (i < this.projects.length) {
                file += '/n';
            }
        }
        await Deno.writeTextFile(path, file);
    }

    public projectExists(projectName: string) : boolean {
        return !!(this.projects.find(x => x.name == projectName))
    }

    public async addProjectAsync(projcetName: string, path: string = './.timeclock') : Promise<void> {
        this.projects.push(new Project(projcetName))
        await this.writeFileAsync(path + '/PROJECTFILE');
    }

    public async getProjectIdAsync(projectName: string) : Promise<string> {
        return await this.projects.find(x => x.name == projectName)?.IdAsync() ?? '';
    }
}

export class Project {
    constructor(public name: string)
    {}

    public async IdAsync(): Promise<string> {
        return await this.generateProjectIdAsync(this.name);
    }

    private async generateProjectIdAsync(projectName: string) : Promise<string> {
        const data = new TextEncoder().encode(projectName);
        return await uuid.v5.generate('30c5ad0a-6a9d-477b-a388-87c835e4eda7', data);
    }
}