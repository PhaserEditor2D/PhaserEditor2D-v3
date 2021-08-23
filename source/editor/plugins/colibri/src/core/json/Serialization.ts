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

    export function copy(data: any) {

        return JSON.parse(JSON.stringify(data));
    }

    export function getDataValue(data: any, key: string) {

        let result = data;

        const keys = key.split(".");

        for (const key2 of keys) {

            if (result !== undefined) {

                result = result[key2];
            }
        }

        return result;
    }

    export function setDataValue(data: any, key: string, value: any) {

        const keys = key.split(".");

        const lastKey = keys[keys.length - 1];

        for (let i = 0; i < keys.length - 1; i++) {

            const key2 = keys[i];

            if (key2 in data) {

                data = data[key2];

            } else {

                data = (data[key2] = {});
            }
        }

        data[lastKey] = value;
    }

}