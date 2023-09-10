import { Shift } from "./Shift.ts";

export interface IShiftHandler {
    createShiftAsync(shift: Shift): Promise<void>;
}