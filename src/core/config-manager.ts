import { CONFIGFILE } from "./files/configfile.ts";

export class ConfigurationManager {


    public static FromEnvironmentAsync() : CONFIGFILE {
        return new Configuration("", 0, "");
    }
}

