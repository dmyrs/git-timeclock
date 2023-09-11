import { IInvoiceHandler } from "../../domain/Invoice/IInvoiceHandler.ts";
import { getNonEmptyDirectoriesAsync } from "../../infra/IO/Files.ts";

export class InvoiceHandler implements IInvoiceHandler {
    private _invoicesDir: string = './.timeclock/invoices';

    public async createInvoiceAsync(): Promise<void> {
        const users = await getNonEmptyDirectoriesAsync('./.timeclock/shifts');
        // read all invoices for all users
        // create dict
        // write to file
        // delete the shifts
    }
}