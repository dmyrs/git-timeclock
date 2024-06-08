export class Configuration {
    name: string;
    rate: number;
    company: string;

    constructor(name: string, rate: number, company: string) {
        this.name = name;
        this.rate = rate;
        this.company = company;
    }

    public static FromEnvironment() : Configuration {
        return new Configuration("", 0, "");
    }
}