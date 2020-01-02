namespace phasereditor2d.scene.ui.json {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export class Serializer {

        private _data: ObjectData;
        private _prefabSerializer: Serializer;
        private _table: SceneDataTable;

        constructor(data: ObjectData, table: SceneDataTable) {

            this._data = data;
            this._table = table;

            if (this._data.prefabId) {
                const prefabData = table.getPrefabData(this._data.prefabId);
                this._prefabSerializer = new Serializer(prefabData, table);
            }
        }

        getSerializer(data: ObjectData) {
            return new Serializer(data, this._table);
        }

        getData() {
            return this._data;
        }

        private getDefaultValue(name: string, defValue?: any) {

            const value = this._data[name];

            if (value !== undefined) {
                return value;
            }

            let defValueInPrefab: any;

            if (this._prefabSerializer) {
                defValueInPrefab = this._prefabSerializer.getDefaultValue(name, defValue);
            }

            if (defValueInPrefab !== undefined) {
                return defValueInPrefab;
            }

            return defValue;
        }

        write(name: string, value: any, defValue?: any) {

            const defValue2 = this.getDefaultValue(name, defValue);

            colibri.core.json.write(this._data, name, value, defValue2);
        }

        read(name: string, defValue?: any) {

            const defValue2 = this.getDefaultValue(name, defValue);

            const value = colibri.core.json.read(this._data, name, defValue2);

            return value;
        }
    }
}