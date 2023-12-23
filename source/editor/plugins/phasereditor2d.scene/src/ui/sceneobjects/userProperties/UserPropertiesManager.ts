namespace phasereditor2d.scene.ui.sceneobjects {

    export abstract class UserPropertiesManager {

        private _properties: UserProperty[];
        private _componentPropertyBuilder: TComponentPropertyBuilder;

        constructor(componentPropertyBuilder: TComponentPropertyBuilder) {

            this._componentPropertyBuilder = componentPropertyBuilder;
            this._properties = [];
        }

        findPropertyByName(name: string) {

            return this._properties.find(p => p.getName() === name);
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

            const { name, label } = this.createNewPropertyNameInfo("property", "Property");

            const prop = new UserProperty(this, this._componentPropertyBuilder, {
                defValue: propType.getDefaultValue(),
                name,
                label,
                tooltip: "",
                customDefinition: false,
                type: propType
            });

            return prop;
        }

        createNewPropertyNameInfo(baseName: string, baseLabel: string) {

            const p = this._properties.find(p2 => p2.getInfo().name === baseName);

            if (!p) {

                return { name: baseName, label: baseLabel };
            }

            let i = 0;

            while (true) {

                i++;

                const p = this._properties.find(p2 => p2.getInfo().name === `${baseName}_${i}`);

                if (!p) {

                    break;
                }
            }

            return {
                name: `${baseName}_${i}`,
                label: `${baseLabel} ${i}`
            }
        }

        createPropertyFromData(data: any) {

            const prop = new UserProperty(this, this._componentPropertyBuilder);

            prop.readJSON(data);

            return prop;
        }

        readJSON(data: any[]) {

            this._properties = [];

            for (const propData of data) {

                const prop = this.createPropertyFromData(propData);

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