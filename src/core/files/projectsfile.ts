export class PROJECTFILE {
    private constructor(public projects: Array<Project>)
    {}

    public static async readFileAsync() : Promise<PROJECTFILE> {
        await PROJECTFILE.initAsync();
        return new PROJECTFILE([]);
    }

    private static async initAsync() : Promise<void> {

    }

    private async writeFileAsync() : Promise<void> {

    }

    public projectExists(projectName: string) : boolean {
        return true;
    }

    public async addProjectAsync(projcetName: string) : Promise<void> {
        this.projects.push(new Project(projcetName))
        await this.writeFileAsync();
    }

    public getProjectId(projectName: string) : string {
        return "";
    }
}

export class Project {
    constructor(public name: string)
    {}

    public get id(): string {
        return this.generateProjectId(this.name);
    }

    private generateProjectId(projectName: string) : string {
        return "";
    }
}