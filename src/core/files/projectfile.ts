import { exists } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { checkFileExistsAsync, createDirectoryAsync } from "../../_lib/file-io.ts";
import { generateSeededGuidAsync } from "../../_lib/guid.ts";

export class PROJECTFILE {
    private constructor(public projects: Array<Project>)
    {}

    public static async readFileAsync() : Promise<PROJECTFILE> {
        const file = await PROJECTFILE.initAsync();
        return file;
    }

    private static async initAsync(path: string = './.timeclock') : Promise<PROJECTFILE> {
        let config: PROJECTFILE;

        if (await checkFileExistsAsync(path+'/PROJECTFILE')) {
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
            file += `${project.name}|${await project.getIdAsync()}`;
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

        const projectsDir = path+'/projects';
        if (!await exists(projectsDir)) {
            await createDirectoryAsync(projectsDir);
        }
        for (const project of this.projects) {
            const projectid = await project.getIdAsync();
            const projPath = path+`/projects/${projectid}`;
            if (!await exists(projPath)) {
                await createDirectoryAsync(projPath);
                await createDirectoryAsync(projPath+'/shifts');
                await createDirectoryAsync(projPath+'/invoices');
            }
        }
    }

    public async getProjectIdAsync(projectName: string) : Promise<string> {
        return await this.projects.find(x => x.name == projectName)?.getIdAsync() ?? '';
    }
}

export class Project {
    constructor(public name: string)
    {}

    public async getIdAsync(): Promise<string> {
        return await this.generateProjectIdAsync(this.name);
    }

    private async generateProjectIdAsync(projectName: string) : Promise<string> {
        return await generateSeededGuidAsync(projectName);
    }
}