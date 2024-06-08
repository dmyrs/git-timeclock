export function parseArgs(args: string[]): { [key: string]: any } {
    const parsedArgs: { [key: string]: any } = { _: [] };

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("-")) {
            const key = args[i].replace(/^-+/, "");
            const value = args[i + 1];
            parsedArgs[key] = value || true;
            i++;
        } else {
            parsedArgs._.push(args[i]);
        }
    }

    return parsedArgs;
}