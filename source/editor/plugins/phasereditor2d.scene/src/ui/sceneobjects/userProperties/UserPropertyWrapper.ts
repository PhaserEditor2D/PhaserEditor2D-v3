namespace phasereditor2d.scene.ui.sceneobjects {

    export class UserPropertyWrapper implements IProperty<ISceneObject> {

        private _userProp: UserProperty;

        constructor(userProp: UserProperty) {

            this._userProp = userProp;
        }

        getUserProperty() {

            return this._userProp;
        }

        getValue(obj: ISceneObject) {

            return this.getComponent(obj).getPropertyValue(this._userProp);
        }

        setValue(obj: ISceneObject, value: any): void {

            this.getComponent(obj).setPropertyValue(this._userProp, value);
        }

        private getComponent(obj: ISceneObject) {

            return EditorSupport.getObjectComponent(obj, UserPropertyComponent) as UserPropertyComponent;
        }

        get name(): string {

            return this._userProp.getName();
        }

        get defValue() {

            return this._userProp.getDefaultValue();
        }

        get local() {

            return false;
        }

        get label() {

            return this._userProp.getLabel();
        }

        get tooltip() {

            return this._userProp.getTooltip();
        }
    }
}