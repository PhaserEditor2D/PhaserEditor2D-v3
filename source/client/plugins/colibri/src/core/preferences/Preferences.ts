namespace colibri.core.preferences {

    export class Preferences {

        private _preferencesSpace: string;

        constructor(preferencesSpace: string) {

            this._preferencesSpace = preferencesSpace;
        }

        private readData() {

            if (this._preferencesSpace in window.localStorage) {

                const str = window.localStorage[this._preferencesSpace];

                try {

                    return JSON.parse(str);

                } catch (e) {
                    console.error(e);
                }
            }

            return {};
        }

        getPreferencesSpace() {
            return this._preferencesSpace;
        }

        setValue(key: string, jsonData: any) {

            try {

                const data = this.readData();

                data[key] = jsonData;

                window.localStorage[this._preferencesSpace] = JSON.stringify(data);

            } catch (e) {
                console.error(e);
            }
        }

        getValue(key: string, defaultValue: any = null): any {

            const data = this.readData();

            return data[key] ?? defaultValue;
        }
    }
}