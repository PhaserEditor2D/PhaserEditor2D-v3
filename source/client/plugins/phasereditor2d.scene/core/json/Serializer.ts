namespace phasereditor2d.scene.core.json {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export class Serializer {

        private _data: ObjectData;
        private _prefabSer: Serializer;

        constructor(data: ObjectData) {

            this._data = data;

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (this._data.prefabId) {

                const prefabData = finder.getPrefabData(this._data.prefabId);

                if (prefabData) {

                    this._prefabSer = new Serializer(prefabData);

                } else {

                    console.error(`Cannot find scene prefab with id "${this._data.prefabId}".`);
                }
            }
        }

        getSerializer(data: ObjectData) {
            return new Serializer(data);
        }

        getData() {
            return this._data;
        }

        getType() {

            if (this._prefabSer) {
                return this._prefabSer.getType();
            }

            return this._data.type;
        }

        getPhaserType() {

            if (this._prefabSer) {
                return this._prefabSer.getPhaserType();
            }

            const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(this._data.type);

            return ext.getPhaserTypeName();
        }

        private getDefaultValue(name: string, defValue?: any) {

            const value = this._data[name];

            if (value !== undefined) {
                return value;
            }

            let defValueInPrefab: any;

            if (this._prefabSer) {
                defValueInPrefab = this._prefabSer.getDefaultValue(name, defValue);
            }

            if (defValueInPrefab !== undefined) {
                return defValueInPrefab;
            }

            return defValue;
        }

        isUnlocked(name: string) {

            if (this.isPrefabInstance()) {

                if (this._data.unlock) {

                    const i = this._data.unlock.indexOf(name);

                    return i >= 0;
                }

                return false;
            }

            return true;
        }

        isPrefabInstance() {

            return typeof this._data.prefabId === "string";
        }

        write(name: string, value: any, defValue?: any) {

            if (this.isPrefabInstance()) {

                if (this.isUnlocked(name)) {

                    const defValue2 = this.getDefaultValue(name, defValue);

                    colibri.core.json.write(this._data, name, value, defValue2);
                }

            } else {

                colibri.core.json.write(this._data, name, value, defValue);
            }
        }

        read(name: string, defValue?: any) {

            // const defValue2 = this.getDefaultValue(name, defValue);
            // const value = colibri.core.json.read(this._data, name, defValue2);
            // return value;


            if (this.isPrefabInstance()) {

                const prefabValue = this.getDefaultValue(name, defValue);

                if (this.isUnlocked(name)) {

                    return colibri.core.json.read(this._data, name, prefabValue);
                }

                return prefabValue;
            }

            return colibri.core.json.read(this._data, name, defValue);
        }
    }
}