import { parseArgs } from "./_lib/cli-parser.ts"
import { PROJECTFILE as projectFile } from "./core/files/projectfile.ts";
import { ShiftManager } from "./core/commands/shift-manager.ts";
import { InvoiceManager } from "./core/commands/invoice-manager.ts";
import { CONFIGFILE as configFile } from "./core/files/configfile.ts";


export class TimeClock {
    public static async main() {
        const CONFIGFILE = await configFile.readFileAsync();
        const args = parseArgs(Deno.args);
        const command = args._[0];

        const PROJECTFILE = await projectFile.readFileAsync();
        if (args.p && !PROJECTFILE.projectExists(args.p)) {
            await PROJECTFILE.addProjectAsync(args.p);
        }
        const projectId = args.p ? (await PROJECTFILE.getProjectIdAsync(args.p)) : null;
        
        switch(command) {
            case "shift":
            {
                const verb = args._[1];
                switch(verb) {
                    case "punch":
                        if (projectId) {
                            await ShiftManager.PunchAsync(projectId, CONFIGFILE.rate);
                            return;
                        }
                        else {
                            throw "project name must be provided"
                        }
                    default:
                            throw "invalid verb for shift command"
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