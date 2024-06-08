export class PUNCHFILE {
    private constructor(public projectId: string, public punchId: string, public punchStart: Date, public shiftRate: number) 
    {}

    public static async readFileAsync() : Promise<PUNCHFILE | null> {
        return null;
    }

    public static async createAsync(projectId: string, punchId: string, punchStart: Date, shiftRate: number) : Promise<void> {
        
    }

    public async deleteAsync(): Promise<void> {

    }
}