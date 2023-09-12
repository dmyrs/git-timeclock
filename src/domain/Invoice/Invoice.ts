import { Dictionary } from "../../infra/Types/Types.ts";
import { Shift } from "../Shift/Shift.ts";
import { sumOf } from "https://deno.land/std@0.201.0/collections/mod.ts";
import { toFixed } from "https://deno.land/x/math@v1.1.0/to_fixed.ts";

export class Invoice{
    userInvoices: Dictionary<[shifts: Shift[], totalHours: number, totalCost: number]>;
    totalHours: number;
    amountDue: number;
    invoiceDir: string;
    invoiceFilePath: string;
    invoicee: string;
    company: string;
    invoiceDate: Date;

    constructor(shifts: Dictionary<Shift[]>, invoicee: string, company: string, invoiceDate: Date) {
        this.userInvoices = {};
        for (const user in shifts) {
            const userShifts: Shift[] = shifts[user];
            const hours: number = sumOf(userShifts, x => x.diffHours);
            const cost: number = sumOf(userShifts, x => x.amountDue)
            this.userInvoices[user] = [userShifts, hours, cost];
        }

        this.amountDue = 0;
        this.totalHours = 0;
        for(const user in this.userInvoices) {
            const [_, hours, amountDue] = this.userInvoices[user];
            this.totalHours+=hours;
            this.amountDue+=amountDue;
        }
        this.invoiceDir = "./.timeclock/invoices";
        this.invoiceFilePath = `${this.invoiceDir}/${invoiceDate.toISOString().split('T')[0]}`;
        this.invoicee = invoicee;
        this.company = company;
        this.invoiceDate = invoiceDate;
        this.totalHours = Number.parseFloat(toFixed(this.totalHours, 2));
    }
}