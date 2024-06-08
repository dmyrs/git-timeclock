import { Punch } from "../domain/Punch/Punch.ts";
import { PunchType } from "../domain/Punch/PunchType.ts";
import { executeShellCommandAsync } from "../infra/IO/Shell.ts";
import { PunchHandler } from "./Punch/PunchHandler.ts";
import { InvoiceHandler } from "./Invoice/InvoiceHandler.ts";

export class TimeClock {
    private _punchHandler = new PunchHandler();
    private _invoiceHandler = new InvoiceHandler();

    private async validateCleanWorkingTreeAsync() {
        const statusOutput = (await executeShellCommandAsync("git", ["status"])).verifyZeroReturnCode();
        if (!statusOutput.stdout.includes("nothing to commit, working tree clean")) {
            throw "punches must occur on a clean working tree";
        }
    }
    
    public async main() {
        await this.validateCleanWorkingTreeAsync();
        const isInvoice: boolean = Deno.args.some(x => x === "--invoice");

        if (isInvoice) {
            const args = Deno.args.filter(x => !x.startsWith('--'));
            const invoicee: string = args[0];
            const company: string = args[1];
            const rate: number = Number.parseFloat(args[2]);
            await this._invoiceHandler.createInvoiceAsync(invoicee, company, rate);
        }
        else {
            const args = Deno.args.filter(x => !x.startsWith('--'));
            const user: string = args[0];
            const isEndPunch: boolean = Deno.args.some(x => x === "--end");
            const rate: number = isEndPunch ? Number.parseFloat(args[1]) : 0;
            const punchType: PunchType = isEndPunch ? PunchType.End : PunchType.Sart;
            const punch = new Punch(punchType, user);
            await this._punchHandler.createPunchAsync(punch, rate);
        }
    
    }
}
