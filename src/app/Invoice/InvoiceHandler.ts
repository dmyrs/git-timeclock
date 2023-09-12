import { IInvoiceHandler } from "../../domain/Invoice/IInvoiceHandler.ts";
import { Invoice } from "../../domain/Invoice/Invoice.ts";
import { Shift } from "../../domain/Shift/Shift.ts";
import { getFilesNamesInDirectory, getNonEmptyDirectoriesAsync } from "../../infra/IO/Files.ts";
import { Dictionary } from "../../infra/Types/Types.ts";
import * as FileManager from "../../infra/IO/Files.ts";
import { executeShellCommandAsync } from "../../infra/IO/Shell.ts";
import { parse } from "https://deno.land/std@0.201.0/datetime/mod.ts";

export class InvoiceHandler implements IInvoiceHandler {
    public async createInvoiceAsync(invoicee: string, companyName: string): Promise<void> {
        const userDirs = await getNonEmptyDirectoriesAsync('./.timeclock/shifts');
        const invoiceData: Dictionary<Shift[]> = {};
        
        for(const userDir of userDirs) {
            invoiceData[userDir] = await this.getUserShiftsAsync(userDir);
        }
        const invoice = new Invoice(invoiceData, invoicee, companyName, new Date());

        await FileManager.createDirectoryAsync(invoice.invoiceDir);
        await this.writeInvoiceFile(invoice);
        
        (await executeShellCommandAsync("git", ["commit", "-m", `\"TIMECLOCK INVOICE - ${invoice.invoiceDate.toISOString().split('T')[0]}\"`])).verifyZeroReturnCode();
    }

    private async getUserShiftsAsync(userDir: string): Promise<Shift[]> {
        const shifts: Shift[] = [];
        const filenames = await getFilesNamesInDirectory(userDir);
        console.log('filenames!', filenames.join(','));
        for(const filename of filenames) {
            const shiftContent: string = await Deno.readTextFile(`${userDir}/${filename}`);
            const splitShift = shiftContent.split('_');
            const shiftLength: number = Number.parseInt(splitShift[0]);
            const shiftDate: Date = parse(splitShift[1], 'yyyy-MM-dd');
            const shift = new Shift(userDir, shiftLength, filename, shiftDate);
            shifts.push(shift);
            await Deno.remove(shift.shiftFilePath);
            (await executeShellCommandAsync("git", ["add", shift.shiftFilePath])).verifyZeroReturnCode();
        }
        return shifts;
    }

    private async writeInvoiceFile(invoice: Invoice): Promise<void> {
        let fileLines: string[] = [];

        fileLines.push('---------------');
        fileLines.push(`${invoice.company} Invoice`);
        fileLines.push(`Billed to: ${invoice.invoicee}`);
        fileLines.push('---------------');
        fileLines.push('');
        fileLines.push('');
        fileLines.push('---------------');
        fileLines.push('User Invoices');
        fileLines.push('---------------');
        fileLines.push('');
        for(const user in invoice.userInvoices) {
            const [shifts, hours, cost] = invoice.userInvoices[user];
            const userLines = this.createUserInvoiceLines(user, shifts, hours, cost);
            fileLines = fileLines.concat(userLines);
            fileLines.push('');
            fileLines.push('-----');
            fileLines.push('');
        }
        fileLines.push('');
        fileLines.push('---------------');
        fileLines.push('Totals');
        fileLines.push('---------------');
        fileLines.push('');
        fileLines.push(`Total Hours: ${invoice.totalHours}`);
        fileLines.push(`Total Amount Due: ${invoice.amountDue}`);

        (await executeShellCommandAsync("git", ["add", invoice.invoiceFilePath])).verifyZeroReturnCode();
    }

    private createUserInvoiceLines(user: string, shifts: Shift[], hours: number, cost: number): string[] {
        const lines: string[] = [];

        lines.push(`User: ${user}`);
        lines.push('Shifts:');
        lines.push('  Date|Hours');
        for(const shift of shifts) {
            lines.push(`  ${shift.date.toISOString().split('T'[0])}|${shift.diffHours}'`);
        }
        lines.push(`Hours: ${hours}`);
        lines.push(`Amount Due: ${cost}`);
        return lines;
    }
}