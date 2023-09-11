import { Dictionary } from "../../infra/Types/Types.ts";
import { Shift } from "../Shift/Shift.ts";

export class Invoice{
    shifts: Dictionary<[Shift[], number]>;
    total: number;

    constructor(shifts: Dictionary<Shift[]>) {
        this.shifts = {
            jkdmyrs: [[], 0]
        };
        this.total = 0;
    }
}