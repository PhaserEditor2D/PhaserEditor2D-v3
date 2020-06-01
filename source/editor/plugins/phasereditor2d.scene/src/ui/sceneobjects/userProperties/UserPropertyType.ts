namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class UserPropertyType<TValue> {

        private _id: string;
        private _defValue: TValue;

        constructor(id: string, defValue: TValue) {

            this._id = id;
            this._defValue = defValue;
        }

        getId() {

            return this._id;
        }

        abstract getName();

        getDefaultValue() {

            return this._defValue;
        }

        writeJSON(data: any) {

            data.id = this._id;
        }

        readJSON(data: any) {
            // nothing
        }

        abstract renderValue(value: any): string;
    }
}