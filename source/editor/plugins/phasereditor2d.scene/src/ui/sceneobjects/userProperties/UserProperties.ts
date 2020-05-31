namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export class UserProperties {

        private _properties: UserProperty[];

        constructor() {

            this._properties = [];
        }

        getProperties() {

            return this._properties;
        }

        readJSON(data: any[]) {

            this._properties = [];

            for (const propData of data) {

                const prop = new UserProperty();

                prop.readJSON(propData);

                this._properties.push(prop);
            }
        }

        writeJSON(data: any[]) {


            for(const prop of this._properties) {

                const propData = {};

                prop.writeJSON(propData);

                data.push(propData);
            }
        }
    }
}