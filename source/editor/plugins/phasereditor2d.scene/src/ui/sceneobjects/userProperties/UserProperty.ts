namespace phasereditor2d.scene.ui.sceneobjects {

    export interface IUserPropertyInfo {
        name: string;
        defValue: any;
        label: string;
        tooltip: string;
        type: UserPropertyType<any>;
    }

    export declare type TComponentPropertyBuilder = (userProp: UserProperty) => IProperty<any>;

    export class UserProperty {

        private _info: IUserPropertyInfo;
        private _componentProperty: IProperty<any>;
        private _componentPropertyBuilder: TComponentPropertyBuilder;

        constructor(componentPropertyBuilder: TComponentPropertyBuilder, info?: IUserPropertyInfo) {

            this._componentPropertyBuilder = componentPropertyBuilder;
            this._info = info;
        }

        getComponentProperty(): IProperty<any> {

            if (!this._componentProperty) {

                this._componentProperty = this._componentPropertyBuilder(this);
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

            if (this._info.defValue === null || this._info.defValue === undefined) {

                this._info.defValue = propType.getDefaultValue();
            }
        }

        buildDeclarationsCode() {

            return this.getType().buildDeclarePropertyCodeDOM(this, this._info.defValue);
        }
    }
}