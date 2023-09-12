import { Punch } from "./Punch.ts";

export interface IPunchHandler {
    createPunchAsync(punch: Punch, rate: number): Promise<void>;
}