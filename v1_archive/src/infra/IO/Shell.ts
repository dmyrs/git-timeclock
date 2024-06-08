import { ShellOutput } from "./ShellOutput.ts";

export async function executeShellCommandAsync(command: string, args: string[]): Promise<ShellOutput> {
    const output = await new Deno.Command(command, { args: args }).output();
    return new ShellOutput(output);
}