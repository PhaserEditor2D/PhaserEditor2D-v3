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

        deleteProperty(propName: string) {
            
            const prop = this._properties.find(p => p.getName() === propName);

            const i = this._properties.indexOf(prop);

            this._properties.splice(i, 1);
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

            const prop = new UserProperty(this, this._componentPropertyBuilder, {
                defValue: propType.getDefaultValue(),
                label: "Property " + i,
                name: "property" + i,
                tooltip: "Property " + i,
                customDefinition: false,
                type: propType
            });

            return prop;
        }

        readJSON(data: any[]) {

            this._properties = [];

            for (const propData of data) {

                const prop = new UserProperty(this, this._componentPropertyBuilder);

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

        toJSON() {

            const data = [];

            this.writeJSON(data);

            return data;
        }
    }
}