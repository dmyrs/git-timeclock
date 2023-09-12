import * as DomainConstants from "../Constants.ts";

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
        this.shiftDir = `./.timeclock/shifts/${user}`;
        this.shiftFilePath = `${this.shiftDir}/${filename}`;
        this.date = date;
        this.amountDue = this.diffHours * rate; // todo - impl
    }
}