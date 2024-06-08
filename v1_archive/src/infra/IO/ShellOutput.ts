export class ShellOutput {
    private _output: Deno.CommandOutput;

    constructor(output: Deno.CommandOutput) {
        this._output = output;
    }
    
    public get code(): number {
        return this._output.code;
    }

    public get stderr(): string {
        return new TextDecoder().decode(this._output.stderr);
    }

    public get stdout(): string {
        return new TextDecoder().decode(this._output.stdout);
    }

    public verifyZeroReturnCode(): ShellOutput {
        if (this._output.code !== 0) {
            // todo - enhance error handling
            console.log(this.stdout, this.stderr);
            throw `non-zero RC: ${this._output.code}`;
        }
        return this;
    }
}