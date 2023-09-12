import { Dictionary } from "../../infra/Types/Types.ts";
import { Shift } from "../Shift/Shift.ts";

export class Invoice{
    userInvoices: Dictionary<[shifts: Shift[], totalHours: number, totalCost: number]>;
    totalHours: number;
    totalCost: number;
    invoiceDir: string;
    invoiceFilePath: string;
    invoicee: string;
    company: string;
    invoiceDate: Date;

    constructor(shifts: Dictionary<Shift[]>, invoicee: string, company: string, invoiceDate: Date) {
        // todo - impl
        this.userInvoices = {
            jkdmyrs: [[], 0, 0]
        };
        this.totalHours = 0;
        this.totalCost = 0;
        this.invoiceDir = "";
        this.invoiceFilePath = "";
        this.invoicee = invoicee;
        this.company = company;
        this.invoiceDate = invoiceDate;
    }
}