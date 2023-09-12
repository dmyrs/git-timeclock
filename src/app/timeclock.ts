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
            await this._invoiceHandler.createInvoiceAsync("Green Oak Building Co.", "dmyrs Software");
        }
        else {
            const user: string = Deno.args[0];
            const isEndPunch: boolean = Deno.args.some(x => x === "--end");
            const punchType: PunchType = isEndPunch ? PunchType.End : PunchType.Sart;
            const punch = new Punch(punchType, user);
            await this._punchHandler.createPunchAsync(punch);
        }
    
    }
}
