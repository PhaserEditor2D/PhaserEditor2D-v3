namespace colibri.core.json {

    export function write(data: any, name: string, value: any, defaultValue?: any): void {
        if (value !== defaultValue) {
            data[name] = value;
        }
    }

    export function read(data: any, name: string, defaultValue?: any): any {

        if (name in data) {
            return data[name];
        }

        return defaultValue;
    }

    export function getDataValue(data: any, key: string) {

        let result = data;

        const keys = key.split(".");

        for (const key of keys) {
            if (result !== undefined) {
                result = result[key];
            }
        }

        return result;
    }

    export function setDataValue(data: any, key: string, value: any) {

        const keys = key.split(".");

        const lastKey = keys[keys.length - 1];

        for (let i = 0; i < keys.length - 1; i++) {

            const key = keys[i];

            if (key in data) {
                data = data[key];
            } else {
                data = (data[key] = {});
            }
        }

        data[lastKey] = value;
    }

}