import { Punch } from "./Punch.ts";

export interface IPunchHandler {
    createPunchAsync(punch: Punch): Promise<void>;
}