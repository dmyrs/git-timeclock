import { Configuration } from "./configuration.ts";
import { parseArgs } from "../_lib/cli-parser.ts"
import { PROJECTFILE as projectFile } from "./files/projectfile.ts";
import { ShiftManager } from "./shift-manager.ts";
import { InvoiceManager } from "./invoice-manager.ts";

export class TimeClock {
    constructor(private readonly _config: Configuration) 
    {}

    public async main() {
        const args = parseArgs(Deno.args);
        const command = args._[0];

        const PROJECTFILE = await projectFile.readFileAsync();
        if (args.p && !PROJECTFILE.projectExists(args.p)) {
            await PROJECTFILE.addProjectAsync(args.p);
        }
        const projectId = args.p ? PROJECTFILE.getProjectId(args.p) : null;

        switch(command) {
            case "punch":
            {
                if (projectId) {
                    await ShiftManager.PunchAsync(projectId, this._config.rate);
                    return;
                }
                else {
                    throw "project name must be provided"
                }
            }
            case "invoice":
            {
                const verb = args._[1];
                switch(verb) {
                    case "create":
                        if (projectId) {
                            await InvoiceManager.CreateAsync(projectId);
                        }
                        else {
                            throw "project name must be provided"
                        }
                        return;
                    case "paid":
                        if (projectId) {
                            await InvoiceManager.PaidAsync(projectId, args.n);
                        }
                        else {
                            throw "project name must be provided"
                        }
                        return;
                    case "status":
                        await InvoiceManager.StatusAsync(projectId);
                        return;
                    default:
                        throw "invalid verb for invoice command"
                }
            }
            default:
                throw "invalid command"
        }
    }
}