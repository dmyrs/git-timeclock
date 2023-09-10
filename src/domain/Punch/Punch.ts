import { PunchType } from "./PunchType.ts";

export class Punch {
    type: PunchType;
    user: string;
    punchDir: string;
    punchFilePath: string;

    constructor(punchType: PunchType, user: string) {
        this.type = punchType;
        this.user = user;
        this.punchDir = `./.timeclock/punches/${user}`;
        this.punchFilePath = `${this.punchDir}/punch`;
    }
}