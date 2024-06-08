import { Configuration } from "../core/configuration.ts";
import { parseArgs } from "../_lib/cli-parser.ts"

export class TimeClock {
    constructor(private readonly _config: Configuration) 
    {}

    public async main() {
        const args = parseArgs(Deno.args);
        const command = args._[0];
        const project = args.p;
        const invoiceNumber = args.n;

        switch(command) {
            case "punch":
                // check PUNCHFILE for existing punch
                // if exists
                    // create a shift (in the project directory), delete PUNCHFILE
                // else
                    // create a punch (in the project directory), create the PUNCHFILE
                break;
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

        // punch -p <projectname>
            // (create or end based on existence)
            // (force punchout if punch in elsewhere) - keep a top level status indicator
        
        // invoice create -p <projcetname>
            // aggregate all punches into an invoice - calculate total $ based on rate in config

        // invoice paid -p <projcetname> -n <invoice number>
            // mark the invoice as paid

        // invoice status
            // get the invoice status for all projcets (unpaid invoices)

        // invoice status -p <projectname>
            // get the invoice status for a project (unpaid invoices)
    }
}