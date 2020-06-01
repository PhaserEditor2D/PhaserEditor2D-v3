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

        add(prop: UserProperty) {

            this._properties.push(prop);
        }

        createProperty(propType: UserPropertyType<any>) {

            let i = 0;

            while (true) {
                i++;

                const p = this._properties.find(p => p.getInfo().name === "property" + i)

                if (!p) {
                    break;
                }
            }

            const prop = new UserProperty({
                defValue: propType.getDefaultValue(),
                label: "Property " + i,
                name: "property" + i,
                tooltip: "Property " + i,
                type: propType
            });

            return prop;
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


            for (const prop of this._properties) {

                const propData = {};

                prop.writeJSON(propData);

                data.push(propData);
            }
        }
    }
}