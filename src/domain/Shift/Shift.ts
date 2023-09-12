import * as DomainConstants from "../Constants.ts";
import { toFixed } from "https://deno.land/x/math@v1.1.0/to_fixed.ts";

export class Shift {
    user: string;
    date: Date;
    diffHours: number
    shiftDir: string;
    shiftFilePath: string;
    amountDue: number;

    public static createFromPunchTimes(user: string, punchStartUtcMs: string, punchEndUtcMs: string, date: Date, rate: number) {
        const diffMs: number = Number.parseInt(punchEndUtcMs) - Number.parseInt(punchStartUtcMs);
        const diffHours = diffMs/DomainConstants.ONE_HOUR_IN_MS;
        const fileName = `shift_${crypto.randomUUID()}`;
        return new Shift(user, diffHours, fileName, date, rate);
    }

    constructor(user: string, diffHours: number, filename: string, date: Date, rate: number) {
        this.user = user;
        this.diffHours = diffHours;
        console.log('DIFF', this.diffHours);
        this.shiftDir = `./.timeclock/shifts/${user}`;
        this.shiftFilePath = `${this.shiftDir}/${filename}`;
        this.date = date;
        this.amountDue = this.diffHours * rate;
        console.log('AMOUNT', this.amountDue);
        this.amountDue = Number.parseFloat(toFixed(this.amountDue, 2));
        this.diffHours = Number.parseFloat(toFixed(diffHours, 2));
    }
}