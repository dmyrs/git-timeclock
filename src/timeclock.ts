enum PunchType {
    Sart,
    End
}

const ONE_HOUR_IN_MS = 3600000;

import {exists} from "https://deno.land/std@0.201.0/fs/mod.ts";

const user: string = Deno.args[0];
const isEndPunch: boolean = Deno.args.some(x => x === "--end");
const punchType: PunchType = isEndPunch ? PunchType.End : PunchType.Sart;
const punchDir = `./.timeclock/punches/${user}`;
const punchFilePath = `${punchDir}/punch`;
const shiftDir = `./.timeclock/shifts/${user}`;
const shiftFilePath = `${shiftDir}/shift_${crypto.randomUUID()}`;

async function executeShellCommand(command: string, args: string[]): Promise<string> {
    const cmd = new Deno.Command(command, { args: args });
    const { code, stdout, stderr } = await cmd.output();
    if (code !== 0) {
        console.log(new TextDecoder().decode(stdout), new TextDecoder().decode(stderr));
        throw `non-zero RC: ${code}`;
    }
    return new TextDecoder().decode(stdout);
}

async function createDirectory(path: string) {
    const dirExists = await exists(path);
    if (!dirExists) {
        await Deno.mkdir(path, {
            recursive: true
        });
    }
}

async function createPunch() {
    if (punchType === PunchType.Sart) {
        await createStartPunch();
    } else {
        await createEndPunch();
    }
}

async function createStartPunch() {
    await Deno.writeTextFile(punchFilePath, Date.now().toString());
    await executeShellCommand("git", ["add", punchFilePath]);
    await executeShellCommand("git", ["commit", "-m", `\"TIMECLOCK PUNCH START - ${user}\"`]);
}

async function createEndPunch() {
    await createDirectory(shiftDir);
    const nowUtcMs = Date.now().toString();
    const punchStartUtcMs = await Deno.readTextFile(punchFilePath);
    await Deno.remove(punchFilePath);
    const diffMs: number = Number.parseInt(nowUtcMs) - Number.parseInt(punchStartUtcMs);
    const diffHors = diffMs/ONE_HOUR_IN_MS;
    await Deno.writeTextFile(shiftFilePath, diffHors.toString());
    await executeShellCommand("git", ["add", punchFilePath]);
    await executeShellCommand("git", ["add", shiftFilePath]);
    await executeShellCommand("git", ["commit", "-m", `\"TIMECLOCK PUNCH END - ${user}\"`]);
}

async function main() {
    const statusOutput = await executeShellCommand("git", ["status"]);
    if (!statusOutput.includes("nothing to commit, working tree clean")) {
        throw "punches must occur on a clean working tree";
    }
    else {
        await createDirectory(punchDir);
        await createPunch();
    }
}

await main();
