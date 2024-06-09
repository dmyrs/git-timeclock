import * as uuid from "jsr:@std/uuid";
import { Random } from "https://deno.land/x/random@v1.1.2/Random.js";

export async function generateSeededGuidAsync(seed: string) : Promise<string> {
    const data = new TextEncoder().encode(seed);
    return await uuid.v5.generate('30c5ad0a-6a9d-477b-a388-87c835e4eda7', data);
}

export async function generateGuidAsync() : Promise<string> {
    const data = new TextEncoder().encode(new Random().string(10));
    return await uuid.v5.generate('30c5ad0a-6a9d-477b-a388-87c835e4eda7', data);
}
