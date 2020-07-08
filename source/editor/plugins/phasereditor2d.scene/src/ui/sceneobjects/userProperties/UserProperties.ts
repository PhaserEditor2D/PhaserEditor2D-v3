namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class UserProperties {

        private _properties: UserProperty[];
        private _componentPropertyBuilder: TComponentPropertyBuilder;

        constructor(componentPropertyBuilder: TComponentPropertyBuilder) {
            this._componentPropertyBuilder = componentPropertyBuilder;
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

                const p = this._properties.find(p2 => p2.getInfo().name === "property" + i)

                if (!p) {
                    break;
                }
            }

            const prop = new UserProperty(this._componentPropertyBuilder, {
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

                const prop = new UserProperty(this._componentPropertyBuilder);

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