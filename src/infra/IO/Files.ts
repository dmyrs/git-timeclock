import {exists} from "https://deno.land/std@0.201.0/fs/mod.ts";

export async function createDirectoryAsync(path: string) {
    const dirExists = await exists(path);
    if (!dirExists) {
        await Deno.mkdir(path, {
            recursive: true
        });
    }
}