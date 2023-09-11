import {exists} from "https://deno.land/std@0.201.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.201.0/path/posix.ts";

export async function createDirectoryAsync(path: string) {
    const dirExists = await exists(path);
    if (!dirExists) {
        await Deno.mkdir(path, {
            recursive: true
        });
    }
}

export async function getNonEmptyDirectoriesAsync(path: string): Promise<string[]> {
    const dirs: string[] = [];
    for await (const dirEntry of Deno.readDir(path)) {
      if (dirEntry.isDirectory) {
        for await (const subEntry of Deno.readDir(join(path, dirEntry.name))) {
          if (subEntry.isFile) {
            dirs.push(join(path, dirEntry.name));
            break;
          }
        }
      }
    }
    return dirs;
}