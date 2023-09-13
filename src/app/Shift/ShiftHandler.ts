import { IShiftHandler } from "../../domain/Shift/IShiftHandler.ts";
import { Shift } from "../../domain/Shift/Shift.ts";
import * as FileManager from "../../infra/IO/Files.ts";
import { executeShellCommandAsync } from "../../infra/IO/Shell.ts";
import { format } from "../../domain/DateExtensions.ts";

export class ShiftHandler implements IShiftHandler {
  public async createShiftAsync(shift: Shift): Promise<void> {
    await FileManager.createDirectoryAsync(shift.shiftDir);
    await Deno.writeTextFile(shift.shiftFilePath, `${shift.diffHours.toString()}_${format(new Date())}`);
    (await executeShellCommandAsync("git", ["add", shift.shiftFilePath])).verifyZeroReturnCode();
  }
}