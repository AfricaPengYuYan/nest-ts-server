import { readFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";

export const getEnv = () => process.env.NODE_ENV;

export const loadConfig = () => {
    const env = getEnv();
    if (env) {
        try {
            return load(readFileSync(join(__dirname, `./${env}.YML`), "utf-8"));
        } catch (e) {
            console.error(e);
        }
    }
};
