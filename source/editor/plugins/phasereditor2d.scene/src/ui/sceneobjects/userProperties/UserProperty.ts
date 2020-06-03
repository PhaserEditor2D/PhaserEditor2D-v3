namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export interface IUserPropertyInfo {
        name: string;
        defValue: any;
        label: string;
        tooltip: string;
        type: UserPropertyType<any>;
    }

    export class UserProperty {

        private _info: IUserPropertyInfo;
        private _componentProperty: UserPropertyWrapper;

        constructor(info?: IUserPropertyInfo) {

            this._info = info;
        }

        getComponentProperty(): UserPropertyWrapper {

            if (!this._componentProperty) {

                if (this.getType() instanceof OptionPropertyType) {

                    this._componentProperty = new OptionUserPropertyWrapper(this);

                } else {

                    this._componentProperty = new UserPropertyWrapper(this);
                }
            }

            return this._componentProperty;
        }

        getType() {

            return this._info.type;
        }

        getInfo() {

            return this._info;
        }

        getName() {

            return this._info.name;
        }

        getLabel() {

            return this._info.label;
        }

        getTooltip() {

            return this._info.tooltip;
        }

        getDefaultValue() {

            return this._info.defValue;
        }

        writeJSON(data: any) {

            data.name = this._info.name;
            data.label = this._info.label;
            data.tooltip = this._info.tooltip;
            data.defValue = this._info.defValue;
            data.type = {};

            this._info.type.writeJSON(data.type);
        }

        readJSON(data: any) {

            const typeData = data.type;
            const typeId = typeData.id;
            const propType = ScenePlugin.getInstance().createUserPropertyType(typeId);
            propType.readJSON(typeData);

            this._info = {
                name: data.name,
                label: data.label,
                tooltip: data.tooltip,
                defValue: data.defValue,
                type: propType
            };
        }

        buildDeclarationsCode() {

            return this.getType().buildDeclarePropertyCodeDOM(this, this._info.defValue);
        }
    }
}