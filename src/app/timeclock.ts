import { Configuration } from "../core/configuration.ts";
import { parseArgs } from "../_lib/cli-parser.ts"
import { PROJECTFILE as projectFile } from "../core/files/projectsfile.ts";
import { PUNCHFILE as punchFile } from "../core/files/punchfile.ts";

export class TimeClock {
    constructor(private readonly _config: Configuration) 
    {}

    public async main() {
        const args = parseArgs(Deno.args);
        const command = args._[0];
        const project = args.p;
        const invoiceNumber = args.n;

        const PROJECTFILE = await projectFile.readFileAsync();
        
        if (! PROJECTFILE.projectExists(project)) {
            await PROJECTFILE.addProjectAsync(project);
        }
        const projectId = PROJECTFILE.getProjectId(project);

        switch(command) {
            case "punch":
            {
                const PUNCHFILE = await punchFile.readFileAsync();
                if (PUNCHFILE) {
                    // create the shift
                    await PUNCHFILE.deleteAsync();
                }
                else {
                    const punchId = ""; // generate a GUID
                    await punchFile.createAsync(projectId, punchId, new Date(), this._config.rate)
                }
                break;   
            }
            case "invoice":
            {
                const verb = args._[1];
                switch(verb) {
                    case "create":
                        // take all shifts for project and user config and create an invoice, create an invoice number
                        // keep an index of all invoices and whether or not they're paid (INVOICES file)
                        break;
                    case "paid":
                        // mark a specific invoice as paid
                        break;
                    case "status":
                        // see all unpaid invoices for
                        if (args.p) {
                            // specific project
                        }
                        else {
                            // all projects
                        }
                        break;
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    }
}