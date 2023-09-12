import { IShiftHandler } from "../../domain/Shift/IShiftHandler.ts";
import { Shift } from "../../domain/Shift/Shift.ts";
import * as FileManager from "../../infra/IO/Files.ts";
import { executeShellCommandAsync } from "../../infra/IO/Shell.ts";

export class ShiftHandler implements IShiftHandler {
  public async createShiftAsync(shift: Shift): Promise<void> {
    await FileManager.createDirectoryAsync(shift.shiftDir);
    await Deno.writeTextFile(shift.shiftFilePath, `${shift.diffHours.toString()}-${new Date().toISOString().split('T')[0]}`);
    (await executeShellCommandAsync("git", ["add", shift.shiftFilePath])).verifyZeroReturnCode();
  }
}