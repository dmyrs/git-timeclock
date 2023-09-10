import * as DomainConstants from "../Constants.ts";

export class Shift {
    user: string;
    diffHours: number
    shiftDir: string;
    shiftFilePath: string;

    constructor(user: string, punchStartUtcMs: string, punchEndUtcMs: string) {
        this.user = user;
        const diffMs: number = Number.parseInt(punchEndUtcMs) - Number.parseInt(punchStartUtcMs);
        this.diffHours = diffMs/DomainConstants.ONE_HOUR_IN_MS;
        this.shiftDir = `./.timeclock/shifts/${user}`;
        this.shiftFilePath = `${this.shiftDir}/shift_${crypto.randomUUID()}`;
    }
}