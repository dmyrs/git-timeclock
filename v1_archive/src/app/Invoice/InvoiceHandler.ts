import { IInvoiceHandler } from "../../domain/Invoice/IInvoiceHandler.ts";
import { Invoice } from "../../domain/Invoice/Invoice.ts";
import { Shift } from "../../domain/Shift/Shift.ts";
import { getFilesNamesInDirectory, getNonEmptyDirectoriesAsync } from "../../infra/IO/Files.ts";
import { Dictionary } from "../../infra/Types/Types.ts";
import * as FileManager from "../../infra/IO/Files.ts";
import { executeShellCommandAsync } from "../../infra/IO/Shell.ts";
import { parse } from "https://deno.land/std@0.201.0/datetime/mod.ts";
import { format } from "../../domain/DateExtensions.ts";

export class InvoiceHandler implements IInvoiceHandler {
    public async createInvoiceAsync(invoicee: string, companyName: string, rate: number): Promise<void> {
        const userDirs = await getNonEmptyDirectoriesAsync('./.timeclock/shifts');
        const invoiceData: Dictionary<Shift[]> = {};
        
        for(const userDir of userDirs) {
            const splitDir = userDir.split('/');
            const userName = splitDir[splitDir.length-1];
            invoiceData[userName] = await this.getUserShiftsAsync(userName, userDir, rate);
        }
        const invoice = new Invoice(invoiceData, invoicee, companyName, new Date());

        await FileManager.createDirectoryAsync(invoice.invoiceDir);
        await this.writeInvoiceFile(invoice);
        
        (await executeShellCommandAsync("git", ["commit", "-m", `\"TIMECLOCK INVOICE - ${format(invoice.invoiceDate)}\"`])).verifyZeroReturnCode();
    }

    private async getUserShiftsAsync(userName: string, userDir: string, rate: number): Promise<Shift[]> {
        const shifts: Shift[] = [];
        const filenames = await getFilesNamesInDirectory(userDir);
        for(const filename of filenames) {
            const shiftContent: string = await Deno.readTextFile(`${userDir}/${filename}`);
            const splitShift = shiftContent.split('_');
            const shiftLength: number = Number.parseFloat(splitShift[0]);
            const shiftDate: Date = parse(splitShift[1], 'yyyy-MM-dd');
            const shift = new Shift(userName, shiftLength, filename, shiftDate, rate);
            shifts.push(shift);
            await Deno.remove(shift.shiftFilePath);
            (await executeShellCommandAsync("git", ["add", shift.shiftFilePath])).verifyZeroReturnCode();
        }
        return shifts;
    }

    private async writeInvoiceFile(invoice: Invoice): Promise<void> {
        let fileLines: string[] = [];

        fileLines.push('---------------\n');
        fileLines.push(`${invoice.company} Invoice\n`);
        fileLines.push(`Bill to: ${invoice.invoicee}\n`);
        fileLines.push('---------------\n');
        fileLines.push('\n');
        fileLines.push('---------------\n');
        fileLines.push('User Invoices\n');
        fileLines.push('---------------\n');
        fileLines.push('\n');
        for(const user in invoice.userInvoices) {
            const [shifts, hours, cost] = invoice.userInvoices[user];
            const userLines = this.createUserInvoiceLines(user, shifts, hours, cost);
            fileLines = fileLines.concat(userLines);
            fileLines.push('\n');
            fileLines.push('-----\n');
            fileLines.push('\n');
        }
        fileLines.push('\n');
        fileLines.push('---------------\n');
        fileLines.push('Totals\n');
        fileLines.push('---------------\n');
        fileLines.push(`Total Hours: ${invoice.totalHours}\n`);
        fileLines.push(`Total Amount Due: ${invoice.amountDue}\n`);

        for(const line of fileLines) {
            await Deno.writeTextFile(invoice.invoiceFilePath, line, { append: true });
        }

        (await executeShellCommandAsync("git", ["add", invoice.invoiceFilePath])).verifyZeroReturnCode();
    }

    private createUserInvoiceLines(user: string, shifts: Shift[], hours: number, cost: number): string[] {
        const lines: string[] = [];

        lines.push(`User: ${user}\n`);
        lines.push('Shifts:\n');
        lines.push('  Date|Hours\n');
        for(const shift of shifts) {
            lines.push(`  ${format(shift.date)}|${shift.diffHours}\n`);
        }
        lines.push(`Hours: ${hours}\n`);
        lines.push(`Amount Due: ${cost}\n`);
        return lines;
    }
}