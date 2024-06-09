import { exists } from "https://deno.land/std/fs/mod.ts";

export async function listDirectoryAsync(path: string): Promise<string[]> {
    const files: string[] = [];
    for await (const dirEntry of Deno.readDir(path)) {
      if (dirEntry.isFile) {
        files.push(dirEntry.name)
      }
    }
    return files;
}

export async function checkFileExistsAsync(path: string): Promise<boolean> {
    return await exists(path, { isFile: true });
}

export async function createDirectoryAsync(path: string): Promise<void> {
    const dirExists = await exists(path);
    if (!dirExists) {
        await Deno.mkdir(path, {
            recursive: true
        });
    }
}